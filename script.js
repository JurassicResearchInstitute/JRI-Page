const dirt = document.getElementById("dirt");
const bones = document.getElementById("bones");
const dCtx = dirt.getContext("2d");
const bCtx = bones.getContext("2d");

const choices = document.getElementById("choices");
const dino = document.getElementById("dino");
const roar = document.getElementById("roar");

let isDigging = false;
let revealed = false;

function resizeCanvas() {
  const rect = dirt.getBoundingClientRect();
  dirt.width = bones.width = rect.width;
  dirt.height = bones.height = rect.height;

  drawBones();
  drawDirt();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawBones() {
  const img = new Image();
  img.src = "assets/bones-text.png";

  img.onload = () => {
    bCtx.clearRect(0, 0, bones.width, bones.height);

    // Fill canvas completely while preserving aspect ratio
    const canvasRatio = bones.width / bones.height;
    const imageRatio = img.width / img.height;

    let drawWidth, drawHeight, x, y;

    if (imageRatio > canvasRatio) {
      // Image is wider → crop sides
      drawHeight = bones.height;
      drawWidth = img.width * (bones.height / img.height);
      x = (bones.width - drawWidth) / 2;
      y = 0;
    } else {
      // Image is taller → crop top/bottom
      drawWidth = bones.width;
      drawHeight = img.height * (bones.width / img.width);
      x = 0;
      y = (bones.height - drawHeight) / 2;
    }

    bCtx.drawImage(img, x, y, drawWidth, drawHeight);
  };
}



function drawDirt() {
  const img = new Image();
  img.src = "assets/dirt.png";
  img.onload = () => {
    dCtx.globalCompositeOperation = "source-over";
    dCtx.drawImage(img, 0, 0, dirt.width, dirt.height);
  };
}

function dig(x, y) {
  dCtx.globalCompositeOperation = "destination-out";
  dCtx.beginPath();
  dCtx.arc(x, y, 28, 0, Math.PI * 2);
  dCtx.fill();
}

function getPos(evt) {
  const rect = dirt.getBoundingClientRect();
  if (evt.touches) {
    return {
      x: evt.touches[0].clientX - rect.left,
      y: evt.touches[0].clientY - rect.top
    };
  }
  return {
    x: evt.offsetX,
    y: evt.offsetY
  };
}

function checkReveal() {
  if (revealed) return;

  const pixels = dCtx.getImageData(0, 0, dirt.width, dirt.height).data;
  let transparent = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) transparent++;
  }

  const percent = transparent / (pixels.length / 4);

  if (percent > 0.35) {
    revealed = true;
    choices.classList.remove("hidden");
  }
}

/* Mouse events */
dirt.addEventListener("mousedown", () => (isDigging = true));
dirt.addEventListener("mouseup", () => (isDigging = false));
dirt.addEventListener("mouseleave", () => (isDigging = false));
dirt.addEventListener("mousemove", e => {
  if (!isDigging) return;
  const pos = getPos(e);
  dig(pos.x, pos.y);
  checkReveal();
});

/* Touch events */
dirt.addEventListener("touchstart", e => {
  isDigging = true;
  const pos = getPos(e);
  dig(pos.x, pos.y);
});
dirt.addEventListener("touchmove", e => {
  e.preventDefault();
  if (!isDigging) return;
  const pos = getPos(e);
  dig(pos.x, pos.y);
  checkReveal();
});
dirt.addEventListener("touchend", () => (isDigging = false));

/* Dino eats NO */
document.getElementById("no").addEventListener("click", () => {
  dino.style.display = "block";
  roar.play();

  setTimeout(() => {
    document.getElementById("no").remove();
  }, 1500);
});

/* YES button */
document.getElementById("yes").addEventListener("click", () => {
  alert("🦖 You'll never not be my Valentine, Toots... P.S. Rawr 💖");
});
