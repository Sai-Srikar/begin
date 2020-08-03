
var topologicalSort = require("./sort").topologicalSort;
var request = require('request');
var fs = require('fs');

function postMethod(path, json) {
    return new Promise((resolve, er) => {
        request({
            method: 'POST',
            url: 'https://api.integrator.io/v1' + path,
            headers: {
                'Authorization': 'Bearer {bearer}'
            },
            json: json
        }, function (error, response, body) {
            if (!error && response.statusCode == 201) {
                resolve(body._id);
            }
        })
    });
}

async function setUp(folderPath, order) {
    var connectionsPath = "/connections";
    var flowsPath = "/flows";
    var exportsPath = "/exports";
    var importsPath = "/imports";
    var dict = new Map();
    var dependencyGraph = JSON.parse(fs.readFileSync(folderPath + "/" + "dependencyGraph.json"));
    for (var i = 0; i < order.length; i++) {
        try{
            fs.accessSync(folderPath + "/" + order[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + "/" + order[i]));
            dict.set(order[i], postMethod('/integrations', Json));
        }
        catch(err){
        }
        
        // try {
        //     fs.accessSync(folderPath + connectionsPath + "/" + order[i], fs.constants.F_OK);
        //     const Json = JSON.parse(fs.readFileSync(folderPath + connectionsPath + "/" + order[i]));
        //     dict.set(order[i], postMethod(connectionsPath, Json));
        // } catch (err) {
        // }
        
        try {
            fs.accessSync(folderPath + exportsPath + "/" + order[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + exportsPath + "/" + order[i]));
            dict.set(order[i], postMethod(exportsPath, Json));
        } catch (err) {
        }
        
        try {
            fs.accessSync(folderPath + importsPath + "/" + order[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + importsPath + "/" + order[i]));
            dict.set(order[i], postMethod(importsPath, Json));
        } catch (err) {
        }
        
        try {
            fs.accessSync(folderPath + flowsPath + "/" + order[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + flowsPath + "/" + order[i]));
            for (var j = 0; j < dependencyGraph[order[i]]["hasDependencyOn"].length; j++) {
                try{
                    fs.accessSync(folderPath + importsPath + "/" + dependencyGraph[order[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json.pageProcessors[0]._importId = await dict.get(dependencyGraph[order[i]]["hasDependencyOn"][j]);
                }
                catch(err){
                }
                
                try {
                    fs.accessSync(folderPath + exportsPath + "/" + dependencyGraph[order[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json.pageGenerators[0]._exportId = await dict.get(dependencyGraph[order[i]]["hasDependencyOn"][j]);                
                } 
                catch(err) {
                }
                
                try {
                    fs.accessSync(folderPath + "/" + dependencyGraph[order[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json._integrationId = await dict.get(dependencyGraph[order[i]]["hasDependencyOn"][j]);
                } catch(err) {
                }
            }
            postMethod(flowsPath, Json)
        } catch (err) {
         }
    }
}
var order = topologicalSort("../../../flows/node/dependencyGraph.json");
setUp("../../../flows/node", order);