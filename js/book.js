(function () {
  /* If a page doesn't have the menu markup baked in (every page except index.html),
     inject the same body-level overlay so the modal can be summoned anywhere. */
  if (!document.getElementById('menu')) {
    var div = document.createElement('div');
    div.innerHTML = [
      '<div class="book-mount" id="menu">',
        '<button class="book-close" type="button" aria-label="Close menu">×</button>',
        '<div class="book-stage" data-state="0">',
          '<div class="cover-flat" aria-hidden="true">',
            '<span class="cover-corner cc-tl"></span>',
            '<span class="cover-corner cc-tr"></span>',
            '<span class="cover-corner cc-bl"></span>',
            '<span class="cover-corner cc-br"></span>',
            '<img class="cover-logo" src="images/kotori-logo.png" alt="">',
            '<h2 class="cover-title">the menu</h2>',
            '<span class="cover-rule"></span>',
            '<span class="cover-meta">vol. iv · spring no. 02</span>',
          '</div>',
          '<img class="menu-flat" data-menu="menu-1" src="images/menu-1.png" alt="" aria-hidden="true">',
          '<img class="menu-flat" data-menu="menu-2" src="images/menu-2.png" alt="" aria-hidden="true">',
          '<img class="menu-flat" data-menu="menu-3" src="images/menu-3.png" alt="" aria-hidden="true">',
          '<div class="book">',
            '<div class="book-spine" aria-hidden="true"></div>',
            '<article class="leaf leaf-cover" data-leaf="0">',
              '<div class="face front">',
                '<div class="cover-art">',
                  '<span class="cover-corner cc-tl"></span>',
                  '<span class="cover-corner cc-tr"></span>',
                  '<span class="cover-corner cc-bl"></span>',
                  '<span class="cover-corner cc-br"></span>',
                  '<img class="cover-logo" src="images/kotori-logo.png" alt="">',
                  '<h2 class="cover-title">the menu</h2>',
                  '<span class="cover-rule"></span>',
                  '<span class="cover-meta">vol. iv · spring no. 02</span>',
                  '<span class="cover-tap">— click to open —</span>',
                '</div>',
              '</div>',
              '<div class="face back">',
                '<div class="page page-image" data-menu="menu-1">',
                  '<img class="page-image-img" src="images/menu-1.png" alt="Kotori menu — page 1">',
                '</div>',
              '</div>',
            '</article>',
            '<article class="leaf" data-leaf="1">',
              '<div class="face front">',
                '<div class="page page-image" data-menu="menu-2">',
                  '<img class="page-image-img" src="images/menu-2.png" alt="Kotori menu — page 2">',
                '</div>',
              '</div>',
              '<div class="face back">',
                '<div class="page page-image" data-menu="menu-3">',
                  '<img class="page-image-img" src="images/menu-3.png" alt="Kotori menu — page 3">',
                '</div>',
              '</div>',
            '</article>',
            '<article class="leaf leaf-back" data-leaf="2" aria-hidden="true">',
              '<div class="face front">',
                '<div class="page page-end">',
                  '<span class="end-line"></span>',
                  '<span class="end-thanks">— thank you —</span>',
                  '<span class="end-foot">kotori · est. 2019</span>',
                '</div>',
              '</div>',
              '<div class="face back">',
                '<div class="cover-art back-cover">',
                  '<span class="cover-corner cc-tl"></span>',
                  '<span class="cover-corner cc-tr"></span>',
                  '<span class="cover-corner cc-bl"></span>',
                  '<span class="cover-corner cc-br"></span>',
                '</div>',
              '</div>',
            '</article>',
          '</div>',
        '</div>',
        '<div class="book-controls" aria-label="Menu navigation">',
          '<button class="book-prev" type="button" aria-label="Previous page">←</button>',
          '<span class="book-progress" aria-live="polite">closed</span>',
          '<button class="book-next" type="button" aria-label="Next page">→</button>',
        '</div>',
        '<div class="book-phone-stack" aria-hidden="true">',
          '<img src="images/menu-1.png" alt="Kotori menu — page 1" loading="lazy">',
          '<img src="images/menu-2.png" alt="Kotori menu — page 2" loading="lazy">',
          '<img src="images/menu-3.png" alt="Kotori menu — page 3" loading="lazy">',
        '</div>',
      '</div>'
    ].join('');
    while (div.firstChild) document.body.appendChild(div.firstChild);
  }

  var mount = document.getElementById('menu');
  if (!mount) return;

  var teaserInner = mount.closest('.teaser-inner');
  var stage    = mount.querySelector('.book-stage');
  var book     = mount.querySelector('.book');
  var leaves   = Array.prototype.slice.call(mount.querySelectorAll('.leaf'));
  var prevBtn  = mount.querySelector('.book-prev');
  var nextBtn  = mount.querySelector('.book-next');
  var progress = mount.querySelector('.book-progress');
  var closeBtn  = mount.querySelector('.book-close');
  var editBtn   = mount.querySelector('.book-edit');
  var editPanel = mount.querySelector('.book-edit-panel');
  var pageImgs  = Array.prototype.slice.call(mount.querySelectorAll('.page-image-img'));

  // last leaf is the back cover — never flippable; max flips = leaves.length - 1
  var maxState = leaves.length - 1;
  var state    = 0;
  var animating = false;

  function updateZ() {
    leaves.forEach(function (leaf, i) {
      leaf.style.zIndex = leaf.classList.contains('flipped') ? (10 + i) : (200 - i);
    });
  }

  function updateUI() {
    stage.dataset.state = String(state);
    if (teaserInner) teaserInner.classList.toggle('is-book-open', state > 0);
    if (state === 0) {
      progress.textContent = 'closed';
    } else {
      progress.textContent = '— spread ' + state + ' / ' + maxState + ' —';
    }
    prevBtn.disabled = state === 0;
    nextBtn.disabled = state >= maxState;
  }

  function centerOpenMenu() {
    if (!mount.scrollIntoView || state !== 1) return;
    window.requestAnimationFrame(function () {
      mount.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    });
  }

  /* keep the actively-flipping leaf on top during its full rotation, then
     settle z-indices once the animation completes — otherwise forward flips
     look janky because the leaf's z-index drops at the start, letting siblings
     overlap it mid-rotation. */
  function flipNext() {
    if (animating || state >= maxState) return;
    animating = true;
    var leaf = leaves[state];
    leaf.style.zIndex = 500;        // float above siblings during flip
    leaf.classList.add('flipped');
    state++;
    updateUI();
    centerOpenMenu();
    setTimeout(function () {
      animating = false;
      updateZ();                    // settle once rotation is done
    }, 1010);
  }

  function flipPrev() {
    if (animating || state <= 0) return;
    animating = true;
    state--;
    var leaf = leaves[state];
    leaf.style.zIndex = 500;        // float above siblings during un-flip too
    leaf.classList.remove('flipped');
    updateUI();
    setTimeout(function () {
      animating = false;
      updateZ();
    }, 1010);
  }

  // ─── click on book halves ───
  book.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    if (document.body.classList.contains('is-editing')) return;
    if (state === 0) { flipNext(); return; }
    var rect = book.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x > rect.width / 2) flipNext();
    else                    flipPrev();
  });

  // ─── make sure links inside pages always navigate (stop drag/swipe interference) ───
  Array.prototype.forEach.call(book.querySelectorAll('a, button'), function (el) {
    el.addEventListener('mousedown',  function (e) { e.stopPropagation(); });
    el.addEventListener('mouseup',    function (e) { e.stopPropagation(); });
    el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
    el.addEventListener('touchend',   function (e) { e.stopPropagation(); });
  });

  prevBtn.addEventListener('click', flipPrev);
  nextBtn.addEventListener('click', flipNext);

  // ─── keyboard (only when book is in view) ───
  document.addEventListener('keydown', function (e) {
    if (state === 0) return;
    var rect = mount.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); flipNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); flipPrev(); }
    else if (e.key === 'Home')      { while (state > 0) flipPrev(); }
    else if (e.key === 'End')       { while (state < maxState) flipNext(); }
  });

  // ─── swipe / drag ───
  var sx = null, sy = null, st = 0;
  function onStart(x, y) { sx = x; sy = y; st = Date.now(); }
  function onEnd(x, y) {
    if (sx === null) return;
    var dx = x - sx, dy = y - sy, dt = Date.now() - st;
    sx = sy = null;
    if (dt > 700) return;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) flipNext(); else flipPrev();
  }
  stage.addEventListener('touchstart', function (e) {
    if (document.body.classList.contains('is-editing')) return;
    var t = e.touches[0]; onStart(t.clientX, t.clientY);
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (document.body.classList.contains('is-editing')) return;
    var t = e.changedTouches[0]; onEnd(t.clientX, t.clientY);
  });
  stage.addEventListener('mousedown',  function (e) {
    if (document.body.classList.contains('is-editing')) return;
    onStart(e.clientX, e.clientY);
  });
  stage.addEventListener('mouseup',    function (e) {
    if (document.body.classList.contains('is-editing')) return;
    onEnd(e.clientX, e.clientY);
  });
  stage.addEventListener('mouseleave', function () { sx = sy = null; });

  // ─── modal open/close ───
  var autoOpenTimer = null;
  function openMenu() {
    if (mount.classList.contains('is-modal')) return;
    document.body.classList.add('is-menu-open');
    mount.classList.add('is-modal');
    /* after 1 second, auto-flip the cover open to reveal the first menu spread.
       only fires if the user hasn't already flipped it themselves. */
    clearTimeout(autoOpenTimer);
    autoOpenTimer = setTimeout(function () {
      if (mount.classList.contains('is-modal') && state === 0) flipNext();
    }, 2500);
  }
  function closeMenu() {
    if (!mount.classList.contains('is-modal')) return;
    clearTimeout(autoOpenTimer);
    mount.classList.add('is-modal-leaving');
    document.body.classList.add('is-menu-leaving');
    setTimeout(function () {
      mount.classList.remove('is-modal');
      mount.classList.remove('is-modal-leaving');
      document.body.classList.remove('is-menu-open');
      document.body.classList.remove('is-menu-leaving');
    }, 280);
  }

  if (closeBtn) closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeMenu();
  });

  // ESC closes the modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('is-menu-open')) {
      closeMenu();
    }
  });

  // Click on the backdrop (outside the book stage) closes the modal
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('is-menu-open')) return;
    if (mount.contains(e.target)) return;       // click inside the book
    closeMenu();
  });

  // Intercept any "Menu" links that target #menu — open as modal instead of jumping
  Array.prototype.forEach.call(document.querySelectorAll('a[href$="#menu"]'), function (a) {
    a.addEventListener('click', function (e) {
      var url = new URL(a.href, location.href);
      if (url.pathname === location.pathname && url.hash === '#menu') {
        e.preventDefault();
        e.stopPropagation();      /* don't let the same click reach the backdrop-close handler */
        openMenu();
      }
    });
  });

  // If the page was loaded with #menu in the URL (e.g. coming from another page),
  // open the modal automatically.
  if (location.hash === '#menu') {
    requestAnimationFrame(openMenu);
  }

  /* clear out leftover transforms from older editor sessions; phone menu
     positions are now baked directly in pages.css. Standalone editor lives
     at /menu-editor.html for future tweaking. */
  try { localStorage.removeItem('kotori-menu-transforms-v1'); } catch (e) {}
  try { localStorage.removeItem('kotori-menu-transforms-mobile-v1'); } catch (e) {}
  try { localStorage.removeItem('kotori-menu-positions-v2'); } catch (e) {}

  // initial state
  updateZ();
  updateUI();
})();
