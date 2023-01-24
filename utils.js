const initialiseS3 = function() {
    const AWS = require('aws-sdk');
    AWS.config.update({ region: 'ca-central-1' });
    
    var s3 = new AWS.S3();
    return s3
 }

const escapeSpecialXMLCharacters = function(string) {
  return string.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = {
  escapeSpecialXMLCharacters,
  initialiseS3 
}
