/* quiz-platform/js/ui.js */
const QuizUI = {
  els: {},
  soundEnabled: true,
  _audioCtx: null,

  init() {
    this.els = {
      screens: {
        home:   document.getElementById('home-screen'),
        quiz:   document.getElementById('quiz-screen'),
        result: document.getElementById('result-screen')
      },
      // quiz
      qCounter:     document.getElementById('q-counter'),
      progressBar:  document.getElementById('progress-bar'),
      timer:        document.getElementById('timer'),
      catBadge:     document.getElementById('cat-badge'),
      qNumMeta:     document.getElementById('q-num-meta'),
      questionText: document.getElementById('question-text'),
      optionsList:  document.getElementById('options-list'),
      explanation:  document.getElementById('explanation'),
      nextBtn:      document.getElementById('next-btn'),
      streakDisplay: document.getElementById('streak-display'),
      // result
      scoreNum:     document.getElementById('score-num'),
      scoreTotal:   document.getElementById('score-total'),
      gradeBadge:   document.getElementById('grade-badge'),
      resCorrect:   document.getElementById('res-correct'),
      resWrong:     document.getElementById('res-wrong'),
      resStreak:    document.getElementById('res-streak'),
      reviewItems:  document.getElementById('review-items'),
      resultTitle:  document.getElementById('result-title'),
      resultSub:    document.getElementById('result-subtitle'),
      // home
      leaderboardEl: document.getElementById('home-leaderboard')
    };
  },

  showScreen(name) {
    Object.entries(this.els.screens).forEach(([key, el]) => {
      if (key === name) {
        el.classList.remove('hidden');
        el.classList.add('active');
      } else {
        el.classList.remove('active');
        el.classList.add('hidden');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderHomeLeaderboard(scores) {
    const el = this.els.leaderboardEl;
    if (!el) return;
    const cats = Object.keys(QuestionBank.CATEGORIES);
    const hasSome = cats.some(c => scores[c]);

    if (!hasSome) {
      el.innerHTML = '<p class="lb-empty">No scores yet. Complete a quiz to appear here!</p>';
      return;
    }

    let html = '<div class="lb-grid">';
    cats.forEach(cat => {
      const info = QuestionBank.CATEGORIES[cat];
      const entry = scores[cat];
      html += `<div class="lb-item">
        <span class="lb-icon">${info.icon}</span>
        <span class="lb-cat">${info.name}</span>
        <span class="lb-score">${entry ? `${entry.score}/${entry.total}` : '—'}</span>
      </div>`;
    });
    html += '</div>';
    el.innerHTML = html;
  },

  renderQuestion(question, index, total, timeLeft, maxTime, streak) {
    const pct = ((index + 1) / total) * 100;
    this.els.progressBar.style.width = pct + '%';
    this.els.qCounter.textContent = `Q ${index + 1} of ${total}`;
    this.updateTimer(timeLeft, maxTime);

    // Streak
    if (streak > 0) {
      this.els.streakDisplay.textContent = `🔥 ${streak} streak`;
      this.els.streakDisplay.style.display = 'inline-flex';
    } else {
      this.els.streakDisplay.style.display = 'none';
    }

    const catInfo = QuestionBank.CATEGORIES[QuizEngine.state.category];
    this.els.catBadge.textContent = catInfo ? catInfo.name : '';
    this.els.qNumMeta.textContent = `Question ${index + 1}`;
    this.els.questionText.textContent = question.text;

    // Hide explanation / next btn
    this.els.explanation.className = 'explanation';
    this.els.explanation.innerHTML = '';
    this.els.nextBtn.className = 'next-btn';
    this.els.nextBtn.textContent = index === total - 1 ? 'See Results →' : 'Next Question →';

    // Options
    const letters = ['A', 'B', 'C', 'D'];
    this.els.optionsList.innerHTML = '';
    question.options.forEach((opt, i) => {
      const div = document.createElement('div');
      div.className = 'option';
      div.dataset.idx = i;
      div.innerHTML = `<span class="option-letter">${letters[i]}</span>${this._escape(opt)}`;
      this.els.optionsList.appendChild(div);
    });

    // Animate card
    const card = document.getElementById('question-card');
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = '';
  },

  showAnswer(selectedIdx, correctIdx, explanation, isPractice) {
    const opts = this.els.optionsList.querySelectorAll('.option');
    opts.forEach((o, i) => {
      if (i === correctIdx) o.classList.add('correct');
      else if (i === selectedIdx && selectedIdx !== correctIdx) o.classList.add('wrong');
    });

    if (isPractice || explanation) {
      this.els.explanation.innerHTML = `<strong>Explanation:</strong> ${this._escape(explanation)}`;
      this.els.explanation.classList.add('show');
    }

    this.els.nextBtn.classList.add('show');
  },

  renderResults(results) {
    const { score, total, grade, streak, answers, category } = results;

    this.els.resultTitle.textContent = this._gradeTitle(grade);
    this.els.resultSub.textContent = `You scored ${score}/${total} in ${QuestionBank.CATEGORIES[category]?.name || category}`;
    this.els.scoreNum.textContent = score;
    if (this.els.scoreTotal) this.els.scoreTotal.textContent = `/${total}`;
    this.els.gradeBadge.textContent = grade;

    const gradeLower = grade.toLowerCase();
    this.els.gradeBadge.className = 'grade-badge';
    if (gradeLower.includes('expert')) this.els.gradeBadge.classList.add('grade-expert');
    else if (gradeLower.includes('advanced')) this.els.gradeBadge.classList.add('grade-advanced');
    else if (gradeLower.includes('intermediate')) this.els.gradeBadge.classList.add('grade-intermediate');
    else this.els.gradeBadge.classList.add('grade-learning');

    const correct = answers.filter(a => a.correct).length;
    const wrong = total - correct;
    this.els.resCorrect.textContent = correct;
    this.els.resWrong.textContent = wrong;
    this.els.resStreak.textContent = streak;

    // Review list
    this.els.reviewItems.innerHTML = '';
    answers.forEach((ans, i) => {
      const div = document.createElement('div');
      div.className = `review-item ${ans.correct ? 'correct' : 'wrong'}`;
      const selectedText = ans.selected >= 0
        ? `Your answer: ${ans.question.options[ans.selected]}`
        : 'Time expired — no answer';
      const correctText = `Correct: ${ans.question.options[ans.question.correct]}`;
      div.innerHTML = `
        <div class="q-num">Q${i + 1}</div>
        <div class="q">${this._escape(ans.question.text)}</div>
        <div class="a">${ans.correct ? '✓ ' : '✗ '}${this._escape(selectedText)}</div>
        ${!ans.correct ? `<div class="correct-ans">✓ ${this._escape(correctText)}</div>` : ''}
      `;
      this.els.reviewItems.appendChild(div);
    });
  },

  updateTimer(seconds, maxTime) {
    const el = this.els.timer;
    if (!el) return;
    el.textContent = seconds;
    el.classList.toggle('warning', seconds <= 10);
  },

  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      if (!this._audioCtx) this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this._audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'tick') {
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Silently fail if audio context unavailable
    }
  },

  showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  },

  _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _gradeTitle(grade) {
    const g = grade.toLowerCase();
    if (g.includes('expert')) return 'Outstanding!';
    if (g.includes('advanced')) return 'Well Done!';
    if (g.includes('intermediate')) return 'Good Effort!';
    return 'Keep Going!';
  }
};
