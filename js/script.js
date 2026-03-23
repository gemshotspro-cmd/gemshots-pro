document.addEventListener("DOMContentLoaded", async () => {
  let gems = [];
  try {
    const response = await fetch("/gems.json");
    gems = await response.json();
  } catch (error) {
    console.error("Error loading gems:", error);
    return;
  }

  const cardTemplate = document.getElementById("gem-card-template").content;
  const detailTemplate = document.getElementById("gem-detail-template").content;
  const grid = document.getElementById("gem-grid");
  const detailContent = document.getElementById("detail-content");
  const relatedGrid = document.getElementById("related-grid");
  const detailSection = document.getElementById("gem-detail");
  const sectionsToToggle = [
    "hero",
    "services",
    "portfolio",
    "process",
    "pricing",
    "contact",
    "booking", // Added booking
  ];
  const viewAllButton = document.getElementById("view-all");

  let showAll = false;
  let currentGemId = null;

  function toggleDetailView(show) {
    sectionsToToggle.forEach((id) => {
      document.getElementById(id)?.classList.toggle("hidden", show);
    });
    detailSection?.classList.toggle("hidden", !show);
  }

  function createMainMedia(src, isVideo) {
    if (isVideo) {
      const video = document.createElement("video");
      video.id = "main-media";
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.className = "w-full h-full object-cover";
      return video;
    } else {
      const img = document.createElement("img");
      img.id = "main-media";
      img.src = src;
      img.alt = "";
      img.className = "w-full h-full object-cover";
      return img;
    }
  }

  function updateMainMedia(src, isVideo) {
    const oldMedia = document.getElementById("main-media");
    if (!oldMedia) return;
    const newMedia = createMainMedia(src, isVideo);
    oldMedia.replaceWith(newMedia);
  }

  function renderDetail(gem) {
    detailContent.innerHTML = "";
    const detail = detailTemplate.cloneNode(true);

    const thumbsContainer = detail.querySelector("#thumbnails");
    thumbsContainer.innerHTML = "";

    gem.images.forEach((src, index) => {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(src.toLowerCase());

      const thumbDiv = document.createElement("div");
      thumbDiv.className =
        "relative cursor-pointer thumbnail rounded overflow-hidden border border-border";

      let thumbEl;
      if (isVideo) {
        thumbEl = document.createElement("video");
        thumbEl.src = src;
        thumbEl.poster = src.replace(/\.[^/.]+$/, ".jpg") || src;
        thumbEl.muted = true;
        thumbEl.loop = false;
        thumbEl.autoplay = false;
        thumbEl.playsInline = true;
        thumbEl.className = "w-full h-20 object-cover";

        const overlay = document.createElement("div");
        overlay.className =
          "absolute inset-0 flex items-center justify-center pointer-events-none";
        overlay.innerHTML = `<svg class="w-10 h-10 text-accent drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
        thumbDiv.appendChild(overlay);
      } else {
        thumbEl = document.createElement("img");
        thumbEl.src = src;
        thumbEl.alt = `${gem.name} thumbnail ${index + 1}`;
        thumbEl.className = "w-full h-20 object-cover";
      }

      thumbDiv.appendChild(thumbEl);

      thumbDiv.addEventListener("click", () => {
        updateMainMedia(src, isVideo);
        thumbsContainer
          .querySelectorAll(".thumbnail")
          .forEach((t) => t.classList.remove("active"));
        thumbDiv.classList.add("active");
      });

      thumbsContainer.appendChild(thumbDiv);

      if (index === 0) {
        thumbDiv.classList.add("active");
        const oldMedia = detail.querySelector("#main-media");
        const mainEl = createMainMedia(src, isVideo);
        oldMedia?.replaceWith(mainEl);
      }
    });

    detail.querySelector(".category").textContent = gem.category.toUpperCase();
    detail.querySelector(".name").textContent = gem.name;
    if (gem.sold) detail.querySelector(".sold-note").classList.remove("hidden");
    // This checks if the element exists before trying to update it
    const priceEl = detail.querySelector(".price");
    if (priceEl) {
      priceEl.textContent = gem.price.toLocaleString();
    }
    detail.querySelector(".description").textContent = gem.description;
    detail.querySelector(".carat").textContent = Number(gem.carat).toFixed(2);
    detail.querySelector(".origin").textContent = gem.origin;
    detail.querySelector(".cut").textContent = gem.cut;
    detail.querySelector(".clarity").textContent = gem.clarity;
    detail.querySelector(".treatment").textContent = gem.treatment;
    detail.querySelector(".certification").textContent = gem.certification;

    // const inquireLink = detail.querySelector("#inquire-link");
    // inquireLink.href = `https://wa.me/94771234567?text=Interested%20in%20gem%20ID%20${gem.id}%20-%20${encodeURIComponent(gem.name)}`;

    detailContent.appendChild(detail);
  }

  function handleHashChange() {
    const hash = location.hash;
    if (hash.startsWith("#gem-")) {
      const id = parseInt(hash.slice(5));
      const gem = gems.find((g) => g.id === id);
      if (gem) {
        currentGemId = id;
        renderDetail(gem);
        renderRelatedGems(gem);
        toggleDetailView(true);
        detailSection?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      toggleDetailView(false);
    }
  }

  function renderGems() {
    grid.innerHTML = "";
    let displayedGems = showAll ? gems : gems.slice(0, 9);

    displayedGems.forEach((gem) => {
      const card = cardTemplate.cloneNode(true);

      const link = card.querySelector("a");
      link.href = `#gem-${gem.id}`;

      const img = card.querySelector("img");
      img.src = gem.images[0];
      img.alt = gem.name;

      card.querySelector(".category").textContent = gem.category.toUpperCase();
      card.querySelector(".name").textContent = gem.name;
      card.querySelector(".specs").textContent =
        `${gem.carat} ct · ${gem.origin}`;

      if (gem.sold) {
        card.querySelector(".sold-badge").classList.remove("hidden");
      }

      grid.appendChild(card);
    });
  }

  function renderRelatedGems(currentGem) {
    relatedGrid.innerHTML = "";
    gems
      .filter((g) => g.id !== currentGem.id)
      .forEach((gem) => {
        const card = cardTemplate.cloneNode(true);

        const link = card.querySelector("a");
        link.href = `#gem-${gem.id}`;

        const img = card.querySelector("img");
        img.src = gem.images[0];
        img.alt = gem.name;

        card.querySelector(".category").textContent =
          gem.category.toUpperCase();
        card.querySelector(".name").textContent = gem.name;
        card.querySelector(".specs").textContent =
          `${gem.carat} ct · ${gem.origin}`;

        if (gem.sold) {
          card.querySelector(".sold-badge").classList.remove("hidden");
        }

        relatedGrid.appendChild(card);
      });
  }

  // Initial render
  renderGems();
  handleHashChange();

  const navLinks = document.querySelectorAll("nav a, #mobile-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href.startsWith("#") && !href.startsWith("#gem-")) {
        toggleDetailView(false);
      }
    });
  });

  // View All button
  viewAllButton.addEventListener("click", () => {
    showAll = true;
    renderGems();
    viewAllButton.style.display = "none";
  });

  // Hash change listener
  window.addEventListener("hashchange", handleHashChange);

  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const body = document.body;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", (!isOpen).toString());
    mobileMenu.classList.toggle("translate-x-full");
    mobileMenu.classList.toggle("translate-x-0");
    body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      body.classList.remove("menu-open");
    }
  });

  // Discount logic
  const discounts = {
    basic: 0, // Edit these percentages to apply discounts (e.g., 20 for 20%)
    pro: 0,
    premium: 0,
    elite: 0,
  };

  document.querySelectorAll("[data-tier]").forEach((card) => {
    const tier = card.dataset.tier;
    const discount = discounts[tier];
    if (discount > 0) {
      const currentPriceEl = card.querySelector(".current-price");
      const originalPrice = parseInt(currentPriceEl.dataset.originalPrice);
      const newPrice = Math.round(originalPrice * (1 - discount / 100));
      const originalPriceEl = card.querySelector(".original-price");
      const discountBadge = card.querySelector(".discount-badge");

      originalPriceEl.textContent = `LKR ${originalPrice.toLocaleString()}`;
      originalPriceEl.classList.remove("hidden");
      currentPriceEl.textContent = `LKR ${newPrice.toLocaleString()}`;
      discountBadge.textContent = `Save ${discount}%`;
      discountBadge.classList.remove("hidden");
    }
  });

  // Pre-fill package from URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPackage = urlParams.get("package");
  if (selectedPackage) {
    const packageSelect = document.querySelector('select[name="package"]');
    if (packageSelect) {
      packageSelect.value = selectedPackage;
    }
  }
});
