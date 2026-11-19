// Organizer page: event details, people, rules, and the draw.
// Everything is saved in this browser's localStorage.
(function () {
  "use strict";
  const { $ } = SS;
  const STORE_KEY = "secret-santa-organizer-v1"; // same key as the one-page version, so saved data carries over

  // ---------- State ----------
  function blank() {
    return { event: { name: "", budget: "", date: "" }, people: [], rules: [], noSwaps: true, result: null };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(blank(), JSON.parse(raw));
    } catch (e) { /* storage blocked: start fresh */ }
    return blank();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  let state = load();
  const uid = () => Math.random().toString(36).slice(2, 10);
  const nameOf = (id) => (state.people.find((p) => p.id === id) || {}).name || "?";
  const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();

  function addPerson(name, answers) {
    name = (name || "").trim();
    if (!name) return null;
    const existing = state.people.find((p) => sameName(p.name, name));
    if (existing) {
      if (answers) existing.answers = Object.assign({}, existing.answers, answers);
      return existing;
    }
    const p = { id: uid(), name, answers: Object.assign({}, answers || {}) };
    state.people.push(p);
    state.result = null;
    return p;
  }

  function emptyRow(text) {
    const li = document.createElement("li");
    const p = document.createElement("p"); p.className = "empty"; p.textContent = text;
    li.appendChild(p);
    return li;
  }

  function setPill(pill, filled) {
    pill.className = "pill " + (filled ? "ok" : "missing");
    pill.textContent = filled ? "Wishlist in" : "No wishlist yet";
  }

  // ---------- Render: event ----------
  function renderEvent() {
    $("#ev-name").value = state.event.name;
    $("#ev-budget").value = state.event.budget;
    $("#ev-date").value = state.event.date;
    $("#event-eyebrow").textContent = state.event.name || "Gift exchange";
  }

  // ---------- Render: people ----------
  function renderPeople() {
    const ul = $("#people-list");
    ul.innerHTML = "";
    if (!state.people.length) ul.appendChild(emptyRow("No one yet. Add names above or paste wishlist codes."));

    state.people.forEach((p) => {
      const li = document.createElement("li");
      const top = document.createElement("div"); top.className = "item-top";

      const nm = document.createElement("span"); nm.className = "item-name"; nm.textContent = p.name;
      const pill = document.createElement("span"); setPill(pill, SS.hasAnswers(p.answers));
      const rm = document.createElement("button"); rm.className = "btn ghost small"; rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        state.people = state.people.filter((x) => x.id !== p.id);
        state.rules = state.rules.filter((r) => r.a !== p.id && r.b !== p.id);
        state.result = null;
        save(); renderAll();
      });
      top.append(nm, pill, rm);

      const det = document.createElement("details"); det.className = "edit";
      const sum = document.createElement("summary");
      sum.textContent = SS.hasAnswers(p.answers) ? "View or edit wishlist" : "Type their wishlist in";
      const box = document.createElement("div"); box.className = "fields";
      SS.buildFields(box, p.answers, "p-" + p.id, (k, v) => {
        p.answers[k] = v;
        save();
        setPill(pill, SS.hasAnswers(p.answers));
      });
      det.append(sum, box);

      li.append(top, det);
      ul.appendChild(li);
    });
  }

  // ---------- Render: rules ----------
  function renderRules() {
    ["#ex-a", "#ex-b"].forEach((sel, idx) => {
      const el = $(sel);
      const prev = el.value;
      el.innerHTML = "";
      state.people.forEach((p) => {
        const o = document.createElement("option");
        o.value = p.id; o.textContent = p.name;
        el.appendChild(o);
      });
      if (state.people.some((p) => p.id === prev)) el.value = prev;
      else if (state.people[idx]) el.value = state.people[idx].id;
    });

    const ul = $("#ex-list");
    ul.innerHTML = "";
    if (!state.rules.length) ul.appendChild(emptyRow("No rules. Anyone can draw anyone except themselves."));

    state.rules.forEach((r, i) => {
      const li = document.createElement("li");
      const top = document.createElement("div"); top.className = "item-top";
      const t = document.createElement("span"); t.className = "item-name plain";
      t.textContent = r.both
        ? `${nameOf(r.a)} and ${nameOf(r.b)} can't draw each other`
        : `${nameOf(r.a)} can't draw ${nameOf(r.b)}`;
      const rm = document.createElement("button"); rm.className = "btn ghost small"; rm.textContent = "Remove";
      rm.addEventListener("click", () => {
        state.rules.splice(i, 1);
        state.result = null;
        save(); renderAll();
      });
      top.append(t, rm);
      li.appendChild(top);
      ul.appendChild(li);
    });

    $("#no-swaps").checked = !!state.noSwaps;
  }

  // ---------- Render: results ----------
  function revealLink(giverId) {
    const g = state.people.find((p) => p.id === giverId);
    const r = state.people.find((p) => p.id === state.result[giverId]);
    if (!g || !r) return "";
    const payload = { v: 1, g: g.name, r: r.name, a: r.answers, e: state.event };
    return SS.pageUrl("reveal.html") + "#r=" + SS.encode(payload);
  }

  function renderResults() {
    const valid = state.result && state.people.length && state.people.every((p) => state.result[p.id]);
    $("#results").hidden = !valid;
    if (!valid) return;

    const show = $("#show-matches").checked;
    const ul = $("#result-list");
    ul.innerHTML = "";

    state.people.forEach((p) => {
      const url = revealLink(p.id);
      const li = document.createElement("li");
      const top = document.createElement("div"); top.className = "item-top";

      const nm = document.createElement("span"); nm.className = "item-name"; nm.textContent = "Link for " + p.name;
      const b1 = document.createElement("button"); b1.className = "btn small"; b1.textContent = "Copy link";
      b1.addEventListener("click", () => SS.copy(url));
      const b2 = document.createElement("button"); b2.className = "btn small primary"; b2.textContent = "Copy message";
      const ev = state.event.name ? ` for ${state.event.name}` : "";
      const msg = `Hi ${p.name}! Your Secret Santa match${ev} is ready. Open this link when no one is looking:\n${url}`;
      b2.addEventListener("click", () => SS.copy(msg));
      top.append(nm, b1, b2);
      li.appendChild(top);

      if (show) {
        const m = document.createElement("span"); m.className = "match";
        m.append("Draws ");
        const s = document.createElement("strong"); s.textContent = nameOf(state.result[p.id]);
        m.appendChild(s);
        li.appendChild(m);
      }
      ul.appendChild(li);
    });
  }

  function renderAll() { renderEvent(); renderPeople(); renderRules(); renderResults(); }

  // ---------- Events: event details ----------
  ["name", "budget", "date"].forEach((k) => {
    $("#ev-" + k).addEventListener("input", (e) => {
      state.event[k] = e.target.value;
      save();
      if (k === "name") $("#event-eyebrow").textContent = state.event.name || "Gift exchange";
    });
  });
  $("#copy-form-link").addEventListener("click", () => SS.copy(SS.pageUrl("wishlist.html")));

  // ---------- Events: people ----------
  $("#add-person").addEventListener("click", () => {
    const el = $("#add-name");
    const name = el.value.trim();
    const err = $("#people-error");
    if (!name) { SS.showErr(err, "Type a name first."); return; }
    if (state.people.some((p) => sameName(p.name, name))) { SS.showErr(err, `${name} is already on the list.`); return; }
    SS.showErr(err, "");
    addPerson(name);
    el.value = ""; el.focus();
    save(); renderAll();
  });
  $("#add-name").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#add-person").click(); });

  $("#import-btn").addEventListener("click", () => {
    const err = $("#people-error");
    // Pick out just the SS1: codes, so pasting a whole email or text message works too.
    const chunks = $("#import-code").value.trim().split(/\s+/).filter((c) => c.startsWith("SS1:"));
    if (!chunks.length) { SS.showErr(err, "Paste a code that starts with SS1:"); return; }
    let added = 0;
    for (const c of chunks) {
      try {
        const obj = SS.decode(c.replace(/^SS1:/, ""));
        if (!obj || obj.t !== "q" || !obj.n) throw new Error("bad code");
        addPerson(obj.n, obj.a);
        added++;
      } catch (e) {
        SS.showErr(err, "That code didn't work. Ask the person to copy it again, all the way to the end.");
        save(); renderAll();
        return;
      }
    }
    SS.showErr(err, "");
    $("#import-code").value = "";
    save(); renderAll();
    SS.toast(added === 1 ? "Wishlist added" : `${added} wishlists added`);
  });

  // ---------- Events: rules ----------
  $("#ex-add").addEventListener("click", () => {
    const a = $("#ex-a").value, b = $("#ex-b").value, both = $("#ex-both").checked;
    if (!a || !b) return;
    if (a === b) { SS.toast("Pick two different people"); return; }
    const dup = state.rules.some((r) => (r.a === a && r.b === b) || (r.both && r.a === b && r.b === a));
    if (!dup) {
      state.rules.push({ a, b, both });
      state.result = null;
      save(); renderAll();
    }
  });
  $("#no-swaps").addEventListener("change", (e) => { state.noSwaps = e.target.checked; save(); });

  // ---------- Events: draw ----------
  $("#draw-btn").addEventListener("click", () => {
    const err = $("#draw-error");
    if (state.people.length < 3) { SS.showErr(err, "Add at least 3 people to draw."); return; }
    const res = SS.runDraw(state.people, state.rules, state.noSwaps);
    if (!res) {
      SS.showErr(err, state.noSwaps
        ? "No draw works with these rules while blocking two-person swaps. Uncheck that box or remove a rule."
        : "No draw works with these rules. Someone has too few people they're allowed to draw. Remove a rule and try again.");
      return;
    }
    SS.showErr(err, "");
    state.result = res;
    save(); renderResults();
    SS.toast("Names drawn");
  });
  $("#show-matches").addEventListener("change", renderResults);

  renderAll();
})();
