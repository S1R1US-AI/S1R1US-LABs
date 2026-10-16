(function () {
  var btn = document.getElementById('em-share');
  if (!btn) return;
  var url = 'https://s1r1us.ai/copyright-terms#exit-matrix-video';
  var text = 'Exit the Matrix & change reality | explore our FAQ on how we r building >> The N3w MATR1X';
  var menu = document.getElementById('em-share-menu');
  var status = document.getElementById('em-share-status');
  var u = encodeURIComponent(url), t = encodeURIComponent(text);
  var links = {
    x: 'https://x.com/intent/post?text=' + t + '&url=' + u,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
    reddit: 'https://www.reddit.com/submit?url=' + u + '&title=' + t,
    email: 'mailto:?subject=' + encodeURIComponent('Exit the MATRIX') + '&body=' + t + '%20' + u
  };
  menu.querySelectorAll('[data-share]').forEach(function (a) { a.href = links[a.getAttribute('data-share')]; });
  btn.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: 'Exit the MATRIX', text: text, url: url }).catch(function () {});
    } else {
      menu.hidden = !menu.hidden;
    }
  });
  document.getElementById('em-copy').addEventListener('click', function () {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { status.textContent = 'Link copied.'; }, function () { status.textContent = url; });
    } else { status.textContent = url; }
  });
})();
