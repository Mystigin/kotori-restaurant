(function () {
  var items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  /* ─── fade-in on scroll ─── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ─── lightbox: click a photo to view it full-size with the page blurred ─── */
  var lightbox      = document.querySelector('.lightbox');
  var lightboxImg   = lightbox && lightbox.querySelector('.lightbox-img');
  var lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-lightbox-open');
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.add('is-leaving');
    document.body.classList.add('is-lightbox-leaving');
    setTimeout(function () {
      lightbox.classList.remove('is-open');
      lightbox.classList.remove('is-leaving');
      document.body.classList.remove('is-lightbox-open');
      document.body.classList.remove('is-lightbox-leaving');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';        // free the loaded image
    }, 260);
  }

  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var img = item.querySelector('img');
      if (!img) return;
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  /* click on the dim backdrop (anywhere outside the image) closes */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightboxImg) return;
    closeLightbox();
  });

  /* ESC closes */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('is-lightbox-open')) {
      closeLightbox();
    }
  });
})();
