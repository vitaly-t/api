const promise = require("bluebird");
const url = require("url");
const { isArray, isObject, isDate, uniq } = require("lodash");
const options = {
  // Initialization Options
  promiseLib: promise, // use bluebird as promise library
  capSQL: true // when building SQL queries dynamically, capitalize SQL keywords
};
if (process.env.LOG_QUERY === "true") {
  options.query = evt => console.info("Executing query %s", evt.query);
}
const pgp = require("pg-promise")(options);
const path = require("path");
const log = require("winston");
const connectionString = process.env.DATABASE_URL;
const parse = require("pg-connection-string").parse;
let config;

try {
  config = parse(connectionString);
  if (process.env.NODE_ENV === "test" || config.host === "localhost") {
    config.ssl = false;
  } else {
    config.ssl = true;
  }
} catch (e) {
  console.error("# Error parsing DATABASE_URL environment variable");
}
let db = pgp(config);

let dbtagkeys;
let dbcasekeys;

async function initKeys() {
  // we're just getting the keys for validation, which are the same for
  // every language, so hard-coding 'en' here is OK.
  dbcasekeys = (await db.one(`
    SELECT to_json(array_agg(key)) AS keys
    FROM localized_case_field_values
    WHERE language = 'en';
  `)).keys;
  dbtagkeys = (await db.one(`
    SELECT to_json(array_agg(key)) as keys
    FROM rotate_tags_localized('en') AS tagvalues
    WHERE tagvalues.key <> 'language';
  `)).keys;
}
initKeys().then(() => console.log("keys initialized")); // we'll need these when users submit data

function sql(filename) {
  return new pgp.QueryFile(path.join(__dirname, filename), {
    minify: true
  });
}

// as.number, enhances existing as.number to cope with numbers as strings
function number(value) {
  if (value === "") {
    return null;
  }
  return pgp.as.number(Number(value));
}

function integer(value) {
  if (value === "") {
    return null;
  }
  return pgp.as.number(parseInt(value));
}

// as.author
function author(user_id, name) {
  // TODO: escape user_id and name to avoid injection attacks
  if (!(user_id && name)) {
    throw new Error("Must have both user_id and name for an author");
  }
  user_id = as.number(user_id);
  name = text(name);
  return `(${user_id}, 'now', ${name})::author`;
}

// as.attachment
function attachment(att) {
  if (!att) {
    return null;
  }
  if (isObject(att)) {
    const url = asUrl(att.url);
    const title = as.text(att.title);
    const size = att.size === undefined ? null : as.number(size);
    return `(${url}, ${title}, ${size})::attachment`;
  } else {
    throw new Error("attachment is wrong shape");
  }
}

function asUrl(value) {
  if (!value) {
    return "";
  }
  if (isObject(value)) {
    console.error("Expecting URL, received: %s", value);
    throw new Error("Not a URL: " + value);
    return "";
  }
  try {
    if (!value.startsWith("http")) {
      value = process.env.ASSETS_URL + value;
    }
    // return new URL(value).href;
    return as.text(new URL(value).href);
  } catch (e) {
    console.error("Expected URL, received: %s", JSON.stringify(value));
    throw e;
  }
}

function urls(urlList) {
  return as.array(uniq((urlList || []).map(asUrl).filter(x => !!x)));
}

function id(obj) {
  if (!obj) {
    return null;
  }
  return as.integer(obj.id);
}

// as.ids, strip [{text,value}] down to [value], then format as array of numbers
function ids(idList) {
  return as.array(uniq((idList || []).map(integer)));
  // return (
  //   "ARRAY[" + idList.map(s => as.number(s.value)).join(", ") + "]::integer[]"
  // );
}

// as.strings
function strings(strList) {
  return as.array(uniq((strList || []).map(text).filter(x => !!x)));
  //  return "ARRAY[" + strList.map(s => as.text(s)).join(", ") + "]::text[]";
}

