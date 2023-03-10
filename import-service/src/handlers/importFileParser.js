'use strict';

const csvParser = require('csv-parser');
const { GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../components/s3Client');

async function convertStreamToJson(fileStream) {
    const results = [];
    return new Promise((resolve) => {
        fileStream
            .pipe(csvParser())
            .on('data', item => results.push(item))
            .on('end', () => resolve(results));
    });
}

async function readFile(fileName) {
    const bucketParams = {
        Bucket: process.env.FILES_BUCKET_NAME,
        Key: fileName,
    };
    const command = new GetObjectCommand(bucketParams);
    return (await s3Client.send(command)).Body;
}

async function parseFile(fileName) {
    const fileStream = await readFile(fileName);

    if (fileStream) {
        return convertStreamToJson(fileStream);
    }

    throw new Error(`Can not find file with the name ${fileName}`);
}

async function copyFile(source, fileName) {
    const params = {
        Bucket: process.env.FILES_BUCKET_NAME,
        CopySource: `/${process.env.FILES_BUCKET_NAME}/${source}`,
        Key: `${process.env.PARSED_FOLDER}/${fileName}`,
    };
    await s3Client.send(new CopyObjectCommand(params));
}

async function deleteFile(fileName) {
    const bucketParams = {
        Bucket: process.env.FILES_BUCKET_NAME,
        Key: fileName,
    };
    await s3Client.send(new DeleteObjectCommand(bucketParams));
}

async function moveFile(sourceFileName, fileName) {
    await copyFile(sourceFileName, fileName);
    await deleteFile(sourceFileName);
}


module.exports.handler = async (event) => {
    console.log('importFileParser:', event);

    await Promise.all(
        event.Records.map(async (record) => {
            console.log(`importFileParser: Start parsing the file ${record.s3.object.key}`);
            const parsedFileData = await parseFile(record.s3.object.key);

            console.log(`importFileParser: File ${record.s3.object.key} was successfully parsed`);
            console.log('importFileParser: Parsed file data:', JSON.stringify(parsedFileData));
            console.log(`importFileParser: Moving ${record.s3.object.key} file to the "${process.env.PARSED_FOLDER}" folder`);

            const filePathParts = record.s3.object.key.split('/');
            await moveFile(record.s3.object.key, filePathParts[filePathParts.length - 1]);

            console.log(`importFileParser: File ${record.s3.object.key} was successfully moved to the parsed directory`);
        }),
    );
};
