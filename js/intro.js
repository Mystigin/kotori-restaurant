(function () {
  var KEY = 'kotori-intro-seen';
  var intro = document.querySelector('.intro');
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
