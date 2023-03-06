'use strict';

const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
});

const translateConfig = {
    marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: false,
        convertClassInstanceToMap: false,
    },
    unmarshallOptions: {
        wrapNumbers: false,
    },
};

module.exports.dynamoDBDocument =  DynamoDBDocument.from(client, translateConfig);
