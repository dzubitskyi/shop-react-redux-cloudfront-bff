'use strict';

const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client } = require('../components/s3Client');

async function getUploadUrl(name) {
    const bucketParams = {
        Bucket: process.env.FILES_BUCKET_NAME,
        Key: `${process.env.UPLOAD_FOLDER}/${name}`,
    };
    const command = new PutObjectCommand(bucketParams);

    try {
        return getSignedUrl(s3Client, command);
    } catch (error) {
        console.error('importProductsFile::getUploadUrl', error);
        return '';
    }
}

function validateFileName(name) {
    return (typeof name === 'string') && (name.split('.').pop() === 'csv');
}

const headers = {
    'Access-Control-Allow-Origin': 'https://dzl13vebtejqq.cloudfront.net',
    'Access-Control-Allow-Credentials': true,
};

const get500ResponsePayload = () => ({
    statusCode: 500,
    headers,
    body: 'Failure: Internal Server Error.',
});

const get400ResponsePayload = () => ({
    statusCode: 400,
    headers,
    body: 'Failure: Bad Request.',
});

const get200ResponsePayload = (body) => ({
    statusCode: 200,
    headers,
    body,
});

module.exports.handler = async (event) => {
    console.log('importProductsFile:', event);
    const name = event?.queryStringParameters?.name;

    if (validateFileName(name)) {
        const url = await getUploadUrl(name);
        return url
            ? get200ResponsePayload(url)
            : get500ResponsePayload();
    }

    return get400ResponsePayload();
};