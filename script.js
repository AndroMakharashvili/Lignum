/* ============================================
   LIGNUM — script.js
   ============================================ */

const works = [
  { id:1, title:"ბრძენი", description:"ხელნაკეთი გარგლის ხის სკულპტურა, 40 სმ სიმაღლე.", category:"სკულპტურა", image:"images/items/ws-beard.png", tags:["სკულპტურა","გარგალი","ხე"] },
  { id:2, title:"მრავალსახე", description:"ხელნაკეთი ალუბლის ხის 4 სახიანი სკულპტურა, 33 სმ სიმაღლე.", category:"სკულპტურა", image:"images/items/ws-4face.png", tags:["სკულპტურა","ალუბლი","ხე"] },
  { id:3, title:"ქართული დრო", description:"ხელნაკეთი ხის კედლის საათი, საქართველოს რუკის ფორმით.", category:"საათი", image:"images/items/geo-clock.png", tags:["საათი","საქართველო","რუკა"] },
  { id:4, title:"ხინკლის საათი", description:"ხელნაკეთი ხის კედლის საათი, ხინკლის ფორმით, აკრილის საღებავით დახატული.", category:"საათი", image:"images/items/khinkali-clock.png", tags:["საათი","ხინკალი","აკრილი"] },
  { id:5, title:"ხის სასანთლე", description:"ხელნაკეთი ხის სასანთლე, კოვზისა და ჩანგლის გამოყენებით, ორიგინალური დიზაინით.", category:"სასანთლე", image:"images/items/xe-candle-white.png", tags:["სასანთლე","ხის","ანათე"] },
  { id:6, title:'ხის სასანთლე „ანათე"', description:'ხელნაკეთი ხის სასანთლე, კოვზისა და ჩანგლის გამოყენებით „ანათეს" ლოგოთი.', category:"სასანთლე", image:"images/items/anate-white.png", tags:["სასანთლე","ხის","ორიგინალური"] },
  { id:7, title:"ღვინის ბოთლების ჩასადები", description:"ხელნაკეთი ხის ღვინის ბოთლების ჩასადები, ორიგინალური დიზაინით, დამწვარი ხის ეფექტით.", category:"ბოთლის ჩასადები", image:"images/items/wineholder.png", tags:["ბოთლის ჩასადები","ხის","ღვინო"] },
];

let currentQuery    = "";
let currentCategory = "ყველა";

/* ============================================
   LIGHTBOX
   ============================================ */
let lbItems = [];
let lbIndex = 0;

