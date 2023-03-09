'use strict';

const { dynamoDBDocument } = require('../components/dynamoDB');
const { getExtendedProductList } = require('./Utils');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://dzl13vebtejqq.cloudfront.net',
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

async function scan(productsStockTableName, productsTableName) {
    try {
        const [productsStock, products] = await Promise.all([
            dynamoDBDocument.scan({ TableName: productsStockTableName }),
            dynamoDBDocument.scan({ TableName: productsTableName })
        ]);

        return [productsStock.Items, products.Items];
    } catch (error) {
        console.log('dynamoDBDocument::scan', error);
        return [];
    }
}

module.exports.handler = async () => {
    const productsList = await scan(process.env.DB_PRODUCTS_STOCK, process.env.DB_PRODUCTS);

    return productsList.length
        ? get200ResponsePayload(JSON.stringify(getExtendedProductList(...productsList)))
        : get404ResponsePayload();
};
