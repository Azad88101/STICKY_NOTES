let createBtn = document.getElementById("createBtn");
let color = document.getElementById("color");
let list = document.getElementById("list");

//////                                                              Timer Elements
const timerInput = document.getElementById("timerInput");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const timerDisplay = document.getElementById("timerDisplay");

let timerInterval;
let timerSeconds = 0;
let isTimerPaused = false;
let alarmSound = new Audio("alarm.mp3");
alarmSound.loop = true;

/////                                                                 Stopwatch Elements
const startStopwatchBtn = document.getElementById("startStopwatchBtn");
const stopStopwatchBtn = document.getElementById("stopStopwatchBtn");
const resetStopwatchBtn = document.getElementById("resetStopwatchBtn");
const stopwatchDisplay = document.getElementById("stopwatchDisplay");

let stopwatchMilliseconds = 0;
let stopwatchInterval;

//////                                                                   Timer Functions
function formatTimerDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function parseTimerInput(inputValue) {
  const num = parseFloat(inputValue);
  if (isNaN(num) || num < 0) return null;
  if (num === Math.floor(num)) return num * 60; // as minutes
  const decimalPart = num - Math.floor(num);
  if (decimalPart > 0 && decimalPart < 1) return Math.round(decimalPart * 100);
  return null;
}

function startTimer() {
  if (!isTimerPaused) {
    const inputVal = timerInput.value;
    const secondsToSet = parseTimerInput(inputVal);
    if (secondsToSet === null) {
      alert("Enter valid time (e.g., 2 for 2 min, 0.5 for 50 sec).");
      return;
    }
    timerSeconds = secondsToSet;
    timerInput.disabled = true;
  }
  alarmSound.pause();
  alarmSound.currentTime = 0;

  startTimerBtn.style.display = "none";
  pauseTimerBtn.style.display = "inline-block";
  resetTimerBtn.style.display = "inline-block";
  isTimerPaused = false;

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      timerDisplay.textContent = formatTimerDisplay(timerSeconds);
    } else {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00";
      alarmSound.play();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  alarmSound.pause();
  alarmSound.currentTime = 0;
  isTimerPaused = true;
  startTimerBtn.textContent = "Resume";
  startTimerBtn.style.display = "inline-block";
  pauseTimerBtn.style.display = "none";
}

function resetTimer() {
  clearInterval(timerInterval);
  alarmSound.pause();
  alarmSound.currentTime = 0;
  timerSeconds = 0;
  isTimerPaused = false;
  timerDisplay.textContent = "00:00";
  timerInput.value = "";
  timerInput.disabled = false;
  startTimerBtn.textContent = "Start Timer";
  startTimerBtn.style.display = "inline-block";
  pauseTimerBtn.style.display = "none";
  resetTimerBtn.style.display = "none";
}

///////                                                                              Stopwatch Functions
function formatStopwatchDisplay(ms) {
  const totalSec = Math.floor(ms / 1000);
  const msDisplay = Math.floor((ms % 1000) / 10);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0)
    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${
      msDisplay < 10 ? "0" : ""
    }${msDisplay}`;
  else
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}.${msDisplay < 10 ? "0" : ""}${msDisplay}`;
}

function startStopwatch() {
  startStopwatchBtn.style.display = "none";
  stopStopwatchBtn.style.display = "inline-block";
  resetStopwatchBtn.style.display = "inline-block";
  stopwatchInterval = setInterval(() => {
    stopwatchMilliseconds += 10;
    stopwatchDisplay.textContent = formatStopwatchDisplay(
      stopwatchMilliseconds
    );
  }, 10);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  startStopwatchBtn.style.display = "inline-block";
  stopStopwatchBtn.style.display = "none";
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchMilliseconds = 0;
  stopwatchDisplay.textContent = "00:00.00";
  resetStopwatchBtn.style.display = "none";
}

////                                                                                      Event Listeners
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
startStopwatchBtn.addEventListener("click", startStopwatch);
stopStopwatchBtn.addEventListener("click", stopStopwatch);
resetStopwatchBtn.addEventListener("click", resetStopwatch);

////                                                                                      Sticky Notes
function createNote(colorValue, content = "", pos = { x: 50, y: 50 }) {
  let newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.innerHTML = `<span class="close">X</span>
    <textarea rows="10" cols="30" placeholder="Write content...">${content}</textarea>`;
  newNote.style.borderColor = colorValue;
  newNote.style.left = pos.x + "px";
  newNote.style.top = pos.y + "px";
  list.appendChild(newNote);
  saveNotes();
}

function saveNotes() {
  let notes = [];
  document.querySelectorAll(".note").forEach((note) => {
    let textarea = note.querySelector("textarea");
    notes.push({
      content: textarea.value,
      color: note.style.borderColor,
      pos: {
        x: parseInt(note.style.left),
        y: parseInt(note.style.top),
      },
    });
  });
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

window.onload = () => {
  let savedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  savedNotes.forEach((note) => createNote(note.color, note.content, note.pos));
};

createBtn.onclick = () => {
  createNote(color.value);
};

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.parentNode.remove();
    saveNotes();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA") {
    saveNotes();
  }
});

////                                                                                      Dragging
let cursor = { x: null, y: null };
let note = { dom: null, x: null, y: null };

document.addEventListener("mousedown", (event) => {
  if (
    event.target.closest("#timer") ||
    event.target.closest("#stopwatch") ||
    event.target.tagName === "TEXTAREA" ||
    event.target.tagName === "INPUT" ||
    event.target.tagName === "BUTTON"
  )
    return;

  if (event.target.classList.contains("note")) {
    cursor = { x: event.clientX, y: event.clientY };
    note = {
      dom: event.target,
      x: event.target.getBoundingClientRect().left,
      y: event.target.getBoundingClientRect().top,
    };
  }
});

document.addEventListener("mousemove", (event) => {
  if (note.dom == null) return;
  let currentCursor = { x: event.clientX, y: event.clientY };
  let distance = {
    x: currentCursor.x - cursor.x,
    y: currentCursor.y - cursor.y,
  };
  note.dom.style.left = note.x + distance.x + "px";
  note.dom.style.top = note.y + distance.y + "px";
  note.dom.style.cursor = "grab";
});

document.addEventListener("mouseup", () => {
  if (note.dom == null) return;
  note.dom.style.cursor = "auto";
  note.dom = null;
  saveNotes();
});
