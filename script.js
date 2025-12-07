// ==============================
//  VERSION SWITCH (A / B)
//  Works on Home, Checkout/Basket, Delivery
// ==============================
(() => {
    const versionButtons = document.querySelectorAll(".version-btn");
    const versionPanels  = document.querySelectorAll(".version-panel");
    const versionLabel   = document.getElementById("current-version-label");
  
    // If a page doesn’t have version switching (e.g. some pages), bail early
    if (!versionButtons.length || !versionPanels.length) return;
  
    function setVersion(version) {
      // Highlight the correct button
      versionButtons.forEach(btn => {
        const btnVersion =
          btn.dataset.version ||           // data-version="A"
          btn.dataset.versionBtn || "";    // or older data-version-btn="A"
  
        btn.classList.toggle("is-active", btnVersion === version);
      });
  
      // Show the matching panel, hide the others
      versionPanels.forEach(panel => {
        const panelVersion = panel.dataset.version; // data-version="A"/"B"
        panel.classList.toggle("is-visible", panelVersion === version);
      });
  
      // Update the “Currently viewing…” label if it exists
      if (versionLabel) {
        versionLabel.textContent =
          version === "A" ? "Version A (baseline)" : "Version B (improved)";
      }
    }
  
    // Expose for other scripts (experiment cards)
    window.tfSetVersion = setVersion;
  
    // Click handling
    versionButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.version || btn.dataset.versionBtn;
        if (v) setVersion(v);
      });
    });
  
    // Initial state: use the button that already has .is-active, otherwise default to B
    let initial = "B";
    const activeBtn = document.querySelector(".version-btn.is-active");
    if (activeBtn) {
      initial =
        activeBtn.dataset.version ||
        activeBtn.dataset.versionBtn ||
        initial;
    }
    setVersion(initial);
  })();
  
  
  // ==============================
  //  JOURNEY STAGE FILTER (Experiments page)
  // ==============================
  (() => {
    const stageTabs   = document.querySelectorAll(".stage-tab");
    const stageGroups = document.querySelectorAll(".stage-group");
  
    if (!stageTabs.length || !stageGroups.length) return;
  
    stageTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.stageFilter; // e.g. "awareness", "all"
  
        stageTabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");
  
        stageGroups.forEach(group => {
          if (filter === "all" || group.dataset.stage === filter) {
            group.style.display = "";
          } else {
            group.style.display = "none";
          }
        });
      });
    });
  })();
  
  
  // ==============================
  //  EXPERIMENT CARD → SWITCH VERSION + SCROLL
  //  (used on experiments overview page)
  // ==============================
  (() => {
    const experimentCards = document.querySelectorAll(".experiment-card");
    if (!experimentCards.length) return;
  
    experimentCards.forEach(card => {
      card.addEventListener("click", () => {
        const version  = card.dataset.version; // "A" or "B"
        const targetId = card.dataset.target;  // e.g. "hero-b"
  
        if (version && window.tfSetVersion) {
          window.tfSetVersion(version);
        }
  
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  })();
  