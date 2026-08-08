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
      e.preventDefault();

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

/* Creative Extras: Synthesized Sound Effects & 3D Card Tilt */
document.addEventListener("DOMContentLoaded", function () {
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
    } catch (e) {}
  }

  const clickableElements = document.querySelectorAll(
    ".navbar-link, [data-filter-btn], .tech-badge, .form-btn, .info_more-btn"
  );

  clickableElements.forEach(element => {
    element.addEventListener("click", function () {
      playUiClickSound(650, 'sine', 0.04);
    });
  });

  const tiltCards = document.querySelectorAll(
    ".project-item, .content-card, .service-item"
  );

  tiltCards.forEach(card => {
    card.style.willChange = "transform";
    card.style.transformStyle = "preserve-3d";

    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

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

/* Ambient Sound Generator */
document.addEventListener("DOMContentLoaded", function () {
  let ambientAudioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let oscillators = [];

  const bgBtn = document.getElementById("bg-music-btn");
  const bgIcon = document.getElementById("bg-music-icon");
  const bgText = document.getElementById("bg-music-text");

  const chordFrequencies = [146.83, 220.00, 277.18, 369.99, 440.00];

  function startAmbientSound() {
    ambientAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    masterGain = ambientAudioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, ambientAudioCtx.currentTime);
    
    const filter = ambientAudioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 550; 

    masterGain.connect(filter);
    filter.connect(ambientAudioCtx.destination);

    chordFrequencies.forEach((freq, index) => {
      const osc = ambientAudioCtx.createOscillator();
      const oscGain = ambientAudioCtx.createGain();

      osc.type = index % 2 === 0 ? "sine" : "triangle";
      
      const detuneAmount = (index % 2 === 0 ? 1 : -1) * 3;
      osc.frequency.setValueAtTime(freq, ambientAudioCtx.currentTime);
      osc.detune.setValueAtTime(detuneAmount, ambientAudioCtx.currentTime);

      oscGain.gain.value = 0.08; 

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    masterGain.gain.exponentialRampToValueAtTime(0.35, ambientAudioCtx.currentTime + 2);
  }

  function stopAmbientSound() {
    if (masterGain && ambientAudioCtx) {
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
      e.stopPropagation();

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

/* Command Palette */
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

  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openPalette();
    });
  }

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

  if (cmdPalette) {
    cmdPalette.addEventListener("click", function (e) {
      if (e.target === cmdPalette) closePalette();
    });
  }
});

/* Ask AI Hardik Chatbot Logic */
document.addEventListener("DOMContentLoaded", function () {
  const chatBtn = document.getElementById("ai-chat-btn");
  const chatWindow = document.getElementById("ai-chat-window");
  const chatClose = document.getElementById("ai-chat-close");
  const chatForm = document.getElementById("ai-chat-form");
  const chatInput = document.getElementById("ai-chat-input");
  const chatMessages = document.getElementById("ai-chat-messages");

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

  window.sendQuickPrompt = function (text) {
    if (chatInput) {
      chatInput.value = text;
      chatForm.dispatchEvent(new Event("submit"));
    }
  };

  if (chatForm) {
    chatForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      appendMessage(message, "user");
      chatInput.value = "";

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

/* Interactive Terminal CLI & Mini-Games Controller */
document.addEventListener("DOMContentLoaded", function () {
  const termModal = document.getElementById("terminal-modal");
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  const termCloseDot = document.getElementById("term-close-dot");
  const termCloseBtn = document.getElementById("term-close-btn");
  const resizeHandle = document.getElementById("term-resize-handle");
  const termCard = document.querySelector(".terminal-modal-card");

  // --- DRAG-TO-RESIZE TERMINAL WINDOW ---
  if (resizeHandle && termCard) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = termCard.offsetWidth;
      startHeight = termCard.offsetHeight;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    function handleMouseMove(e) {
      if (!isResizing) return;
      const newWidth = Math.max(360, startWidth + (e.clientX - startX));
      const newHeight = Math.max(280, startHeight + (e.clientY - startY));
      
      termCard.style.width = newWidth + "px";
      termCard.style.height = newHeight + "px";
      termCard.style.maxWidth = "95vw";
      termCard.style.maxHeight = "95vh";
    }

    function handleMouseUp() {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }

  // ... (rest of your script.js content below)

  let activeGameMode = null; // 'snake', 'tetris', 'quiz', 'tictactoe'
  let snakeInterval = null;
  let tetrisInterval = null;
  let matrixInterval = null;

  // Quiz State
  let quizIndex = 0;
  let quizScore = 0;
  const quizQuestions = [
    { q: "1. Which loss function is commonly used for multi-class classification?", options: ["A) MSE", "B) Cross-Entropy", "C) Hinge Loss"], answer: "b" },
    { q: "2. What algorithm is used to extract multi-resolution signal features?", options: ["A) Fourier Transform", "B) Wavelet Transform", "C) K-Means"], answer: "b" },
    { q: "3. What does RAG stand for in AI architecture?", options: ["A) Retrieval-Augmented Generation", "B) Recurrent Array Graph", "C) Random Access Group"], answer: "a" },
    { q: "4. What framework is primary for Flask WSGI servers?", options: ["A) Werkzeug", "B) Express", "C) NestJS"], answer: "a" },
    { q: "5. What is the primary tech symposium at IIT Bombay?", options: ["A) Techfest", "B) Mood Indigo", "C) E-Summit"], answer: "a" }
  ];

  // TicTacToe State
  let tttBoard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  window.openTerminalModal = function () {
    if (termModal) {
      termModal.style.display = "flex";
      if (termInput) {
        termInput.disabled = false;
        setTimeout(() => termInput.focus(), 50);
      }
    }
  };

  function closeTerminalModal() {
    stopSnakeGame();
    stopTetrisGame();
    stopMatrixRain();
    if (termModal) termModal.style.display = "none";
  }

  if (termCloseDot) termCloseDot.addEventListener("click", closeTerminalModal);
  if (termCloseBtn) termCloseBtn.addEventListener("click", closeTerminalModal);

  function appendOutput(text, color = "#a9b7c6") {
    const div = document.createElement("div");
    div.style.color = color;
    div.style.marginBottom = "8px";
    div.innerHTML = text;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
    return div;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const commandResponses = {
    help: `Available Commands:
  cat resume.txt  - Print plain ASCII resume
  skills          - Print engineering tech stack tree
  ping raekis     - Simulate live latency to Raekis AI production backend
  clear           - Clear terminal screen
  about           - Display developer summary
  matrix          - Trigger green falling code rain (ESC/stop to exit)
  snake           - Play terminal Snake game (WASD / Arrows)
  tetris          - Play terminal Tetris game (A/D: Move, W: Rotate, S: Drop)
  quiz            - Take 5-question AI/Engineering Quiz
  tictactoe       - Play Tic-Tac-Toe against AI bot
  exit            - Close terminal`,

    about: `Hardik Khariwal
Dual Degree (B.Tech + M.Tech) Student @ IIT Bombay
AI Engineer Intern @ Raekis.ai
Focus: AI Agents, Wavelet Biometrics, Signal Processing, Full-Stack Architecture`,

    "cat resume.txt": `===============================================================
                       HARDIK KHARIWAL
      khariwalhardik@gmail.com | IIT Bombay, Powai, Mumbai
===============================================================
[EDUCATION]
* Dual Degree Electrical Engineering, IIT Bombay
  - Specialization: Signal Processing & Communications
  - Minor: AI & Data Science
[EXPERIENCE]
* AI Engineer Intern | Raekis.ai (California, US)
* Software Developer | Placement Office, IIT Bombay
===============================================================`,

    skills: `tech-stack/
├── languages/ (Python, C++, TypeScript, SQL)
├── ai_ml/ (PyTorch, LLMs, RAG, OpenCV)
├── fullstack/ (React, Flask, Node.js, PostgreSQL)
└── infrastructure/ (Docker, Linux, Git)`
  };

  // --- TERMINAL INPUT LISTENER ---
  if (termInput) {
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const cmd = this.value.trim().toLowerCase();
        this.value = "";

        if (!cmd && !activeGameMode) return;

        if (!activeGameMode) {
          appendOutput(`<span style="color: #00ff88;">hkhariwal@iitb-dev:~$</span> ${escapeHtml(cmd)}`);
        }

        if (activeGameMode === 'quiz') {
          handleQuizInput(cmd);
          return;
        }

        if (activeGameMode === 'tictactoe') {
          handleTicTacToeInput(cmd);
          return;
        }

        if (cmd === "clear") {
          termOutput.innerHTML = "";
          stopMatrixRain();
        } else if (cmd === "stop" || cmd === "q") {
          stopMatrixRain();
          appendOutput("Matrix animation stopped.", "var(--orange-yellow-crayola)");
        } else if (cmd === "exit") {
          closeTerminalModal();
        } else if (cmd === "matrix") {
          startMatrixRain();
        } else if (cmd === "snake") {
          startSnakeGame();
        } else if (cmd === "tetris") {
          startTetrisGame();
        } else if (cmd === "quiz") {
          startQuizGame();
        } else if (cmd === "tictactoe") {
          startTicTacToeGame();
        } else if (commandResponses[cmd]) {
          appendOutput(commandResponses[cmd], "#a9b7c6");
        } else {
          appendOutput(`zsh: command not found: ${cmd}. Type 'help' for available commands.`, "#ff5f56");
        }
      }
    });
  }

  // --- MATRIX RAIN EFFECT ---
  function startMatrixRain() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;

    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0101010101";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    if (matrixInterval) clearInterval(matrixInterval);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff88";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);

    appendOutput("Matrix rain initiated across display. Press [ESC] or type 'stop' to end.", "var(--orange-yellow-crayola)");
  }

  function stopMatrixRain() {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
    const canvas = document.getElementById("matrix-canvas");
    if (canvas) {
      canvas.style.display = "none";
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

// --- RETRO SNAKE GAME ---
  function startSnakeGame() {
    activeGameMode = "snake";
    stopSnakeGame();
    activeGameMode = "snake";

    if (termInput) {
      termInput.disabled = true;
      termInput.blur();
    }

    requestAnimationFrame(() => {
      termModal?.focus({ preventScroll: true });
    });

    appendOutput("<br>🐍 <strong>SNAKE GAME STARTED!</strong> Use <strong>WASD</strong> or <strong>Arrow Keys</strong>. Press 'q' to quit.", "var(--orange-yellow-crayola)");

    const gameDiv = document.createElement("div");
    gameDiv.id = "snake-game-screen";
    gameDiv.style.cssText = "font-family: monospace; background: #000; padding: 14px; border: 1px solid #00ff88; border-radius: 8px; margin: 10px 0; text-align: center;";
    termOutput.appendChild(gameDiv);

    // Expanded grid dimensions (More blocks)
    const width = 36;
    const height = 16;
    let snake = [{ x: 15, y: 8 }, { x: 14, y: 8 }, { x: 13, y: 8 }];
    let food = { x: 26, y: 8 };
    let dir = { x: 1, y: 0 };
    let score = 0;

    function renderBoard() {
      let grid = "";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (x === food.x && y === food.y) {
            grid += "🍎";
          } else if (snake.some(s => s.x === x && s.y === y)) {
            grid += "🟩";
          } else {
            grid += "▪️";
          }
        }
        grid += "\n";
      }
      gameDiv.innerHTML = `<pre style="margin:0; font-size: 14px; line-height: 1.15; letter-spacing: 0.5px;">${grid}</pre><div style="color:#00ff88; font-size: 14px; margin-top: 8px; font-weight: bold;">Score: ${score} | WASD / Arrow Keys</div>`;
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    snakeInterval = setInterval(() => {
      // Screen wrapping logic (wraps left <-> right, top <-> bottom)
      let rawX = snake[0].x + dir.x;
      let rawY = snake[0].y + dir.y;

      const head = {
        x: (rawX + width) % width,
        y: (rawY + height) % height
      };

      // Game Over on self-collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        stopSnakeGame();
        appendOutput(`💀 <strong>GAME OVER!</strong> Final Score: ${score}`, "#ff5f56");
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
      } else {
        snake.pop();
      }

      renderBoard();
    }, 150);

    // Global Key Listener for Snake Controls
    window.handleSnakeControls = function(e) {
      if (activeGameMode !== "snake") return;

      const k = e.key.toLowerCase();
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];

      if (gameKeys.includes(e.key) || gameKeys.includes(k)) {
        e.preventDefault();
        e.stopPropagation();
      }

      if ((k === "w" || e.key === "ArrowUp") && dir.y === 0) dir = { x: 0, y: -1 };
      if ((k === "s" || e.key === "ArrowDown") && dir.y === 0) dir = { x: 0, y: 1 };
      if ((k === "a" || e.key === "ArrowLeft") && dir.x === 0) dir = { x: -1, y: 0 };
      if ((k === "d" || e.key === "ArrowRight") && dir.x === 0) dir = { x: 1, y: 0 };

      if (k === "q") {
        stopSnakeGame();
        appendOutput("Snake game exited.", "#ff5f56");
      }
    };

    document.addEventListener("keydown", window.handleSnakeControls, true);
  }

  function stopSnakeGame() {
    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = null;
    if (window.handleSnakeControls) {
      document.removeEventListener("keydown", window.handleSnakeControls, true);
      window.handleSnakeControls = null;
    }
    if (activeGameMode === "snake") activeGameMode = null;

    if (termInput) {
      termInput.disabled = false;
      termInput.focus();
    }
  }

  // --- RETRO TETRIS GAME ---
  function startTetrisGame() {
    activeGameMode = "tetris";
    stopTetrisGame();
    activeGameMode = "tetris";

    if (termInput) {
      termInput.disabled = true;
      termInput.blur();
    }

    requestAnimationFrame(() => {
      termModal?.focus({ preventScroll: true });
    });

    appendOutput("<br>🧩 <strong>TETRIS STARTED!</strong> Controls: <strong>A/D</strong> or <strong>Left/Right</strong> (Move), <strong>W</strong> or <strong>Up</strong> (Rotate), <strong>S</strong> or <strong>Down</strong> (Drop). Press 'q' to quit.", "var(--orange-yellow-crayola)");

    const gameDiv = document.createElement("div");
    gameDiv.id = "tetris-game-screen";
    gameDiv.style.cssText = "font-family: monospace; background: #000; padding: 14px; border: 1px solid #00ff88; border-radius: 8px; margin: 10px 0; text-align: center;";
    termOutput.appendChild(gameDiv);

    const cols = 10;
    const rows = 16;
    let board = Array.from({ length: rows }, () => Array(cols).fill("▪️"));
    let score = 0;
    let linesCleared = 0;

    const shapes = {
      I: [[1,1,1,1]],
      J: [[1,0,0],[1,1,1]],
      L: [[0,0,1],[1,1,1]],
      O: [[1,1],[1,1]],
      S: [[0,1,1],[1,1,0]],
      T: [[0,1,0],[1,1,1]],
      Z: [[1,1,0],[0,1,1]]
    };

    const blocks = ["🟦", "🟩", "🟨", "🟧", "🟪", "🟥", "🟫"];

    function getRandomPiece() {
      const keys = Object.keys(shapes);
      const key = keys[Math.floor(Math.random() * keys.length)];
      const block = blocks[Math.floor(Math.random() * blocks.length)];
      return {
        shape: shapes[key],
        block: block,
        x: Math.floor((cols - shapes[key][0].length) / 2),
        y: 0
      };
    }

    let currentPiece = getRandomPiece();

    function collide(pX, pY, shape) {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            let newX = pX + c;
            let newY = pY + r;
            if (newX < 0 || newX >= cols || newY >= rows) return true;
            if (newY >= 0 && board[newY][newX] !== "▪️") return true;
          }
        }
      }
      return false;
    }

    function rotate(matrix) {
      return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    }

    function lockPiece() {
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            let boardY = currentPiece.y + r;
            let boardX = currentPiece.x + c;
            if (boardY >= 0) board[boardY][boardX] = currentPiece.block;
          }
        }
      }

      let lines = 0;
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== "▪️")) {
          board.splice(r, 1);
          board.unshift(Array(cols).fill("▪️"));
          lines++;
          r++;
        }
      }

      if (lines > 0) {
        linesCleared += lines;
        score += lines * 100;
      }

      currentPiece = getRandomPiece();

      if (collide(currentPiece.x, currentPiece.y, currentPiece.shape)) {
        stopTetrisGame();
        appendOutput(`💀 <strong>TETRIS GAME OVER!</strong> Score: ${score} | Lines: ${linesCleared}`, "#ff5f56");
      }
    }

    function renderBoard() {
      let displayBoard = board.map(row => [...row]);

      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            let py = currentPiece.y + r;
            let px = currentPiece.x + c;
            if (py >= 0 && py < rows && px >= 0 && px < cols) {
              displayBoard[py][px] = currentPiece.block;
            }
          }
        }
      }

      let gridStr = displayBoard.map(row => row.join("")).join("\n");
      gameDiv.innerHTML = `<pre style="margin:0; font-size: 18px; line-height: 1.15; letter-spacing: 1.5px;">${gridStr}</pre><div style="color:#00ff88; font-size: 15px; margin-top: 8px; font-weight: bold;">Score: ${score} | Lines: ${linesCleared}</div>`;
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    tetrisInterval = setInterval(() => {
      if (!collide(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
      } else {
        lockPiece();
      }
      renderBoard();
    }, 450);

    // Global Key Listener for Tetris Controls
    window.handleTetrisControls = function(e) {
      if (activeGameMode !== "tetris") return;

      const k = e.key.toLowerCase();
      const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];

      if (gameKeys.includes(e.key) || gameKeys.includes(k)) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (k === "a" || e.key === "ArrowLeft") {
        if (!collide(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
          currentPiece.x--;
        }
      } else if (k === "d" || e.key === "ArrowRight") {
        if (!collide(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
          currentPiece.x++;
        }
      } else if (k === "s" || e.key === "ArrowDown") {
        if (!collide(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
          currentPiece.y++;
        }
      } else if (k === "w" || e.key === "ArrowUp") {
        let rotated = rotate(currentPiece.shape);
        if (!collide(currentPiece.x, currentPiece.y, rotated)) {
          currentPiece.shape = rotated;
        }
      } else if (k === "q") {
        stopTetrisGame();
        appendOutput("Tetris game exited.", "#ff5f56");
        return;
      }

      renderBoard();
    };

    document.addEventListener("keydown", window.handleTetrisControls, true);
  }

  function stopTetrisGame() {
    if (tetrisInterval) clearInterval(tetrisInterval);
    tetrisInterval = null;
    if (window.handleTetrisControls) {
      document.removeEventListener("keydown", window.handleTetrisControls, true);
      window.handleTetrisControls = null;
    }
    if (activeGameMode === "tetris") activeGameMode = null;

    if (termInput) {
      termInput.disabled = false;
      termInput.focus();
    }
  }

  // --- TRIVIA QUIZ ---
  function startQuizGame() {
    activeGameMode = "quiz";
    quizIndex = 0;
    quizScore = 0;
    appendOutput("<br>🎯 <strong>5-Question Engineering Quiz Started!</strong> Type A, B, or C into terminal and press Enter.", "var(--orange-yellow-crayola)");
    renderCurrentQuestion();
    if (termInput) termInput.focus();
  }

  function renderCurrentQuestion() {
    if (quizIndex < quizQuestions.length) {
      const qObj = quizQuestions[quizIndex];
      let txt = `<strong>${qObj.q}</strong><br>`;
      qObj.options.forEach(opt => { txt += `${opt}<br>`; });
      appendOutput(txt, "#a9b7c6");
    } else {
      activeGameMode = null;
      let badge = quizScore >= 40 ? " 🎖️ [Verified Portfolio Visitor Badge Unlocked!]" : "";
      appendOutput(`✨ <strong>Quiz Complete!</strong> Final Score: ${quizScore}/50${badge}`, "var(--orange-yellow-crayola)");
      if (termInput) termInput.focus();
    }
  }

  function handleQuizInput(input) {
    const ans = input.trim().toLowerCase();
    if (!["a", "b", "c"].includes(ans)) {
      appendOutput("Please enter 'a', 'b', or 'c'.", "#ff5f56");
      return;
    }

    if (ans === quizQuestions[quizIndex].answer) {
      quizScore += 10;
      appendOutput("✅ Correct! (+10 pts)", "#00ff88");
    } else {
      appendOutput(`❌ Wrong! Correct answer was '${quizQuestions[quizIndex].answer.toUpperCase()}'.`, "#ff5f56");
    }

    quizIndex++;
    renderCurrentQuestion();
  }

  // --- TIC-TAC-TOE ---
  function startTicTacToeGame() {
    activeGameMode = "tictactoe";
    tttBoard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    appendOutput("<br>❌⭕ <strong>Tic-Tac-Toe vs AI!</strong> You are 'X'. Enter position number (1-9) in the terminal and hit Enter.", "var(--orange-yellow-crayola)");
    renderTicTacToeBoard();
    if (termInput) termInput.focus();
  }

  function renderTicTacToeBoard() {
    const b = tttBoard;
    const boardTxt = `
  ${b[0]} | ${b[1]} | ${b[2]}
 ---+---+---
  ${b[3]} | ${b[4]} | ${b[5]}
 ---+---+---
  ${b[6]} | ${b[7]} | ${b[8]}`;
    appendOutput(`<pre style="margin:0; font-family:monospace; color:#00ff88;">${boardTxt}</pre>`);
  }

  function checkTTTWinner(board) {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let w of wins) {
      if (board[w[0]] !== " " && board[w[0]] === board[w[1]] && board[w[1]] === board[w[2]]) {
        return board[w[0]];
      }
    }
    if (board.every(cell => cell === "X" || cell === "O")) return "Tie";
    return null;
  }

  function handleTicTacToeInput(input) {
    const pos = parseInt(input) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8 || tttBoard[pos] === "X" || tttBoard[pos] === "O") {
      appendOutput("Invalid position. Type an available number between 1 and 9.", "#ff5f56");
      return;
    }

    tttBoard[pos] = "X";
    renderTicTacToeBoard();

    let win = checkTTTWinner(tttBoard);
    if (win) {
      finishTTTGame(win);
      return;
    }

    const emptyIndices = tttBoard.map((val, idx) => (val !== "X" && val !== "O") ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      const aiMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      tttBoard[aiMove] = "O";
      appendOutput(`AI Bot played position ${aiMove + 1}:`, "#a9b7c6");
      renderTicTacToeBoard();

      win = checkTTTWinner(tttBoard);
      if (win) {
        finishTTTGame(win);
      }
    }
  }

  function finishTTTGame(winner) {
    activeGameMode = null;
    if (winner === "X") {
      appendOutput("🎉 <strong>YOU WON!</strong> Great match!", "#00ff88");
    } else if (winner === "O") {
      appendOutput("🤖 <strong>AI BOT WON!</strong> Try again.", "#ff5f56");
    } else {
      appendOutput("🤝 <strong>IT'S A DRAW!</strong>", "var(--orange-yellow-crayola)");
    }
    if (termInput) termInput.focus();
  }

  // --- GLOBAL KEYBOARD SHORTCUTS ---
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      stopMatrixRain();
      if (activeGameMode === "snake") {
        stopSnakeGame();
        appendOutput("Snake game exited.", "#ff5f56");
      } else if (activeGameMode === "tetris") {
        stopTetrisGame();
        appendOutput("Tetris game exited.", "#ff5f56");
      } else if (termModal && termModal.style.display === "flex") {
        closeTerminalModal();
      }
    }
  });
});