import Validate from './validator.js';
const validator = new Validate();

document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const x = document.querySelector('input[name="x"]').value;
    const y = document.querySelector('#y').value;
    const r = document.querySelector('input[name="r"]').value;

    console.log("x:", x, "y:", y, "r:", r);
    const check = validator.check(x, y, r);
    console.log("Validation result:", check, "x:", x, "y:", y, "r:", r);

    if (check.allOk) {

        const coords = validator.getCoords();
        console.log("Validation result:", check, "x:", coords.x, "y:", coords.y, "r:", coords.r);
        fetch(`http://localhost:8080/fcgi-bin/server.jar?x=${coords.x}&y=${coords.y}&r=${coords.r}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.text();
            })
            .then(function (answer) {
                localStorage.setItem("session", answer);
                console.log("Server response:", answer);
                var res = JSON.parse(answer);
                var table = document.getElementById("res-table"),
                    tbody = table.getElementsByTagName("tbody")[0];
                var row = document.createElement("tr");
                var isHitCell = document.createElement("td");
                var xCell = document.createElement("td");
                var yCell = document.createElement("td");
                var rCell = document.createElement("td");
                var timeCell = document.createElement("td");
                var worktimeCell = document.createElement("td");
                
                if (res.error === 'all ok') {
                    document.getElementById("input-log").innerText = '';
                    if (res.result === "true") {
                        isHitCell.innerText = "HIT";
                    } else {
                        isHitCell.innerText = "MISS";
                    }

                    // Установка значений ячеек
                    xCell.innerText = res.x;
                    yCell.innerText = res.y;
                    rCell.innerText = res.r;
                    timeCell.innerText = res.time;
                    worktimeCell.innerText = res.workTime;

                    // Вывод значений в консоль
                    console.log("isHit:", isHitCell.innerText);
                    console.log("x:", res.x);
                    console.log("y:", res.y);
                    console.log("r:", res.r);
                    console.log("time:", res.time);
                    console.log("worktime:", res.workTime);

                    // Добавление ячеек в строку
                    row.appendChild(isHitCell);
                    row.appendChild(xCell);
                    row.appendChild(yCell);
                    row.appendChild(rCell);
                    row.appendChild(timeCell);
                    row.appendChild(worktimeCell);
                    tbody.appendChild(row);

                } else {
                    if (res.error === "fill") {
                        document.getElementById("input-log").innerText = "Field can't be empty";
                    } else if (res.error === "method") {
                        document.getElementById("input-log").innerText = "Only GET requests";
                    }
                }

            })
            .catch(error => {
                alert(`${error.message}`);
            });
    } else {
        document.getElementById("input-log").innerText = check.log;
    }
});
