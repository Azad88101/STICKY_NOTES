var a;

let createBtn = document.getElementById("createBtn");
let color = document.getElementById("color");
let list = document.getElementById("list");

createBtn.onclick = () => {
  let newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.innerHTML = `<span class="close">X</span>
          <textarea name="" rows="10"  cols="30" placeholder="Write content.." id=""></textarea
          >`;

  newNote.style.borderColor = color.value;

  list.appendChild(newNote);
};

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.parentNode.remove();
  }
});

let cursor = {
  x: null,
  y: null,
};
let note = {
  dom: null,
  x: null,
  y: null,
};
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
});
