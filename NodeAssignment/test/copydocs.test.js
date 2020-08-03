should = require('chai').should();
_=require('lodash');
const CopyDocs=require('../CopyDocs').CopyDocs;
const temp=new CopyDocs('../../flows/node/');

describe('#CopyDocs',()=>{
    it('is an object',()=>{
        _.isObject(CopyDocs).should.be.true;
    })

    it('integration creation successful',async ()=>{
        
        const intId= await temp.createIntegration();
        console.log(intId);
        _.isString(intId).should.be.true;
    })

    it.only ('export test',async()=>{
        var result=[];
        // result=await temp.createExports();
        console.log(await temp.createExports());
        console.log(result);
    })
})
