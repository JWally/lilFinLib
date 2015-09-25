var fin = require("./src/main");


var splits = [
    [0.05/12,0.95],
    [0.075/12, 0.85],
    [0.10/12, 0.80],
    [1000, 0.75]
];

var flows = [
    [0, -10000],
    [12, 3000],
    [13, 4000],
    [15, 6000],
    [16, -8000],
    [19, 8000],
    [21, 9000]
];

var ary = [];

// Create an array to store the present value
// of cash flows at their pv rates
var buckets = splits.map(function(d){return 0});

// MORE!
var temp = 0,
    tempFv = 0,
// This one tells us which cf allocation
// hurdle we're currently operating under.
    start = 0,
    j = 0;

// Iterate over each cash flow for each period
for(var i = 0; i < flows.length; i++){
    // We're just starting out...
    // load up our buckets with the first
    // value in the thing
    if(i === 0){
        for(j = 0; j < splits.length; j++){
            // In case of something weird...
            temp = -fin.pv({
                rate: splits[j][0],
                nper: flows[i][0],
                fv: flows[i][1] * splits[start][1],
                pmt: 0
            });
            // Add the temp amount to the buckets
            buckets[j] += temp;         
        }
        
        ary.push([
            flows[i][0],
            flows[i][1],
            splits[start][0],
            splits[start][1],
            temp
        ]);         
        
    } else {
        // Figure how much we need to take from the current
        // CF, and add it to the buckets
        temp = -fin.pv({
            rate: splits[start][0],
            nper: flows[i][0],
            fv: flows[i][1] * splits[start][1],
            pmt: 0
        });
        // Lets make life easy...
        // Start off by saying that this new
        // cash flow shouldn't change anything
        if(temp + buckets[start] <= -0.001){
            // Straight push into the CFs
            ary.push([
                flows[i][0],
                flows[i][1],
                splits[start][0],
                splits[start][1],
                flows[i][1] * splits[start][1]
            ]);  
        
            // Load up the buckets
            for(var j = start; j < buckets.length; j++){
                buckets[j] -= fin.pv({
                    rate: splits[j][0],
                    nper: flows[i][0],
                    fv: flows[i][1] * splits[start][1],
                    pmt: 0
                });
            }        
        } else {
            // Calc the FV of the PV needed
            tempFv = fin.fv({
                rate: splits[start][0],
                nper: flows[i][0],
                pv: buckets[start],
                pmt: 0
            });
            
            // Straight push into the CFs
            ary.push([
                flows[i][0],
                flows[i][1],
                splits[start][0],
                splits[start][1],
                tempFv
            ]); 
        
            // Apply this value to all of the buckets
            // calculating the pv of that FV...
            for(var j = start; j < buckets.length; j++){
                buckets[j] += fin.pv({
                    rate: splits[j][0],
                    nper: flows[i][0],
                    fv: -tempFv,
                    pmt: 0
                });
            }
            
            // Deduct the Amount available from the
            // current Cash Flow
            flows[i][1] -= tempFv;
        
            // Add 1 to our starting position
            start += 1;
            // Go over this loop again
            if(start < buckets.length){
                i--;
            } else {
                start--;
            }
        }
    }
}

console.log(
    ary.map(
        function(d){
            return d.map(
                function(e){
                    return Math.round(e*1000)/1000
                })
        })
    );
