// Shared helpers used by every page. Exposes one global: window.SS.
// Plain script (not an ES module) so the pages also work when opened straight from disk.
(function (root) {
  "use strict";
  const SS = root.SS || (root.SS = {});

  // The questionnaire. Change these to change the questions on every page.
  SS.QUESTIONS = [
    { k: "likes",    label: "Things I love",              hint: "Hobbies, colors, activities. Start typing, then tap a suggestion or press Enter", type: "tags", suggest: "LIKES", placeholder: "e.g. hiking, cats, green" },
    { k: "brands",   label: "Favorite brands and stores", hint: "Start typing, then tap a suggestion or press Enter", type: "tags", suggest: "BRANDS", placeholder: "e.g. Lego, Sephora, Patagonia" },
    { k: "treats",   label: "Favorite snacks and drinks", hint: "" },
    { k: "wishlist", label: "Wishlist ideas or links",    hint: "Be specific!" },
    { k: "sizes",    label: "Clothes and sizes",          hint: "", type: "sizes" },
    { k: "avoid",    label: "Please don't get me",        hint: "Allergies, things I already have, pet peeves" },
    { k: "notes",    label: "Anything else",              hint: "" }
  ];

  // Size dropdowns shown when someone ticks "I'm open to getting clothes".
  // Options are plain strings or { group, items } for an <optgroup>.
  // The free-text "sizes" answer becomes the fit-notes box underneath.
  const range = (from, to, step, fmt) => {
    const out = [];
    for (let n = from; n <= to + 1e-9; n += step) out.push(fmt(n));
    return out;
  };
  SS.SIZES = [
    { k: "sz_top", label: "Tops and sweaters",
      options: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"] },
    { k: "sz_bottom", label: "Pants and bottoms",
      options: [
        { group: "Letter", items: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"] },
        { group: "Women's numeric", items: ["00", "0"].concat(range(2, 24, 2, String)).map((n) => "Size " + n) },
        { group: "Waist (inches)", items: range(24, 48, 1, (n) => "Waist " + n) }
      ] },
    { k: "sz_shoe", label: "Shoes",
      options: [
        { group: "US women's", items: range(4, 13, 0.5, (n) => "US women's " + n) },
        { group: "US men's",   items: range(5, 16, 0.5, (n) => "US men's " + n) },
        { group: "UK",         items: range(2, 14, 0.5, (n) => "UK " + n) },
        { group: "EU",         items: range(34, 50, 1, (n) => "EU " + n) }
      ] },
    { k: "sz_socks", label: "Socks", options: ["S", "M", "L", "XL"] },
    { k: "sz_hat", label: "Hats and gloves", options: ["XS", "S", "M", "L", "XL", "One size fits all"] }
  ];

  // Suggestions for the "Things I love" tag field (questions point to a list by name with `suggest`). People can still add anything not listed.
  SS.LIKES = [
    // Hobbies and activities
    "Baking", "Cooking", "Grilling", "Coffee", "Tea", "Wine", "Craft beer", "Cocktails", "Gardening", "Houseplants",
    "Hiking", "Camping", "Running", "Cycling", "Yoga", "Pilates", "Climbing", "Skiing", "Snowboarding", "Swimming",
    "Surfing", "Fishing", "Golf", "Tennis", "Pickleball", "Soccer", "Basketball", "Football", "Baseball", "Hockey",
    "Weightlifting", "Dancing", "Travel", "Road trips", "Beach days", "Photography", "Painting", "Drawing", "Sketching",
    "Pottery", "Knitting", "Crochet", "Sewing", "Embroidery", "Woodworking", "DIY projects", "Journaling", "Stationery",
    "Calligraphy", "Scrapbooking", "Reading", "Fantasy books", "Mystery novels", "Romance novels", "Sci-fi", "Poetry",
    "Comics", "Manga", "Anime", "Movies", "Horror movies", "TV series", "Podcasts", "Music", "Vinyl records", "Concerts",
    "Guitar", "Piano", "Singing", "Video games", "Board games", "Puzzles", "Jigsaw puzzles", "Crosswords", "Lego",
    "Tabletop RPGs", "Chess", "Card games", "Magic tricks", "Astronomy", "Science", "History", "Languages", "Tech gadgets",
    "Coding", "3D printing", "Cars", "Motorcycles", "Fashion", "Sneakers", "Jewelry", "Makeup", "Skincare", "Nail art",
    "Perfume", "Candles", "Cozy blankets", "Home decor", "Self-care", "Spa days", "Meditation", "Bath bombs",
    // Animals and nature
    "Dogs", "Cats", "Horses", "Birds", "Birdwatching", "Nature", "Flowers", "Mountains", "The ocean", "Sustainability",
    // Food
    "Chocolate", "Candy", "Spicy food", "Hot sauce", "Cheese", "Sushi", "Pizza", "Pasta", "Tacos", "Ramen", "Desserts",
    // Colors
    "Red", "Pink", "Orange", "Yellow", "Green", "Blue", "Navy", "Purple", "Black", "White", "Gray", "Neutrals",
    "Pastels", "Earth tones", "Gold", "Silver"
  ];

  // Suggestions for the "Favorite brands and stores" tag field.
  SS.BRANDS = [
    // Clothing and shoes
    "Nike", "Adidas", "New Balance", "Converse", "Vans", "Puma", "Asics", "Hoka", "Birkenstock", "Dr. Martens", "UGG",
    "Levi's", "Gap", "Old Navy", "Uniqlo", "Zara", "H&M", "Madewell", "J.Crew", "Abercrombie & Fitch", "American Eagle",
    "Aritzia", "Anthropologie", "Urban Outfitters", "Free People", "Lululemon", "Athleta", "Alo Yoga", "Patagonia",
    "The North Face", "Columbia", "Carhartt", "L.L.Bean", "REI", "Arc'teryx", "Champion", "Ralph Lauren", "Tommy Hilfiger",
    "Calvin Klein", "Everlane", "Bombas", "Smartwool",
    // Beauty and self-care
    "Sephora", "Ulta", "Glossier", "Fenty Beauty", "Rare Beauty", "Charlotte Tilbury", "Clinique", "Estée Lauder", "MAC",
    "NARS", "Benefit", "Too Faced", "Urban Decay", "The Ordinary", "CeraVe", "Drunk Elephant", "Summer Fridays",
    "Laneige", "Bath & Body Works", "Lush", "Aesop", "L'Occitane", "Le Labo", "Diptyque", "Jo Malone", "Yankee Candle",
    // Home, kitchen and stationery
    "IKEA", "Target", "Crate & Barrel", "West Elm", "Pottery Barn", "Williams Sonoma", "Le Creuset", "Staub", "Our Place",
    "Stanley", "Yeti", "Hydro Flask", "Owala", "Nespresso", "Starbucks", "Moleskine", "Leuchtturm1917", "Muji",
    // Tech and games
    "Apple", "Samsung", "Google", "Sony", "Nintendo", "PlayStation", "Xbox", "Steam", "Bose", "JBL", "Kindle", "Lego",
    "Funko", "Pokémon", "Disney", "Marvel", "Star Wars", "Harry Potter", "Barnes & Noble",
    // Food and treats
    "Trader Joe's", "Whole Foods", "Ghirardelli", "Lindt", "Godiva", "See's Candies", "Haribo", "Ferrero Rocher",
    // Gifts and accessories
    "Etsy", "Amazon", "Kendra Scott", "Pandora", "Mejuri", "Fossil", "Ray-Ban", "Kate Spade", "Coach", "Fjällräven",
    "Herschel", "Away", "Anthropologie Home", "Jellycat", "Squishmallows"
  ];

  SS.$ = (sel) => document.querySelector(sel);

  // ---------- Encoding: JSON -> base64url, unicode safe ----------
  SS.encode = function (obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  SS.decode = function (str) {
    let s = str.trim().replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  };

  // Full URL of another page in this site. Works on GitHub Pages subfolders
  // (https://user.github.io/repo/) and on a custom domain.
  SS.pageUrl = function (page) {
    const u = new URL(page, location.href);
    u.hash = ""; u.search = "";
    return u.href;
  };

  // ---------- Small UI helpers ----------
  SS.toast = function (msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg; t.hidden = false;
    clearTimeout(SS.toast._t);
    SS.toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  };

  SS.copy = async function (text, fallbackEl) {
    try {
      await navigator.clipboard.writeText(text);
      SS.toast("Copied");
    } catch (e) {
      if (fallbackEl) { fallbackEl.focus(); fallbackEl.select(); }
      SS.toast("Press Ctrl+C or Cmd+C to copy");
    }
  };

  SS.showErr = function (el, msg) { el.textContent = msg || ""; el.hidden = !msg; };

  SS.fmtDate = function (iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  SS.hasAnswers = (answers) =>
    Object.values(answers || {}).some((v) => typeof v === "string" && v.trim());

  // Text to show for one question, or "" if unanswered. Used on the reveal page.
  SS.answerText = function (q, answers) {
    const a = answers || {};
    const notes = (a[q.k] || "").trim();
    if (q.type !== "sizes") return notes;
    const lines = SS.SIZES.filter((s) => a[s.k]).map((s) => s.label + ": " + a[s.k]);
    if (notes) lines.push(notes);
    if (a.clothes === "yes") lines.unshift(lines.length ? "Open to getting clothes." : "Open to getting clothes, but didn't list sizes.");
    return lines.join("\n");
  };

  // The "open to clothes" checkbox plus one dropdown per size category and a notes box.
  function buildSizes(container, q, answers, idPrefix, onInput) {
    const a = answers || {};
    const set = (k, v) => { if (onInput) onInput(k, v); };

    const wrap = document.createElement("div");
    wrap.className = "sizes";
    const title = document.createElement("span");
    title.className = "sizes-title";
    title.textContent = q.label;

    const chkLab = document.createElement("label");
    chkLab.className = "check";
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.id = idPrefix + "-clothes";
    // Older codes only had free-text sizes, so treat any size info as a yes.
    chk.checked = a.clothes === "yes" || !!(a[q.k] || "").trim() || SS.SIZES.some((s) => a[s.k]);
    chkLab.append(chk, " I'm open to getting clothes");

    const body = document.createElement("div");
    body.className = "sizes-body";
    body.hidden = !chk.checked;

    const grid = document.createElement("div");
    grid.className = "sizes-grid";
    const selects = SS.SIZES.map((s) => {
      const lab = document.createElement("label");
      lab.textContent = s.label;
      const sel = document.createElement("select");
      sel.id = idPrefix + "-" + s.k;
      sel.add(new Option("Skip", ""));
      s.options.forEach((o) => {
        if (typeof o === "string") { sel.add(new Option(o, o)); return; }
        const g = document.createElement("optgroup");
        g.label = o.group;
        o.items.forEach((it) => g.appendChild(new Option(it, it)));
        sel.add(g);
      });
      // Keep a value the list doesn't know about (for example, if the options change later).
      if (a[s.k] && ![...sel.options].some((op) => op.value === a[s.k])) sel.add(new Option(a[s.k], a[s.k]));
      sel.value = a[s.k] || "";
      sel.addEventListener("change", () => set(s.k, sel.value));
      lab.appendChild(sel);
      grid.appendChild(lab);
      return { s, sel };
    });

    const notesLab = document.createElement("label");
    notesLab.textContent = "Other sizes or fit notes ";
    const sm = document.createElement("small");
    sm.textContent = "Tall, petite, loose fit, ring or bra size";
    notesLab.appendChild(sm);
    const ta = document.createElement("textarea");
    ta.id = idPrefix + "-" + q.k;
    ta.rows = 2;
    ta.value = a[q.k] || "";
    ta.addEventListener("input", () => set(q.k, ta.value));
    notesLab.appendChild(ta);

    chk.addEventListener("change", () => {
      body.hidden = !chk.checked;
      set("clothes", chk.checked ? "yes" : "");
      if (!chk.checked) {
        // Not open to clothes: drop the sizes so they don't end up in the code.
        selects.forEach(({ s, sel }) => { sel.value = ""; set(s.k, ""); });
        ta.value = ""; set(q.k, "");
      }
    });

    body.append(grid, notesLab);
    wrap.append(title, chkLab, body);
    container.appendChild(wrap);
  }

  // Text box with suggestions; tapping one (or pressing Enter) adds a removable chip.
  // Stored as a comma-separated string so codes and the reveal page stay plain text.
  SS.splitTags = (str) => (str || "").split(/[,\n]/).map((t) => t.trim()).filter(Boolean);

  function buildTags(container, q, answers, idPrefix, onInput) {
    const tags = SS.splitTags(answers && answers[q.k]);
    const has = (t) => tags.some((x) => x.toLowerCase() === t.toLowerCase());
    const save = () => { if (onInput) onInput(q.k, tags.join(", ")); };

    const wrap = document.createElement("div");
    wrap.className = "tags";
    const lab = document.createElement("label");
    lab.htmlFor = idPrefix + "-" + q.k;
    lab.textContent = q.label + " ";
    if (q.hint) { const sm = document.createElement("small"); sm.textContent = q.hint; lab.appendChild(sm); }

    const chips = document.createElement("ul");
    chips.className = "chips";
    chips.setAttribute("aria-label", q.label);

    const box = document.createElement("div");
    box.className = "tags-box";
    const input = document.createElement("input");
    input.type = "text";
    input.id = idPrefix + "-" + q.k;
    input.autocomplete = "off";
    input.placeholder = q.placeholder || "";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    const list = document.createElement("ul");
    list.className = "suggest";
    list.id = input.id + "-list";
    list.setAttribute("role", "listbox");
    list.hidden = true;
    input.setAttribute("aria-controls", list.id);
    box.append(input, list);

    let items = [];   // current suggestions (strings)
    let active = -1;  // highlighted suggestion index

    function renderChips() {
      chips.innerHTML = "";
      tags.forEach((t, i) => {
        const li = document.createElement("li");
        li.className = "chip";
        li.append(t);
        const x = document.createElement("button");
        x.type = "button";
        x.className = "chip-x";
        x.textContent = "×";
        x.setAttribute("aria-label", "Remove " + t);
        x.addEventListener("click", () => { tags.splice(i, 1); save(); renderChips(); input.focus(); });
        li.appendChild(x);
        chips.appendChild(li);
      });
      chips.hidden = !tags.length;
    }

    function close() {
      list.hidden = true; active = -1;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    }

    function setActive(i) {
      active = i;
      [...list.children].forEach((li, j) => li.setAttribute("aria-selected", j === i ? "true" : "false"));
      if (i >= 0) input.setAttribute("aria-activedescendant", list.id + "-" + i);
      else input.removeAttribute("aria-activedescendant");
    }

    function suggest() {
      const term = input.value.trim().toLowerCase();
      if (!term) { close(); return; }
      const pool = (SS[q.suggest] || []).filter((s) => !has(s));
      const starts = pool.filter((s) => s.toLowerCase().split(/[\s-]+/).some((w) => w.startsWith(term)) || s.toLowerCase().startsWith(term));
      const contains = pool.filter((s) => !starts.includes(s) && s.toLowerCase().includes(term));
      items = starts.concat(contains).slice(0, 6);
      const typed = input.value.trim().replace(/,+$/, "");
      const exact = items.some((s) => s.toLowerCase() === term);
      if (!exact && !has(typed)) items.push(typed);  // last row: add what they typed

      list.innerHTML = "";
      items.forEach((s, i) => {
        const li = document.createElement("li");
        li.id = list.id + "-" + i;
        li.setAttribute("role", "option");
        li.textContent = (i === items.length - 1 && !exact && s === typed) ? "Add \u201c" + s + "\u201d" : s;
        // pointerdown + preventDefault keeps focus in the input so the keyboard stays open on phones.
        li.addEventListener("pointerdown", (e) => e.preventDefault());
        li.addEventListener("click", () => add(s));
        list.appendChild(li);
      });
      list.hidden = !items.length;
      input.setAttribute("aria-expanded", String(!list.hidden));
      setActive(items.length ? 0 : -1);
    }

    function add(t) {
      t = t.trim();
      if (t && !has(t)) { tags.push(t); save(); renderChips(); }
      input.value = "";
      close();
      input.focus();
    }

    input.addEventListener("input", () => {
      // Typing a comma finishes the current entry.
      if (input.value.includes(",")) { SS.splitTags(input.value).forEach((t) => { if (!has(t)) tags.push(t); }); save(); renderChips(); input.value = ""; close(); return; }
      suggest();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && items.length && !list.hidden) { e.preventDefault(); setActive((active + 1) % items.length); }
      else if (e.key === "ArrowUp" && items.length && !list.hidden) { e.preventDefault(); setActive((active - 1 + items.length) % items.length); }
      else if (e.key === "Enter") {
        e.preventDefault();
        if (!list.hidden && active >= 0) add(items[active]);
        else if (input.value.trim()) add(input.value);
      }
      else if (e.key === "Escape") close();
      else if (e.key === "Backspace" && !input.value && tags.length) { tags.pop(); save(); renderChips(); }
    });
    input.addEventListener("blur", close);

    renderChips();
    wrap.append(lab, chips, box);
    container.appendChild(wrap);
  }

  // Builds one labeled field per question inside `container`.
  // onInput(key, value) fires on every change; the sizes question uses several keys.
  SS.buildFields = function (container, answers, idPrefix, onInput) {
    container.innerHTML = "";
    SS.QUESTIONS.forEach((q) => {
      if (q.type === "sizes") { buildSizes(container, q, answers, idPrefix, onInput); return; }
      if (q.type === "tags") { buildTags(container, q, answers, idPrefix, onInput); return; }
      const lab = document.createElement("label");
      lab.textContent = q.label + " ";
      if (q.hint) {
        const sm = document.createElement("small");
        sm.textContent = q.hint;
        lab.appendChild(sm);
      }
      const ta = document.createElement("textarea");
      ta.id = idPrefix + "-" + q.k;
      ta.rows = 2;
      ta.value = (answers && answers[q.k]) || "";
      if (onInput) ta.addEventListener("input", () => onInput(q.k, ta.value));
      lab.appendChild(ta);
      container.appendChild(lab);
    });
  };
})(typeof window !== "undefined" ? window : globalThis);
