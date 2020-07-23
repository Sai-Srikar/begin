const request = require('request');

var postData={
    "name": "Node",
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
