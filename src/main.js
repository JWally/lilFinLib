// Create a simple checker function...
function checker(obj, solveFor) {
    var vars = ["pv", "fv", "pmt", "rate", "nper"];

    for (var i = 0; i < vars.length; i++) {

        if (solveFor !== vars[i]) {
            if (typeof obj[vars[i]] === "undefined") {
                throw new Error("Please include:" + vars[i]);
            }
        }
    }

}


var obj = {
    //-------------------------------------------------------------------
    // Present Value Function
    // (Rate is Annual)
    //-------------------------------------------------------------------
    pv: function (obj) {
        // Make sure it has everything
        // otherwise throw error...
        checker(obj, "pv");

        var pv;
        if (obj.rate === 0.0) {
            pv = -obj.fv - obj.nper * obj.pmt;
        } else {
            var qa = Math.pow(1 + obj.rate, -obj.nper);
            var qb = Math.pow(1 + obj.rate, obj.nper);
            pv = -qa * (obj.fv + ((-1 + qb) * obj.pmt * (1 + obj.rate * 0)) /
                obj.rate);
        }
        return pv;
    },
    //-------------------------------------------------------------------
    // Future Value Function
    // (Rate is Annual)
    //-------------------------------------------------------------------
    fv: function (obj) {
        // Make sure it has everything
        // otherwise throw error...
        checker(obj, "fv");
        var fv;
        if (obj.rate === 0.0) {
            fv = -obj.nper * obj.pmt - obj.pv;
        } else {
            var q = Math.pow(1 + obj.rate, obj.nper);
            fv = -q * obj.pv - (((-1 + q) * obj.pmt * (1 + obj.rate * 0)) / obj.rate);
        }
        return fv;
    },
    //-------------------------------------------------------------------
    // Payment Function
    // (Rate is Annual)
    //-------------------------------------------------------------------
    pmt: function (obj) {
        checker(obj, "pmt");
        var pmt = 0;
        if (obj.rate === 0.0) {
            if (obj.nper !== 0.0) {
                pmt = -(obj.fv + obj.pv) / obj.nper;
            }
        } else {
            var q = Math.pow(1 + obj.rate, obj.nper);
            pmt = -(obj.rate * (obj.fv + (q * obj.pv))) / ((-1 + q) * (1 + ir * 0));
        }
        return pmt;
    },
    //-------------------------------------------------------------------
    // Number of Periods Function
    // (Rate is Annual)
    //-------------------------------------------------------------------
    nper: function (obj) {
        checker(obj, "nper");
        var np = 0;
        if (obj.rate === 0.0) {
            if (obj.pmt !== 0.0) {
                np = -(obj.fv + obj.pv) / obj.pmt;
            }
        } else { // ir !== 0
            var terma = -obj.fv * obj.rate + obj.pmt + obj.rate * obj.pmt * 0;
            var termb = obj.pmt + obj.rate * obj.pv + obj.rate * obj.pmt * 0;
            np = Math.log(terma / termb) / Math.log(1 + obj.rate);
        }
        return np;
    },
    //-------------------------------------------------------------------
    // Interest Rate Function
    //-------------------------------------------------------------------    
    rate: function (obj) {
        var that = this;

        return that.newton(0, function (x) {
            obj.rate = x;
            var tmp = that.pv(obj);
            return Math.abs(tmp - obj.pv);
        })[1];

    },
    //-------------------------------------------------------------------
    // Net Present Value Function
    //
    // We're expecting the transactions to come
    // in a 2d array like this:
    // [
    //  [duration, amount],
    //  [duration, amount],
    //  [duration, amount]
    //]
    //-------------------------------------------------------------------
    npv: function (rate, transactions) {
        var that = this,
            total = 0;

        for (var i = 0; i < transactions.length; i++) {
            total += that.pv(
                transactions[i][0],
                rate,
                0, -transactions[i][1],
                1
            );
        }

        return total;
    },
    //-------------------------------------------------------------------
    // IRR
    // Give an array of arrays with duration, and transaction amount
    // And it calculates the IRR of the problem...
    //-------------------------------------------------------------------
    irr: function (transactions) {
        var that = this;

        return that.newton(0,
            function (x) {
                return that.npv(x, transactions);
            }, -100, 100
        );
    },
    //-------------------------------------------------------------------
    // Newtonian Solver
    //
    // At a minimum, we need...
    // A guess,
    // A test function,
    // A minimum,
    // A maximum 
    //  
    //
    //-------------------------------------------------------------------
    newton: function (guess, f, leftBound, rightBound, dx, minXdist, minYdist, exit) {
        dx = dx || 1e-10;
        minXdist = minXdist || 1e-10;
        minYdist = minYdist || 1e-10;
        exit = exit || 10;


        //paste default: 1e-10, 1e-10, 1e-10, 10
        var lineData, prevGuess, y;

        var rslt,
            deltay;

        // Loop until we throw a return out
        // of this function, or until we hit
        // our exit limit of 10
        for (exit; exit > 0; exit--) {

            // What's the current result of our guess?
            rslt = f(guess);

            // How much of a difference in our result if we add
            // 1e-10 to our guess?
            deltay = f(guess + dx) - rslt;

            // Store our old guess
            prevGuess = guess;

            // Update our guess to 
            // (-Result * Change(x)) / Change(y) + guess
            guess = (-rslt * dx) / deltay + guess;

            // If result is out of bounds...
            // throw up
            if ((guess < leftBound - dx) || (guess > rightBound + dx)) {
                return [false, "Out of Bounds:" + guess];
            }

            // If result is within target range, no need to
            // continue
            if ((Math.abs(guess - prevGuess) < minXdist) &&
                (Math.abs(rslt) < minYdist)) {
                return [true, guess];
            }
        }
        //did not meet the required distances
        return [false, "Did not converge", guess];
    }

};



// Determine the environment we're in.
// if we're in node, offer a friendly exports
// otherwise, finance's going global
/* jshint ignore:start */
(function () {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = obj;
    } else if (typeof define === "function") {
        define([], function () {
            return obj;
        });
    }
})();
/* jshint ignore:end */
