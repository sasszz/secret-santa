// Home page. Sends links made by the old one-page version to the new pages,
// so any links you already sent still work.
(function () {
  "use strict";
  const h = location.hash;
  if (h.startsWith("#r=")) location.replace("reveal.html" + h);
  else if (h === "#form") location.replace("wishlist.html");
})();
