const request = require('request');

const options={
    url:'https://api.integrator.io/v1/integrations',
    headers:{
        'Authorization':'Bearer {token here}'
    },
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

// request.get('https://api.integrator.io/v1/flows',callback)
//     .auth(null, null, true, 'd54e21c46cf441e8bc43c18e339b1886');