const assert = require('chai').assert;
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
 
const handler = require("../function/handler");
 
describe("Lambda Tests", function(){
 
    describe("Successful Invocation", function(){
        it("Successful Invocation with results", function(done) {
 
            const testData = {
                   url: "https://www.imdb.com/title/tt0117500/"
            };
 
            lambdaTester(handler.scrap).event(testData)
            .expectResult((result) => {
                expect(result.statusCode).to.exist;
                expect(result.body).to.exist;
                expect(result.statusCode).to.equal(200);
            }).verify(done);
        });
    });
    
    describe("Failed Invocation", function(){
        it("Unsuccessful invocation", function(done) {
 
            const testData = {
                url:''
            };
 
            lambdaTester(handler.scrap).event(testData)
            .expectResult((result) => {
                    expect(result.statusCode).to.exist;
                    expect(result.body).to.exist;
                    expect(result.statusCode).to.be.oneOf([400,500]);
            }).then(function () {
                    done()
                })
           });
    });
 
})