const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

var s3 = new AWS.S3();

function putObjectToS3(bucket, key, data) {

    var params = {
        Bucket: bucket,
        Key: key,
        Body: data
    }
    s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
}

module.exports = {
    putObjectToS3
}
