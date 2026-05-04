(function () {
  var KEY = 'kotori-intro-seen';
  var intro = document.querySelector('.intro');

  /* ── hero video autoplay.
        Primary trigger: 1 second after page open. By that point the page
        has parsed, the video has had time to start loading, and the intro
        splash is still up so the video starting "early" is invisible to
        the user — but iOS has registered enough engagement signals to
        allow play(). Backups: try at parse, on loadeddata, and on the
        first user gesture if everything else fails. ─────────────────── */
  var hero = document.querySelector('video.hero-video');
  if (hero) {
    hero.muted = true;        // iOS sometimes only respects muted as a property
    hero.playsInline = true;
    hero.setAttribute('webkit-playsinline', '');
    var tryPlay = function () {
      var p = hero.play();
      if (p && typeof p.then === 'function') p.catch(function () {});
    };
    tryPlay();                                                          // immediate attempt
    if (hero.readyState < 2) hero.addEventListener('loadeddata', tryPlay, { once: true });
    setTimeout(tryPlay, 1000);                                          // primary trigger — 1s after page open
    /* if still paused after the primary attempt, hook the first
       tap/scroll/click as a guaranteed-allowed user-gesture fallback */
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
    }, 1200);
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
