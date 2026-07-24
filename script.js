const header = document.querySelector(".site-header");

const setHeaderState = () => {
  if (header) {
    header.dataset.elevated = window.scrollY > 8 ? "true" : "false";
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroButtons = document.querySelectorAll("[data-slide-target]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeSlide = 0;
let heroTimer;

const showHeroSlide = (slideIndex) => {
  activeSlide = slideIndex;
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === slideIndex);
  });
  heroButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === slideIndex);
  });
};

const startHeroRotation = () => {
  if (reducedMotion || heroSlides.length < 2) {
    return;
  }
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => {
    showHeroSlide((activeSlide + 1) % heroSlides.length);
  }, 5200);
};

heroButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showHeroSlide(index);
    startHeroRotation();
  });
});

startHeroRotation();

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const inquiryForm = document.querySelector("#inquiry-form");
const privacyConsent = document.querySelector("#privacy-consent");
const inquirySubmitButton = inquiryForm?.querySelector('button[type="submit"]');
const privacyDialog = document.querySelector("#privacy-dialog");
const privacyOpenButton = document.querySelector(".privacy-open");
const privacyCloseButtons = document.querySelectorAll(".privacy-close, .privacy-decline");
const privacyAgreeButton = document.querySelector(".privacy-agree");
const naverMapContainer = document.querySelector("#naver-map");
const naverMapStatus = document.querySelector("#naver-map-status");
const naverMapKeyId = "ksmxjjiaxl";

const showOfficeMapFallback = () => {
  if (naverMapStatus) {
    naverMapStatus.hidden = false;
  }
};

window.navermap_authFailure = showOfficeMapFallback;

window.initOfficeMap = () => {
  if (!naverMapContainer || !window.naver?.maps) {
    showOfficeMapFallback();
    return;
  }

  const officePosition = new naver.maps.LatLng(37.397493, 126.987915);
  const officeMap = new naver.maps.Map(naverMapContainer, {
    center: officePosition,
    zoom: 17,
    scaleControl: false,
    logoControl: true,
    mapDataControl: false,
    zoomControl: true
  });

  new naver.maps.Marker({
    map: officeMap,
    position: officePosition,
    title: "오토리스너 방문 상담 위치"
  });
};

const loadOfficeMap = () => {
  if (!naverMapContainer) {
    return;
  }

  const mapSdk = document.createElement("script");
  mapSdk.async = true;
  mapSdk.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKeyId}`;
  mapSdk.addEventListener("load", window.initOfficeMap);
  mapSdk.addEventListener("error", showOfficeMapFallback);
  document.head.append(mapSdk);
};

loadOfficeMap();

if (privacyConsent && inquirySubmitButton) {
  const updateInquiryState = () => {
    inquirySubmitButton.disabled = !privacyConsent.checked;
  };

  const openPrivacyDialog = () => {
    if (privacyDialog?.showModal && !privacyDialog.open) {
      privacyDialog.showModal();
    }
  };

  privacyOpenButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPrivacyDialog();
  });
  privacyCloseButtons.forEach((button) => {
    button.addEventListener("click", () => privacyDialog?.close());
  });
  privacyAgreeButton?.addEventListener("click", () => {
    privacyConsent.checked = true;
    updateInquiryState();
    privacyDialog?.close();
  });
  privacyConsent.addEventListener("change", updateInquiryState);
  updateInquiryState();
}
