const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

var s3 = new AWS.S3();

// Returns true on successful write and false on failure.
function putObjectToS3(bucket, key, data) {

return new Promise((resolve, reject) => { 
       var params = {
        Bucket: bucket,
        Key: key,
        Body: data
    }
    return s3.putObject(params, function(err, data) {
        if (err) {
            console.log("An error has occured writing data to s3\n", err, err.stack); // an error occurred
            return reject(err)
                        }
        else {console.log("Data has been successfully written to ", key, ".");
            return resolve(true)
        } // successful response
    });
    })
}

module.exports = {
    putObjectToS3
}
