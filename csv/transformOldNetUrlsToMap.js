const fs = require("fs");
const parse = require("csv-parse");

const types = ["cases", "methods", "organizations"];
const fileName = type => `old-dot-net-urls-mapped-to-id-${type}.csv`;

const oldBasePaths = ["https://participedia.ctweb08.ct.coop", "https://participedia.net"];

const map = {};

types.forEach(type => translateCSVToObj(type));

function translateCSVToObj(type) {
  fs.createReadStream("./csv/" + fileName(type))
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
      // split base path from url
      const url = csvrow[1];

      let pathOnly = "";
      if (url.indexOf(oldBasePaths[0]) !== -1) {
        pathOnly = url.split(oldBasePaths[0])[1];
      } else if (url.indexOf(oldBasePaths[1]) !== -1) {
        pathOnly = url.split(oldBasePaths[1])[1];
      }

      // don't include /en/node/ formatted paths
      if (pathOnly.indexOf("/en/node/") !== -1) {
        return;
      }

      if (pathOnly) {
        map[pathOnly] = csvrow[0];
      }
    })
    .on('end',function() {
      //do something with csvData
      console.log(map);
      fs.writeFile("./csv/oldURLSMap.json", JSON.stringify(map), function(err) {
        if(err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });
    });
}
