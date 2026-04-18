(function () {
  "use strict";

  var toastEl = document.getElementById("toast");
  var toastTimer;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2200);
  }

  function copyText(text, feedbackEl) {
    function done(ok) {
      if (feedbackEl) {
        feedbackEl.textContent = ok ? "Copied." : "";
      }
      if (ok) showToast("Copied to clipboard");
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true);
        },
        function () {
          fallbackCopy(text, feedbackEl);
        }
      );
      return;
    }
    fallbackCopy(text, feedbackEl);
  }

  function fallbackCopy(text, feedbackEl) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        if (feedbackEl) feedbackEl.textContent = "Copied.";
        showToast("Copied to clipboard");
      } else {
        window.prompt("Copy this text:", text);
        if (feedbackEl) feedbackEl.textContent = "";
      }
    } catch (e) {
      window.prompt("Copy this text:", text);
      if (feedbackEl) feedbackEl.textContent = "";
    }
  }

  function getTextFromSelector(selector) {
    var el = document.querySelector(selector);
    return el ? el.textContent.trim() : "";
  }

  /* Hero donation panel */
  var btnDonateHero = document.getElementById("btn-donate-hero");
  var donationPanel = document.getElementById("donation-panel");

  if (btnDonateHero && donationPanel) {
    btnDonateHero.addEventListener("click", function () {
      var expanded = btnDonateHero.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      btnDonateHero.setAttribute("aria-expanded", next ? "true" : "false");
      donationPanel.hidden = !next;
    });
  }

  /* Copy buttons */
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-copy-target");
      var text = getTextFromSelector(sel);
      var fid = btn.getAttribute("data-copy-feedback");
      var feedbackEl = fid ? document.getElementById(fid) : null;
      if (text) copyText(text, feedbackEl);
    });
  });

  var copyLinkBtn = document.getElementById("copy-link");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      var url = window.location.href;
      var fid = copyLinkBtn.getAttribute("data-copy-feedback");
      var feedbackEl = fid ? document.getElementById(fid) : null;
      copyText(url, feedbackEl);
    });
  }

  /* WhatsApp share — set href so link works on first click and when opened in a new tab */
  var waBtn = document.getElementById("whatsapp-share");
  function setWhatsAppHref() {
    if (!waBtn) return;
    var url = window.location.href;
    var title = document.title || "Help Sankalp";
    var msg =
      "Please consider supporting Sankalp’s treatment. Read his story and donate via UPI here: " +
      url +
      " — " +
      title;
    waBtn.setAttribute("href", "https://wa.me/?text=" + encodeURIComponent(msg));
  }
  setWhatsAppHref();
  window.addEventListener("hashchange", setWhatsAppHref);

  /* FAQ accordion — independent panels */
  document.querySelectorAll(".faq__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      var panelId = trigger.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      var next = !expanded;
      trigger.setAttribute("aria-expanded", next ? "true" : "false");
      panel.hidden = !next;
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".faq__trigger[aria-expanded='true']").forEach(function (t) {
      var panelId = t.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (panel && document.activeElement === t) {
        t.setAttribute("aria-expanded", "false");
        panel.hidden = true;
      }
    });
    if (btnDonateHero && document.activeElement === btnDonateHero && donationPanel && !donationPanel.hidden) {
      btnDonateHero.setAttribute("aria-expanded", "false");
      donationPanel.hidden = true;
    }
  });
  /* ── Language toggle ── */

  var TRANSLATIONS = {
    en: {
      "skip-link": "Skip to content",
      "header-eyebrow": "For everyone who has asked how to help",
      "hero-h1": "Help Sankalp get back to his life",
      "hero-lede": "Sankalp is 17. He is undergoing cancer treatment. We are his family, and we are asking for your support so he can focus on getting well \u2014 not on whether we can afford the next cycle of care.",
      "btn-donate": "Donate via UPI",
      "donation-panel-label": "UPI ID \u2014 tap to copy",
      "copy-btn": "Copy",
      "qr-note": "Scan with any UPI app",
      "donation-trust": "100% of your donation goes directly to <strong>Shipra Srivastava (Dolly)</strong>. No platform fees.",
      "story-heading": "His story",
      "story-p1": "Before all of this, Sankalp was a regular teenager \u2014 school, friends, plans for the future. He laughed easily. He showed up for people. That is the boy we still see, even on the hard days.",
      "story-p2": "When we learned how serious his illness was, our world narrowed to hospitals, tests, and waiting rooms. The words do not matter as much as this: he needs ongoing treatment, and it costs more than any family should have to carry alone.",
      "story-p3": "Today we are taking it one step at a time \u2014 treatment schedules, good days and rough days, and the hope that with the right support he can get back to the life that was interrupted.",
      "story-p4": "If you are here, thank you. Whether you can give a little or a lot, share this page, or simply hold us in your thoughts \u2014 it means more than we can say.",
      "timeline-heading": "Moments along the way",
      "timeline-intro": "A few photos with simple captions \u2014 the human arc, not a polished campaign.",
      "timeline-cap-1": "Before surgery \u2014 school and friends",
      "timeline-cap-2": "Smiling with his family",
      "timeline-cap-3": "During treatment \u2014 we are still here",
      "costs-heading": "What the money goes toward",
      "costs-intro": "Every rupee has a purpose. Here is exactly where the money goes.",
      "cost-1": "Chemotherapy cycles",
      "cost-2": "Hospital stays and procedures",
      "cost-3": "Travel to and from the hospital",
      "cost-4": "Daily care at home",
      "cost-5": "Medication and follow-up",
      "donate-heading": "How to donate",
      "donate-intro": "Use any UPI app (PhonePe, Google Pay, Paytm, BHIM, your bank app). Your money goes straight to his mother\u2019s account.",
      "upi-label": "UPI ID",
      "copy-upi-btn": "Copy UPI ID",
      "donate-trust": "100% of your donation goes directly to <strong>Shipra Srivastava (Dolly)</strong>. No platform fees.",
      "whatsapp-btn": "Share on WhatsApp",
      "copy-link-btn": "Copy page link",
      "updates-heading": "Updates",
      "updates-intro": "Newest first. We will add a short note here when something changes.",
      "update-1-date": "17 April 2026",
      "update-1-title": "We\u2019ve launched \u2014 help us help Sankalp",
      "update-1-text": "This page is live. Sankalp is under care; we will post short updates here so everyone who is rooting for him can hear directly from us. Thank you for being here.",
      "family-heading": "The family behind this",
      "family-intro": "Real people, with names and faces, standing behind every word on this page.",
      "family-1-relation": "His mother",
      "family-1-note": "Managing all of Sankalp\u2019s day-to-day care and treatment. The heart of everything on this page.",
      "family-2-relation": "His brother",
      "family-2-note": "Coordinating this fundraiser and staying close to Sankalp through every step of treatment.",
      "family-3-relation": "Family \u2014 built this page",
      "family-3-note": "Put this page together so Sankalp\u2019s story could reach the people who know and love him.",
      "family-4-relation": "Family",
      "family-4-note": "Supporting the family through treatment, travel, and the long months ahead.",
      "family-5-relation": "Family",
      "family-5-note": "Here for Sankalp and the whole family through every stage of his recovery.",
      "faq-heading": "Questions you might have",
      "faq-q-1": "How do I know my money reaches Sankalp?",
      "faq-a-1": "Donations go by UPI directly to <strong>Shipra Srivastava (Dolly)</strong> \u2014 the same account his care is paid from. There is no platform or middleman taking a cut.",
      "faq-q-2": "Can I donate a small amount?",
      "faq-a-2": "Yes. Every rupee matters. There is no minimum. If many people give what they can, it adds up.",
      "faq-q-3": "What is the money specifically used for?",
      "faq-a-3": "Funds go toward treatment and everything that surrounds it \u2014 hospital care, chemo cycles, travel, medication, and daily support at home. See the <a href=\"#costs\">breakdown above</a> for how we think about costs.",
      "faq-q-4": "Will I get an update on how he is doing?",
      "faq-a-4": "We will keep the <a href=\"#updates\">Updates</a> section on this page whenever there is news we can share. Thank you for caring enough to ask.",
      "faq-q-5": "Can I visit or send something?",
      "faq-a-5": "We are grateful. Right now we are juggling treatment schedules and rest. Please message us first using the contact in the footer so we can suggest what helps without overwhelming him or the home.",
      "faq-q-6": "What if the goal is exceeded?",
      "faq-a-6": "If we reach the amount we had planned for, we will say so clearly on this website and explain what comes next \u2014 whether that is further treatment, follow-up care, or supporting his recovery.",
      "faq-q-7": "Is this tax deductible?",
      "faq-a-7": "Probably not. This is a direct UPI transfer to an individual for medical care, not a registered charity receipt. If you need documentation for your own records, contact us and we will help where we can.",
      "footer-contact": "Questions about this page or verifying details: <a href=\"mailto:family@example.com\">family@example.com</a> \u2014 replace with a working family email or phone.",
      "footer-back": "Back to top"
    },
    hi: {
      "skip-link": "\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u092a\u0930 \u091c\u093e\u090f\u0901",
      "header-eyebrow": "\u0909\u0928 \u0938\u092d\u0940 \u0915\u0947 \u0932\u093f\u090f \u091c\u093f\u0928\u094d\u0939\u094b\u0902\u0928\u0947 \u092e\u0926\u0926 \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u092a\u0942\u091b\u093e",
      "hero-h1": "\u0938\u0902\u0915\u0932\u094d\u092a \u0915\u094b \u0909\u0938\u0915\u0940 \u091c\u093c\u093f\u0902\u0926\u0917\u0940 \u092e\u0947\u0902 \u0935\u093e\u092a\u0938 \u0932\u093e\u0928\u0947 \u092e\u0947\u0902 \u092e\u0926\u0926 \u0915\u0930\u0947\u0902",
      "hero-lede": "\u0938\u0902\u0915\u0932\u094d\u092a 17 \u0938\u093e\u0932 \u0915\u093e \u0939\u0948\u0964 \u0935\u0939 \u0915\u0948\u0902\u0938\u0930 \u0915\u093e \u0907\u0932\u093e\u091c \u0915\u0930\u0935\u093e \u0930\u0939\u093e \u0939\u0948\u0964 \u0939\u092e \u0909\u0938\u0915\u093e \u092a\u0930\u093f\u0935\u093e\u0930 \u0939\u0948\u0902, \u0914\u0930 \u0939\u092e \u0906\u092a\u0938\u0947 \u092e\u0926\u0926 \u092e\u093e\u0901\u0917 \u0930\u0939\u0947 \u0939\u0948\u0902 \u0924\u093e\u0915\u093f \u0935\u0939 \u0920\u0940\u0915 \u0939\u094b\u0928\u0947 \u092a\u0930 \u0927\u094d\u092f\u093e\u0928 \u0926\u0947 \u0938\u0915\u0947 \u2014 \u0928 \u0915\u093f \u0907\u0938 \u092c\u093e\u0924 \u092a\u0930 \u0915\u093f \u0939\u092e \u0905\u0917\u0932\u0947 \u0907\u0932\u093e\u091c \u0915\u093e \u0916\u0930\u094d\u091a \u0909\u0920\u093e \u092a\u093e\u090f\u0902\u0917\u0947 \u092f\u093e \u0928\u0939\u0940\u0902\u0964",
      "btn-donate": "UPI \u0938\u0947 \u0926\u093e\u0928 \u0915\u0930\u0947\u0902",
      "donation-panel-label": "UPI ID \u2014 \u0915\u0949\u092a\u0940 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u091f\u0948\u092a \u0915\u0930\u0947\u0902",
      "copy-btn": "\u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902",
      "qr-note": "\u0915\u093f\u0938\u0940 \u092d\u0940 UPI \u090f\u092a \u0938\u0947 \u0938\u094d\u0915\u0948\u0928 \u0915\u0930\u0947\u0902",
      "donation-trust": "\u0906\u092a\u0915\u093e 100% \u0926\u093e\u0928 \u0938\u0940\u0927\u0947 <strong>Shipra Srivastava (Dolly)</strong> \u0924\u0915 \u091c\u093e\u0924\u093e \u0939\u0948\u0964 \u0915\u094b\u0908 \u092a\u094d\u0932\u0947\u091f\u092b\u093c\u0949\u0930\u094d\u092e \u0936\u0941\u0932\u094d\u0915 \u0928\u0939\u0940\u0902\u0964",
      "story-heading": "\u0909\u0938\u0915\u0940 \u0915\u0939\u093e\u0928\u0940",
      "story-p1": "\u092f\u0939 \u0938\u092c \u0939\u094b\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947, \u0938\u0902\u0915\u0932\u094d\u092a \u090f\u0915 \u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0915\u093f\u0936\u094b\u0930 \u0925\u093e \u2014 \u0938\u094d\u0915\u0942\u0932, \u0926\u094b\u0938\u094d\u0924, \u092d\u0935\u093f\u0937\u094d\u092f \u0915\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0901\u0964 \u0935\u0939 \u0906\u0938\u093e\u0928\u0940 \u0938\u0947 \u0939\u0901\u0938\u0924\u093e \u0925\u093e\u0964 \u0935\u0939 \u0932\u094b\u0917\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u092e\u094c\u091c\u0942\u0926 \u0930\u0939\u0924\u093e \u0925\u093e\u0964 \u092f\u0939\u0940 \u0935\u0939 \u0932\u0921\u093c\u0915\u093e \u0939\u0948 \u091c\u093f\u0938\u0947 \u0939\u092e \u0906\u091c \u092d\u0940 \u0926\u0947\u0916\u0924\u0947 \u0939\u0948\u0902, \u092e\u0941\u0936\u094d\u0915\u093f\u0932 \u0926\u093f\u0928\u094b\u0902 \u092e\u0947\u0902 \u092d\u0940\u0964",
      "story-p2": "\u091c\u092c \u0939\u092e\u0947\u0902 \u0909\u0938\u0915\u0940 \u092c\u0940\u092e\u093e\u0930\u0940 \u0915\u0940 \u0917\u0902\u092d\u0940\u0930\u0924\u093e \u0915\u093e \u092a\u0924\u093e \u091a\u0932\u093e, \u0924\u094b \u0939\u092e\u093e\u0930\u0940 \u0926\u0941\u0928\u093f\u092f\u093e \u0905\u0938\u094d\u092a\u0924\u093e\u0932\u094b\u0902, \u091c\u093e\u0901\u091a\u094b\u0902 \u0914\u0930 \u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u093e \u0915\u0915\u094d\u0937\u094b\u0902 \u0924\u0915 \u0938\u093f\u092e\u091f \u0917\u0908\u0964 \u0936\u092c\u094d\u0926\u094b\u0902 \u0938\u0947 \u091c\u093c\u094d\u092f\u093e\u0926\u093e \u092f\u0939 \u092c\u093e\u0924 \u092e\u093e\u092f\u0928\u0947 \u0930\u0916\u0924\u0940 \u0939\u0948: \u0909\u0938\u0947 \u0932\u0917\u093e\u0924\u093e\u0930 \u0907\u0932\u093e\u091c \u0915\u0940 \u091c\u093c\u0930\u0942\u0930\u0924 \u0939\u0948, \u0914\u0930 \u092f\u0939 \u0916\u0930\u094d\u091a \u0915\u093f\u0938\u0940 \u092d\u0940 \u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u0947 \u0932\u093f\u090f \u0905\u0915\u0947\u0932\u0947 \u0909\u0920\u093e\u0928\u0947 \u0938\u0947 \u0915\u0939\u0940\u0902 \u091c\u093c\u094d\u092f\u093e\u0926\u093e \u0939\u0948\u0964",
      "story-p3": "\u0906\u091c \u0939\u092e \u090f\u0915-\u090f\u0915 \u0915\u0926\u092e \u0906\u0917\u0947 \u092c\u0922\u093c \u0930\u0939\u0947 \u0939\u0948\u0902 \u2014 \u0907\u0932\u093e\u091c \u0915\u093e \u0936\u0947\u0921\u093c\u094d\u092f\u0942\u0932, \u0905\u091a\u094d\u091b\u0947 \u0914\u0930 \u092e\u0941\u0936\u094d\u0915\u093f\u0932 \u0926\u093f\u0928, \u0914\u0930 \u092f\u0939 \u0909\u092e\u094d\u092e\u0940\u0926 \u0915\u093f \u0938\u0939\u0940 \u0938\u0939\u092f\u094b\u0917 \u0938\u0947 \u0935\u0939 \u0909\u0938 \u091c\u0940\u0935\u0928 \u092e\u0947\u0902 \u0935\u093e\u092a\u0938 \u0932\u094c\u091f \u0938\u0915\u0947 \u091c\u094b \u092c\u0940\u091a \u092e\u0947\u0902 \u0930\u0941\u0915 \u0917\u092f\u093e \u0925\u093e\u0964",
      "story-p4": "\u0905\u0917\u0930 \u0906\u092a \u092f\u0939\u093e\u0901 \u0939\u0948\u0902, \u0924\u094b \u0936\u0941\u0915\u094d\u0930\u093f\u092f\u093e\u0964 \u091a\u093e\u0939\u0947 \u0906\u092a \u0925\u094b\u0921\u093c\u093e \u0926\u0947 \u0938\u0915\u0947\u0902 \u092f\u093e \u092c\u0939\u0941\u0924, \u092f\u0939 \u092a\u0947\u091c \u0936\u0947\u092f\u0930 \u0915\u0930\u0947\u0902, \u092f\u093e \u0938\u093f\u0930\u094d\u092b\u093c \u0939\u092e\u0947\u0902 \u0905\u092a\u0928\u0940 \u0926\u0941\u0906\u0913\u0902 \u092e\u0947\u0902 \u092f\u093e\u0926 \u0930\u0916\u0947\u0902 \u2014 \u092f\u0939 \u0939\u092e\u093e\u0930\u0947 \u0932\u093f\u090f \u092c\u0947\u0939\u0926 \u092e\u093e\u092f\u0928\u0947 \u0930\u0916\u0924\u093e \u0939\u0948\u0964",
      "timeline-heading": "\u0930\u093e\u0938\u094d\u0924\u0947 \u0915\u0947 \u0915\u0941\u091b \u092a\u0932",
      "timeline-intro": "\u0915\u0941\u091b \u0924\u0938\u094d\u0935\u0940\u0930\u0947\u0902 \u0938\u0930\u0932 \u0915\u0948\u092a\u094d\u0936\u0928 \u0915\u0947 \u0938\u093e\u0925 \u2014 \u090f\u0915 \u0907\u0902\u0938\u093e\u0928 \u0915\u0940 \u0915\u0939\u093e\u0928\u0940, \u0915\u094b\u0908 \u091a\u092e\u0915\u0926\u093e\u0930 \u0905\u092d\u093f\u092f\u093e\u0928 \u0928\u0939\u0940\u0902\u0964",
      "timeline-cap-1": "\u0938\u0930\u094d\u091c\u0930\u0940 \u0938\u0947 \u092a\u0939\u0932\u0947 \u2014 \u0938\u094d\u0915\u0942\u0932 \u0914\u0930 \u0926\u094b\u0938\u094d\u0924",
      "timeline-cap-2": "परिवार के साथ मुस्कुराते हुए",
      "timeline-cap-3": "\u0907\u0932\u093e\u091c \u0915\u0947 \u0926\u094c\u0930\u093e\u0928 \u2014 \u0939\u092e \u0905\u092d\u0940 \u092d\u0940 \u092f\u0939\u093e\u0901 \u0939\u0948\u0902",
      "costs-heading": "\u092a\u0948\u0938\u0947 \u0915\u093f\u0938 \u0915\u093e\u092e \u0906\u090f\u0902\u0917\u0947",
      "costs-intro": "\u0938\u091a\u094d\u091a\u0947 \u0906\u0902\u0915\u0921\u093c\u0947 \u0906\u092a\u0915\u093e \u092d\u0930\u094b\u0938\u093e \u092c\u0928\u093e\u0924\u0947 \u0939\u0948\u0902\u0964 \u091c\u0948\u0938\u0947-\u091c\u0948\u0938\u0947 \u0939\u092e\u0947\u0902 \u0914\u0930 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u092e\u093f\u0932\u0947\u0917\u0940, \u0939\u092e \u0930\u093e\u0936\u093f \u0905\u092a\u0921\u0947\u091f \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
      "cost-1": "\u0915\u0940\u092e\u094b\u0925\u0947\u0930\u0947\u092a\u0940 \u0915\u0947 \u091a\u0915\u094d\u0930",
      "cost-2": "\u0905\u0938\u094d\u092a\u0924\u093e\u0932 \u092e\u0947\u0902 \u092d\u0930\u094d\u0924\u0940 \u0914\u0930 \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e\u090f\u0901",
      "cost-3": "\u0905\u0938\u094d\u092a\u0924\u093e\u0932 \u0906\u0928\u093e-\u091c\u093e\u0928\u093e",
      "cost-4": "\u0918\u0930 \u092a\u0930 \u0926\u0948\u0928\u093f\u0915 \u0926\u0947\u0916\u092d\u093e\u0932",
      "cost-5": "\u0926\u0935\u093e\u0907\u092f\u093e\u0901 \u0914\u0930 \u092b\u093c\u0949\u0932\u094b-\u0905\u092a",
      "donate-heading": "\u0926\u093e\u0928 \u0915\u0948\u0938\u0947 \u0915\u0930\u0947\u0902",
      "donate-intro": "\u0915\u094b\u0908 \u092d\u0940 UPI \u090f\u092a \u0907\u0938\u094d\u0924\u0947\u092e\u093e\u0932 \u0915\u0930\u0947\u0902 (PhonePe, Google Pay, Paytm, BHIM, \u0906\u092a\u0915\u093e \u092c\u0948\u0902\u0915 \u090f\u092a)\u0964 \u0906\u092a\u0915\u093e \u092a\u0948\u0938\u093e \u0938\u0940\u0927\u0947 \u0909\u0928\u0915\u0940 \u092e\u093e\u0901 \u0915\u0947 \u0916\u093e\u0924\u0947 \u092e\u0947\u0902 \u091c\u093e\u090f\u0917\u093e\u0964",
      "upi-label": "UPI ID",
      "copy-upi-btn": "UPI ID \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902",
      "donate-trust": "\u0906\u092a\u0915\u093e 100% \u0926\u093e\u0928 \u0938\u0940\u0927\u0947 <strong>Shipra Srivastava (Dolly)</strong> \u0924\u0915 \u091c\u093e\u0924\u093e \u0939\u0948\u0964 \u0915\u094b\u0908 \u092a\u094d\u0932\u0947\u091f\u092b\u093c\u0949\u0930\u094d\u092e \u0936\u0941\u0932\u094d\u0915 \u0928\u0939\u0940\u0902\u0964",
      "whatsapp-btn": "WhatsApp \u092a\u0930 \u0936\u0947\u092f\u0930 \u0915\u0930\u0947\u0902",
      "copy-link-btn": "\u092a\u0947\u091c \u0932\u093f\u0902\u0915 \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902",
      "updates-heading": "\u0905\u092a\u0921\u0947\u091f",
      "updates-intro": "\u0938\u092c\u0938\u0947 \u0928\u092f\u093e \u092a\u0939\u0932\u0947\u0964 \u091c\u092c \u092d\u0940 \u0915\u0941\u091b \u092c\u0926\u0932\u0947\u0917\u093e, \u0939\u092e \u092f\u0939\u093e\u0901 \u090f\u0915 \u091b\u094b\u091f\u0940 \u0938\u0940 \u0938\u0942\u091a\u0928\u093e \u0926\u0947\u0902\u0917\u0947\u0964",
      "update-1-date": "17 \u0905\u092a\u094d\u0930\u0948\u0932 2026",
      "update-1-title": "\u0939\u092e\u0928\u0947 \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0940 \u2014 \u0938\u0902\u0915\u0932\u094d\u092a \u0915\u0940 \u092e\u0926\u0926 \u0915\u0930\u0928\u0947 \u092e\u0947\u0902 \u0938\u093e\u0925 \u0926\u0947\u0902",
      "update-1-text": "\u092f\u0939 \u092a\u0947\u091c \u0932\u093e\u0907\u0935 \u0939\u0948\u0964 \u0938\u0902\u0915\u0932\u094d\u092a \u0907\u0932\u093e\u091c \u092e\u0947\u0902 \u0939\u0948; \u0939\u092e \u092f\u0939\u093e\u0901 \u091b\u094b\u091f\u0947-\u091b\u094b\u091f\u0947 \u0905\u092a\u0921\u0947\u091f \u092a\u094b\u0938\u094d\u091f \u0915\u0930\u0947\u0902\u0917\u0947 \u0924\u093e\u0915\u093f \u0909\u0938\u0915\u0947 \u0932\u093f\u090f \u0926\u0941\u0906 \u0915\u0930\u0928\u0947 \u0935\u093e\u0932\u0947 \u0938\u092d\u0940 \u0932\u094b\u0917 \u0938\u0940\u0927\u0947 \u0939\u092e\u0938\u0947 \u0938\u0941\u0928 \u0938\u0915\u0947\u0902\u0964 \u092f\u0939\u093e\u0901 \u0906\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0936\u0941\u0915\u094d\u0930\u093f\u092f\u093e\u0964",
      "family-heading": "\u0907\u0938 \u092a\u0947\u091c \u0915\u0947 \u092a\u0940\u091b\u0947 \u0915\u093e \u092a\u0930\u093f\u0935\u093e\u0930",
      "family-intro": "\u0905\u0938\u0932\u0940 \u0932\u094b\u0917, \u0928\u093e\u092e \u0914\u0930 \u091a\u0947\u0939\u0930\u0947 \u0915\u0947 \u0938\u093e\u0925, \u0907\u0938 \u092a\u0947\u091c \u0915\u0947 \u0939\u0930 \u0936\u092c\u094d\u0926 \u0915\u0947 \u092a\u0940\u091b\u0947 \u0916\u0921\u093c\u0947 \u0939\u0948\u0902\u0964",
      "family-1-relation": "\u0909\u0928\u0915\u0940 \u092e\u093e\u0901",
      "family-1-note": "\u0938\u0902\u0915\u0932\u094d\u092a \u0915\u0940 \u0930\u094b\u091c\u093c\u092e\u0930\u094d\u0930\u093e \u0915\u0940 \u0926\u0947\u0916\u092d\u093e\u0932 \u0914\u0930 \u0907\u0932\u093e\u091c \u0938\u0902\u092d\u093e\u0932 \u0930\u0939\u0940 \u0939\u0948\u0902\u0964 \u0907\u0938 \u092a\u0947\u091c \u0915\u0940 \u0906\u0924\u094d\u092e\u093e\u0964",
      "family-2-relation": "\u0909\u0928\u0915\u093e \u092d\u093e\u0908",
      "family-2-note": "\u0907\u0938 \u092b\u0902\u0921\u0930\u0947\u091c\u093c\u0930 \u0915\u094b \u0938\u092e\u0928\u094d\u0935\u093f\u0924 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0907\u0932\u093e\u091c \u0915\u0947 \u0939\u0930 \u0915\u0926\u092e \u092a\u0930 \u0938\u0902\u0915\u0932\u094d\u092a \u0915\u0947 \u0938\u093e\u0925 \u0939\u0948\u0902\u0964",
      "family-3-relation": "\u092a\u0930\u093f\u0935\u093e\u0930 \u2014 \u0907\u0938 \u092a\u0947\u091c \u0915\u094b \u092c\u0928\u093e\u092f\u093e",
      "family-3-note": "\u092f\u0939 \u092a\u0947\u091c \u092c\u0928\u093e\u092f\u093e \u0924\u093e\u0915\u093f \u0938\u0902\u0915\u0932\u094d\u092a \u0915\u0940 \u0915\u0939\u093e\u0928\u0940 \u0909\u0928 \u0932\u094b\u0917\u094b\u0902 \u0924\u0915 \u092a\u0939\u0941\u0901\u091a\u0947 \u091c\u094b \u0909\u0938\u0947 \u091c\u093e\u0928\u0924\u0947 \u0914\u0930 \u092a\u094d\u092f\u093e\u0930 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
      "family-4-relation": "\u092a\u0930\u093f\u0935\u093e\u0930",
      "family-4-note": "\u0907\u0932\u093e\u091c, \u0938\u092b\u093c\u0930 \u0914\u0930 \u0906\u0928\u0947 \u0935\u093e\u0932\u0947 \u0932\u0902\u092c\u0947 \u092e\u0939\u0940\u0928\u094b\u0902 \u092e\u0947\u0902 \u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u093e \u0938\u093e\u0925 \u0926\u0947 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964",
      "family-5-relation": "\u092a\u0930\u093f\u0935\u093e\u0930",
      "family-5-note": "\u0938\u0902\u0915\u0932\u094d\u092a \u0914\u0930 \u092a\u0942\u0930\u0947 \u092a\u0930\u093f\u0935\u093e\u0930 \u0915\u0947 \u0932\u093f\u090f \u0909\u0938\u0915\u0947 \u0920\u0940\u0915 \u0939\u094b\u0928\u0947 \u0915\u0947 \u0939\u0930 \u091a\u0930\u0923 \u092e\u0947\u0902 \u092e\u094c\u091c\u0942\u0926 \u0939\u0948\u0902\u0964",
      "faq-heading": "\u0906\u092a\u0915\u0947 \u092e\u0928 \u092e\u0947\u0902 \u0939\u094b \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u092f\u0947 \u0938\u0935\u093e\u0932",
      "faq-q-1": "\u092e\u0941\u091d\u0947 \u0915\u0948\u0938\u0947 \u092a\u0924\u093e \u091a\u0932\u0947\u0917\u093e \u0915\u093f \u092e\u0947\u0930\u093e \u092a\u0948\u0938\u093e \u0938\u0902\u0915\u0932\u094d\u092a \u0924\u0915 \u092a\u0939\u0941\u0901\u091a\u093e?",
      "faq-a-1": "\u0926\u093e\u0928 UPI \u0915\u0947 \u091c\u093c\u0930\u093f\u090f \u0938\u0940\u0927\u0947 <strong>Shipra Srivastava (Dolly)</strong> \u0915\u0947 \u092a\u093e\u0938 \u091c\u093e\u0924\u093e \u0939\u0948 \u2014 \u0935\u0939\u0940 \u0916\u093e\u0924\u093e \u091c\u093f\u0938\u0938\u0947 \u0909\u0928\u0915\u093e \u0907\u0932\u093e\u091c \u0939\u094b\u0924\u093e \u0939\u0948\u0964 \u0915\u094b\u0908 \u092a\u094d\u0932\u0947\u091f\u092b\u093c\u0949\u0930\u094d\u092e \u092f\u093e \u092c\u093f\u091a\u094b\u0932\u093f\u092f\u093e \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      "faq-q-2": "\u0915\u094d\u092f\u093e \u092e\u0948\u0902 \u0925\u094b\u0921\u093c\u0940 \u0930\u093e\u0936\u093f \u0926\u093e\u0928 \u0915\u0930 \u0938\u0915\u0924\u093e/\u0938\u0915\u0924\u0940 \u0939\u0942\u0901?",
      "faq-a-2": "\u0939\u093e\u0901\u0964 \u0939\u0930 \u0930\u0941\u092a\u092f\u093e \u092e\u093e\u092f\u0928\u0947 \u0930\u0916\u0924\u093e \u0939\u0948\u0964 \u0915\u094b\u0908 \u0928\u094d\u092f\u0942\u0928\u0924\u092e \u0930\u093e\u0936\u093f \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0905\u0917\u0930 \u092c\u0939\u0941\u0924 \u0938\u0947 \u0932\u094b\u0917 \u091c\u093f\u0924\u0928\u093e \u0926\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902 \u0926\u0947\u0902\u0917\u0947, \u0924\u094b \u092f\u0939 \u092c\u0921\u093c\u0940 \u092e\u0926\u0926 \u092c\u0928 \u091c\u093e\u0924\u0940 \u0939\u0948\u0964",
      "faq-q-3": "\u092a\u0948\u0938\u0947 \u0915\u093e \u0907\u0938\u094d\u0924\u0947\u092e\u093e\u0932 \u0915\u093f\u0938 \u0915\u093e\u092e \u0915\u0947 \u0932\u093f\u090f \u0939\u094b\u0917\u093e?",
      "faq-a-3": "\u0930\u093e\u0936\u093f \u0907\u0932\u093e\u091c \u0914\u0930 \u0909\u0938\u0938\u0947 \u091c\u0941\u0921\u093c\u0940 \u0939\u0930 \u091a\u0940\u091c\u093c \u092a\u0930 \u0916\u0930\u094d\u091a \u0939\u094b\u0917\u0940 \u2014 \u0905\u0938\u094d\u092a\u0924\u093e\u0932 \u0915\u0940 \u0926\u0947\u0916\u092d\u093e\u0932, \u0915\u0940\u092e\u094b \u0915\u0947 \u091a\u0915\u094d\u0930, \u0938\u092b\u093c\u0930, \u0926\u0935\u093e\u0907\u092f\u093e\u0901, \u0914\u0930 \u0918\u0930 \u092a\u0930 \u0926\u0948\u0928\u093f\u0915 \u0938\u0939\u093e\u092f\u0924\u093e\u0964 \u0916\u0930\u094d\u091a \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u0939\u092e\u093e\u0930\u0940 \u0938\u094b\u091a \u0915\u0947 \u0932\u093f\u090f <a href=\"#costs\">\u0909\u092a\u0930 \u0926\u093f\u092f\u093e \u0935\u093f\u0935\u0930\u0923</a> \u0926\u0947\u0916\u0947\u0902\u0964",
      "faq-q-4": "\u0915\u094d\u092f\u093e \u092e\u0941\u091d\u0947 \u0909\u0938\u0915\u0947 \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u0905\u092a\u0921\u0947\u091f \u092e\u093f\u0932\u0947\u0917\u093e?",
      "faq-a-4": "\u091c\u092c \u092d\u0940 \u0939\u092e\u093e\u0930\u0947 \u092a\u093e\u0938 \u0938\u093e\u091d\u093e \u0915\u0930\u0928\u0947 \u0932\u093e\u092f\u0915 \u0916\u092c\u0930 \u0939\u094b\u0917\u0940, \u0939\u092e \u0907\u0938 \u092a\u0947\u091c \u0915\u0947 <a href=\"#updates\">\u0905\u092a\u0921\u0947\u091f</a> \u0938\u0947\u0915\u094d\u0936\u0928 \u0915\u094b \u0905\u092a\u0921\u0947\u091f \u0915\u0930\u0924\u0947 \u0930\u0939\u0947\u0902\u0917\u0947\u0964 \u092a\u0942\u091b\u0928\u0947 \u0915\u0940 \u092a\u0930\u0935\u093e\u0939 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0936\u0941\u0915\u094d\u0930\u093f\u092f\u093e\u0964",
      "faq-q-5": "\u0915\u094d\u092f\u093e \u092e\u0948\u0902 \u092e\u093f\u0932\u0928\u0947 \u0906 \u0938\u0915\u0924\u093e/\u0938\u0915\u0924\u0940 \u0939\u0942\u0901 \u092f\u093e \u0915\u0941\u091b \u092d\u0947\u091c \u0938\u0915\u0924\u093e/\u0938\u0915\u0924\u0940 \u0939\u0942\u0901?",
      "faq-a-5": "\u0939\u092e \u0906\u092d\u093e\u0930\u0940 \u0939\u0948\u0902\u0964 \u0905\u092d\u0940 \u0939\u092e \u0907\u0932\u093e\u091c \u0915\u0947 \u0936\u0947\u0921\u093c\u094d\u092f\u0942\u0932 \u0914\u0930 \u0906\u0930\u093e\u092e \u092e\u0947\u0902 \u0935\u094d\u092f\u0938\u094d\u0924 \u0939\u0948\u0902\u0964 \u0915\u0943\u092a\u092f\u093e \u092a\u0939\u0932\u0947 \u092b\u0941\u091f\u0930 \u092e\u0947\u0902 \u0926\u093f\u090f \u0917\u090f \u0938\u0902\u092a\u0930\u094d\u0915 \u0938\u0947 \u0939\u092e\u0947\u0902 \u092e\u0948\u0938\u0947\u091c \u0915\u0930\u0947\u0902 \u0924\u093e\u0915\u093f \u0939\u092e \u092c\u0924\u093e \u0938\u0915\u0947\u0902 \u0915\u093f \u0915\u094d\u092f\u093e \u092e\u0926\u0926\u0917\u093e\u0930 \u0939\u094b\u0917\u093e\u0964",
      "faq-q-6": "\u0905\u0917\u0930 \u0932\u0915\u094d\u0937\u094d\u092f \u0938\u0947 \u091c\u093c\u094d\u092f\u093e\u0926\u093e \u092a\u0948\u0938\u0947 \u0906 \u0917\u090f \u0924\u094b?",
      "faq-a-6": "\u0905\u0917\u0930 \u0939\u092e \u0905\u092a\u0928\u0940 \u092f\u094b\u091c\u0928\u093e \u0915\u0940 \u0930\u093e\u0936\u093f \u0924\u0915 \u092a\u0939\u0941\u0901\u091a \u091c\u093e\u0924\u0947 \u0939\u0948\u0902, \u0924\u094b \u0939\u092e \u0907\u0938 \u0935\u0947\u092c\u0938\u093e\u0907\u091f \u092a\u0930 \u0938\u094d\u092a\u0937\u094d\u091f \u0930\u0942\u092a \u0938\u0947 \u092c\u0924\u093e\u090f\u0902\u0917\u0947 \u0914\u0930 \u0938\u092e\u091d\u093e\u090f\u0902\u0917\u0947 \u0915\u093f \u0906\u0917\u0947 \u0915\u094d\u092f\u093e \u0939\u094b\u0917\u093e\u0964",
      "faq-q-7": "\u0915\u094d\u092f\u093e \u092f\u0939 \u0915\u0930-\u0915\u091f\u094c\u0924\u0940 \u092f\u094b\u0917\u094d\u092f \u0939\u0948?",
      "faq-a-7": "\u0936\u093e\u092f\u0926 \u0928\u0939\u0940\u0902\u0964 \u092f\u0939 \u090f\u0915 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0915\u094b \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0926\u0947\u0916\u092d\u093e\u0932 \u0915\u0947 \u0932\u093f\u090f \u0938\u0940\u0927\u093e UPI \u091f\u094d\u0930\u093e\u0902\u0938\u092b\u093c\u0930 \u0939\u0948, \u0915\u094b\u0908 \u092a\u0902\u091c\u0940\u0915\u0943\u0924 \u0926\u093e\u0928 \u0915\u0940 \u0930\u0938\u0940\u0926 \u0928\u0939\u0940\u0902\u0964 \u0905\u0917\u0930 \u0906\u092a\u0915\u094b \u0905\u092a\u0928\u0947 \u0930\u093f\u0915\u0949\u0930\u094d\u0921 \u0915\u0947 \u0932\u093f\u090f \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u091a\u093e\u0939\u093f\u090f, \u0924\u094b \u0939\u092e\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902, \u0939\u092e \u091c\u0939\u093e\u0901 \u0924\u0915 \u0939\u094b \u0938\u0915\u0947 \u092e\u0926\u0926 \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
      "footer-contact": "\u0907\u0938 \u092a\u0947\u091c \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u0938\u0935\u093e\u0932 \u092f\u093e \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0947 \u0932\u093f\u090f: <a href=\"mailto:family@example.com\">family@example.com</a> \u2014 \u090f\u0915 \u0915\u093e\u092e \u0915\u0930\u0928\u0947 \u0935\u093e\u0932\u0947 \u092a\u093e\u0930\u093f\u0935\u093e\u0930\u093f\u0915 \u0908\u092e\u0947\u0932 \u092f\u093e \u092b\u093c\u094b\u0928 \u0938\u0947 \u092c\u0926\u0932\u0947\u0902\u0964",
      "footer-back": "\u0935\u093e\u092a\u0938 \u0909\u092a\u0930"
    }
  };

  var currentLang = localStorage.getItem("sankalp-lang") || "en";

  function applyLang(lang) {
    var t = TRANSLATIONS[lang];
    if (!t) return;

    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    currentLang = lang;
    localStorage.setItem("sankalp-lang", lang);
    setWhatsAppHref();
  }

  applyLang(currentLang);

  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang-btn"));
    });
  });

})();
