import Validate from './validator.js';
const validator = new Validate();

document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const x = document.querySelector('input[name="x"]:checked')?.value;

    const y = document.querySelector('#y').value;

    const r = document.querySelector('select[name="r"]').value;

    console.log("x:", x, "y:", y, "r:", r);

    // Валидация
    const check = validator.check(x, y, r);
    console.log("Validation result:", check);

    if (check.allOk) {
        const coords = validator.getCoords();
        console.log("Validated coords:", coords);

        // Отправляем POST-запрос
        fetch('http://localhost:8080/fcgi-bin/server.jar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: `x=${coords.x}&y=${coords.y}&r=${coords.r}`
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.text();
            })
            .then(answer => {
                localStorage.setItem("session", answer);
                console.log("Server response:", answer);

                const res = JSON.parse(answer);
                const table = document.getElementById("res-table");
                const tbody = table.getElementsByTagName("tbody")[0];
                const row = document.createElement("tr");

                const isHitCell = document.createElement("td");
                const xCell = document.createElement("td");
                const yCell = document.createElement("td");
                const rCell = document.createElement("td");
                const timeCell = document.createElement("td");
                const worktimeCell = document.createElement("td");

                if (res.error === 'all ok') {
                    document.getElementById("input-log").innerText = '';
                    isHitCell.innerText = res.result === "true" ? "HIT" : "MISS";

                    xCell.innerText = res.x;
                    yCell.innerText = res.y;
                    rCell.innerText = res.r;
                    timeCell.innerText = res.time;
                    worktimeCell.innerText = res.workTime;

                    row.appendChild(isHitCell);
                    row.appendChild(xCell);
                    row.appendChild(yCell);
                    row.appendChild(rCell);
                    row.appendChild(timeCell);
                    row.appendChild(worktimeCell);
                    tbody.appendChild(row);
                } else {
                    // Ошибки сервера
                    if (res.error === "fill" || res.error === "empty body") {
                        document.getElementById("input-log").innerText = "Field can't be empty";
                    } else if (res.error === "method not allowed") {
                        document.getElementById("input-log").innerText = "Only POST requests allowed";
                    } else {
                        document.getElementById("input-log").innerText = res.error;
                    }
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    } else {
        document.getElementById("input-log").innerText = check.log;
    }
});
