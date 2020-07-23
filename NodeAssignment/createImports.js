const request = require('request');

var postData={
    "name": "NodeI",
    "responseTransform": {
        "type": "expression",
        "expression": {
            "version": "1"
        },
        "version": "1"
    },
    "_connectionId": "5ebe7565d6af806b53e083c1",
    "distributed": false,
    "apiIdentifier": "i441308b88",
    "ignoreExisting": true,
    "mapping": {
        "fields": [
            {
                "extract": "id",
                "generate": "ProductCode"
            },
            {
                "extract": "title",
                "generate": "Name"
            },
            {
                "extract": "variants[*].taxable",
                "generate": "IsActive"
            }
        ]
    },
    "salesforce": {
        "operation": "insert",
        "sObjectType": "Product2",
        "api": "soap",
        "idLookup": {
            "whereClause": "(ProductCode = {{{string id}}})"
        },
        "removeNonSubmittableFields": false
    },
    "filter": {
        "type": "expression",
        "expression": {
            "version": "1"
        },
        "version": "1"
    },
    "adaptorType": "SalesforceImport"
}

const options={
    url:'https://api.integrator.io/v1/imports',
    headers:{
        'Authorization':'Bearer {token here}'
    },
    json:postData
}

function callback(error,response,body){
    if(!error && response.statusCode ==201){
        console.log(body)
    }
    else
    {
        console.log(response.statusCode);
    }
}

request.post(options,callback);