function createLightbox() {
  if (document.getElementById("lignum-lightbox")) return;
  const lb = document.createElement("div");
  lb.id = "lignum-lightbox";
  lb.className = "lightbox";
  lb.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" id="lb-close" aria-label="დახურვა">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="lightbox-prev" id="lb-prev" aria-label="წინა">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="lightbox-next" id="lb-next" aria-label="შემდეგი">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <img class="lightbox-img" id="lb-img" src="" alt="">
      <div class="lightbox-info">
        <div class="lightbox-title" id="lb-title"></div>
        <div class="lightbox-desc"  id="lb-desc"></div>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.getElementById("lb-prev").addEventListener("click", e => { e.stopPropagation(); lbNavigate(-1); });
  document.getElementById("lb-next").addEventListener("click", e => { e.stopPropagation(); lbNavigate(1); });
  document.addEventListener("keydown", e => {
    if (!document.getElementById("lignum-lightbox").classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  lbNavigate(-1);
    if (e.key === "ArrowRight") lbNavigate(1);
  });
}

function openLightbox(items, startIndex) {
  lbItems = items; lbIndex = startIndex;
  lbShow();
  document.getElementById("lignum-lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lignum-lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

function lbNavigate(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  lbShow();
}

function lbShow() {
  const item = lbItems[lbIndex];
  const img  = document.getElementById("lb-img");
  img.style.cssText = "opacity:0; transform:scale(0.97); transition:opacity 0.2s ease,transform 0.2s ease;";
  img.onload = () => { img.style.opacity = "1"; img.style.transform = "scale(1)"; };
  img.src  = item.src;
  img.alt  = item.title || "";
  document.getElementById("lb-title").textContent = item.title || "";
  document.getElementById("lb-desc").textContent  = item.desc  || "";
  const show = lbItems.length > 1;
  document.getElementById("lb-prev").style.display = show ? "" : "none";
  document.getElementById("lb-next").style.display = show ? "" : "none";
}

function attachGalleryLightbox() {
  const cards = document.querySelectorAll(".work-card");
  if (!cards.length) return;
  const items = Array.from(cards).map(card => ({
    src:   card.querySelector("img")?.src || "",
    title: card.querySelector(".work-name")?.textContent || "",
    desc:  card.querySelector(".work-description")?.textContent || "",
  }));
  cards.forEach((card, i) => card.addEventListener("click", () => openLightbox(items, i)));
}

function initFeaturedLightbox() {
  const cards = document.querySelectorAll(".feat-card");
  if (!cards.length) return;
  const items = Array.from(cards).map(card => ({
    src:   card.querySelector("img")?.src || "",
    title: card.querySelector(".feat-overlay h3")?.textContent || "",
    desc:  card.querySelector(".feat-overlay p")?.textContent  || "",
  }));
  cards.forEach((card, i) => card.addEventListener("click", () => openLightbox(items, i)));
}

/* ============================================
   GALLERY RENDER
   ============================================ */
function renderGallery(filteredWorks) {
  const grid       = document.getElementById("gallery-grid");
  const noResults  = document.getElementById("no-results");
  const searchInfo = document.getElementById("search-info");
  if (!grid) return;
  grid.innerHTML = "";

  if (searchInfo) {
    if (currentQuery.trim())          searchInfo.textContent = `"${currentQuery}" — ${filteredWorks.length} ნამუშევარი ნაპოვნი`;
    else if (currentCategory !== "ყველა") searchInfo.textContent = `კატეგორია: ${currentCategory} — ${filteredWorks.length} ნამუშევარი`;
    else                              searchInfo.textContent = `სულ ${filteredWorks.length} ნამუშევარი`;
  }

  if (filteredWorks.length === 0) { if (noResults) noResults.style.display = "block"; return; }
  if (noResults) noResults.style.display = "none";

  filteredWorks.forEach((work, index) => {
    const card = document.createElement("div");
    card.className = "work-card reveal";
    card.style.transitionDelay = `${index * 0.06}s`;
    card.innerHTML = `
      <div class="work-card-img">
        <img src="${work.image}" alt="${work.title}" loading="lazy">
        <div class="work-hover">
          <span class="work-hover-tag">${work.category}</span>
          <h3 class="work-hover-title">${work.title}</h3>
          <p class="work-hover-desc">${work.description}</p>
        </div>
      </div>
      <div class="work-card-body">
        <span class="work-tag">${work.category}</span>
        <h3 class="work-name">${work.title}</h3>
        <p class="work-description">${work.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  observeReveal();
  attachGalleryLightbox();
}

/* ============================================
   FILTER + SEARCH
   ============================================ */
function filterWorks() {
  const query  = currentQuery.toLowerCase().trim();
  const result = works.filter(work => {
    const catMatch   = currentCategory === "ყველა" || work.category === currentCategory;
    const allText    = [work.title, work.description, work.category, ...(work.tags||[])].join(" ").toLowerCase();
    const textMatch  = !query || allText.includes(query);
    return catMatch && textMatch;
  });
  renderGallery(result);
}

function initSearch() {
  const inputs = document.querySelectorAll(".search-input");
  inputs.forEach(input => {
    input.addEventListener("input", function () {
      currentQuery = this.value.trim();
      if (document.getElementById("gallery-grid")) filterWorks();
      else if (currentQuery.length > 1) window.location.href = `gallery.html?q=${encodeURIComponent(currentQuery)}`;
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && this.value.trim() && !document.getElementById("gallery-grid"))
        window.location.href = `gallery.html?q=${encodeURIComponent(this.value.trim())}`;
    });
  });
  if (document.getElementById("gallery-grid")) {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { currentQuery = q; inputs.forEach(i => (i.value = q)); }
    filterWorks();
  }
}

function initCategoryFilter() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(btn => btn.addEventListener("click", function () {
    btns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.dataset.category;
    filterWorks();
  }));
}

/* ============================================
   HEADER / SCROLL / FORM
   ============================================ */
function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), { passive: true });
}

let revealObserver;
function observeReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
    if (!el.classList.contains("visible")) revealObserver.observe(el);
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    const successMsg = document.getElementById("form-success");
    btn.disabled = true; btn.textContent = "იგზავნება...";
    try {
      const res = await fetch(form.action, { method:"POST", body:new FormData(form), headers:{Accept:"application/json"} });
      if (res.ok) {
        form.reset();
        if (successMsg) { successMsg.style.display = "block"; setTimeout(() => (successMsg.style.display = "none"), 5000); }
      } else { alert("შეცდომა! გთხოვთ სცადოთ ხელახლა."); }
    } catch { alert("კავშირის შეცდომა."); }
    finally {
      btn.disabled = false;
      btn.innerHTML = `გაგზავნა <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    }
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  createLightbox();
  initHeaderScroll();
  initSearch();
  initCategoryFilter();
  initContactForm();
  initFeaturedLightbox();
  setTimeout(observeReveal, 100);
});
