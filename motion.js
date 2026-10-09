/* One quiet entrance per item, shared by EN and RU pages. */
(function () {
  'use strict';
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  var items = Array.from(document.querySelectorAll(
    '.cinematic > .section-num, .cinematic > .section-display, ' +
    '.cinematic-item, .reel-item, .about-head, .about .prose, ' +
    '.services > .section-display, .service-list > li, ' +
    '.clients > *, .contact > *, .about-socials'
  ));
  var observer = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (entry) {
      return entry.isIntersecting && !entry.target.hidden;
    });
    visible.sort(function (a, b) {
      return a.boundingClientRect.top - b.boundingClientRect.top ||
        a.boundingClientRect.left - b.boundingClientRect.left;
    });
    visible.forEach(function (entry, index) {
      show(entry.target, Math.min(index, 2) * 120);
    });
  }, { threshold: 0.025, rootMargin: '0px' });

  function show(item, delay) {
    item.style.setProperty('--motion-delay', delay + 'ms');
    item.classList.remove('motion-pending');
    observer.unobserve(item);
  }

  items.forEach(function (item) {
    // Preserve the position of content above a restored scroll position.
    if (!item.hidden && item.getBoundingClientRect().bottom < 0) return;
    item.classList.add('motion-ready', 'motion-pending');
    observer.observe(item);
  });

  document.addEventListener('focusin', function (event) {
    var item = event.target.closest('.motion-pending');
    if (item) show(item, 0);
  });

  function disableMotion(event) {
    if (!event.matches) return;
    observer.disconnect();
    items.forEach(function (item) {
      item.classList.remove('motion-pending', 'motion-ready');
      item.style.removeProperty('--motion-delay');
    });
  }
  if (preference.addEventListener) preference.addEventListener('change', disableMotion);
  else if (preference.addListener) preference.addListener(disableMotion);
})();
