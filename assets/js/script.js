'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    if (modalImg && modalTitle && modalText) {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    }
  });
}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase().trim();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn.length > 0 ? filterBtn[0] : null;

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase().trim();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form && formBtn) {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav links (FIXED: scope variable shadowing bug fixed with `j`)
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const clickedNavText = this.innerHTML.toLowerCase().trim();

    for (let j = 0; j < pages.length; j++) {
      if (clickedNavText === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// Local Flask Backend Submission
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("portfolio-contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent page reload/redirect

      const submitBtn = contactForm.querySelector("[data-form-btn]");
      const btnTextSpan = submitBtn ? submitBtn.querySelector("span") : null;
      const originalText = btnTextSpan ? btnTextSpan.innerText : "Send Message";

      if (submitBtn) submitBtn.disabled = true;
      if (btnTextSpan) btnTextSpan.innerText = "Sending...";

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
      };

      fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        let resData = await response.json();
        if (response.status === 200) {
          if (formStatus) {
            formStatus.style.display = "block";
            formStatus.style.color = "var(--orange-yellow-crayola, #ffdb70)";
            formStatus.innerText = "Thank you! Your message has been saved.";
          }
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.style.display = "block";
            formStatus.style.color = "#ff4d4d";
            formStatus.innerText = resData.message || "Something went wrong!";
          }
        }
      })
      .catch((error) => {
        if (formStatus) {
          formStatus.style.display = "block";
          formStatus.style.color = "#ff4d4d";
          formStatus.innerText = "Error: Make sure your Flask backend server is running.";
        }
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (btnTextSpan) btnTextSpan.innerText = originalText;
      });
    });
  }
});

// Copy to Clipboard Helper Function
function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    alert(message);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Cursor Glow Follower
document.addEventListener("DOMContentLoaded", function () {
  const cursorBlur = document.getElementById("cursor-blur");

  if (cursorBlur) {
    window.addEventListener("mousemove", function (e) {
      cursorBlur.style.left = e.clientX + "px";
      cursorBlur.style.top = e.clientY + "px";
    });
  }
});


