import Validate from './validate.js';
const validator = new Validate();

document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const x = document.querySelector('input[name="x"]:checked');
    const y = document.querySelector('#coord-y');
    const r = document.querySelector('input[name="r"]:checked');
    const check = validator.check(x, y, r);
    if (check.allOk) {
        const coords = validator.getCoords();
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
                var res = JSON.parse(answer);
                var table = document.getElementById("res-table"),
                    tbody = table.getElementsByTagName("tbody")[0];
                var row = document.createElement("tr");
                var isHit = document.createElement("td");
                var x = document.createElement("td");
                var y = document.createElement("td");
                var r = document.createElement("td");
                var time = document.createElement("td");
                var worktime = document.createElement("td");
                if (res.error === 'all ok') {
                    document.getElementById("input-log").innerText = '';
                    if (res.result === "true"){
                        isHit.innerText = "HIT";
                    }
                    else {
                        isHit.innerText = "MISS";
                    }

                    x.innerText = res.x;
                    y.innerText = res.y;
                    r.innerText = res.r;
                    time.innerText = res.time;
                    worktime.innerText = res.workTime;
                    row.appendChild(isHit);
                    row.appendChild(x);
                    row.appendChild(y);
                    row.appendChild(r);
                    row.appendChild(time);
                    row.appendChild(worktime);
                    tbody.appendChild(row);

                } else{
                    if (res.error === "fill")
                        document.getElementById("input-log").innerText = "Field can't be empty";
                    else if (res.error === "method")
                        document.getElementById("input-log").innerText = "Only GET requests";
                }

            })
            .catch(error => {
                alert(`${error.message}`)
            })
    }
    else {
        document.getElementById("input-log").innerText = check.log;
    }
});