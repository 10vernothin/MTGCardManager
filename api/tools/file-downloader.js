var fs = require('fs').promises;
var https = require('https')

/*
downloadFile(uri, filename, callback) downloads a file in any file format from an uri to a file
Source: https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
*/
exports.downloadFile = function(uri, filename, callback=undefined) {
    https.get(uri, (resp) => {
      let data = Buffer.alloc(0);
      resp.on('data', (chunk) => {
        data = Buffer.concat([data, chunk])
        chunk = null;
        resp = null;
      })
      resp.on('end', () => {
        resp = null;
        fs.writeFile(filename, data).then(() =>{
          if (!(callback===undefined)){
            callback(0)
          }
        }).catch((err) => {
          console.log(err.errno)
          if (!(callback===undefined)){
            callback(err.errno)
          }
          
        })
      })
      resp.on('error', (err) => {
        console.log(err.errno)
        if (!(callback===undefined)){
          callback(err.errno)
        }
      })
    })
};