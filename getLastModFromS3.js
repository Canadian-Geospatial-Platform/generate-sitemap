const { initialiseS3 } = require('./utils.js')

var s3 = initialiseS3();

async function getLastMod(key) {
    const geojson = await getObjectFromS3(process.env.INPUT_BUCKET, process.env.INPUT_BUCKET_PREFIX+"0083e317-8bb5-492a-8348-c021e183f307.geojson")
    console.log(geojson.data)
}

function getObjectFromS3 (bucket, key) {

return new Promise((resolve, reject) => { 
    console.log("key is: \n" + key)
       var params = {
        Bucket: bucket,
        Key: key,
    }
    return s3.getObject(params, function(err, data) {
        if (err) {
            console.log("An error has occured writing data to s3\n", err, err.stack); // an error occurred
            return reject(err)
                        }
        else {console.log("Data has been successfully fetched ", key, ".");
            return resolve(true)
        } // successful response
    });
    })
}

module.exports = {
 getLastMod   
}
