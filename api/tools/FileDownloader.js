var fs = require('fs');
var https = require('https')

/*
downloadFile(uri, filename, callback) downloads a file in any file format from an uri to a file
Source: https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
*/
exports.fetchFile = (uri, callback) => {
    uri = uri.valueOf()
    https.get(uri, (resp) => {
        let data = Buffer.alloc(0);
        resp.on('data', (chunk) => {
          data = Buffer.concat([data, chunk])
          resp = null;
          chunk = null;
        })
        resp.on('end', () => {
          callback(data);
          resp = null;
          uri = null;
        })
        resp.on('error', (err) => {
          data = null;
          resp = null;
          uri = null;
          callback("FETCH ERROR")
        })
    })
    
};

exports.downloadFile = (uri, filename, callback) => {
  if (filename === null || filename === undefined || uri === undefined ||uri === null) {
    if (callback) {
      callback("DOWNLOADER ERROR: URI/FILERNAME empty")
    }
  }
  uri = uri.valueOf()
  filename = filename.valueOf()
  this.fetchFile(uri, (data) => {
    if (data === "FETCH ERROR") {
        data = null;
        if (callback) {
          callback({message:"DOWNLOADER: FETCH ERROR"})
        }
    } else {
      fs.mkdir(filename.split('/').slice(0,-1).join('/'), {recursive: true}, () =>{
        fs.writeFile(filename, data,(err) =>{
          if (err) {
            data = null;
            if (callback) {
              callback({message: `DOWNLOADER: ${err.message}`})
            }
            err = null;
          } else {
            data = null;
            if (callback) {
              callback(0)
            }
          }
        })
        filename = null;
        uri = null;
      })
  
    }
  })
};
