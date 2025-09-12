import com.fastcgi.FCGIInterface;
import validation.Validate;
import check.Checker;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Objects;

class Server {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        Validate v = new Validate();
        Checker checker = new Checker();

        while (fcgiInterface.FCGIaccept() >= 0) {
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");

            if (method.equals("POST")) {
                long time = System.nanoTime();
                String body = readRequestBody();

                if (!Objects.equals(body, "")) {
                    LinkedHashMap<String, String> m = getValues(body);
                    boolean isShot;
                    boolean isValid;
                    try {
                        Double x = Double.parseDouble(m.get("x"));
                        Float y = Float.parseFloat(m.get("y"));
                        Double r = Double.parseDouble(m.get("r"));

                        isValid = v.check(x, y, r);
                        isShot = checker.hit(x, y, r);
                    } catch (Exception e) {
                        System.out.println(err("Invalid data"));
                        continue;
                    }

                    if (isValid) {
                        System.out.println(resp(isShot, m.get("x"), m.get("y"), m.get("r"), time));
                    } else {
                        System.out.println(err(v.getErr()));
                    }
                } else {
                    System.out.println(err("empty body"));
                }
            } else {
                System.out.println(err("method not allowed"));
            }
        }
    }

    private static String readRequestBody() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while (reader.ready() && (line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private static LinkedHashMap<String, String> getValues(String inpString) {
        String[] args = inpString.split("&");
        LinkedHashMap<String, String> map = new LinkedHashMap<>();
        for (String s : args) {
            String[] arg = s.split("=");
            if (arg.length == 2) {
                map.put(arg[0], arg[1]);
            }
        }
        return map;
    }

    private static String resp(boolean isShoot, String x, String y, String r, long wt) {
        String content = """
                {"result":"%s","x":"%s","y":"%s","r":"%s","time":"%s","workTime":"%s","error":"all ok"}
                """.formatted(isShoot, x, y, r, (double)(System.nanoTime() - wt) / 1_000_000, LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));

        return """
                Content-Type: application/json; charset=utf-8
                Content-Length: %d


                %s
                """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }

    private static String err(String msg) {
        String content = """
                {"error":"%s"}
                """.formatted(msg);

        return """
                Content-Type: application/json; charset=utf-8
                Content-Length: %d


                %s
                """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }
}
