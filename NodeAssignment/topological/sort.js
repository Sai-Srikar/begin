var fs = require('fs');
function sortUtil(input,obj,visited,stack){
    visited[obj]=true;
    for (var i = 0; i < input[obj]["hasDependencyOn"].length; i++) {
        if (!visited[input[obj]["hasDependencyOn"][i]]) {
            sortUtil(input, input[obj]["hasDependencyOn"][i], visited, stack);
        }
    }
    stack.push(obj);
}
function topologicalSort(inputPath){
    var input = fs.readFileSync(inputPath, "utf8");
    input = JSON.parse(input);
    var files = Object.keys(input);
    var stack = [];
    var visited = {}
    for(var i=0;i<files.length;i++){
        visited[files[i]] = false;
    }
    for (var i=0;i<files.length;i++) {
        if(visited[files[i]]==false){
            sortUtil(input,files[i], visited, stack);
        }
    }
    return stack;
}

module.exports = {
    topologicalSort
}
