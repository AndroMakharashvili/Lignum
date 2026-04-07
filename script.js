/* ============================================
   LIGNUM — script.js
   JavaScript ლოგიკა: ძებნა, ანიმაციები, ჰედერი
   ============================================ */

/* ============================================
   1. ნამუშევრების მასივი — გალერეის მონაცემები
   ახალი ნამუშევრის დასამატებლად, უბრალოდ
   დაამატეთ ახალი ობიექტი ამ მასივში.
   ============================================ */
const works = [
  {
    id: 1,
    title: "ბრძენი",
    description: "ხელნაკეთი გარგლის ხის სკულპტურა, 40 სმ სიმაღლე.",
    category: "სკულპტურა",
    image: "images/items/ws-beard.png",
    tags: ["სკულპტურა", "გარგალი", "ხე"],
  },
  {
    id: 2,
    title: "მრავალსახე",
    description: "ხელნაკეთი ალუბლის ხის 4 სახიანი სკულპტურა, 33 სმ სიმაღლე.",
    category: "სკულპტურა",
    image: "images/items/ws-4face.png",
    tags: ["სკულპტურა", "ალუბლი", "ხე"],
  },
  {
    id: 3,
    title: "ქართული დრო",
    description: "ხელნაკეთი ხის კედლის საათი, საქართველოს რუკის ფორმით.",
    category: "საათი",
    image: "images/items/geo-clock.png",
    tags: ["საათი", "საქართველო", "რუკა"],
  },
  {
    id: 4,
    title: "ხინკლის საათი",
    description: "ხელნაკეთი ხის კედლის საათი, ხინკლის ფორმით, აკრილის საღებავით დახატული.",
    category: "საათი",
    image: "images/items/khinkali-clock.png",
    tags: ["საათი", "ხინკალი", "აკრილი"],
  },
  {
    id: 5,
    title: "ხის სასანთლე",
    description: "ხელნაკეთი ხის სასანთლე, კოვზისა და ჩანგლის გამოყენებით, ორიგინალური დიზაინით.",
    category: "სასანთლე",
    image: "images/items/xe-candle-white.png",
    tags: ["სასანთლე", "ხის", "ანათე"],
  },
  {
    id: 6,
    title: "ხის სასანთლე „ანათე“",
    description: "ხელნაკეთი ხის სასანთლე, კოვზისა და ჩანგლის გამოყენებით „ანათეს“ ლოგოთი.",
    category: "სასანთლე",
    image: "images/items/anate-white.png",
    tags: ["სასანთლე", "ხის", "ორიგინალური"],
  },
  {
    id: 7,
    title: "ღვინის ბოთლების ჩასადები",
    description: "ხელნაკეთი ხის ღვინის ბოთლების ჩასადები, ორიგინალური დიზაინით, დამწვარი ხის ეფექტით.",
    category: "ბოთლის ჩასადები",
    image: "images/items/wineholder.png",
    tags: ["ბოთლის ჩასადები", "ხის", "ღვინო"],
  },
];

/* ============================================
   2. გლობალური ძებნის მდგომარეობა
   ============================================ */
let currentQuery    = "";
let currentCategory = "ყველა";

/* ============================================
   3. გალერეის რენდერი
   ============================================ */
function renderGallery(filteredWorks) {
  const grid       = document.getElementById("gallery-grid");
  const noResults  = document.getElementById("no-results");
  const searchInfo = document.getElementById("search-info");

  if (!grid) return; // მხოლოდ gallery.html-ზე

  grid.innerHTML = "";

  // ძებნის ინფო-ტექსტი
  if (searchInfo) {
    if (currentQuery.trim()) {
      searchInfo.textContent = `"${currentQuery}" — ${filteredWorks.length} ნამუშევარი ნაპოვნი`;
    } else if (currentCategory !== "ყველა") {
      searchInfo.textContent = `კატეგორია: ${currentCategory} — ${filteredWorks.length} ნამუშევარი`;
    } else {
      searchInfo.textContent = `სულ ${filteredWorks.length} ნამუშევარი`;
    }
  }

  if (filteredWorks.length === 0) {
    // "ვერ მოიძებნა" მდგომარეობა
    if (noResults) noResults.style.display = "block";
    return;
  }

  if (noResults) noResults.style.display = "none";

  // ნამუშევრების ბარათების გენერირება
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

  // ახლად დამატებულ ელემენტებზე Intersection Observer-ის გამოყენება
  observeReveal();
}