/* ==========================================================================
   Creative Extras: Synthesized Sound Effects & 3D Card Tilt
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  // --- 1. Audio Sound Effects on UI Interactions ---
  // Uses Web Audio API (No external sound files required)
  let audioCtx = null;

  function playUiClickSound(freq = 600, type = 'sine', duration = 0.04) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext fallback for blocked autoplay policies
    }
  }

  // Attach click sound to Navbar Links, Filter Buttons, and Badges
  const clickableElements = document.querySelectorAll(
    ".navbar-link, [data-filter-btn], .tech-badge, .form-btn, .info_more-btn"
  );

  clickableElements.forEach(element => {
    element.addEventListener("click", function () {
      playUiClickSound(650, 'sine', 0.04);
    });
  });


  // --- 2. Interactive 3D / Tilt Effect on Cards ---
  const tiltCards = document.querySelectorAll(
    ".project-item, .content-card, .service-item"
  );

  tiltCards.forEach(card => {
    // Add smooth transition reset styling directly
    card.style.willChange = "transform";
    card.style.transformStyle = "preserve-3d";

    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle rotation values (Max ~10deg)
      const rotateX = (-y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;

      card.style.transition = "transform 0.1s ease-out";
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", function () {
      card.style.transition = "transform 0.5s ease";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });

});


/* ==========================================================================
   Soothing Ambient Background Sound Generator (Louder & Richer Warm Drone)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  let ambientAudioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let oscillators = [];

  const bgBtn = document.getElementById("bg-music-btn");
  const bgIcon = document.getElementById("bg-music-icon");
  const bgText = document.getElementById("bg-music-text");

  // Rich, soothing chord notes: C3, G3, C4, E4, G4 (Cmaj chord ensemble)
  // const chordFrequencies = [130.81, 196.00, 261.63, 329.63, 392.00];
  // Dmaj7 / F#m Ambient Chord (Hz): D3, A3, C#4, F#4, A4
const chordFrequencies = [146.83, 220.00, 277.18, 369.99, 440.00];

  function startAmbientSound() {
    ambientAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master Gain for smooth volume transitions
    masterGain = ambientAudioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, ambientAudioCtx.currentTime);
    
    // Warm low-pass filter (increased cutoff slightly to 550Hz for clearer presence without harshness)
    const filter = ambientAudioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 550; 

    masterGain.connect(filter);
    filter.connect(ambientAudioCtx.destination);

    // Create layered sine and soft triangle wave oscillators for a lush, full pad sound
    chordFrequencies.forEach((freq, index) => {
      const osc = ambientAudioCtx.createOscillator();
      const oscGain = ambientAudioCtx.createGain();

      // Alternate wave types to add depth and warmth
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      
      // Slight sub-cent detune for a natural ambient chorus effect
      const detuneAmount = (index % 2 === 0 ? 1 : -1) * 3;
      osc.frequency.setValueAtTime(freq, ambientAudioCtx.currentTime);
      osc.detune.setValueAtTime(detuneAmount, ambientAudioCtx.currentTime);

      // Increased per-note volume level
      oscGain.gain.value = 0.08; 

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    // Fade-in over 2 seconds to a clearer, comfortable listening level (0.35 max gain)
    masterGain.gain.exponentialRampToValueAtTime(0.35, ambientAudioCtx.currentTime + 2);
  }

  function stopAmbientSound() {
    if (masterGain && ambientAudioCtx) {
      // Smooth fade-out over 1.5 seconds
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ambientAudioCtx.currentTime + 1.5);
      setTimeout(() => {
        oscillators.forEach((osc) => osc.stop());
        oscillators = [];
        if (ambientAudioCtx) ambientAudioCtx.close();
        ambientAudioCtx = null;
      }, 1500);
    }
  }

  if (bgBtn) {
    bgBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevents nav tab switching conflict

      if (!isPlaying) {
        startAmbientSound();
        isPlaying = true;
        if (bgIcon) bgIcon.setAttribute("name", "volume-medium-outline");
        if (bgText) bgText.innerText = "Sound: ON";
      } else {
        stopAmbientSound();
        isPlaying = false;
        if (bgIcon) bgIcon.setAttribute("name", "volume-mute-outline");
        if (bgText) bgText.innerText = "Sound: OFF";
      }
    });
  }
});

/* ==========================================================================
   Interactive Command Palette with Arrow Key Navigation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const cmdPalette = document.getElementById("cmd-palette");
  const cmdInput = document.getElementById("cmd-input");
  const cmdResults = document.getElementById("cmd-results");
  const cmdTriggerBtn = document.getElementById("cmd-trigger-btn");

  let selectedIndex = 0;
  let currentFilteredCommands = [];

  const commands = [
    { name: "Go to About", icon: "person-outline", action: () => navigateTab("about") },
    { name: "Go to Resume", icon: "document-text-outline", action: () => navigateTab("resume") },
    { name: "Go to Portfolio / Projects", icon: "briefcase-outline", action: () => navigateTab("portfolio") },
    { name: "Go to Interests", icon: "heart-outline", action: () => navigateTab("interests") },
    { name: "Go to Contact Page", icon: "mail-outline", action: () => navigateTab("contact") },
    { name: "Open LinkedIn Profile", icon: "logo-linkedin", action: () => window.open("https://linkedin.com/in/hardikkhariwal", "_blank") },
    { name: "Open GitHub Profile", icon: "logo-github", action: () => window.open("https://github.com/khariwalhardik", "_blank") },
    { name: "Copy Email Address", icon: "copy-outline", action: () => copyEmail("khariwalhardik@gmail.com") },
    { name: "Download Resume PDF", icon: "download-outline", action: () => downloadResume() },
    { name: "Launch Terminal Shell", icon: "terminal-outline", action: () => openTerminalModal() },
  ];

  function navigateTab(tabName) {
    const targetBtn = Array.from(document.querySelectorAll('.navbar-link'))
      .find(btn => btn.innerText.toLowerCase().includes(tabName));
    if (targetBtn) targetBtn.click();
  }

  function copyEmail(email) {
    navigator.clipboard.writeText(email);
    alert("Email copied to clipboard!");
  }

  function downloadResume() {
    const link = document.createElement("a");
    link.href = "./assets/Hardik_Khariwal_Resume.pdf";
    link.download = "Hardik_Khariwal_Resume.pdf";
    link.click();
  }

  function renderCommands(filteredCmds) {
    if (!cmdResults) return;
    cmdResults.innerHTML = "";
    currentFilteredCommands = filteredCmds;

    if (filteredCmds.length === 0) {
      cmdResults.innerHTML = `<p style="padding: 10px; font-size: 13px; color: var(--light-gray-70);">No matching commands found.</p>`;
      return;
    }

    if (selectedIndex >= filteredCmds.length) {
      selectedIndex = 0;
    }

    filteredCmds.forEach((cmd, idx) => {
      const item = document.createElement("div");
      item.classList.add("cmd-item");
      item.style.cssText = `
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; border-radius: 8px; cursor: pointer;
        background: ${idx === selectedIndex ? 'var(--onyx)' : 'transparent'};
        border: ${idx === selectedIndex ? '1px solid var(--orange-yellow-crayola)' : '1px solid transparent'};
        color: var(--white-2); font-size: 13px; font-family: sans-serif;
        transition: background 0.15s ease, border-color 0.15s ease;
      `;

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <ion-icon name="${cmd.icon}" style="color: var(--orange-yellow-crayola); font-size: 16px;"></ion-icon>
          <span>${cmd.name}</span>
        </div>
        <span style="font-size: 10px; color: var(--light-gray-70); font-family: monospace;">↵ Select</span>
      `;

      item.addEventListener("mouseenter", () => {
        selectedIndex = idx;
        updateSelectionHighlight();
      });

      item.addEventListener("click", () => {
        cmd.action();
        closePalette();
      });

      cmdResults.appendChild(item);
    });
  }

  function updateSelectionHighlight() {
    const items = cmdResults.querySelectorAll(".cmd-item");
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.style.background = "var(--onyx)";
        item.style.borderColor = "var(--orange-yellow-crayola)";
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        item.style.background = "transparent";
        item.style.borderColor = "transparent";
      }
    });
  }

  function openPalette() {
    if (cmdPalette) {
      cmdPalette.style.display = "flex";
      selectedIndex = 0;
      renderCommands(commands);
      if (cmdInput) setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closePalette() {
    if (cmdPalette) {
      cmdPalette.style.display = "none";
      if (cmdInput) cmdInput.value = "";
    }
  }

  // Open via Navbar Trigger Button
  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPalette();
    });
  }

  // Keyboard Shortcuts (Cmd + K / Esc)
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdPalette && (cmdPalette.style.display === "none" || !cmdPalette.style.display)) {
        openPalette();
      } else {
        closePalette();
      }
    }

    if (e.key === "Escape") closePalette();
  });

  // Handle Input Typing & Arrow Key Navigation
  if (cmdInput) {
    cmdInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query));
      selectedIndex = 0;
      renderCommands(filtered);
    });

    cmdInput.addEventListener("keydown", function (e) {
      if (currentFilteredCommands.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentFilteredCommands.length;
        updateSelectionHighlight();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentFilteredCommands.length) % currentFilteredCommands.length;
        updateSelectionHighlight();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFilteredCommands[selectedIndex]) {
          currentFilteredCommands[selectedIndex].action();
          closePalette();
        }
      }
    });
  }

  // Close when clicking overlay backdrop
  if (cmdPalette) {
    cmdPalette.addEventListener("click", function (e) {
      if (e.target === cmdPalette) closePalette();
    });
  }
});

/* ==========================================================================
   Ask AI Hardik Chatbot Widget Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const chatBtn = document.getElementById("ai-chat-btn");
  const chatWindow = document.getElementById("ai-chat-window");
  const chatClose = document.getElementById("ai-chat-close");
  const chatForm = document.getElementById("ai-chat-form");
  const chatInput = document.getElementById("ai-chat-input");
  const chatMessages = document.getElementById("ai-chat-messages");

  // Toggle Window
  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      const isHidden = chatWindow.style.display === "none" || !chatWindow.style.display;
      chatWindow.style.display = isHidden ? "flex" : "none";
      if (isHidden) chatInput.focus();
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      chatWindow.style.display = "none";
    });
  }

  // Global Quick Prompt Handler
  window.sendQuickPrompt = function (text) {
    if (chatInput) {
      chatInput.value = text;
      chatForm.dispatchEvent(new Event("submit"));
    }
  };

  // Submit Handler
  if (chatForm) {
    chatForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      // Append User Message
      appendMessage(message, "user");
      chatInput.value = "";

      // Append Loading Indicator
      const loadingMsg = appendMessage("Typing...", "bot");

      try {
        const response = await fetch("https://margy-subtetanical-myrle.ngrok-free.dev/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        if (response.ok && data.reply) {
          loadingMsg.innerText = data.reply;
        } else {
          loadingMsg.innerText = data.error || "Sorry, I couldn't process that request right now.";
        }
      } catch (err) {
        loadingMsg.innerText = "Error: Please check if your local Flask backend server is running.";
      }
    });
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("ai-msg", sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }
});

const cmdTriggerBtn = document.getElementById("cmd-trigger-btn");
if (cmdTriggerBtn) {
  cmdTriggerBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openPalette();
  });
}

/* ==========================================================================
   Interactive Terminal Easter Egg Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const termModal = document.getElementById("terminal-modal");
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  const termCloseDot = document.getElementById("term-close-dot");

  window.openTerminalModal = function () {
    if (termModal) {
      termModal.style.display = "flex";
      if (termInput) setTimeout(() => termInput.focus(), 50);
    }
  };

  function closeTerminalModal() {
    if (termModal) termModal.style.display = "none";
  }

  if (termCloseDot) termCloseDot.addEventListener("click", closeTerminalModal);

  const commandResponses = {
    help: `Available Commands:
  cat resume.txt  - Print plain ASCII resume
  skills          - Print engineering tech stack tree
  ping raekis     - Simulate live latency to Raekis AI production backend
  clear           - Clear terminal screen
  about           - Display developer summary
  exit            - Close interactive terminal`,

    about: `Hardik Khariwal
Dual Degree (B.Tech + M.Tech) Student @ IIT Bombay
AI Engineer Intern @ Raekis.ai
Focus: AI Agents, Wavelet Biometrics, Signal Processing, Full-Stack Architecture`,

    "cat resume.txt": `===============================================================
                       HARDIK KHARIWAL
      khariwalhardik@gmail.com | IIT Bombay, Powai, Mumbai
===============================================================

[EDUCATION]
* Dual Degree (B.Tech + M.Tech) Electrical Engineering, IIT Bombay
  - Specialization: Signal Processing & Communications
  - Minor: AI & Data Science

[EXPERIENCE]
* AI Engineer Intern | Raekis.ai (California, US)
  - Engineered autonomous AI agent workflows and LLM systems.
* Software Developer | Placement Office, IIT Bombay
  - Full-stack web and platform infrastructure development.

[RESEARCH]
* Dual Degree Thesis under Prof. Gadre
  - Multi-Resolution Wavelet Analysis on Biometrics.
===============================================================`,

    skills: `tech-stack/
├── languages/
│   ├── Python
│   ├── C/C++
│   ├── TypeScript
│   └── SQL
├── ai_ml/
│   ├── PyTorch
│   ├── LLMs & Agentic Workflows
│   ├── RAG & Prompt Engineering
│   └── OpenCV
├── fullstack/
│   ├── React & Next.js
│   ├── Flask & FastAPI
│   ├── Node.js & PostgreSQL
│   └── Docker & Linux (Ubuntu/Kali)
└── current_focus/
    └── Wavelet Analysis & Autonomous AI Agents`,

    "ping raekis": `PING api.raekis.ai (104.21.32.12) 56(84) bytes of data.
64 bytes from 104.21.32.12: icmp_seq=1 ttl=58 time=18.4 ms
64 bytes from 104.21.32.12: icmp_seq=2 ttl=58 time=16.2 ms
64 bytes from 104.21.32.12: icmp_seq=3 ttl=58 time=17.1 ms
--- api.raekis.ai ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 16.204/17.233/18.411/0.908 ms`
  };

  if (termInput) {
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const cmd = this.value.trim().toLowerCase();
        this.value = "";

        if (!cmd) return;

        // Print entered command
        const line = document.createElement("div");
        line.style.margin = "6px 0";
        line.innerHTML = `<span style="color: #00ff88;">hkhariwal@iitb-dev:~$</span> ${escapeHtml(cmd)}`;
        termOutput.appendChild(line);

        if (cmd === "clear") {
          termOutput.innerHTML = "";
        } else if (cmd === "exit") {
          closeTerminalModal();
        } else if (commandResponses[cmd]) {
          const resp = document.createElement("div");
          resp.style.color = "#a9b7c6";
          resp.style.marginBottom = "10px";
          resp.innerText = commandResponses[cmd];
          termOutput.appendChild(resp);
        } else {
          const err = document.createElement("div");
          err.style.color = "#ff5f56";
          err.style.marginBottom = "10px";
          err.innerText = `zsh: command not found: ${cmd}. Type 'help' for available commands.`;
          termOutput.appendChild(err);
        }

        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Close terminal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && termModal && termModal.style.display === "flex") {
      closeTerminalModal();
    }
  });
});