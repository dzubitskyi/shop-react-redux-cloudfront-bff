'use strict';

const { Products } = require('./constants');

module.exports.handler = async (event) => {
    const productId = event?.pathParameters?.id;

    const product = Products.find((product) => product.id === productId);

    if (product) {
        return {
            statusCode: 200,
            body: JSON.stringify(product),
        };
    }

    return {
        statusCode: 404,
        body: "",
    };
};