function casekey(group, obj) {
  if (group === undefined) {
    throw new Error("Group cannot be undefined");
  }
  if (obj === undefined) {
    throw new Error("Object cannot be undefined for group " + group);
  }
  if (obj.key === undefined) {
    throw new Error("Key cannot be undefined for group " + group);
  }
  //  if (dbcasekeys.includes(`${group}_${obj.key}`)) {
  // FIXME: Need to re-add validation that key is legal for this field
  if (obj.key.length > 0) {
    return text(obj.key);
  }
  return "";
}

function casekeys(group, objList) {
  if (group === undefined) {
    throw new Error("Group cannot be undefined");
  }
  if (objList === undefined) {
    throw new Error("objList cannot be undefined for group " + group);
  }
  try {
    return as.array(
      uniq((objList || []).map(k => casekey(group, k)).filter(x => !!x))
    );
  } catch (e) {
    console.error(
      "Attempting to convert and filter a list of keys for %s, but got %s for the list",
      group,
      JSON.stringify(objList)
    );
    throw e;
  }
}

function tagkey(obj) {
  if (obj === undefined) {
    throw new Error("Object cannot be undefined for tag");
  }
  if (obj.key === undefined) {
    throw new Error("Key cannot be undefined for tag");
  }
  if (dbtagkeys.includes(obj.key)) {
    return text(obj.key);
  } else {
    console.warn("failed tag: %s", obj.key);
  }
  return null;
}

function tagkeys(objList) {
  return as.array(uniq((objList || []).map(tagkey).filter(x => !!x)));
}

function localed(strList) {
  // localed strings come in as as list of objects with {text, value}, we want value (the localization key)
  if (strList && strList.length && isObject(strList[0])) {
    return strings(strList.map(s => s.value));
  } else {
    // someone passes us a list of strings, yay!
    return strings(strList);
  }
}

function attachments(attList) {
  if (attList.length && typeof attList[0] === "object") {
    return strings(attList.map(a => a.url));
  } else {
    return strings(attList);
  }
}

function aMedium(obj) {
  if (!obj.url) return null;
  return [
    '"(',
    asUrl(obj.url),
    ",",
    // attribution: obj.attribution,
    as.text(obj.attribution),
    ",",
    // title: obj.title
    as.text(obj.title),
    ')"'
  ].join("");
}

function aSourcedMedia(obj) {
  if (!obj.url) return null;
  return [
    '"(',
    asUrl(obj.url),
    ",",
    asUrl(obj.source_url),
    ",",
    // attribution: obj.attribution,
    as.text(obj.attribution),
    ",",
    // title: obj.title
    as.text(obj.title),
    ')"'
  ].join("");
  // if (!obj.url) return null;
  // return {
  //   url: asUrl(obj.url),
  //   source_url: asUrl(obj.link),
  //   attribution: as.text(obj.attribution),
  //   title: as.text(obj.title)
  // };
}

function simpleArray(values) {
  return "{" + values.join(",") + "}";
}

function media(mediaList) {
  return simpleArray((mediaList || []).map(aMedium).filter(x => !!x)); // remove nulls
}

function sourcedMedia(photoList) {
  return simpleArray((photoList || []).map(aSourcedMedia).filter(x => !!x)); // remove nulls
}

function boolean(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === true || value === false) {
    return value;
  }
  return false;
}

// Yes, these should be converted to booleans
function yesno(value) {
  if (!value) {
    return null;
  }
  if (value === "yes" || value === "no") {
    return value;
  }
  throw new Error("Only yes or no are allowed here");
}

function date(value) {
  if (isDate(value)) {
    return text(value);
  } else {
    if (!value) {
      return null;
    }
    return new Date(value);
  }
}

// replace as.text, don't convert null to "null" because that's dumb
function text(value) {
  return pgp.as.text(value || "");
}

function richtext(value) {
  // FIXME: only allow white-listed HTML
  return text(value);
}

const as = Object.assign({}, pgp.as, {
  boolean,
  author,
  attachment,
  attachments,
  date,
  id,
  ids,
  integer,
  localed,
  media,
  number,
  sourcedMedia,
  strings,
  casekey,
  casekeys,
  richtext,
  tagkeys,
  text,
  url: asUrl,
  urls,
  yesno
});

