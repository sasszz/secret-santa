// Wishlist page: a participant fills out the questions and gets a code for the organizer.
(function () {
  "use strict";
  const { $ } = SS;
  const answers = {};

  SS.buildFields($("#wish-fields"), answers, "wish", (k, v) => { answers[k] = v; });

  $("#wish-make").addEventListener("click", () => {
    const name = $("#wish-name").value.trim();
    if (!name) {
      SS.showErr($("#wish-error"), "Add your name so the organizer knows it's you.");
      $("#wish-name").focus();
      return;
    }
    SS.showErr($("#wish-error"), "");
    const code = "SS1:" + SS.encode({ t: "q", n: name, a: answers });
    $("#wish-code").value = code;

    // Pre-filled email and text messages. The person picks the organizer as the recipient.
    const msg = `Hi! Here's my Secret Santa wishlist code.\n\n${code}`;
    $("#wish-email").href = "mailto:?subject=" + encodeURIComponent(`Secret Santa wishlist from ${name}`) +
      "&body=" + encodeURIComponent(msg);
    // "sms:?&body=" works on both iPhone and Android.
    $("#wish-text").href = "sms:?&body=" + encodeURIComponent(msg);
    $("#wish-form").hidden = true;
    $("#wish-result").hidden = false;
    $("#wish-result").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Go back to the form. Answers are kept; clicking "Create my code" again makes a fresh code.
  $("#wish-edit").addEventListener("click", () => {
    $("#wish-result").hidden = true;
    $("#wish-form").hidden = false;
    $("#wish-form").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#wish-copy").addEventListener("click", () => SS.copy($("#wish-code").value, $("#wish-code")));
})();
