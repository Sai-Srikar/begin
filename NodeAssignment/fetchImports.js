const request = require('request');

const options={
    url:'https://api.integrator.io/v1/imports',
    headers:{
        'Authorization':'Bearer {token here}'
    }
}

function callback(error,response,body){
    if(!error && response.statusCode ==200){
        const result=JSON.parse(body);
        console.log(result)
    }
    else
    {
        console.log(response.statusCode);
    }
}

request.get(options,callback);
