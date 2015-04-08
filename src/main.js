var obj = {
    pv: function (np, ir, pmt, fv, pb) {
        var pv;
        if (ir === 0.0) {
            pv = -fv - np * pmt;
        } else {
            var qa = Math.pow(1 + ir, -np);
            var qb = Math.pow(1 + ir, np);
            pv = -qa * (fv + ((-1 + qb) * pmt * (1 + ir * pb)) / ir);
        }
        return pv;
    },
    fv: function (np, ir, pmt, pv, pb) {
        var fv;
        if (ir === 0.0) {
            fv = -np * pmt - pv;
        } else {
            var q = Math.pow(1 + ir, np);
            fv = -q * pv - (((-1 + q) * pmt * (1 + ir * pb)) / ir);
        }
        return fv;
    },

    pmt: function (np, ir, fv, pv, pb) {
        var pmt = 0;
        if (ir === 0.0) {
            if (np !== 0.0) {
                pmt = -(fv + pv) / np;
            }
        } else {
            var q = Math.pow(1 + ir, np);
            pmt = -(ir * (fv + (q * pv))) / ((-1 + q) * (1 + ir * pb));
        }
        return pmt;
    },
    nper: function (ir, pmt, fv, pv, pb) {
        var np = 0;
        if (ir === 0.0) {
            if (pmt !== 0.0) {
                np = -(fv + pv) / pmt;
            }
        } else { // ir !== 0
            var terma = -fv * ir + pmt + ir * pmt * pb;
            var termb = pmt + ir * pv + ir * pmt * pb;
            np = Math.log(terma / termb) / Math.log(1 + ir);
        }
        return np;
    },
    // We're expecting the transactions to come
    // in a 2d array like this:
    // [
    //  [duration, amount],
    //  [duration, amount],
    //  [duration, amount]
    //]
    npv: function (rate, transactions) {
        var that = this,
            total = 0;

        //    pv: function (np, ir, pmt, fv, pb) {

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
    // Solving Problems...Like a boss!
    newton: function (guess, f, leftBound, rightBound, dx, minXdist, minYdist, exit) {
        dx = dx || 1e-10;
        minXdist = minXdist || 1e-10;
        minYdist = minYdist || 1e-10;
        exit = exit || 10;


        //paste default: 1e-10, 1e-10, 1e-10, 10
        var sequencePoints = [
            [guess, f(guess)]
        ];
        var lineData, prevGuess, y;

        var rslt,
            deltay;

        //newton loop
        for (exit; exit > 0; exit -= 1) {
            rslt = f(guess);
            deltay = f(guess + dx) - rslt;
            lineData = [guess, rslt, dx, deltay];
            prevGuess = guess;
            y = lineData[1];
            guess = (-rslt * dx) / deltay + guess;
            if ((guess < leftBound - dx) || (guess > rightBound + dx)) {
                return [false, "Out of Bounds:" + guess, sequencePoints];
            }
            //add (a,f(a))
            sequencePoints.push([guess, f(guess)]);
            if ((Math.abs(guess - prevGuess) < minXdist) && (Math.abs(y) <
                    minYdist)) {
                return [true, guess, sequencePoints];
            }
        }
        //did not meet the required distances
        return [false, "Did not converge", sequencePoints];
    },
    // Welp...Here's our IRR Function
    irr: function (transactions) {
        var that = this;

        return that.newton(0,
            function(x){return that.npv(x, transactions)},
            -100,
            100
        );
    }
};



//We want this functions zeros
var rslts = obj.irr([
    [0, -1000],
    [1, 100],
    [2, 100],
    [3, 100],
    [4, 100],
    [5, 100],
    [6, 100],
    [7, 100],
    [8, 1000],
    [8, 100]
]);



console.log(rslts);
