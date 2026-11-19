// The matching logic. No DOM code here, so it can be tested on its own.
(function (root) {
  "use strict";
  const SS = root.SS || (root.SS = {});

  // Fisher-Yates shuffle using the browser's secure random numbers.
  SS.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // people:  [{ id, ... }]
  // rules:   [{ a, b, both }]  meaning a can't draw b (and b can't draw a if both)
  // noSwaps: if true, two people never draw each other
  // Returns { giverId: receiverId }, or null when no valid draw exists.
  SS.runDraw = function (people, rules, noSwaps) {
    const ids = people.map((p) => p.id);
    const banned = new Map(ids.map((id) => [id, new Set([id])]));
    rules.forEach((r) => {
      if (banned.has(r.a)) banned.get(r.a).add(r.b);
      if (r.both && banned.has(r.b)) banned.get(r.b).add(r.a);
    });

    // Place the most restricted people first, random among ties.
    const order = SS.shuffle(ids).sort((x, y) => banned.get(y).size - banned.get(x).size);
    const assign = {};
    const used = new Set();
    let steps = 0;

    function place(i) {
      if (i === order.length) return true;
      if (++steps > 300000) return false; // give up on huge impossible cases
      const giver = order[i];
      for (const r of SS.shuffle(ids)) {
        if (used.has(r) || banned.get(giver).has(r)) continue;
        if (noSwaps && ids.length > 2 && assign[r] === giver) continue;
        assign[giver] = r; used.add(r);
        if (place(i + 1)) return true;
        delete assign[giver]; used.delete(r);
      }
      return false;
    }
    return place(0) ? assign : null;
  };
})(typeof window !== "undefined" ? window : globalThis);
