// Reveal page: opened from a private link like reveal.html#r=...
(function () {
  "use strict";
  const { $ } = SS;

  function fail() {
    $("#rv-error").hidden = false;
    $("#rv-btn").hidden = true;
  }

  const hash = location.hash;
  if (!hash.startsWith("#r=")) { fail(); return; }

  let data;
  try {
    data = SS.decode(hash.slice(3));
    if (!data.g || !data.r) throw new Error("missing names");
  } catch (e) { fail(); return; }

  const ev = data.e || {};
  document.title = (ev.name || "Secret Santa") + " match";
  $("#rv-event").textContent = ev.name || "Secret Santa";
  $("#rv-hello").textContent = "Hi " + data.g + "!";
  $("#rv-name").textContent = data.r;

  // Budget and date
  const facts = $("#rv-facts");
  [["Budget", ev.budget], ["Exchange", SS.fmtDate(ev.date)]].forEach(([k, v]) => {
    if (!v) return;
    const d = document.createElement("div"); d.className = "fact";
    const s = document.createElement("span"); s.textContent = k;
    const b = document.createElement("b"); b.textContent = v;
    d.append(s, b); facts.appendChild(d);
  });
  facts.hidden = !facts.children.length;

  // Their wishlist answers
  const dl = $("#rv-answers");
  const a = data.a || {};
  SS.QUESTIONS.forEach((q) => {
    const v = SS.answerText(q, a);
    if (!v) return;
    const dt = document.createElement("dt"); dt.textContent = q.label;
    const dd = document.createElement("dd"); dd.textContent = v;
    dl.append(dt, dd);
  });
  if (!dl.children.length) {
    const dd = document.createElement("dd"); dd.className = "empty";
    dd.textContent = data.r + " didn't fill out a wishlist. Time to do some friendly detective work.";
    dl.appendChild(dd);
  }

  $("#rv-btn").addEventListener("click", () => {
    $("#rv-card").hidden = false;
    $("#rv-card").classList.add("pop");
    $("#rv-btn").hidden = true;
  });
})();
