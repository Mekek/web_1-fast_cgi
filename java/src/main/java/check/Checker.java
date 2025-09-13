package check;

public class Checker {
    public boolean hit(double x, float y, double r) {
        return inRect(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private boolean inRect(double x, float y, double r) {
        return x <= 0 && y >= 0 && x >= (float) -r / 2 && y <= r;
    }

    private boolean inTriangle(double x, float y, double r) {
        return (x <= (float) r/2) && (y <= r) && (2 * x + y <= r) && x >= 0 && y >= 0;
    }

    private boolean inCircle(double x, float y, double r) {
        return (x * x + y * y) <= (r * r) && x <= 0 && y <= 0;
    }
}
