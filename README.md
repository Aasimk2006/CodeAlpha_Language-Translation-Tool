# 🌐 LinguaBridge - Language Translation Tool

> **CodeAlpha Internship Project**  
> **Task**: TASK 1 - Language Translation Tool  
> **Developer**: AASIM KHAN  
> **Domain**: Frontend / Software Development Internship  
> **Candidate ID**: `CA/DF1/312332`

---

## 📌 Project Overview

**LinguaBridge** is a feature-rich, web-based **Language Translation Tool** designed for seamless multilingual communication. Built with pure HTML5, CSS3, and modern ES6+ JavaScript, it delivers high-performance translations across 56+ global languages using a multi-provider fallback translation engine.

---

## ✨ Key Features

- **🌐 Multi-Language Support**: Translates between 56+ global languages with country flag icons and automatic source language detection.
- **🔄 Multi-Provider Fallback Engine**:
  - **Primary**: Google Translate Free GTX API (`https://translate.googleapis.com/translate_a/single`)
  - **Fallback 1**: MyMemory Translation API (`https://api.mymemory.translated.net`)
  - **Fallback 2**: Lingva Translate API (`https://lingva.ml`)
  *Ensures 100% uptime with zero required API keys from the user!*
- **🔀 Language Swap**: Instantly swap source and target languages and texts (`Alt + S`).
- **🔊 Text-to-Speech (TTS)**: Native browser speech synthesis (`SpeechSynthesis`) to listen to pronunciation in both source and target languages.
- **🎙️ Voice Dictation (Speech-to-Text)**: Record voice input directly using Web Speech Recognition (`SpeechRecognition`).
- **📋 Copy to Clipboard**: One-click copy with toast notifications.
- **⚡ Real-time Auto Translation**: Debounced auto-translate on typing + manual trigger (`Ctrl + Enter`).
- **📜 Translation History**: Saves translation logs to `localStorage` with options to view, copy, re-use, or clear history.
- **🌓 Dark / Light Theme Toggle**: Seamless UI theme switching with saved preference.
- **🎓 Developer Profile Modal**: Built-in developer info & candidate ID card.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Glassmorphism, Flexbox, CSS Grid, Custom Variables), Modern JavaScript (ES6+ Modules)
- **Icons & Fonts**: FontAwesome 6, Google Fonts (Inter)
- **APIs**: Google Translate GTX API, MyMemory API, Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Backend (Optional Runner)**: Python 3 (`http.server`)

---

## 🚀 How to Run the Application

### Option 1: Direct Browser Access
Simply open the `index.html` file in any modern web browser:
```bash
# Double-click index.html or open via terminal
```

### Option 2: Local Python Server (Recommended)
Run the included lightweight Python HTTP server:
```bash
python server.py
```
Then visit **`http://localhost:8000`** in your browser.

---

## 📂 Project Structure

```
Language Translation Tool/
│
├── index.html       # Main HTML page structure & modals
├── styles.css       # Complete UI styling, animations & theme palettes
├── languages.js    # 56+ languages registry & Speech locale mappings
├── translator.js   # Multi-provider translation API engine with fallback
├── app.js          # Main application controller, speech & history logic
├── server.py       # Python local server runner
└── README.md        # Project documentation & candidate details
```

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + Enter` (or `Cmd + Enter`): Trigger Translation
- `Alt + S`: Swap Source & Target Languages
- `Esc`: Close History or Developer Modals

---

## 👨‍💻 Developer Information

- **Developer**: Aasim Khan
- **Internship Program**: CodeAlpha Software Engineering Internship
- **Project**: Task 1 - Language Translation Tool
