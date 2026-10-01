/**
 * Main Application Logic
 * Integrates UI components, translation engine, speech features, history, and theme settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const sourceLangSelect = document.getElementById('sourceLangSelect');
  const targetLangSelect = document.getElementById('targetLangSelect');
  const swapLangBtn = document.getElementById('swapLangBtn');
  const quickLanguagesBar = document.getElementById('quickLanguagesBar');
  
  const sourceText = document.getElementById('sourceText');
  const outputText = document.getElementById('outputText');
  
  const micBtn = document.getElementById('micBtn');
  const sourceSpeakBtn = document.getElementById('sourceSpeakBtn');
  const targetSpeakBtn = document.getElementById('targetSpeakBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  
  const charCounter = document.getElementById('charCounter');
  const providerBadge = document.getElementById('providerBadge');
  const autoTranslateToggle = document.getElementById('autoTranslateToggle');
  const translateBtn = document.getElementById('translateBtn');
  
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  const historyBtn = document.getElementById('historyBtn');
  const historyModal = document.getElementById('historyModal');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const historyList = document.getElementById('historyList');
  
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutModal = document.getElementById('aboutModal');
  const closeAboutBtn = document.getElementById('closeAboutBtn');
  const candidateIdInput = document.getElementById('candidateIdInput');
  
  const toastContainer = document.getElementById('toastContainer');

  // App State Variables
  let debounceTimer = null;
  let recognition = null;
  let isListening = false;
  let lastDetectedSource = 'en';

  // --- 1. INITIALIZATION & SETUP ---

  function init() {
    populateLanguageSelects();
    renderQuickPickLanguages();
    loadTheme();
    loadCandidateId();
    setupSpeechRecognition();
    setupEventListeners();
  }

  // Populate Dropdown Menus
  function populateLanguageSelects() {
    sourceLangSelect.innerHTML = '';
    targetLangSelect.innerHTML = '';

    LANGUAGES.forEach(lang => {
      const optionSrc = document.createElement('option');
      optionSrc.value = lang.code;
      optionSrc.textContent = `${lang.flag} ${lang.name}`;
      sourceLangSelect.appendChild(optionSrc);

      if (lang.code !== 'auto') {
        const optionTgt = document.createElement('option');
        optionTgt.value = lang.code;
        optionTgt.textContent = `${lang.flag} ${lang.name}`;
        targetLangSelect.appendChild(optionTgt);
      }
    });

    // Default Selection: Auto Detect -> Spanish (es)
    sourceLangSelect.value = 'auto';
    targetLangSelect.value = 'es';
  }

  // Render Popular Quick Pick Chips
  function renderQuickPickLanguages() {
    quickLanguagesBar.innerHTML = '<span style="font-size:0.8rem; color:var(--text-muted); align-self:center; margin-right:0.25rem;">Quick Select:</span>';
    
    POPULAR_LANGUAGES.forEach(code => {
      const lang = LANGUAGES.find(l => l.code === code);
      if (lang) {
        const chip = document.createElement('button');
        chip.className = `quick-chip ${targetLangSelect.value === code ? 'active' : ''}`;
        chip.textContent = `${lang.flag} ${lang.name}`;
        chip.onclick = () => {
          targetLangSelect.value = code;
          updateQuickChips();
          handleTranslate();
        };
        quickLanguagesBar.appendChild(chip);
      }
    });
  }

  function updateQuickChips() {
    const chips = quickLanguagesBar.querySelectorAll('.quick-chip');
    chips.forEach(chip => {
      const langName = chip.textContent.split(' ').slice(1).join(' ');
      const targetLang = LANGUAGES.find(l => l.code === targetLangSelect.value);
      if (targetLang && targetLang.name === langName) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // --- 2. TRANSLATION EXECUTION ---

  async function handleTranslate() {
    const text = sourceText.value.trim();

    if (!text) {
      outputText.innerHTML = 'Translation will appear here...';
      outputText.classList.add('output-placeholder');
      providerBadge.textContent = 'Ready';
      updateCharCounter();
      return;
    }

    // Show loading skeleton shimmer
    renderLoadingSkeleton();
    providerBadge.textContent = 'Translating...';

    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;

    try {
      const res = await translator.translate(text, sourceLang, targetLang);
      
      outputText.classList.remove('output-placeholder');
      outputText.textContent = res.translatedText;
      providerBadge.textContent = `Via ${res.provider}`;
      
      lastDetectedSource = res.detectedSourceLang || sourceLang;
      if (sourceLang === 'auto' && res.detectedSourceLang) {
        const detectedObj = LANGUAGES.find(l => l.code === res.detectedSourceLang);
        if (detectedObj) {
          providerBadge.textContent += ` (Detected: ${detectedObj.name})`;
        }
      }

      // Save to History
      saveToHistory({
        sourceLang: sourceLang === 'auto' ? `auto (${lastDetectedSource})` : sourceLang,
        targetLang,
        sourceText: text,
        targetText: res.translatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

    } catch (err) {
      outputText.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${err.message}</span>`;
      providerBadge.textContent = 'Translation Error';
      showToast('Translation failed. Please check network connection.', 'error');
    }
  }

  function renderLoadingSkeleton() {
    outputText.classList.remove('output-placeholder');
    outputText.innerHTML = `
      <div class="skeleton" style="width: 85%;"></div>
      <div class="skeleton" style="width: 60%;"></div>
      <div class="skeleton" style="width: 75%;"></div>
    `;
  }

  function updateCharCounter() {
    const len = sourceText.value.length;
    charCounter.textContent = `${len} / 5000`;
  }

  // --- 3. EVENT LISTENERS ---

  function setupEventListeners() {
    // Input Event with Debounce for Auto-Translate
    sourceText.addEventListener('input', () => {
      updateCharCounter();
      if (autoTranslateToggle.checked) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleTranslate, 400);
      }
    });

    // Translate Button Click
    translateBtn.addEventListener('click', handleTranslate);

    // Language Select Change
    sourceLangSelect.addEventListener('change', () => {
      if (sourceText.value.trim()) handleTranslate();
    });

    targetLangSelect.addEventListener('change', () => {
      updateQuickChips();
      if (sourceText.value.trim()) handleTranslate();
    });

    // Swap Languages Button
    swapLangBtn.addEventListener('click', () => {
      let srcVal = sourceLangSelect.value;
      let tgtVal = targetLangSelect.value;

      if (srcVal === 'auto') {
        srcVal = lastDetectedSource || 'en';
      }

      sourceLangSelect.value = tgtVal;
      targetLangSelect.value = srcVal;

      // Swap Text if output exists
      const currentSource = sourceText.value;
      const currentTarget = outputText.classList.contains('output-placeholder') ? '' : outputText.textContent;

      if (currentTarget) {
        sourceText.value = currentTarget;
        handleTranslate();
      } else {
        updateQuickChips();
      }
    });

    // Clear Button
    clearBtn.addEventListener('click', () => {
      sourceText.value = '';
      outputText.innerHTML = 'Translation will appear here...';
      outputText.classList.add('output-placeholder');
      updateCharCounter();
      providerBadge.textContent = 'Ready';
      sourceText.focus();
    });

    // Copy Translation Button
    copyBtn.addEventListener('click', () => {
      if (outputText.classList.contains('output-placeholder') || !outputText.textContent.trim()) {
        showToast('Nothing to copy yet!', 'info');
        return;
      }

      navigator.clipboard.writeText(outputText.textContent).then(() => {
        showToast('Translation copied to clipboard!', 'success');
        copyBtn.style.color = 'var(--accent-primary)';
        setTimeout(() => copyBtn.style.color = '', 1500);
      }).catch(() => {
        showToast('Failed to copy text', 'error');
      });
    });

    // Text-to-Speech (TTS)
    sourceSpeakBtn.addEventListener('click', () => {
      speakText(sourceText.value, sourceLangSelect.value === 'auto' ? lastDetectedSource : sourceLangSelect.value);
    });

    targetSpeakBtn.addEventListener('click', () => {
      if (!outputText.classList.contains('output-placeholder')) {
        speakText(outputText.textContent, targetLangSelect.value);
      }
    });

    // Mic / Voice Dictation Button
    micBtn.addEventListener('click', toggleVoiceInput);

    // Theme Switcher
    themeToggleBtn.addEventListener('click', toggleTheme);

    // History Modal Listeners
    historyBtn.addEventListener('click', openHistoryModal);
    closeHistoryBtn.addEventListener('click', closeHistoryModal);
    clearHistoryBtn.addEventListener('click', clearHistory);
    historyModal.addEventListener('click', (e) => {
      if (e.target === historyModal) closeHistoryModal();
    });

    // About Developer Modal Listeners
    aboutBtn.addEventListener('click', openAboutModal);
    closeAboutBtn.addEventListener('click', closeAboutModal);
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeAboutModal();
    });

    // Candidate ID Auto-Save
    candidateIdInput.addEventListener('input', () => {
      localStorage.setItem('lb_candidate_id', candidateIdInput.value.trim());
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter or Cmd+Enter to Translate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTranslate();
      }
      // Alt+S to Swap
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        swapLangBtn.click();
      }
      // Escape to close active modals
      if (e.key === 'Escape') {
        if (historyModal.classList.contains('active')) closeHistoryModal();
        if (aboutModal.classList.contains('active')) closeAboutModal();
      }
    });
  }

  function openAboutModal() {
    aboutModal.classList.add('active');
  }

  function closeAboutModal() {
    aboutModal.classList.remove('active');
  }

  function loadCandidateId() {
    const savedId = localStorage.getItem('lb_candidate_id');
    candidateIdInput.value = savedId || 'CA/DF1/312332';
  }

  // --- 4. SPEECH SYNTHESIS & RECOGNITION ---

  function speakText(text, langCode) {
    if (!text || !text.trim()) {
      showToast('No text available to speak', 'info');
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech not supported in this browser.', 'error');
      return;
    }

    // Cancel active speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = LANGUAGES.find(l => l.code === langCode);
    const locale = langObj ? langObj.tts : 'en-US';
    
    utterance.lang = locale;

    // Try matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang === locale);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
    showToast(`Speaking (${langObj ? langObj.name : locale})...`, 'info');
  }

  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.title = 'Voice dictation not supported in this browser';
      micBtn.style.opacity = '0.5';
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('listening');
      showToast('Listening... Speak into microphone', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(res => res[0].transcript)
        .join('');
      
      sourceText.value = transcript;
      updateCharCounter();
    };

    recognition.onerror = (err) => {
      console.error('Speech recognition error:', err);
      showToast('Voice dictation error. Try again.', 'error');
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
      if (sourceText.value.trim() && autoTranslateToggle.checked) {
        handleTranslate();
      }
    };
  }

  function toggleVoiceInput() {
    if (!recognition) {
      showToast('Speech Recognition is not supported in this browser.', 'error');
      return;
    }

    if (isListening) {
      recognition.stop();
      stopListening();
    } else {
      const srcCode = sourceLangSelect.value === 'auto' ? 'en-US' : (LANGUAGES.find(l => l.code === sourceLangSelect.value)?.tts || 'en-US');
      recognition.lang = srcCode;
      recognition.start();
    }
  }

  function stopListening() {
    isListening = false;
    micBtn.classList.remove('listening');
  }

  // --- 5. THEME MANAGEMENT ---

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lb_theme', newTheme);
    updateThemeIcon(newTheme);
  }

  function loadTheme() {
    const saved = localStorage.getItem('lb_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // --- 6. HISTORY MANAGEMENT ---

  function saveToHistory(item) {
    let history = getHistory();
    // Avoid duplicate top entry
    if (history.length > 0 && history[0].sourceText === item.sourceText && history[0].targetLang === item.targetLang) {
      return;
    }

    history.unshift(item);
    if (history.length > 50) history.pop(); // limit to 50
    localStorage.setItem('lb_history', JSON.stringify(history));
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem('lb_history')) || [];
    } catch {
      return [];
    }
  }

  function openHistoryModal() {
    renderHistoryList();
    historyModal.classList.add('active');
  }

  function closeHistoryModal() {
    historyModal.classList.remove('active');
  }

  function renderHistoryList() {
    const history = getHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No translation history yet.</p>';
      return;
    }

    history.forEach((item, idx) => {
      const srcObj = LANGUAGES.find(l => l.code === item.sourceLang.split(' ')[0]) || { flag: '🌐', name: item.sourceLang };
      const tgtObj = LANGUAGES.find(l => l.code === item.targetLang) || { flag: '🌐', name: item.targetLang };

      const card = document.createElement('div');
      card.className = 'history-item';
      card.innerHTML = `
        <div class="history-meta">
          <span>${srcObj.flag} ${srcObj.name} ➔ ${tgtObj.flag} ${tgtObj.name}</span>
          <span>${item.timestamp}</span>
        </div>
        <div class="history-text">${escapeHtml(item.sourceText)}</div>
        <div class="history-trans">${escapeHtml(item.targetText)}</div>
        <div class="history-actions">
          <button class="quick-chip use-hist-btn" data-idx="${idx}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Use</button>
          <button class="quick-chip copy-hist-btn" data-idx="${idx}"><i class="fa-regular fa-copy"></i> Copy</button>
        </div>
      `;

      card.querySelector('.use-hist-btn').onclick = () => {
        sourceText.value = item.sourceText;
        targetLangSelect.value = item.targetLang;
        handleTranslate();
        closeHistoryModal();
      };

      card.querySelector('.copy-hist-btn').onclick = () => {
        navigator.clipboard.writeText(item.targetText);
        showToast('Copied from history!', 'success');
      };

      historyList.appendChild(card);
    });
  }

  function clearHistory() {
    localStorage.removeItem('lb_history');
    renderHistoryList();
    showToast('Translation history cleared.', 'info');
  }

  // --- 7. TOAST NOTIFICATIONS & UTILS ---

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-xmark';

    toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color:var(--accent-primary);"></i> <span>${escapeHtml(message)}</span>`;
    
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialize App
  init();
});
