const pageCount = 9;
const pages = document.getElementById("pages");
const hint = document.getElementById("hint");

const pageLinks = {
  1: [
    {x:86, y:68, w:12, h:24, to:2, label:"Next"}
  ],

  2: [
    {x:86, y:68, w:12, h:24, to:3, label:"Next"}
  ],

  // Four gifts on page 3 open pages 4–7.
  3: [
    {x:13, y:43, w:16, h:31, to:4, label:"Gift 1"},
    {x:31, y:51, w:16, h:29, to:5, label:"Gift 2"},
    {x:51, y:42, w:17, h:31, to:6, label:"Gift 3"},
    {x:72, y:48, w:17, h:30, to:7, label:"Gift 4"}
  ],

  4: [
    {x:5, y:70, w:19, h:25, to:3, label:"Back to gifts"}
  ],

  5: [
    {x:5, y:70, w:20, h:25, to:3, label:"Back to gifts"}
  ],

  6: [
    {x:4, y:2, w:20, h:24, to:3, label:"Back to gifts"}
  ],

  7: [
  {x:5, y:69, w:20, h:27, to:3, label:"Back to gifts"},
  {x:45, y:55, w:50, h:45, to:8, label:"Next"}
  ],

  8: [
  {x:65, y:55, w:30, h:45, to:9, label:"Next"}
  ],

  9: [
    {x:51, y:72, w:18, h:18, to:1, label:"Back to start"}
  ]
};

function goTo(n, updateUrl = true) {
  n = Math.max(1, Math.min(pageCount, n));

  document.querySelectorAll(".page").forEach((p, i) => {
    p.classList.toggle("active", i + 1 === n);
  });

  if (updateUrl) {
    history.replaceState({page:n}, "", `#page-${n}`);
  }

  requestAnimationFrame(positionAllHotspots);
}

function positionHotspots() {
  document.querySelectorAll(".page").forEach(page => {
    const img = page.querySelector("img");
    const buttons = page.querySelectorAll(".hotspot");

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    const pageWidth = page.clientWidth;
    const pageHeight = page.clientHeight;

    // Calculate the actual visible size of the Canva image
    // when object-fit: contain is being used.
    const scale = Math.min(
      pageWidth / img.naturalWidth,
      pageHeight / img.naturalHeight
    );

    const imageWidth = img.naturalWidth * scale;
    const imageHeight = img.naturalHeight * scale;

    // Center of the actual visible image.
    const offsetX = (pageWidth - imageWidth) / 2;
    const offsetY = (pageHeight - imageHeight) / 2;

    buttons.forEach(button => {
      const link = button._link;

      const left = offsetX + (link.x / 100) * imageWidth;
      const top = offsetY + (link.y / 100) * imageHeight;
      const width = (link.w / 100) * imageWidth;
      const height = (link.h / 100) * imageHeight;

      button.style.left = left + "px";
      button.style.top = top + "px";
      button.style.width = width + "px";
      button.style.height = height + "px";
    });
  });
}

for (let i = 1; i <= pageCount; i++) {
  const page = document.createElement("section");

  page.className = "page" + (i === 4 ? " tall" : "");
  page.setAttribute("aria-label", `Page ${i}`);

  const img = document.createElement("img");

  img.src = `assets/${i}.png`;
  img.alt = i === 1 ? "Happy Boyfriend Day" : `Scrapbook page ${i}`;
  img.draggable = false;

  page.appendChild(img);

  (pageLinks[i] || []).forEach(link => {
    const button = document.createElement("button");

    button.className = "hotspot";
    button.type = "button";
    button.setAttribute("aria-label", link.label);

    // Store the original Canva-image coordinates.
    button._link = link;

    button.addEventListener("click", () => {
      goTo(link.to);
    });

    page.appendChild(button);
  });

  img.addEventListener("load", positionAllHotspots);

  pages.appendChild(page);
}

function positionAllHotspots() {
  positionHotspots();
}

function currentPage() {
  const m = location.hash.match(/page-(\d+)/);
  return m
    ? Math.min(pageCount, Math.max(1, Number(m[1])))
    : 1;
}

goTo(currentPage(), false);

window.addEventListener("popstate", () => {
  goTo(currentPage(), false);
});

window.addEventListener("resize", positionAllHotspots);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const p = currentPage();

  if (e.key === "ArrowRight") {
    if (p === 1) goTo(2);
    else if (p === 2) goTo(3);
    else if (p === 7) goTo(8);
    else if (p === 8) goTo(9);
  }

  if (e.key === "ArrowLeft") {
    if (p === 2) goTo(1);
    else if (p === 3) goTo(2);
    else if ([4,5,6,7].includes(p)) goTo(3);
    else if (p === 8) goTo(7);
    else if (p === 9) goTo(1);
  }
});

// Swipe navigation for phones
let startX = null;

document.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].clientX;
}, {passive:true});

document.addEventListener("touchend", e => {
  if (startX === null) return;

  const dx = e.changedTouches[0].clientX - startX;
  startX = null;

  if (Math.abs(dx) < 60) return;

  const p = currentPage();

  if (dx < 0) {
    if (p === 1) goTo(2);
    else if (p === 2) goTo(3);
    else if (p === 7) goTo(8);
    else if (p === 8) goTo(9);
  } else {
    if (p === 2) goTo(1);
    else if (p === 3) goTo(2);
    else if ([4,5,6,7].includes(p)) goTo(3);
    else if (p === 8) goTo(7);
    else if (p === 9) goTo(1);
  }
}, {passive:true});

// Small hint on the first page
setTimeout(() => hint.classList.add("show"), 700);
setTimeout(() => hint.classList.remove("show"), 3500);
