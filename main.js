// ================= NAV: solidify on scroll =================
const nav = document.querySelector('.sitenav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ================= SCROLL REVEAL =================
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// ================= HAMBURGER MENU =================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

if (hamburger && navLinks) {
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('open');
  });
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ================= BOOKING PAGE: room select + live summary =================
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const selectBtns = document.querySelectorAll('.select-btn');
  const sumRoom = document.getElementById('sumRoom');
  const sumPrice = document.getElementById('sumPrice');
  const sumNights = document.getElementById('sumNights');
  const sumMultiplier = document.getElementById('sumMultiplier');
  const sumTotal = document.getElementById('sumTotal');
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');

  let selectedPrice = 0;
  const SERVICE_FEE = 2000;

  function formatNaira(n) {
    return '₦' + n.toLocaleString('en-NG');
  }

  function getNights() {
    if (!checkin.value || !checkout.value) return 1;
    const inDate = new Date(checkin.value);
    const outDate = new Date(checkout.value);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  function updateSummary() {
    const nights = getNights();
    sumNights.textContent = nights + (nights === 1 ? ' night' : ' nights');
    sumMultiplier.textContent = '×' + nights;
    const total = (selectedPrice * nights) + SERVICE_FEE;
    sumTotal.textContent = formatNaira(total);
  }

  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectBtns.forEach(b => { b.classList.remove('chosen'); b.textContent = 'Select'; });
      btn.classList.add('chosen');
      btn.textContent = 'Selected';
      sumRoom.textContent = btn.dataset.name;
      selectedPrice = parseInt(btn.dataset.price);
      sumPrice.textContent = formatNaira(selectedPrice);
      updateSummary();
    });
  });

  checkin.addEventListener('change', updateSummary);
  checkout.addEventListener('change', updateSummary);

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (selectedPrice === 0) {
      alert('Please select a room first.');
      return;
    }
    // Actual submission (auth check + saving to Firestore) is handled
    // by the module script in booking.html, which listens for the
    // custom 'booking:ready' event dispatched below.
    document.dispatchEvent(new CustomEvent('booking:ready', {
      detail: {
        roomName: sumRoom.textContent,
        nights: getNights(),
        total: selectedPrice * getNights() + SERVICE_FEE
      }
    }));
  });
}

// ================= ROOM IMAGE CAROUSELS =================
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const prevBtn = carousel.querySelector('.car-arrow.prev');
  const nextBtn = carousel.querySelector('.car-arrow.next');
  let index = 0;
  const total = slides.length;
  const autoplayMs = parseInt(carousel.dataset.autoplay) || 4500;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  prevBtn.addEventListener('click', () => { goTo(index - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); resetAutoplay(); });

  let timer = setInterval(() => goTo(index + 1), autoplayMs);
  function resetAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), autoplayMs);
  }
});

// ================= DASHBOARD SIDEBAR TOGGLE (mobile) =================
const dashToggle = document.querySelector('.dash-toggle');
const dashSidebar = document.querySelector('.dash-sidebar');
if (dashToggle && dashSidebar) {
  dashToggle.addEventListener('click', () => {
    dashSidebar.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (dashSidebar.classList.contains('open') &&
        !dashSidebar.contains(e.target) &&
        !dashToggle.contains(e.target)) {
      dashSidebar.classList.remove('open');
    }
  });
  // Close the sidebar the moment a link inside it is tapped, so the
  // destination is actually visible instead of staying hidden behind it.
  dashSidebar.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      dashSidebar.classList.remove('open');
    });
  });
}