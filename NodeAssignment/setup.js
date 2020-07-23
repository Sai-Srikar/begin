var fs=require('fs');
const request=require('request');
const { resolve } = require('path');

class setup{
    constructor(folderPath){
        this.folderPath = folderPath;
        this.importConnectionID = '5f198bbc6b46b548b41988a7';
        this.exportConnectionID = '5f198b1b46842548ba57fc88';
        this.importID = "No import created";
        this.exportID = "No export created";
        this.flowID = "No flow created";
        this.integrationID = "No integration created";
    }

    postMethod(path,json){
        return new Promise((resolve, reject) =>{request({
            method: 'POST',
            url: 'https://api.integrator.io/v1'+path,
            headers: {
                'Authorization': 'Bearer {token here}'
            },
            json: json
            }, function (error, response, body){
                if (!error && response.statusCode == 201) {
                    resolve(body._id);
                }
            })
        });
    }

    setupIntegration(){
        const integrationPath= "/integrations";
        const importjson = fs.readFileSync(this.folderPath+"/integration.json");
        const integrationDetails = JSON.parse(importjson);
        this.integrationID = this.postMethod(integrationPath, integrationDetails);
    }

    setupConnections(){
        const connectionPath='/connections';
        const importjson = fs.readFileSync(this.folderPath+"/connections/importC.json");
        const importConnection = JSON.parse(importjson);
        this.importConnectionID=this.postMethod(connectionPath, importConnection);

        const exportjson = fs.readFileSync(this.folderPath+"/connections/exportC.json");
        const exportConnection = JSON.parse(exportjson);
        this.exportConnectionID=this.postMethod(connectionPath, exportConnection);
    }

    setupImport(){
        const importPath='/imports';
        const importjson = fs.readFileSync(this.folderPath+"/imports/importDetails.json");
        const importDetails = JSON.parse(importjson);
        importDetails._connectionId=this.importConnectionID;
        this.importID = this.postMethod(importPath, importDetails);

    }

    setupExport(){
        const exportPath='/exports';
        const importjson = fs.readFileSync(this.folderPath+"/exports/exportDetails.json");
        const exportDetails = JSON.parse(importjson);
        exportDetails._connectionId=this.exportConnectionID;
        this.exportID = this.postMethod(exportPath, exportDetails);

    }

    async setupFlow(){

        const flowPath='/flows';
        const importjson = fs.readFileSync(this.folderPath+"/flows/flow.json");
        const flowDetails = JSON.parse(importjson);
        flowDetails.pageProcessors._importId= await this.importID;
        flowDetails.pageGenerators._exportId=await this.exportID;
        flowDetails.__integrationId= await this.integrationID;
        this.flowID=this.postMethod(flowPath, flowDetails);

    }

    startSetup(){
        this.setupIntegration();
        this.setupImport();
        this.setupExport();
        this.setupFlow();
    }
}

integration = new setup('../../flows/node/');
integration.startSetup();