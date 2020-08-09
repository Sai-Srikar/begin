var request = require('request');
var fs = require('fs');
const { resolve } = require('path');


class setup{
    constructor(folderPath){
        this.folderPath = folderPath;
        this.mappingDictionary = new Map();
        this.intId="No integration created";
    }
    
    postMethod(path,json){
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://api.integrator.io/v1' + path,
                headers: {
                    'Authorization': 'Bearer {token here}'
                },
                json: json
            }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body);
                }
                else{
                    console.log(response.body);
                    console.log(error);
                }
            })
        });
    }
    createIntegration(callback){
        const integrationPath = "/integrations";
        const importjson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        var id = importjson._id;
        var method=this.postMethod(integrationPath, importjson);
        this.intId=method._id;
        callback(method);
    }
    async createConnections(){
        const connectionPath = "/connections";
        var foldername = this.folderPath;
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + connectionPath, function (err, files) {
            if(err){
                console.error(err);
                process.exit(1);
            }
            files.forEach(function(file,index){
                const connectionJson = JSON.parse(fs.readFileSync(foldername+connectionPath+"/"+file));
                //using file name to map
                dict.set(id,postMethod(file,connectionJson));
            })
        });
    }
     createExports(callback) {
        const exportPath = "/exports";
        var foldername = this.folderPath
        var dict  = this.mappingDictionary
        var postMethod = this.postMethod;
        var result=[];
        fs.readdir(foldername + exportPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const exportsJson = JSON.parse(fs.readFileSync(foldername+exportPath+"/"+ file));
                var id = exportsJson._id;
                var method=await postMethod(exportPath, exportsJson);
                var newId=method._id;
                dict.set(id,newId);
                callback(method);
            })
        });
    }
    async createImports(callback){
        const importsPath = "/imports";
        var foldername = this.folderPath
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + importsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const importsJson = JSON.parse(fs.readFileSync(foldername+importsPath+"/"+file));
                importsJson._connectionId = await dict.get(importsJson._connectionId);
                var id = importsJson._id;
                var method=postMethod(importsPath, importsJson);
                var newId=method._id;
                dict.set(id,newId);
                callback(method);
            })
        });
    }
    async createFlows(callback){
        const flowsPath = "/flows";
        var foldername = this.folderPath;
        var dict = this.mappingDictionary;
        var postMethod = this.postMethod;
        var integrationID= await this.intId;
        fs.readdir(foldername + flowsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const flowsJson = JSON.parse(fs.readFileSync(foldername+flowsPath+"/"+file));
                try {
                    var integrationResponse = await dict.get("_integrationId");
                    flowsJson._integrationId = integrationResponse._id;
                } catch (error) {
                    console.log("Integration not processed");
                }
                try {
                    var exportResponse = await dict.get(flowsJson.pageGenerators[0]._exportId);
                    console.log(exportResponse)
                    flowsJson.pageGenerators[0]._exportId = exportResponse._id;
                } catch (error) {
                    console.log(error)
                    console.log("Export not processed");
                }
                try {
                    console.log(dict);
                    var importResponse = await dict.get(flowsJson.pageProcessors[0]._importId);
                    console.log(importResponse)
                    flowsJson.pageProcessors[0]._importId = importResponse._id;
                } catch (error) {
                    console.log(error)
                    console.log("Import not processed");
                }
                var method = postMethod(flowsPath, flowsJson);
                callback(method);
            })
        });
    }
    doesNothingCallBack() {
        //callback is only used for mocha testing
    }
    starSsetup() {
        this.createIntegration(this.doesNothingCallBack);
        this.createConnections();
        this.createExports(this.doesNothingCallBack);
        this.createImports(this.doesNothingCallBack);
        this.createFlows(this.doesNothingCallBack);
    }
}

// var start=new CopyDocs('../../flows/test2/');
// start.setup();

// getCopydocs =(props)=> new CopyDocs(props);
module.exports={CopyDocs}