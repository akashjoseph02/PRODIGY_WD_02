let isRunning = false;
let startTime;
let laps = [];
const lapsPerColumn = 10; // Number of laps per column
let lastUpdate = Date.now();

function startPause() {
    if (!isRunning) {
        start();
        document.getElementById("startPause").innerText = "Pause";
    } else {
        pause();
        document.getElementById("startPause").innerText = "Resume";
    }
}

function start() {
    isRunning = true;
    startTime = new Date() - laps.reduce((acc, lap) => acc + lap.time, 0);
    update();
}

function pause() {
    isRunning = false;
    laps.push({ time: new Date() - startTime });
    updateLaps();
}

function reset() {
    isRunning = false;
    startTime = null;
    laps = [];
    document.getElementById("display").innerText = "00:00:00";
    document.getElementById("startPause").innerText = "Start";
    updateLaps();
}

function update() {
    if (isRunning) {
        const now = Date.now();
        const elapsed = now - startTime;
        const formattedTime = formatTime(elapsed);
        document.getElementById("display").innerText = formattedTime;

        const timeDiff = now - lastUpdate;
        lastUpdate = now;

        const adjustedInterval = 100 - timeDiff; 

        setTimeout(update, adjustedInterval > 0 ? adjustedInterval : 0);

        if (laps.length % lapsPerColumn === 0 && laps.length !== 0) {
            createNewColumn();
        }
    }
}

function createNewColumn() {
    const lapsContainer = document.getElementById("laps");
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("lap-column");
    lapsContainer.appendChild(columnDiv);
}

function updateLaps() {
    const lapsContainer = document.getElementById("laps");

    lapsContainer.innerHTML = "";

    const totalColumns = Math.ceil(laps.length / lapsPerColumn);

    for (let i = 0; i < totalColumns; i++) {
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("lap-column");

        for (let j = i * lapsPerColumn; j < (i + 1) * lapsPerColumn && j < laps.length; j++) {
            const lap = laps[j];
            const lapTime = formatTime(lap.time);
            const lapDiv = document.createElement("div");
            lapDiv.innerText = `Lap ${j + 1}: ${lapTime}`;
            columnDiv.appendChild(lapDiv);
        }

        lapsContainer.appendChild(columnDiv);
    }
}

function formatTime(time) {
    const date = new Date(time);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}
