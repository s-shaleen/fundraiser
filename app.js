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
      "story-p2": "He grew up without his father, who passed away when Sankalp was three. His brother Harsh, 25, works full time while finishing his masters degree \u2014 the only earning member of a family that has always had each other, even when they didn\u2019t have much else. They were just finding steadier ground.",
      "story-p3": "This illness did not care about any of that.",
      "story-p4": "Chemotherapy, hospital stays, daily care \u2014 the costs are beyond what this family can carry alone. We are asking for help because no family should have to face this by themselves.",
      "story-p5": "If you are here, you are already part of their support. Thank you.",
      "timeline-heading": "Moments along the way",
      "timeline-intro": "A few photos with simple captions \u2014 the human arc, not a polished campaign.",
      "timeline-cap-1": "Sankalp in February 2026",
      "timeline-cap-2": "Smiling with his family",
      "timeline-cap-3": "Sankalp in Regency Hospital, Kanpur \u2014 right after surgery",
      "timeline-cap-4": "Sankalp is still giving the best hugs",
      "costs-heading": "What the money goes toward",
      "costs-intro": "Every rupee has a purpose. Here is exactly where the money goes.",
      "costs-goal": "Our goal is to raise \u20b910,00,000. Here is where every rupee goes.",
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
      "update-5-date": "19 April 2026",
      "update-5-title": "This page \u2014 we turned to the world",
      "update-5-text": "We had done everything we could within our family and our circle. Every personal resource had been used. Today, we built this page and asked for help beyond what we could reach alone. It was not an easy decision. But Sankalp has more rounds of chemotherapy ahead, and we could not stop.",
      "update-4-date": "13 April 2026",
      "update-4-title": "First chemotherapy \u2014 3 more rounds ahead",
      "update-4-text": "Sankalp began his first round of chemotherapy today. Three more rounds are scheduled at three-week intervals. This is the next long chapter, and we are with him every step.",
      "update-3-date": "7 April 2026",
      "update-3-title": "Sankalp is home",
      "update-3-text": "After over two weeks in hospital, Sankalp was discharged from Regency Hospital. Being home matters more than words can say.",
      "update-2-date": "22 March 2026",
      "update-2-title": "Brain haemorrhage surgery \u2014 biopsy confirms cancer",
      "update-2-text": "Surgery was performed to address the brain haemorrhage. The biopsy results came back: cancer is present. This was the moment everything became real.",
      "update-1-date": "21 March 2026",
      "update-1-title": "First collapse and hospitalisation",
      "update-1-text": "Sankalp collapsed at home after complaining of a severe headache. He was rushed to Regency Hospital, Kanpur, and admitted immediately.",
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
      "family-6-relation": "Family",
      "family-6-note": "The kind of support that doesn\u2019t need to say anything \u2014 always there when it matters.",
      "family-7-relation": "Family",
      "family-7-note": "Sankalp\u2019s uncle, standing with the family through every step of his treatment and recovery.",
      "family-8-relation": "Family",
      "family-8-note": "Part of the extended family rallying behind Sankalp through his treatment.",
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
      "faq-a-5": "We are grateful. Right now we are juggling treatment schedules and rest. Please reach out to someone you know in the family first so we can suggest what helps without overwhelming him or the home.",
      "faq-q-6": "What if the goal is exceeded?",
      "faq-a-6": "If we reach the amount we had planned for, we will say so clearly on this website and explain what comes next \u2014 whether that is further treatment, follow-up care, or supporting his recovery.",
      "faq-q-7": "Is this tax deductible?",
      "faq-a-7": "Probably not. This is a direct UPI transfer to an individual for medical care, not a registered charity receipt. If you need documentation for your own records, contact us and we will help where we can.",
      "footer-contact": "This page was put together by Sankalp\u2019s family. If you received this link, you already know someone who can vouch for us. Please share it forward.",
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
      "story-p2": "उसके पिता का निधन तब हो गया था जब संकल्प तीन साल का था। उसके भाई हर्ष, 25 साल, पूरे समय काम करते हैं और साथ में अपनी मास्टर्स डिग्री भी पूरी कर रहे हैं — एक ऐसे परिवार के इकलौते कमाने वाले, जिन्होंने हमेशा एक-दूसरे का साथ दिया, भले ही पास ज़्यादा कुछ न हो। वे अभी-अभी थोड़ी स्थिरता की ओर बढ़ रहे थे।",
      "story-p3": "इस बीमारी को इन सब बातों की कोई परवाह नहीं थी।",
      "story-p4": "कीमोथेरेपी, अस्पताल में रहना, रोज़ की देखभाल — ये खर्च इस परिवार की क्षमता से परे हैं। हम मदद माँग रहे हैं क्योंकि किसी भी परिवार को यह अकेले नहीं झेलना चाहिए।",
      "story-p5": "अगर आप यहाँ हैं, तो आप पहले से ही उनके सहारे का हिस्सा हैं। शुक्रिया।",
      "timeline-heading": "\u0930\u093e\u0938\u094d\u0924\u0947 \u0915\u0947 \u0915\u0941\u091b \u092a\u0932",
      "timeline-intro": "\u0915\u0941\u091b \u0924\u0938\u094d\u0935\u0940\u0930\u0947\u0902 \u0938\u0930\u0932 \u0915\u0948\u092a\u094d\u0936\u0928 \u0915\u0947 \u0938\u093e\u0925 \u2014 \u090f\u0915 \u0907\u0902\u0938\u093e\u0928 \u0915\u0940 \u0915\u0939\u093e\u0928\u0940, \u0915\u094b\u0908 \u091a\u092e\u0915\u0926\u093e\u0930 \u0905\u092d\u093f\u092f\u093e\u0928 \u0928\u0939\u0940\u0902\u0964",
      "timeline-cap-1": "संकल्प — फरवरी 2026",
      "timeline-cap-2": "परिवार के साथ मुस्कुराते हुए",
      "timeline-cap-3": "रीजेंसी हॉस्पिटल, कानपुर — ऑपरेशन के तुरंत बाद",
      "timeline-cap-4": "संकल्प अभी भी सबसे अच्छे गले लगाता है",
      "costs-heading": "\u092a\u0948\u0938\u0947 \u0915\u093f\u0938 \u0915\u093e\u092e \u0906\u090f\u0902\u0917\u0947",
      "costs-intro": "सच्चे आंकड़े आपका भरोसा बनाते हैं। जैसे-जैसे हमें और जानकारी मिलेगी, हम राशि अपडेट करेंगे।",
      "costs-goal": "हमारा लक्ष्य ₹10,00,000 जुटाना है। यहाँ बताया गया है कि हर रुपया कहाँ जाएगा।",
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
      "update-5-date": "19 अप्रैल 2026",
      "update-5-title": "यह पेज — हमने दुनिया की तरफ हाथ बढ़ाया",
      "update-5-text": "हमने अपने परिवार और अपने दायरे में जो भी कर सकते थे, वह सब कर लिया था। हर निजी संसाधन लगा दिया था। आज हमने यह पेज बनाया और उस मदद के लिए हाथ बढ़ाया जो हम अकेले नहीं जुटा सकते थे। यह आसान फैसला नहीं था। लेकिन संकल्प की कीमोथेरेपी के और राउंड बाकी हैं, और हम रुक नहीं सकते थे।",
      "update-4-date": "13 अप्रैल 2026",
      "update-4-title": "पहली कीमोथेरेपी — 3 और राउंड बाकी",
      "update-4-text": "आज संकल्प की पहली कीमोथेरेपी शुरू हुई। तीन हफ्तों के अंतराल पर तीन और राउंड तय हैं। यह अगला लंबा सफर है, और हम हर कदम उसके साथ हैं।",
      "update-3-date": "7 अप्रैल 2026",
      "update-3-title": "संकल्प घर आ गया",
      "update-3-text": "दो हफ्तों से ज़्यादा अस्पताल में रहने के बाद संकल्प को रीजेंसी हॉस्पिटल से छुट्टी मिल गई। घर वापस आना — इसे शब्दों में बयां करना मुश्किल है।",
      "update-2-date": "22 मार्च 2026",
      "update-2-title": "ब्रेन हेमरेज की सर्जरी — बायोप्सी में कैंसर की पुष्टि",
      "update-2-text": "ब्रेन हेमरेज के लिए सर्जरी की गई। बायोप्सी रिपोर्ट आई: कैंसर है। यही वह पल था जब सब कुछ सच हो गया।",
      "update-1-date": "21 मार्च 2026",
      "update-1-title": "पहला दौरा और अस्पताल में भर्ती",
      "update-1-text": "तेज़ सिरदर्द की शिकायत के बाद संकल्प घर पर बेहोश हो गया। उसे तुरंत रीजेंसी हॉस्पिटल, कानपुर ले जाया गया और भर्ती किया गया।",
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
      "family-5-note": "संकल्प और पूरे परिवार के लिए उसके ठीक होने के हर चरण में मौजूद हैं।",
      "family-6-relation": "परिवार",
      "family-6-note": "वह समर्थन जिसे कुछ कहने की जरूरत नहीं \u2014 जब भी ज़रूरत हो, हमेशा साथ।",
      "family-7-relation": "परिवार",
      "family-7-note": "संकल्प के चाचा, इलाज और ठीक होने के हर कदम पर परिवार के साथ खड़े हैं।",
      "family-8-relation": "परिवार",
      "family-8-note": "विस्तृत परिवार का हिस्सा, जो संकल्प के इलाज के दौरान उसके साथ एकजुट है।",
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
      "faq-a-5": "हम आभारी हैं। अभी हम इलाज के शेड्यूल और आराम में व्यस्त हैं। कृपया पहले परिवार में किसी ऐसे व्यक्ति से संपर्क करें जिन्हें आप जानते हों, ताकि हम बता सकें कि क्या मददगार होगा।",
      "faq-q-6": "\u0905\u0917\u0930 \u0932\u0915\u094d\u0937\u094d\u092f \u0938\u0947 \u091c\u093c\u094d\u092f\u093e\u0926\u093e \u092a\u0948\u0938\u0947 \u0906 \u0917\u090f \u0924\u094b?",
      "faq-a-6": "\u0905\u0917\u0930 \u0939\u092e \u0905\u092a\u0928\u0940 \u092f\u094b\u091c\u0928\u093e \u0915\u0940 \u0930\u093e\u0936\u093f \u0924\u0915 \u092a\u0939\u0941\u0901\u091a \u091c\u093e\u0924\u0947 \u0939\u0948\u0902, \u0924\u094b \u0939\u092e \u0907\u0938 \u0935\u0947\u092c\u0938\u093e\u0907\u091f \u092a\u0930 \u0938\u094d\u092a\u0937\u094d\u091f \u0930\u0942\u092a \u0938\u0947 \u092c\u0924\u093e\u090f\u0902\u0917\u0947 \u0914\u0930 \u0938\u092e\u091d\u093e\u090f\u0902\u0917\u0947 \u0915\u093f \u0906\u0917\u0947 \u0915\u094d\u092f\u093e \u0939\u094b\u0917\u093e\u0964",
      "faq-q-7": "\u0915\u094d\u092f\u093e \u092f\u0939 \u0915\u0930-\u0915\u091f\u094c\u0924\u0940 \u092f\u094b\u0917\u094d\u092f \u0939\u0948?",
      "faq-a-7": "\u0936\u093e\u092f\u0926 \u0928\u0939\u0940\u0902\u0964 \u092f\u0939 \u090f\u0915 \u0935\u094d\u092f\u0915\u094d\u0924\u093f \u0915\u094b \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0926\u0947\u0916\u092d\u093e\u0932 \u0915\u0947 \u0932\u093f\u090f \u0938\u0940\u0927\u093e UPI \u091f\u094d\u0930\u093e\u0902\u0938\u092b\u093c\u0930 \u0939\u0948, \u0915\u094b\u0908 \u092a\u0902\u091c\u0940\u0915\u0943\u0924 \u0926\u093e\u0928 \u0915\u0940 \u0930\u0938\u0940\u0926 \u0928\u0939\u0940\u0902\u0964 \u0905\u0917\u0930 \u0906\u092a\u0915\u094b \u0905\u092a\u0928\u0947 \u0930\u093f\u0915\u0949\u0930\u094d\u0921 \u0915\u0947 \u0932\u093f\u090f \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c\u093c \u091a\u093e\u0939\u093f\u090f, \u0924\u094b \u0939\u092e\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902, \u0939\u092e \u091c\u0939\u093e\u0901 \u0924\u0915 \u0939\u094b \u0938\u0915\u0947 \u092e\u0926\u0926 \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
      "footer-contact": "यह पेज संकल्प के परिवार ने बनाया है। अगर आपको यह लिंक मिला है, तो आप पहले से किसी ऐसे व्यक्ति को जानते हैं जो हमारी पुष्टि कर सकता है। कृपया इसे आगे शेयर करें।",
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
