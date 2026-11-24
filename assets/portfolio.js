document.querySelectorAll('.bts-toggle').forEach((button, index) => {
  const card = button.closest('.note-card');
  const drawer = card.querySelector('.bts-drawer');
  const count = card.querySelectorAll('.bts-strip img').length;
  drawer.id = `behind-scenes-${index}`;
  button.setAttribute('aria-controls', drawer.id);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const open = card.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.innerHTML = `${open ? '收起花絮' : `幕后花絮 · ${count}`} <span class="chev" aria-hidden="true">⌄</span>`;
  });
});

const lightbox = document.getElementById('lightbox');
const image = lightbox.querySelector('img');
const counter = lightbox.querySelector('.lightbox-counter');
let currentImages = [];
let currentIndex = 0;
let trigger;

function showImage(index) {
  currentIndex = (index + currentImages.length) % currentImages.length;
  const selected = currentImages[currentIndex];
  image.src = selected.src;
  image.alt = selected.alt;
  counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  lightbox.querySelector('.lightbox-prev').hidden = currentImages.length < 2;
  lightbox.querySelector('.lightbox-next').hidden = currentImages.length < 2;
}

function openImage(selected, source) {
  trigger = source;
  const group = selected.closest('.photo-gallery, .bts-strip');
  currentImages = [...group.querySelectorAll('img')];
  showImage(currentImages.indexOf(selected));
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.gallery-open').forEach(button => {
  button.addEventListener('click', () => openImage(button.querySelector('img'), button));
});
document.querySelectorAll('.bts-strip img').forEach(img => {
  img.setAttribute('role', 'button');
  img.setAttribute('tabindex', '0');
  img.setAttribute('aria-label', `放大：${img.alt}`);
  img.addEventListener('click', () => openImage(img, img));
  img.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openImage(img, img);
    }
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentIndex + 1); }
});
lightbox.addEventListener('close', () => {
  document.body.style.overflow = '';
  trigger?.focus({preventScroll:true});
});
