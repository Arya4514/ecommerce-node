
const aws = require('aws-sdk');
const config = require('../environments');

const spacesEndpoint = new aws.Endpoint(config.SPACES_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey: config.SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

const uploadData = async (params) => {
    return new Promise((resolve, reject) => {
        s3.upload(params, function (s3Err, data) {
            if (s3Err)
                reject(s3Err)
            resolve(data.Location)
        });

    })
}

const listObjectBucket = async (params) => {
    return new Promise((resolve, reject) => {
        s3.listObjects(params, function (err, data) {
            if (err)
                reject(err, err.stack);   // an error occurred
            resolve(data);       // successful response
        })
    })
}

const deleteObjectsResponse = async (params) => {
    return new Promise((resolve, reject) => {
        bucket.s3.deleteObject(params, function (err, data) {
            if (err)
                reject(err)  // error
            resolve(data);
        })
    })
}

const signedUrl = async (params) => {
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, (err, data) => {
            if (err)
                reject(err)  // error
            resolve(data);
        })
    })
}

let bucket = {
    s3,
    uploadData,
    listObjectBucket,
    deleteObjectsResponse,
    signedUrl
}
module.exports = bucket;