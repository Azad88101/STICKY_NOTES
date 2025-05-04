
let createBtn = document.getElementById("createBtn");
let color = document.getElementById("color");
let list = document.getElementById("list");

// Create a note with optional content and position
function createNote(colorValue, content = "", pos = {x: 50, y: 50}) {
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

// Save all notes to localStorage
function saveNotes() {
  let notes = [];
  document.querySelectorAll(".note").forEach(note => {
    let textarea = note.querySelector("textarea");
    notes.push({
      content: textarea.value,
      color: note.style.borderColor,
      pos: {
        x: parseInt(note.style.left),
        y: parseInt(note.style.top)
      }
    });
  });
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

// Load notes from localStorage
window.onload = () => {
  let savedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  savedNotes.forEach(note => createNote(note.color, note.content, note.pos));
};

// Add new note
createBtn.onclick = () => {
  createNote(color.value);
};

// Delete note
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.parentNode.remove();
    saveNotes();
  }
});

// Save content on typing
document.addEventListener("input", (e) => {
  if (e.target.tagName === "TEXTAREA") {
    saveNotes();
  }
});

// Drag logic
let cursor = { x: null, y: null };
let note = { dom: null, x: null, y: null };

document.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("note")) {
    cursor = {
      x: event.clientX,
      y: event.clientY,
    };
    note = {
      dom: event.target,
      x: event.target.getBoundingClientRect().left,
      y: event.target.getBoundingClientRect().top,
    };
  }
});

document.addEventListener("mousemove", (event) => {
  if (note.dom == null) return;
  let currentCursor = {
    x: event.clientX,
    y: event.clientY,
  };
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