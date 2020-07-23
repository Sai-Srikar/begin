const request = require('request');

var postData={
    "name": "PostmanE",
    "_connectionId": "5ebe7296ec10b303fce69ae3",
    "apiIdentifier": "e5e1e2e669",
    "asynchronous": true,
    "assistant": "shopify",
    "assistantMetadata": {
        "resource": "product",
        "operation": "retrieves_alistofproducts"
    },
    "http": {
        "relativeURI": "/admin/products.json{{#compare export.http.paging.page \"!=\" \"1\"}}?page={{{export.http.paging.page}}}{{/compare}}",
        "method": "GET",
        "headers": [
            {
                "name": "X-Shopify-Api-Features",
                "value": "include-presentment-prices"
            }
        ],
        "successMediaType": "json",
        "errorMediaType": "json",
        "paging": {
            "method": "page",
            "page": 1,
            "relativeURI": "/admin/products.json{{#compare export.http.paging.page \"!=\" \"1\"}}?page={{{export.http.paging.page}}}{{/compare}}",
            "lastPageStatusCode": 404
        },
        "response": {
            "resourcePath": "products"
        }
    },
    "rest": {
        "relativeURI": "/admin/products.json",
        "method": "GET",
        "headers": [
            {
                "name": "X-Shopify-Api-Features",
                "value": "include-presentment-prices"
            }
        ],
        "resourcePath": "products",
        "pagingMethod": "pageargument",
        "pageArgument": "page"
    },
    "transform": {
        "type": "expression",
        "expression": {
            "version": "1",
            "rules": []
        },
        "version": "1",
        "rules": []
    },
    "filter": {
        "type": "expression",
        "expression": {
            "version": "1"
        },
        "version": "1"
    },
    "inputFilter": {
        "type": "expression",
        "expression": {
            "version": "1"
        },
        "version": "1"
    },
    "adaptorType": "RESTExport"
}

const options={
    url:'https://api.integrator.io/v1/exports',
    headers:{
        'Authorization':'Bearer {token here}'
    },
    json:postData
}

function callback(error,response,body){
    if(!error && response.statusCode ==201){
        console.log(body);
    }
    else
    {
        console.log(response.statusCode);
    }
}

request.post(options,callback);
