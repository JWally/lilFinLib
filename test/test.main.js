/*global require*/
/*global describe*/
/*global it*/

var assert = require("assert"),
    my_tests = require("./test.suite.json"),
    round = function(num){
        return Math.round(num * 1000) / 1000
    }


suite("Finance Functions", function() {
    // Hold the finance functions
    // in the `fin` variable
    var fin = require("../src/main");
    
    ///////////////////////////////////
    //PRESENT VALUE FUNCTIONS
    ///////////////////////////////////
    suite("Present Value", function() {
        /////
        for(var i = 0; i < my_tests.length; i++){
            var obj = my_tests[i];
            test("PV: " + JSON.stringify(obj), function(){
                assert.equal(round(obj.pv),round(fin.pv(obj)));
            });
        }
    });
    ///////////////////////////////////
    //FUTURE VALUE FUNCTIONS
    ///////////////////////////////////
    suite("Future Value", function() {
        /////
        for(var i = 0; i < my_tests.length; i++){
            var obj = my_tests[i];
            test("FV: " + JSON.stringify(obj), function(){
                assert.equal(round(obj.fv),round(fin.fv(obj)));
            });
        }
    });
    ///////////////////////////////////
    //PAYMENT
    ///////////////////////////////////
    suite("Payment Amt", function() {
        /////
        for(var i = 0; i < my_tests.length; i++){
            var obj = my_tests[i];
            test("PMT: " + JSON.stringify(obj), function(){
                assert.equal(round(obj.pmt),round(fin.pmt(obj)));
            });
        }
    });
    ///////////////////////////////////
    //NPER
    ///////////////////////////////////
    suite("Num Periods", function() {
        /////
        for(var i = 0; i < my_tests.length; i++){
            var obj = my_tests[i];
            test("NPER: " + JSON.stringify(obj), function(){
                assert.equal(round(obj.nper),round(fin.nper(obj)));
            });
        }
    });    
    ///////////////////////////////////
    //RATE
    ///////////////////////////////////
    suite("Num Periods", function() {
        /////
        for(var i = 0; i < my_tests.length; i++){
            var obj = my_tests[i];
            test("RATE: " + JSON.stringify(obj), function(){
                assert.equal(round(obj.rate),round(fin.rate(obj)));
            });
        }
    });     
    
    
}); 


