const { initialiseS3 } = require('./utils.js')

var s3 = initialiseS3();

// Get the geojson from the output bucket
async function getObjectKeys(startAfter, maxObjectIds, bucket, prefix) {
    try {
        const params = {
            Bucket: bucket,
            Prefix: prefix ? prefix : undefined,
            StartAfter: startAfter ? startAfter : undefined,
            MaxKeys: maxObjectIds
        };
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents
    }
    catch (e) {
        console.log(`Warning: Could not retrieve file from S3: ${e.message}. This can be caused by the destination bucket having no entry for this specific item.`)
        return [];
    }
}

// This function gets 50K object keys as this is the max amount of urls a sitemap file can contain. It will need to be run again if more keys are still available.
async function getObjectIds(startAfter = undefined, maxObjectIds = 50000, bucket, prefix, keepFileExtension = false) {
    let ret = []
    let reachedLastKey = false
    let reachedLengthLimit = false

    while (!reachedLengthLimit && !reachedLastKey) {
        let newKeySet = await getObjectKeys(startAfter, maxObjectIds, bucket, prefix)
        if (newKeySet.length > 0) {
            startAfter = newKeySet[newKeySet.length - 1].Key
            newKeySet = newKeySet.filter(e => {
                if(e.Key.split('/').pop()) return true
                return false
            }).map(e => { 
                const lastModDate = new Date(e.LastModified)
                let ret =  {
                    key: e.Key.split('/').pop(),
                    lastModified: lastModDate.toISOString()
            }
                if (!keepFileExtension) ret.ket = ret.key.split('.')[0]
                return ret
            }) // Remove folders and file extensions from Key.
            ret = ret.concat(newKeySet)
        }
        else {
            reachedLastKey = true
            startAfter = false
        }
        if (maxObjectIds) reachedLengthLimit = true
    }
    return {
        data: ret,
        startAfter: startAfter
    }
}

module.exports = {
    getObjectIds
}
