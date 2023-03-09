<details>
  <summary>Task 4.1</summary>

    1. Use AWS Console to create two database tables in DynamoDB. Expected schemas for products and stocks
    2. Write a script to fill tables with test examples. Store it in your Github repository. Execute it for your DB to fill data.
</details>

#### result:
```
node "product-service/src/scripts/insertProducts.js"
```

<details>
  <summary>Task 4.2</summary>

    1. Extend your serverless.yml file with data about your database table and pass it to lambda’s environment variables section.
    2. Integrate the getProductsList lambda to return via GET /products request a list of products from the database (joined stocks and products tables).
    3. Implement a Product model on FE side as a joined model of product and stock by productId.
</details>

#### result:
[getProductsList.js](https://n26b8xi1na.execute-api.eu-central-1.amazonaws.com/dev/products)
[getProductById.js](https://n26b8xi1na.execute-api.eu-central-1.amazonaws.com/dev/products/4263dce1-ca23-4e3b-a8a5-5b7f90be2def)
[cloudfront](https://dzl13vebtejqq.cloudfront.net)

<details>
  <summary>Task 4.3</summary>

    1. Create a lambda function called createProduct under the same Serverless config file (i.e. serverless.yaml) of Product Service which will be triggered by the HTTP POST method.
    2. The requested URL should be /products.
    3. Implement its logic so it will be creating a new item in a Products table.
    4. Save the URL (API Gateway URL) to execute the implemented lambda functions for later - you'll need to provide it in the PR (e.g in PR's description) when submitting the task.
</details>

#### result:
`createProduct.js`

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"title":"Nokia 8210 4G Blue","description":"The Nokia 8210 4G Blue is the modern version of the classic Nokia 8210.","count":99,"price":79}' \
  https://n26b8xi1na.execute-api.eu-central-1.amazonaws.com/dev/products
```