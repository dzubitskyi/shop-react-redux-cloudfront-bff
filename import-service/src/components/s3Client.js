'use strict';

const { S3Client } = require('@aws-sdk/client-s3');

module.exports.s3Client = new S3Client({
    region: process.env.REGION,
});