var downloader = require('./FileDownloader')
var fsPromise = require('fs').promises

path = "../api/json/scryfall/cards"


exports.downloadAllCards = () =>{
    readAllPaths().then((resolvedDirs) => {
        resolvedDirs = resolvedDirs.flat(1)
        let startIndex = 0
        let batchIndex = 0
        let len = resolvedDirs.length
        let noBatches = 20
        let endIndex = startIndex + noBatches
        let maxPerBatch = Math.floor(len/noBatches)
        console.log(`Downloading Cards --- Total Cards:${len}, Number of Batches:${noBatches}, Max Items Per Batch: ${maxPerBatch}`)
        while (batchIndex <= noBatches) {
            console.log(`Initializing Batch ${batchIndex}`)
            downloadFileInBulk(resolvedDirs.slice(startIndex, endIndex), batchIndex)
            startIndex = endIndex
            endIndex = (startIndex + maxPerBatch < len)?startIndex+maxPerBatch: len
            batchIndex += 1
        }
        
    })
    path = null;
}

readAllPaths = async () => {
    dirs = await fsPromise.readdir(path, {withFileTypes: true})
    dirs = dirs.filter((dir)=>dir.isDirectory())
    listofDirs = dirs.map((dir) => {
        pathname = path.concat(`/${dir.name}`)
        return readPathsofDir(pathname)
    })
    return await Promise.all(listofDirs)
}

readPathsofDir = async (pathname) => {
    files = (await fsPromise.readdir(pathname, {withFileTypes: true})).filter((file) => file.isFile())
    files = files.map((file) => {
        return pathname.concat(`/${file.name}`)
    })
    return files
}

downloadFileInBulk = (listofDirs, batchIndex, subIndex=0) => {
    console.log(`Initiating Batch Item ${batchIndex+1}.${subIndex+1}`)
    if (!(listofDirs[subIndex] === undefined)){
        fsPromise.readFile(listofDirs[subIndex]).then((result) => {
            let uriList = JSON.parse(result).image_uris
            if (!(uriList === undefined || uriList === null)){
                let pathList = Object.keys(uriList).map((key)=>{
                    let imgpath = listofDirs[subIndex].split('/').slice(0,-1)
                    let filename = listofDirs[subIndex].split('/').slice(-1)[0].split('.')
                    filename = filename[0].concat(`_${key}`).concat(`.${uriList[key].split('/').slice(-1)[0].split('.').slice(1)[0].substr(0,3)}`)
                    imgpath.push('images')
                    imgpath.push(filename)
                    imgpath = imgpath.join('/')
                    return imgpath
                })
                uriList = Object.keys(uriList).map((key) =>{return uriList[key]})
                //console.log(uriList, pathList)
                downloadAllImagesOfCard(uriList, pathList, 0, (end) => {
                    if (end === 0){ 
                        //console.log(`BATCH ${batchIndex+1}.${subIndex+1} complete`);
                        if (subIndex < listofDirs.length) {
                            downloadFileInBulk(listofDirs, batchIndex, subIndex+1)
                        } else {
                            console.log(`BATCH ${batchIndex+1} complete.`)
                        }
                    } else {
                        console.log(`BATCH ${batchIndex+1}.${subIndex+1} failed. Abandoning batch.`);
                    }
                })
            } else {
                if (subIndex < listofDirs.length) {
                    downloadFileInBulk(listofDirs, batchIndex, subIndex+1)
                } else {
                    console.log(`BATCH ${batchIndex+1} complete.`)
                }
            }
        })
    } else {
        if (subIndex < listofDirs.length) {
            downloadFileInBulk(listofDirs, batchIndex, subIndex+1)
        } else {
            console.log(`BATCH ${batchIndex+1} complete.`)
        }
    }
}

downloadAllImagesOfCard = (lstOfURIs, lstOfPaths, index, callback) => {
    //console.log(`DOWNLOADING IMAGE ${index} ${lstOfPaths[index].split('/').slice(-1)}`)
    fsPromise.readdir(lstOfPaths[index].split('/').slice(0, -1).join('/'))
    .then((listOfNames) => {
        if (listOfNames.includes(lstOfPaths[index].split('/').slice(-1)[0])){
            downloader.downloadFile(lstOfURIs[index], lstOfPaths[index], (resp) => {
                if (resp === 0) {
                    if (!(index+1 >= lstOfURIs.length)) {
                        setTimeout(() => {
                            downloadAllImagesOfCard(lstOfURIs, lstOfPaths, index+1, callback)
                        }, 100)
                        resp = null;
                    } else {
                        resp = null;
                        callback(0)
                    }
                } else {
                    console.log(resp)
                    callback(-1)
                    resp = null

                }
            })
            listOfNames = null;
        } else {
            //console.log(`SKIPPING IMAGE ${index} ${lstOfPaths[index].split('/').slice(-1)}`)
            if (!(index+1 >= lstOfURIs.length)) {
                setTimeout(() => {
                    downloadAllImagesOfCard(lstOfURIs, lstOfPaths, index+1, callback)
                }, 100)
                resp = null;
            } else {
                resp = null;
                callback(0)
            }
        }
    })
    .catch((err) => {
            downloader.downloadFile(lstOfURIs[index], lstOfPaths[index], (resp) => {
                if (resp === 0) {
                    if (!(index+1 >= lstOfURIs.length)) {
                        setTimeout(() => {
                            downloadAllImagesOfCard(lstOfURIs, lstOfPaths, index+1, callback)
                        }, 100)
                        resp = null;
                    } else {
                        resp = null;
                        callback(0)
                    }
                } else {
                    console.log(resp)
                    resp = null
                }
            })
            listOfNames = null;
        })
}