const helpers = pgp.helpers;

const CASE_EDIT_BY_ID = sql("../sql/case_edit_by_id.sql");
const CASE_EDIT_STATIC = sql("../sql/case_edit_static.sql");
const CASE_VIEW_BY_ID = sql("../sql/case_view_by_id.sql");
const CASE_VIEW_STATIC = sql("../sql/case_view_static.sql");
const METHOD_EDIT_BY_ID = sql("../sql/method_edit_by_id.sql");
const METHOD_EDIT_STATIC = sql("../sql/method_edit_static.sql");
const METHOD_VIEW_BY_ID = sql("../sql/method_view_by_id.sql");
const METHOD_VIEW_STATIC = sql("../sql/method_view_static.sql");
const ORGANIZATION_EDIT_BY_ID = sql("../sql/organization_edit_by_id.sql");
const ORGANIZATION_EDIT_STATIC = sql("../sql/organization_edit_static.sql");
const ORGANIZATION_VIEW_BY_ID = sql("../sql/organization_view_by_id.sql");
const ORGANIZATION_VIEW_STATIC = sql("../sql/organization_view_static.sql");
const INSERT_LOCALIZED_TEXT = sql("../sql/insert_localized_text.sql");
const UPDATE_NOUN = sql("../sql/update_noun.sql");
const INSERT_AUTHOR = sql("../sql/insert_author.sql");
const USER_BY_EMAIL = sql("../sql/user_by_email.sql");
const USER_BY_ID = sql("../sql/user_by_id.sql");
const CREATE_USER_ID = sql("../sql/create_user_id.sql");
const CASES_BY_COUNTRY = sql("../sql/cases_by_country.sql");
const CREATE_CASE = sql("../sql/create_case.sql");
const CREATE_METHOD = sql("../sql/create_method.sql");
const CREATE_ORGANIZATION = sql("../sql/create_organization.sql");
const TITLES_FOR_THINGS = sql("../sql/titles_for_things.sql");
const SEARCH = sql("../sql/search.sql");
const FEATURED_MAP = sql("../sql/featuredmap.sql");
const FEATURED = sql("../sql/featured.sql");
const SEARCH_MAP = sql("../sql/searchmap.sql");
const LIST_MAP_CASES = sql("../sql/list_map_cases.sql");
const LIST_MAP_ORGANIZATIONS = sql("../sql/list_map_orgs.sql");
const LIST_TITLES = sql("../sql/list_titles.sql");
const LIST_SHORT = sql("../sql/list_short.sql");
const UPDATE_USER = sql("../sql/update_user.sql");
const UPDATE_CASE = sql("../sql/update_case.sql");

module.exports = {
  db,
  as,
  helpers,
  pgp,
  INSERT_LOCALIZED_TEXT,
  UPDATE_NOUN,
  INSERT_AUTHOR,
  USER_BY_EMAIL,
  USER_BY_ID,
  CREATE_USER_ID,
  CASES_BY_COUNTRY,
  CREATE_CASE,
  CREATE_METHOD,
  CREATE_ORGANIZATION,
  TITLES_FOR_THINGS,
  SEARCH,
  FEATURED_MAP,
  FEATURED,
  SEARCH_MAP,
  LIST_MAP_CASES,
  LIST_MAP_ORGANIZATIONS,
  LIST_TITLES,
  LIST_SHORT,
  UPDATE_USER,
  UPDATE_CASE,
  CASE_EDIT_BY_ID,
  CASE_EDIT_STATIC,
  CASE_VIEW_BY_ID,
  CASE_VIEW_STATIC,
  METHOD_EDIT_BY_ID,
  METHOD_EDIT_STATIC,
  METHOD_VIEW_BY_ID,
  METHOD_VIEW_STATIC,
  ORGANIZATION_EDIT_BY_ID,
  ORGANIZATION_EDIT_STATIC,
  ORGANIZATION_VIEW_BY_ID,
  ORGANIZATION_VIEW_STATIC
};
