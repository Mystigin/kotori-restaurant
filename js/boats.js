/* Boat fleet — spawns random 3D-shaded boats into the seigaiha banner at irregular
   intervals. Each boat has its own ocean-physics motion: heave (vertical bob),
   pitch (rotateX), and roll (rotateZ), composed with a horizontal traverse. */
(function () {
  var fleet = document.querySelector('.gallery-fleet');
  if (!fleet) return;

  /* ─── boat templates: SVG with shading gradients for faux-3D look ─── */
  var BOATS = [
    /* 1) red junk-style boat with cream sail */
    function () {
      var id = 'g' + Math.random().toString(36).slice(2, 7);
      return [
        '<svg width="44" height="26" viewBox="0 0 44 26" xmlns="http://www.w3.org/2000/svg">',
          '<defs>',
            '<linearGradient id="', id, '" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0" stop-color="#d35a3a"/>',
              '<stop offset=".55" stop-color="#a83c1f"/>',
              '<stop offset="1" stop-color="#4a1408"/>',
            '</linearGradient>',
          '</defs>',
          '<line x1="16" y1="2" x2="16" y2="15" stroke="#3a1810" stroke-width="0.9"/>',
          '<path d="M16 2 L20.5 3 L16 4 Z" fill="#7a2510"/>',
          '<path d="M16.5 3 L16.5 14 L25 14 Z" fill="#fff8e6" stroke="#a83c1f" stroke-width="0.7"/>',
          '<path d="M16.5 3 L16.5 14 L19.5 14 Z" fill="#d6c8a4" opacity="0.55"/>',
          '<path d="M3 15 L41 15 L36 22 L8 22 Z" fill="url(#', id, ')"/>',
          '<path d="M3 15 L41 15" stroke="#ffd9b8" stroke-width="0.5" opacity="0.5"/>',
          '<path d="M8 22 L36 22 L34 24 L10 24 Z" fill="#2a0a04" opacity="0.55"/>',
        '</svg>'
      ].join('');
    },

    /* 2) blue motorized fishing boat with wheelhouse */
    function () {
      var id = 'g' + Math.random().toString(36).slice(2, 7);
      return [
        '<svg width="40" height="22" viewBox="0 0 40 22" xmlns="http://www.w3.org/2000/svg">',
          '<defs>',
            '<linearGradient id="', id, '" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0" stop-color="#5e8aa8"/>',
              '<stop offset=".55" stop-color="#264c7c"/>',
              '<stop offset="1" stop-color="#0a1a32"/>',
            '</linearGradient>',
          '</defs>',
          '<rect x="13" y="6" width="11" height="7.5" fill="url(#', id, ')" stroke="#0a1a32" stroke-width="0.5"/>',
          '<rect x="15" y="8" width="7" height="3.5" fill="#fff8e6" opacity="0.7"/>',
          '<line x1="13" y1="6" x2="11" y2="2" stroke="#0a1a32" stroke-width="0.6"/>',
          '<path d="M2 14 L38 14 L34 19 L6 19 Z" fill="url(#', id, ')"/>',
          '<path d="M2 14 L38 14" stroke="#cfdfee" stroke-width="0.5" opacity="0.55"/>',
          '<path d="M6 19 L34 19 L32 21 L8 21 Z" fill="#04081a" opacity="0.5"/>',
        '</svg>'
      ].join('');
    },

    /* 3) tiny yellow rowboat with a small figure */
    function () {
      var id = 'g' + Math.random().toString(36).slice(2, 7);
      return [
        '<svg width="32" height="16" viewBox="0 0 32 16" xmlns="http://www.w3.org/2000/svg">',
          '<defs>',
            '<linearGradient id="', id, '" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0" stop-color="#f3c764"/>',
              '<stop offset=".55" stop-color="#c08a30"/>',
              '<stop offset="1" stop-color="#4a3010"/>',
            '</linearGradient>',
          '</defs>',
          '<circle cx="16" cy="3.5" r="1.8" fill="#3a2818"/>',
          '<path d="M14.2 5 L17.8 5 L17 8.5 L15 8.5 Z" fill="#5a3020"/>',
          '<line x1="13" y1="7" x2="9" y2="9" stroke="#3a2818" stroke-width="0.7"/>',
          '<line x1="19" y1="7" x2="23" y2="9" stroke="#3a2818" stroke-width="0.7"/>',
          '<path d="M2 8 L30 8 L26 13 L6 13 Z" fill="url(#', id, ')"/>',
          '<path d="M2 8 L30 8" stroke="#fff5d8" stroke-width="0.5" opacity="0.55"/>',
        '</svg>'
      ].join('');
    },

    /* 4) tall white sailboat with main + jib */
    function () {
      var id = 'g' + Math.random().toString(36).slice(2, 7);
      return [
        '<svg width="38" height="26" viewBox="0 0 38 26" xmlns="http://www.w3.org/2000/svg">',
          '<defs>',
            '<linearGradient id="', id, '" x1="0" y1="0" x2="0" y2="1">',
              '<stop offset="0" stop-color="#f0e8d2"/>',
              '<stop offset=".55" stop-color="#9a8e74"/>',
              '<stop offset="1" stop-color="#1f1810"/>',
            '</linearGradient>',
          '</defs>',
          '<line x1="15" y1="2" x2="15" y2="18" stroke="#1a1410" stroke-width="0.7"/>',
          '<path d="M15.5 3 L15.5 18 L26 18 Z" fill="#fff" stroke="#3a3530" stroke-width="0.5"/>',
          '<path d="M15.5 3 L15.5 18 L19 18 Z" fill="#dad3c4" opacity="0.55"/>',
          '<path d="M14.5 3 L9 18 L14.5 18 Z" fill="#fff" stroke="#3a3530" stroke-width="0.5"/>',
          '<path d="M2 18 L36 18 L32 23 L6 23 Z" fill="url(#', id, ')"/>',
          '<path d="M2 18 L36 18" stroke="#1a1410" stroke-width="0.4" opacity="0.6"/>',
          '<path d="M6 23 L32 23 L30 25 L8 25 Z" fill="#0a0806" opacity="0.55"/>',
        '</svg>'
      ].join('');
    }
  ];

  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ─── spawn one boat ─── */
  function spawn() {
    if (document.hidden) return;          /* skip spawning when tab is backgrounded */

    var boat = document.createElement('span');
    boat.className = 'gallery-boat';

    /* random voyage parameters */
    var sailDur = rand(16, 30);           /* seconds to cross the screen */
    var bobDur  = rand(2.6, 4.4);         /* seconds per heave/roll cycle */
    var bobDelay = rand(-bobDur, 0);      /* phase-offset so boats aren't synced */
    var topPos = rand(2, 6);              /* px from top of banner — small variation */
    var scale = rand(0.85, 1.1);          /* size jitter */

    /* alternate sailing direction so some boats come from the right */
    var rtl = Math.random() < 0.18;       /* ~18% chance of right-to-left */
    if (rtl) boat.classList.add('rtl');

    boat.style.setProperty('--sail-dur', sailDur + 's');
    boat.style.setProperty('--bob-dur',  bobDur  + 's');
    boat.style.setProperty('--bob-delay', bobDelay + 's');
    boat.style.setProperty('--top',  topPos + 'px');
    boat.style.setProperty('--scale', scale);

    boat.innerHTML = pick(BOATS)();
    fleet.appendChild(boat);

    /* clean up after the traversal completes */
    setTimeout(function () {
      if (boat.parentNode) boat.parentNode.removeChild(boat);
    }, sailDur * 1000 + 600);
  }

  /* ─── recursive scheduler with randomised intervals ─── */
  function scheduleNext() {
    var delay = rand(1500, 7500);   /* 1.5–7.5 s between launches */
    setTimeout(function () {
      spawn();
      scheduleNext();
    }, delay);
  }

  /* one boat right at the start so the bar isn't empty for the first 1.5–7s */
  setTimeout(spawn, 400);
  scheduleNext();
})();
