const { initialiseS3 } = require('./utils.js')

var s3 = initialiseS3();

async function getLastMod(key) {
    const geojson = await getObjectFromS3(process.env.INPUT_BUCKET, process.env.INPUT_BUCKET_PREFIX+"0083e317-8bb5-492a-8348-c021e183f307.geojson")
    const geoJsonObject = JSON.parse(geojson.toString())
    console.log(geoJsonObject.properties[0].)

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
            console.log("An error has occured reading from s3\n", err, err.stack); // an error occurred
            return reject(err)
                        }
        else {console.log("Data has been successfully fetched from s3", key, ".");
            return resolve(data)
        } // successful response
    });
    })
}

module.exports = {
 getLastMod   
}
