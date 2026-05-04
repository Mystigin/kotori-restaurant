(function () {
  var KEY = 'kotori-intro-seen';
  var intro = document.querySelector('.intro');

  /* ── hero video autoplay (iOS Safari sometimes silently rejects autoplay
        even on muted videos, especially when an overlay is on top during
        load). Force-play after metadata is ready, retry after the intro
        clears, and fall back to the first user interaction. ───────────── */
  var hero = document.querySelector('video.hero-video');
  if (hero) {
    hero.muted = true;        // iOS sometimes only respects muted as a property
    hero.playsInline = true;
    hero.setAttribute('webkit-playsinline', '');
    var tryPlay = function () {
      var p = hero.play();
      if (p && typeof p.then === 'function') p.catch(function () {});
    };
    tryPlay();
    if (hero.readyState < 2) hero.addEventListener('loadeddata', tryPlay, { once: true });
    setTimeout(tryPlay, 500);
    setTimeout(tryPlay, 4000);    // after the intro overlay fades out
    /* if still paused after a moment, hook the first tap/scroll to start it */
    var startOnGesture = function () {
      tryPlay();
      ['touchstart', 'click', 'scroll'].forEach(function (ev) {
        document.removeEventListener(ev, startOnGesture, true);
      });
    };
    setTimeout(function () {
      if (hero.paused) {
        ['touchstart', 'click', 'scroll'].forEach(function (ev) {
          document.addEventListener(ev, startOnGesture, true);
        });
      }
    }, 1500);
  }

  if (!intro) return;

  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

  if (seen) {
    intro.classList.add('skip');
    document.body.classList.add('no-intro');
    return;
  }

  // mark seen as soon as the intro begins so quick reloads don't re-trigger
  try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

  // remove the overlay from the DOM after its fade-out completes
  // (animation is 1.2s starting at 2.4s -> ends at 3.6s; add small buffer)
  setTimeout(function () {
    intro.style.display = 'none';
  }, 3800);
})();
