'use strict';

module.exports.getExtendedProductList = (productsStockItems, productsItems) =>
    productsStockItems.map(({ count, product_id }) =>
        ({
            count, ...productsItems.find(({ id }) => id === product_id),
        })
    );
