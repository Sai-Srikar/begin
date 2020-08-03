var request = require('request');
var fs = require('fs');
const { resolve } = require('path');
class CopyDocs{
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
                    'Authorization': 'Bearer b39d7da2a6324f20b1e39500e2851229'
                },
                json: json
            }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body._id);
                }
                else{
                    console.log(response.statusCode);
                    console.log(error);
                }
            })
        });
    }
    async createIntegration(){
        const integrationPath = "/integrations";
        const importjson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        var id = importjson._id;
        this.intId=this.postMethod(integrationPath, importjson);
        return this.intId;
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
                var id = connectionJson._id;
                dict.set(id,postMethod(connectionPath,connectionJson));
            })
        });
    }
    async createExports() {
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
                var newId=await postMethod(exportPath, exportsJson);
                dict.set(id,newId);
                await result.push(newId);
            })
        });
        console.log(result);
    }
    async createImports(){
        const importsPath = "/imports";
        var foldername = this.folderPath
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + importsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(function (file, index) {
                const importsJson = JSON.parse(fs.readFileSync(foldername+importsPath+"/"+file));
                // importsJson._connectionId = await dict.get(importsJson._connectionId);
                var id = importsJson._id;
                dict.set(id, postMethod(importsPath, importsJson));
            })
        });
    }
    async createFlows(){
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
                flowsJson.pageProcessors[0]._importId = await dict.get(flowsJson.pageProcessors[0]._importId);
                flowsJson.pageGenerators[0]._exportId = await dict.get(flowsJson.pageGenerators[0]._exportId);
                flowsJson._integrationId =integrationID;
                postMethod(flowsPath, flowsJson);
            })
        });
    }
    setup() {
        this.createIntegration();
        // this.createConnections();
        this.createExports();
        this.createImports();
        this.createFlows();
    }
}

var start=new CopyDocs('../../flows/test2/');
start.createExports();

// getCopydocs =(props)=> new CopyDocs(props);
module.exports={CopyDocs}