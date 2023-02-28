'use strict';

const { Products } = require('./constants');

module.exports.handler = async () => {
    return {
        headers: {
            "Access-Control-Allow-Origin": "https://dx1sqf128gisv.cloudfront.net",
        },
        statusCode: 200,
        body: JSON.stringify(Products),
    };
};
