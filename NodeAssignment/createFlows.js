const request = require('request');

var postData={
    "name":"Test Create",
    '_integrationId':'5f16d543545ecc2a32483177'
}

const options={
    url:'https://api.integrator.io/v1/flows',
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
