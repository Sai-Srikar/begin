var name={
    "firstName":"Simgamsetty",
    "lastName":"Sai Srikar",
    "age":"20",
}

class MetaDataParse{

    #version;
    #channel;
    #keyField;

    constructor(){
        this.#version="";
        this.#channel="";
        this.#keyField="";
    }

    setVersion(version)
    {
        this.#version=cersion;
    };
    getVersion() {
        return this.#version;
    };
    
    setChannel(channel) {
        this.#channel = channel;
    };
    getChannel() {
        return this.#channel;
    };
    
    setkeyField(keyField) {
        this.#keyField = keyField;
    };
    getkeyField() {
        return this.#keyField;
    };

    getKeyFields (jsonArray) {
        var keyFieldArray = []
        for (var x in jsonArray) {
            keyFieldArray.push(x.getKeyField());
        }
        return keyFieldArray;
    };
}

var wer=new MetaDataParse();

console.log(wer);

wer.setChannel("tv9");
console.log(wer);
console.log(wer.getChannel());


function groupObjectsBy(jsonArray, key) {
var newJson={}

    for(var x in jsonArray)
    {
        
        if(newJson[jsonArray[x][key]])
        {
            
            newJson[jsonArray[x][key]].push(jsonArray[x]);
        }
        else
        {
            newJson[jsonArray[x][key]]=[];
            newJson[jsonArray[x][key]].push(jsonArray[x]);
        }
        
    }
    return newJson;

};  


class SortArray{
    sortedArray;
     
    constructor(... args){
        this.originalArray = args 
        this.sortedArray = []
    }
    #sort=function(){
        this.sortedArray = this.originalArray.sort();
    }
    getSortedArray(){
        this.#sort();
        return this.sortedArray;
    }
}

class SortObjectArray extends SortArray {
    sortedArray;
    constructor(... args){
        super(args)
    }

    #getSortOrder=function(prop) {     
        return function(a, b) {
            if (a[prop] > b[prop]) {  
                return 1;  
            } else if (a[prop] < b[prop]) {  
                return -1;  
            }  
            return 0;  
        }  
    } 

    #sort=function(prop){
        this.sortedArray=this.originalArray[0].sort(this.#getSortOrder(prop));
    }

    getSortedJsonArray(key){
        this.#sort(key);
        return this.sortedArray;
    }
}


var test=[
    {
    "channel": "A",
    "name": "shoe"
    },
    {
    "channel": "A",
    "name": "electronics"
    },
    {
    "channel": "B",
    "name": "apparel"
    },
    {
    "channel": "C",
    "name": "electronics"
    }
    ];


var result=(groupObjectsBy(test, "channel"));

console.log(result);



var testArray = []; 

var qwer=new SortObjectArray({  
    "EmployeeName": "John",  
    "Experience": "12",  
    "Technology": "SharePoint"  
}, {  
    "EmployeeName": "Charles",  
    "Experience": "9",  
    "Technology": "ASP.NET"  
}, {  
    "EmployeeName": "Jo",  
    "Experience": "3",  
    "Technology": "JAVA"  
}, {  
    "EmployeeName": "Daine",  
    "Experience": "7",  
    "Technology": "Sql Server"  
}, {  
    "EmployeeName": "Zain",  
    "Experience": "6",  
    "Technology": "C#"  
});

console.log(qwer.getSortedJsonArray("EmployeeName"));