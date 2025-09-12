package validation;

import java.util.LinkedList;
import java.util.List;

public class Validate {
    private final List<Double> xRange = new LinkedList<>();
    private final List<Double> rRange = new LinkedList<>();
    private String log = "all ok";

    public Validate() {
        xRange.add(-2.0);
        xRange.add(-1.5);
        xRange.add(-1.0);
        xRange.add(-0.5);
        xRange.add(0.0);
        xRange.add(0.5);
        xRange.add(1.0);
        xRange.add(1.5);
        xRange.add(2.0);

        rRange.add(1.0);
        rRange.add(2.0);
        rRange.add(3.0);
        rRange.add(4.0);
        rRange.add(5.0);
    }

    public boolean check(Double x, Float y, Double r) {
        return checkX(x) && checkY(y) && checkR(r);
    }

    public String getErr() {
        return log;
    }

    public boolean checkX(Double x) {
        if (xRange.contains(x)) {
            return true;
        }
        log = "X must be selected from the range: -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2";
        return false;
    }

    public boolean checkY(Float y) {
        // Y должен быть в диапазоне от -5 до 3
        if (-5 <= y && y <= 3) {
            return true;
        }
        log = "Y value must be between -5 and 3";
        return false;
    }

    public boolean checkR(Double r) {
        if (rRange.contains(r)) {
            return true;
        }
        log = "R must be selected from the range: 1, 2, 3, 4, 5";
        return false;
    }
}
