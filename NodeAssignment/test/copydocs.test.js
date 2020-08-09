should = require('chai').should();
_=require('lodash');
const CopyDocs=require('../CopyDocs').CopyDocs;
const temp=new CopyDocs('../../flows/node/');
const { assert } = require('chai');

const nock = require('nock');
var integrationApi=nock('https://api.integrator.io/v1');

describe('#CopyDocs',()=>{
    it('is an object',()=>{
        _.isObject(CopyDocs).should.be.true;
    })

    it('integration creation successful', (done)=>{
        integrationApi.post('/integrations').reply(201,{body:"integration ID is returned"});
        const result="integration ID is returned";

        temp.createIntegration(function(res){
            _.isEqual(result,res.body);
            done();
        });
    })

    it.only('export creation successful', (done)=>{
        integrationApi.post('/exports').reply(201,{body:"export  is returned"});
        const result="export  is returned";

         temp.createExports(function(res){
            console.log(res.body);
            assert.equal(res.body, result);
            done();
        });
    })

    it.only('import creation successful', ()=>{
        integrationApi.post('/imports').reply(201,{body:"import is returned"});
        const result="import is returned";

        return temp.createImports(function(res){
            console.log(res.body);
            assert.equal(res.body, result);
        });
    })
    
})
