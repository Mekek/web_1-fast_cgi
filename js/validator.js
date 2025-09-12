export default class Validate {
    x;
    y;
    r;

    constructor() {
        this.log = "";
    }

    check(x, y, r) {
        this.log = "";
        if (!this.checkForNull(x, y, r))
            return {
                allOk: false,
                log: "Fill in all form fields"
            };
        return {
            allOk: this.checkX(x) && this.checkY(y) && this.checkR(r),
            log: this.log
        };
    }

    checkForNull(x, y, r) {
        return x && y && r;
    }

    checkX(x) {
        x = parseFloat(x);
        this.x = x;
        if ([-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].includes(x))
            return true;
        else {
            this.log = "Select valid X value: " + x;
            return false;
        }
    }

    checkY(y) {
        if (!/^(-?\d+(\.\d+)?)$/.test(y)) {
            this.log = "Y must contain a number";
            return false;
        }
        y = parseFloat(y);
        this.y = y;
        if (isNaN(y)) {
            this.log = "Y must contain a number";
            return false;
        }
        if (-5 <= y && y <= 3)
            return true;
        else {
            this.log = "Y value must be between -5 and 3";
            return false;
        }
    }

    checkR(r) {
        r = parseFloat(r);
        this.r = r;
        if ([1, 2, 3, 4, 5].includes(r))
            return true;
        else {
            this.log = "Select valid R value";
            return false;
        }
    }

    getCoords() {
        return {
            x: this.x,
            y: this.y,
            r: this.r
        };
    }
}
