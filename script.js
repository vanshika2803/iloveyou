const pageCount = 9;
const pages = document.getElementById("pages");
const hint = document.getElementById("hint");

const pageLinks = {
  1: [{x:86, y:68, w:12, h:24, to:2, label:"Next"}],
  2: [{x:86, y:68, w:12, h:24, to:3, label:"Next"}],

  // Four gifts on page 3 open pages 4–7.
  3: [
    {x:13, y:43, w:16, h:31, to:4, label:"Gift 1"},
    {x:31, y:51, w:16, h:29, to:5, label:"Gift 2"},
    {x:51, y:42, w:17, h:31, to:6, label:"Gift 3"},
    {x:72, y:48, w:17, h:30, to:7, label:"Gift 4"}
  ],

  4: [{x:5, y:70, w:19, h:25, to:3, label:"Back to gifts"}],
  5: [{x:5, y:70, w:20, h:25, to:3, label:"Back to gifts"}],
  6: [{x:4, y:2, w:20, h:24, to:3, label:"Back to gifts"}],
  7: [
    {x:5, y:69, w:20, h:27, to:3, label:"Back to gifts"},
    {x:82, y:69, w:14, h:27, to:8, label:"Next"}
  ],
  8: [{x:82, y:69, w:14, h:27, to:9, label:"Next"}],
  9: [{x:51, y:72, w:18, h:18, to:1, label:"Back to start"}]
};

function goTo(n, updateUrl = true) {
  n = Math.max(1, Math.min(pageCount, n));
  document.querySelectorAll(".page").forEach((p, i) => {
    p.classList.toggle("active", i + 1 === n);
  });
  if (updateUrl) history.replaceState({page:n}, "", `#page-${n}`);
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
    const a = document.createElement("button");
    a.className = "hotspot";
    a.type = "button";
    a.setAttribute("aria-label", link.label);
    a.style.left = link.x + "%";
    a.style.top = link.y + "%";
    a.style.width = link.w + "%";
    a.style.height = link.h + "%";
    a.addEventListener("click", () => goTo(link.to));
    page.appendChild(a);
  });

  pages.appendChild(page);
}

function currentPage() {
  const m = location.hash.match(/page-(\d+)/);
  return m ? Math.min(pageCount, Math.max(1, Number(m[1]))) : 1;
}

goTo(currentPage(), false);

window.addEventListener("popstate", () => goTo(currentPage(), false));

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

// Swipe navigation for phones.
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

// Small hint on the first page.
setTimeout(() => hint.classList.add("show"), 700);
setTimeout(() => hint.classList.remove("show"), 3500);
