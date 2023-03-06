const { readFileSync } = require('fs');
const path = require('path');

const { DynamoDBClient, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const options = {
    region: process.env.AWS_REGION,
};
const dynamoDBClient = new DynamoDBClient(options);

const DB_PRODUCTS = 'product-service-products-dev';
const DB_PRODUCTS_STOCK = 'product-service-stock-dev';

const params = {
    RequestItems: {},
}

const products = readFileSync(path.resolve(__dirname, 'products.json'));
const productsParams = JSON.parse(products).map((product) => ({
    PutRequest: {
        Item: {
            ...product,
        },
    },
}));
params.RequestItems[DB_PRODUCTS] = productsParams;

const productsStock = readFileSync(path.resolve(__dirname, 'products_stock.json'));
const productsStockParams = JSON.parse(productsStock).map((product) => ({
    PutRequest: {
        Item: {
            ...product,
        },
    },
}));
params.RequestItems[DB_PRODUCTS_STOCK] = productsStockParams;

(async () => {
    try {
        const data = await dynamoDBClient.send(new BatchWriteItemCommand(params));
        console.log('dynamoDBClient::send', data);
        return data;
    } catch (error) {
        console.error('dynamoDBClient::send', error);
    }
})();
