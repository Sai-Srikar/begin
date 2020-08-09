const request = require('request');
var fs=require('fs');

class createIntegration{
    constructor(path){
        this.path=path;
        this.options={
            url:'https://api.integrator.io/v1/integrations',
            headers:{
                'Authorization':'Bearer {token here}'
            },
            json:{}
        }
    }

 callback(error,response,body){
    if(!error && response.statusCode ==201){
        console.log(body);
    }
    else
    {
        console.log(response.statusCode);
    }
}

create(){
    var data= fs.readFileSync(this.path);
    this.options.json=JSON.parse(data);
    request.post(this.options,callback);
}

}

var start=new createIntegration('{file path here}');
start.create();