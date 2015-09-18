var fin = require("./src/main"),
    obj = require("./test/test.suite.json")[0],
    obj1 = require("./test/test.suite.json")[0]
    
var a = fin.newton(0, function(x){
    obj.rate = x;
    var tmp = fin.pv(obj);
    return Math.abs(tmp - obj.pv);
});

console.log(a[1], obj1);