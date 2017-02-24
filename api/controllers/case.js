'use strict'
var express = require('express')
var router = express.Router()
var groups = require('../helpers/groups')
var es = require('../helpers/es')
var ddb = require('../helpers/ddb')
var cache = require('apicache')
var AWS = require("aws-sdk")
var getAuthorByAuthorID = require('../helpers/getAuthor')
var log = require('winston')
var Bodybuilder = require('bodybuilder')
var jsonStringify = require('json-pretty');

var db = require('../helpers/db')

/**
 * @api {get} /case/countsByCountry Get case counts for each country
 * @apiGroup Cases
 * @apiVersion 0.1.0
 * @apiName countsByCountry
 *
 * @apiSuccess {Boolean} OK true if call was successful
 * @apiSuccess {String[]} errors List of error strings (when `OK` is false)
 * @apiSuccess {Object} data Mapping of country names to counts (when `OK` is true)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "OK": true,
 *       "data": {
 *          countryCounts: {
 *            "United States": 122,
 *            "United Kingdom": 57,
 *            "Italy": 51,
 *            ...
 *        }
 *     }
 * })
 */

// TODO: figure out if the choropleth should show cases or all things

router.get('/countsByCountry', function (req, res) {
    db.query(
        'select $1~.$3~, count($1~.$3~) from $1~, $2~ where $1~.$4~ = $2~.$5~ group by $1~.$3~;',
        ['geolocation', 'cases', 'country', 'id', 'location']
    ).then(function(data){
        // convert array to object
        var countryCounts = {};
        data.forEach(function(row){
            if (row.country === null){
                return;
            }
            countryCounts[row.country.toLowerCase()] = row.count;
        });
        res.status(200).json({
            OK: true,
            data: {
                countryCounts: countryCounts
            }
        })
    }).catch(function(error){
        log.error("Exception in /case/countsByCountry => %s", error)
        res.status(500).json({
            OK: false,
            error: error
        })
    })
});


/**
 * @api {post} /case/new Create new case
 * @apiGroup Cases
 * @apiVersion 0.1.0
 * @apiName newCase
 *
 * @apiSuccess {Boolean} OK true if call was successful
 * @apiSuccess {String[]} errors List of error strings (when `OK` is false)
 * @apiSuccess {Object} data case data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "OK": true,
 *       "data": {
 *         "ID": 3,
 *         "Description": 'foo'
 *        }
 *     }
 *
 * @apiError NotAuthenticated The user is not authenticated
 * @apiError NotAuthorized The user doesn't have permission to perform this operation.
 *
 */
router.post('/new', function (req, res, next) {
  groups.user_has(req, 'Contributors', function () {
    res.status(401).json({message: 'access denied - user does not have proper authorization'})
  }, function () {
    es.index({
      index: 'pp',
      type: 'case',
      body: req.body
    }, function (error, response) {
      if (error) {
        res.status(error.status).json({message: error.message})
      } else {
        res.status(200).json(req.body)
      }
    })
  })
})

/**
 * @api {put} /case/:caseId  Submit a new version of a case
 * @apiGroup Cases
 * @apiVersion 0.1.0
 * @apiName editCase
 * @apiParam {Number} caseId Case ID
 *
 * @apiSuccess {Boolean} OK true if call was successful
 * @apiSuccess {String[]} errors List of error strings (when `OK` is false)
 * @apiSuccess {Object} data case data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "OK": true,
 *       "data": {
 *         "ID": 3,
 *         "Description": 'foo'
 *        }
 *     }
 *
 * @apiError NotAuthenticated The user is not authenticated
 * @apiError NotAuthorized The user doesn't have permission to perform this operation.
 *
 */

router.put('/:caseId', function editCaseById (req, res) {
  cache.clear()
  groups.user_has(req, 'Contributors', function () {
    console.log("user doesn't have Contributors group membership")
    res.status(401).json({message: 'access denied - user does not have proper authorization'})
    return
  }, function () {
    var caseId = req.swagger.params.caseId.value
    var caseBody = req.body
    res.status(200).json(req.body)
  })})

/**
 * @api {get} /case/:caseId Get the last version of a case
 * @apiGroup Cases
 * @apiVersion 0.1.0
 * @apiName getCaseById
 * @apiParam {Number} caseId Case ID
 *
 * @apiSuccess {Boolean} OK true if call was successful
 * @apiSuccess {String[]} errors List of error strings (when `OK` is false)
 * @apiSuccess {Object} data case data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "OK": true,
 *       "data": {
 *         "ID": 3,
 *         "Description": 'foo'
 *        }
 *     }
 *
 * @apiError NotAuthenticated The user is not authenticated
 * @apiError NotAuthorized The user doesn't have permission to perform this operation.
 *
 */

 router.get('/:caseId', function getCaseById (req, res) {
     db.task(function(t){
         let caseId = req.params.caseId;
         return t.batch([
             t.one('SELECT * FROM cases, case__localized_texts WHERE cases.id = case__localized_texts.case_id AND  cases.id = $1;',caseId),
             t.any('SELECT users.name, case__authors.timestamp FROM users, case__authors WHERE users.id = case__authors.author AND case__authors.case_id = $1', caseId)
         ]);
    }).then(function(data){
        let the_case = data[0];
        let authors = data[1];
        the_case.authors = authors;
         res.status(200).json({
             OK: true,
             data: the_case
         })
     }).catch(function(error){
         log.error("Exception in GET /case/%s => %s", req.params.caseId, error)
         res.status(500).json({
             OK: false,
             error: error
         })
     })
 })


/**
 * @api {delete} /case/:caseId Delete a case
 * @apiGroup Cases
 * @apiVersion 0.1.0
 * @apiName deleteCase
 * @apiParam {Number} caseId Case ID
 *
 * @apiSuccess {Boolean} OK true if call was successful
 * @apiSuccess {String[]} errors List of error strings (when `OK` is false)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        OK: true
 *     }
 *
 * @apiError NotAuthenticated The user is not authenticated
 * @apiError NotAuthorized The user doesn't have permission to perform this operation.
 *
 */

router.delete('/:caseId', function editCaseById (req, res) {
  cache.clear()
  groups.user_has(req, 'Contributors', function () {
    console.error("user doesn't have Contributors group membership")
    res.status(401).json({message: 'access denied - user does not have proper authorization'})
    return
  }, function () {
    var caseId = req.swagger.params.caseId.value
    var caseBody = req.body
    res.status(200).json(req.body)
  })
})

module.exports = router
