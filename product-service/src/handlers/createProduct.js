'use strict';

const uuid = require('uuid');
const { TransactionCanceledException } = require('@aws-sdk/client-dynamodb');
const { dynamoDBDocument } = require('../components/dynamoDB');

const get400ResponsePayload = () => ({
    statusCode: 400,
    headers: {
        'Content-Type': 'text/plain',
    },
    body: 'Failure: product item has not been created.',
});
const get409ResponsePayload = () => ({
    statusCode: 409,
    headers: {
        'Content-Type': 'text/plain',
    },
    body: 'Failure: product item already exists.',
});
const get200ResponsePayload = () => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'text/plain',
    },
    body: 'Success: product item has been created.',
});

function isValidProductData({ title, count }) {
    const isValidTitle = title => (typeof title === 'string' && Boolean(title.trim()));
    const isValidCount = count => (Number.isInteger(count) && (count >= 0));

    return (isValidTitle(title) && isValidCount(count));
}

function getTransactParams(data, uuidV4) {
    const productItem = {
        id: uuidV4,
        title: data.title,
        description: data.description,
        price: data.price,
    };

    const productStockItem = {
        product_id: uuidV4,
        count: data.count,
    };

    return {
        TransactItems: [
            {
                Put: {
                    TableName: process.env.DB_PRODUCTS,
                    ConditionExpression: 'attribute_not_exists(id)',
                    Item: productItem,
                },
            },
            {
                Put: {
                    TableName: process.env.DB_PRODUCTS_STOCK,
                    ConditionExpression: 'attribute_not_exists(product_id)',
                    Item: productStockItem,
                },
            },
        ],
    };
}

async function transact(params) {
    try {
        await dynamoDBDocument.transactWrite(params);
    } catch (error) {
        console.log('dynamoDBDocument::transactWrite', error);
        return error;
    }
}

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body);

    if (isValidProductData(body)) {
        const transactionError = await transact(getTransactParams(body, uuid.v4()));
        if (transactionError instanceof TransactionCanceledException
            && (transactionError.CancellationReasons?.[1]?.Code === 'ConditionalCheckFailed')
        ) {
            return get409ResponsePayload();
        }

        return get200ResponsePayload();
    }

    return get400ResponsePayload();
};
