'use strict';

const { dynamoDBDocument } = require('../components/dynamoDB');
const { getExtendedProductList } = require('./Utils');

const headers = {
    'Content-Type': 'application/json',
}

const get200ResponsePayload = (body) => ({
    statusCode: 200,
    headers,
    body,
});
const get404ResponsePayload = () => ({
    statusCode: 404,
    headers,
    body: '[]',
});

async function query(params) {
    try {
        const { Items } = await dynamoDBDocument.query(params);
        return Items;
    } catch (error) {
        console.log('dynamoDBDocument::query', error);
        return [];
    }
}

function getProductStockParams(productId) {
    return {
        TableName: process.env.DB_PRODUCTS_STOCK,
        ExpressionAttributeValues: {
            ':product_id': productId,
        },
        KeyConditionExpression: '#product_id = :product_id',
        ExpressionAttributeNames: {
            '#product_id': 'product_id',
        },
    };
}

function getProductParams(productId) {
    return {
        TableName: process.env.DB_PRODUCTS,
        ExpressionAttributeValues: {
            ':id': productId,
        },
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id',
        },
    }
}

module.exports.handler = async (event) => {
    const productId = event?.pathParameters?.id;

    const productStock = await query(getProductStockParams(productId));

    const product = productStock.length
        ? await query(getProductParams(productId))
        : [];

    const extendedProduct = product.length
        ? getExtendedProductList(productStock, product)
        : [];

    return extendedProduct.length
        ? get200ResponsePayload(JSON.stringify(extendedProduct))
        : get404ResponsePayload();
};
