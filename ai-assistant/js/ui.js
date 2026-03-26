const ChatUI = {
  messagesEl: null,
  typingEl: null,
  _onFollowupClick: null,

  init(onFollowupClick) {
    this.messagesEl   = document.getElementById('messages');
    this._onFollowupClick = onFollowupClick || null;
  },

  addMessage(role, text, animate = true) {
    const isUser = role === 'user';
    const div = document.createElement('div');
    div.className = `message ${role}${animate ? ' msg-animate' : ''}`;

    const formattedText = isUser
      ? this._escapeHtml(text).replace(/\n/g, '<br>')
      : ResponseEngine.formatText(text);

    div.innerHTML = `
      <div class="msg-avatar ${role}">${isUser ? 'You' : 'IS'}</div>
      <div class="msg-content">
        <div class="msg-bubble" data-raw="${this._escapeAttr(text)}">
          ${isUser ? `<p>${formattedText}</p>` : `<p>${formattedText}</p>`}
          <button class="copy-btn" title="Copy message" onclick="ChatUI.copyMessage(this)">&#128203;</button>
        </div>
        <div class="msg-time">${this.getTimeString()}</div>
      </div>
    `;

    this.messagesEl.appendChild(div);
    this.scrollToBottom(true);
    return div;
  },

  showTyping() {
    this.hideTyping();
    const wrapper = document.createElement('div');
    wrapper.className = 'typing-wrapper';
    wrapper.id = 'typing-indicator';
    wrapper.innerHTML = `
      <div class="msg-avatar ai">IS</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    this.messagesEl.appendChild(wrapper);
    this.scrollToBottom(true);
    this.typingEl = wrapper;
  },

  hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
    this.typingEl = null;
  },

  showFollowups(suggestions) {
    this.clearFollowups();
    if (!suggestions || suggestions.length === 0) return;

    const container = document.createElement('div');
    container.className = 'followup-chips';
    container.id = 'followup-chips';

    suggestions.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'followup-chip';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        if (this._onFollowupClick) this._onFollowupClick(text);
      });
      container.appendChild(btn);
    });

    this.messagesEl.appendChild(container);
    this.scrollToBottom(true);
  },

  clearFollowups() {
    const el = document.getElementById('followup-chips');
    if (el) el.remove();
  },

  scrollToBottom(smooth = true) {
    if (!this.messagesEl) return;
    this.messagesEl.scrollTo({
      top: this.messagesEl.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant'
    });
  },

  formatMarkdown(text) {
    return ResponseEngine.formatText(text);
  },

  getTimeString() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  copyMessage(btnEl) {
    const bubble = btnEl.closest('.msg-bubble');
    const raw = bubble ? bubble.dataset.raw : '';
    if (!raw) return;

    navigator.clipboard.writeText(raw).then(() => {
      const orig = btnEl.innerHTML;
      btnEl.textContent = 'Copied!';
      btnEl.style.background = '#34d399';
      btnEl.style.color = '#000';
      setTimeout(() => {
        btnEl.innerHTML = orig;
        btnEl.style.background = '';
        btnEl.style.color = '';
      }, 1500);
    }).catch(() => {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = raw;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btnEl.textContent = 'Copied!';
      setTimeout(() => { btnEl.innerHTML = '&#128203;'; }, 1500);
    });
  },

  exportConversation(messages) {
    if (!messages || messages.length === 0) return;

    const lines = ['InsightSerenity AI — Chat Export', '=' .repeat(40), ''];

    messages.forEach(msg => {
      const role = msg.role === 'user' ? 'You' : 'InsightSerenity AI';
      lines.push(`[${msg.time || ''}] ${role}:`);
      lines.push(msg.text);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `chat-export-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },

  clearMessages() {
    if (this.messagesEl) this.messagesEl.innerHTML = '';
  },

  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
