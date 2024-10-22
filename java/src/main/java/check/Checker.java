package check;

public class Checker {
    public boolean hit(double x, float y, double r) {
        return inRect(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    private boolean inRect(double x, float y, double r) {
        return x <= 0 && y <= 0 && x >= -r && y >= (float) -r / 2;
    }

    private boolean inTriangle(double x, float y, double r) {
        return (x <= r/2) && (y <= (float) r/2) && (2 * x + 2 * y <= r) && x >= 0 && y >= 0;
    }

    private boolean inCircle(double x, float y, double r) {
        return (x * x + y * y) <= (float) (r * r) / 4 && x <= 0 && y >= 0;
    }
}
