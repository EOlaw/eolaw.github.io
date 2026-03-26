const ChatApp = {
  history: [],
  isTyping: false,
  MAX_CHARS: 2000,

  init() {
    ChatUI.init((text) => this.sendMessage(text));

    // Load history from localStorage
    this.history = this.loadHistory();

    if (this.history.length === 0) {
      this._addWelcomeMessage();
    } else {
      this._renderHistory();
    }

    this._bindEvents();
  },

  _addWelcomeMessage() {
    const greeting = ResponseEngine.getGreeting();
    const welcomeText = `${greeting} I'm the InsightSerenity AI Assistant — powered by Emmanuel's expertise in data science, software engineering, AI/ML, and life coaching.\n\nWhat can I help you with today?`;

    const time = ChatUI.getTimeString();
    this.history.push({ role: 'ai', text: welcomeText, time });
    ChatUI.addMessage('ai', welcomeText, false);
    ChatUI.showFollowups([
      'Help me analyze data with Python',
      'I need career transition advice',
      'What does the Bible say about purpose?'
    ]);
  },

  _renderHistory() {
    ChatUI.clearMessages();
    ChatUI.clearFollowups();
    this.history.forEach(msg => {
      ChatUI.addMessage(msg.role, msg.text, false);
    });
    ChatUI.scrollToBottom(false);
  },

  _bindEvents() {
    // Form submit
    const form = document.getElementById('chat-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input ? input.value.trim() : '';
        if (text) this.sendMessage(text);
      });
    }

    // Enter key (no shift)
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const text = input.value.trim();
          if (text) this.sendMessage(text);
        }
      });

      // Character counter
      input.addEventListener('input', () => {
        const len = input.value.length;
        const counterEl = document.getElementById('char-counter');
        if (counterEl) {
          counterEl.textContent = `${len}/${this.MAX_CHARS}`;
          counterEl.classList.toggle('warn', len > 1800);
          counterEl.classList.toggle('limit', len >= this.MAX_CHARS);
        }
        // Enforce max
        if (len > this.MAX_CHARS) {
          input.value = input.value.slice(0, this.MAX_CHARS);
        }
        // Auto-resize
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 160) + 'px';
      });
    }

    // Send button
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const inp = document.getElementById('chat-input');
        const text = inp ? inp.value.trim() : '';
        if (text) this.sendMessage(text);
      });
    }

    // Quick chip buttons
    document.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.send || btn.textContent.trim();
        this.sendMessage(text);
      });
    });

    // Sidebar suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if (input) {
          input.value = btn.dataset.fill || btn.textContent.trim().replace(/^[^ ]+ /, '');
          input.focus();
        }
      });
    });

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportChat());
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearChat());
    }

    // New conversation button
    const newChatBtn = document.querySelector('.new-chat-btn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => this.clearChat());
    }
  },

  sendMessage(text) {
    if (!text || this.isTyping) return;

    const input = document.getElementById('chat-input');
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }

    const counterEl = document.getElementById('char-counter');
    if (counterEl) {
      counterEl.textContent = `0/${this.MAX_CHARS}`;
      counterEl.classList.remove('warn', 'limit');
    }

    ChatUI.clearFollowups();

    const time = ChatUI.getTimeString();
    this.history.push({ role: 'user', text, time });
    ChatUI.addMessage('user', text, true);
    this.saveHistory();

    this.isTyping = true;
    ChatUI.showTyping();

    const delay = 1000 + Math.random() * 1000;

    setTimeout(() => {
      ChatUI.hideTyping();
      this.isTyping = false;

      const { response, followups } = ResponseEngine.getResponse(text);
      const aiTime = ChatUI.getTimeString();
      this.history.push({ role: 'ai', text: response, time: aiTime });
      ChatUI.addMessage('ai', response, true);
      ChatUI.showFollowups(followups);
      this.saveHistory();
    }, delay);
  },

  clearChat() {
    if (!confirm('Clear the conversation? This cannot be undone.')) return;
    this.history = [];
    localStorage.removeItem('chat_history');
    ChatUI.clearMessages();
    ChatUI.clearFollowups();
    this._addWelcomeMessage();
  },

  exportChat() {
    ChatUI.exportConversation(this.history);
  },

  saveHistory() {
    try {
      localStorage.setItem('chat_history', JSON.stringify(this.history.slice(-50)));
    } catch (e) {
      // Storage full — trim further
      localStorage.setItem('chat_history', JSON.stringify(this.history.slice(-20)));
    }
  },

  loadHistory() {
    try {
      const raw = localStorage.getItem('chat_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};

document.addEventListener('DOMContentLoaded', () => ChatApp.init());