/* ============================================
   4. ძებნის ლოგიკა (ცოცხალი ფილტრაცია)
   ============================================ */
function filterWorks() {
  const query    = currentQuery.toLowerCase().trim();
  const category = currentCategory;

  const result = works.filter(work => {
    // კატეგორიის ფილტრი
    const catMatch = category === "ყველა" || work.category === category;

    // ტექსტური ძებნა — სათაური, აღწერა, თეგები, კატეგორია
    const searchFields = [
      work.title,
      work.description,
      work.category,
      ...(work.tags || []),
    ].join(" ").toLowerCase();

    const textMatch = !query || searchFields.includes(query);

    return catMatch && textMatch;
  });

  renderGallery(result);
}

/* ============================================
   5. ჰედერის საძიებო ველი
   (მუშაობს ორივე ფაილში — index.html & gallery.html)
   ============================================ */
function initSearch() {
  const inputs = document.querySelectorAll(".search-input");

  inputs.forEach(input => {
    input.addEventListener("input", function () {
      const query = this.value.trim();
      currentQuery = query;

      // თუ gallery.html-ზე ვართ — გავფილტროთ ადგილზე
      if (document.getElementById("gallery-grid")) {
        filterWorks();
      } else if (query.length > 1) {
        // index.html-ზე — გადავიდეთ gallery.html-ზე ძებნით
        window.location.href = `gallery.html?q=${encodeURIComponent(query)}`;
      }
    });

    // Enter-ით გალერეაზე გადასვლა
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && this.value.trim()) {
        if (!document.getElementById("gallery-grid")) {
          window.location.href = `gallery.html?q=${encodeURIComponent(this.value.trim())}`;
        }
      }
    });
  });

  // URL-ში q პარამეტრის წაკითხვა (gallery.html-ისთვის)
  if (document.getElementById("gallery-grid")) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      currentQuery = q;
      inputs.forEach(input => (input.value = q));
    }
    filterWorks();
  }
}

/* ============================================
   6. კატეგორიის ფილტრი
   ============================================ */
function initCategoryFilter() {
  const btns = document.querySelectorAll(".filter-btn");

  btns.forEach(btn => {
    btn.addEventListener("click", function () {
      btns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.dataset.category;
      filterWorks();
    });
  });
}

/* ============================================
   7. Scroll-based header ეფექტი
   ============================================ */
function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}

/* ============================================
   8. Scroll Animations — Intersection Observer
   ============================================ */
let revealObserver;

function observeReveal() {
  // ძველი observer-ის გათიშვა (თუ გალერეა გადახატულია)
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
    if (!el.classList.contains("visible")) {
      revealObserver.observe(el);
    }
  });
}

/* ============================================
   9. Formspree კონტაქტის ფორმა
   ============================================ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn         = form.querySelector(".btn-submit");
    const successMsg  = document.getElementById("form-success");

    // ღილაკის ტემპ. გათიშვა
    btn.disabled = true;
    btn.textContent = "იგზავნება...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        if (successMsg) {
          successMsg.style.display = "block";
          setTimeout(() => (successMsg.style.display = "none"), 5000);
        }
      } else {
        alert("შეცდომა! გთხოვთ სცადოთ ხელახლა.");
      }
    } catch {
      alert("კავშირის შეცდომა. გთხოვთ სცადოთ მოგვიანებით.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `გაგზავნა <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    }
  });
}

/* ============================================
   10. ინიციალიზაცია — DOM მზადობის შემდეგ
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initSearch();
  initCategoryFilter();
  initContactForm();

  // პირველი ჩტვირთვის reveal ელემენტები
  // მცირე გვიანება, რომ DOM ბოლომდე დარენდერდეს
  setTimeout(observeReveal, 100);
});
