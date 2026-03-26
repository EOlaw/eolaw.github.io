/* quiz-platform/js/app.js */
const QuizApp = {
  selectedCategory: null,
  selectedDifficulty: 'medium',
  isPractice: false,
  soundEnabled: true,
  scores: {},

  init() {
    QuizUI.init();
    this._loadScores();
    QuizUI.renderHomeLeaderboard(this.scores);
    this._bindEvents();
    QuizUI.showScreen('home');
  },

  _loadScores() {
    try {
      const raw = localStorage.getItem('quiz_scores');
      this.scores = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.scores = {};
    }
  },

  _saveScores() {
    try {
      localStorage.setItem('quiz_scores', JSON.stringify(this.scores));
    } catch (e) {}
  },

  _bindEvents() {
    // Category card clicks
    document.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCategory = card.dataset.cat;
      });
    });

    // Difficulty toggle
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDifficulty = btn.dataset.diff;
      });
    });

    // Practice mode checkbox
    const practiceToggle = document.getElementById('practice-toggle');
    if (practiceToggle) {
      practiceToggle.addEventListener('change', () => {
        this.isPractice = practiceToggle.checked;
      });
    }

    // Start quiz button
    document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());

    // Next button
    document.getElementById('next-btn').addEventListener('click', () => this.handleNext());

    // Play Again
    document.getElementById('play-again-btn').addEventListener('click', () => {
      this.startQuiz();
    });

    // Change Category
    document.getElementById('change-cat-btn').addEventListener('click', () => {
      QuizUI.showScreen('home');
    });

    // Share Score
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareScore());
    }

    // Sound toggle
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        QuizUI.soundEnabled = this.soundEnabled;
        soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        soundBtn.title = this.soundEnabled ? 'Sound on' : 'Sound off';
      });
    }
  },

  startQuiz() {
    if (!this.selectedCategory) {
      // Auto-select first category
      const first = document.querySelector('.cat-card');
      if (first) {
        first.classList.add('selected');
        this.selectedCategory = first.dataset.cat;
      }
    }

    QuizEngine.start(this.selectedCategory, this.selectedDifficulty, this.isPractice);
    QuizUI.showScreen('quiz');
    this.showCurrentQuestion();
  },

  showCurrentQuestion() {
    const { currentIndex, questions, streak, timePerQ, isPractice } = QuizEngine.state;
    const q = QuizEngine.getCurrentQuestion();
    if (!q) return;

    QuizUI.renderQuestion(q, currentIndex, questions.length, timePerQ, timePerQ, streak);

    // Attach option listeners
    document.querySelectorAll('#options-list .option').forEach(opt => {
      opt.addEventListener('click', () => {
        const idx = parseInt(opt.dataset.idx, 10);
        this.handleAnswer(idx);
      });
    });

    // Start timer unless practice mode
    if (!isPractice) {
      QuizEngine.startTimer(
        (remaining) => {
          QuizUI.updateTimer(remaining, timePerQ);
          if (remaining <= 5) QuizUI.playSound('tick');
        },
        () => {
          // Time expired — auto-submit as no answer
          this._handleTimeout();
        }
      );
    }
  },

  handleAnswer(optionIndex) {
    QuizEngine.stopTimer();
    const result = QuizEngine.submitAnswer(optionIndex);
    QuizUI.showAnswer(optionIndex, result.correctIndex, result.explanation, QuizEngine.state.isPractice);
    QuizUI.soundEnabled = this.soundEnabled;
    QuizUI.playSound(result.isCorrect ? 'correct' : 'wrong');
  },

  _handleTimeout() {
    // Record no-answer
    const q = QuizEngine.getCurrentQuestion();
    const result = QuizEngine.submitAnswer(-1);
    QuizUI.showAnswer(-1, result.correctIndex, result.explanation, QuizEngine.state.isPractice);
    QuizUI.playSound('wrong');
  },

  handleNext() {
    const hasMore = QuizEngine.nextQuestion();
    if (hasMore) {
      this.showCurrentQuestion();
    } else {
      this.showResults();
    }
  },

  showResults() {
    const results = QuizEngine.getResults();
    QuizUI.showScreen('result');
    QuizUI.renderResults(results);
    this.saveScore(results);

    // Update share button data
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.dataset.score = results.score;
      shareBtn.dataset.total = results.total;
      shareBtn.dataset.category = results.category;
    }
  },

  saveScore(results) {
    const { category, score, total } = results;
    const existing = this.scores[category];
    if (!existing || score > existing.score) {
      this.scores[category] = { score, total, date: new Date().toISOString() };
      this._saveScores();
    }
  },

  shareScore() {
    const btn = document.getElementById('share-btn');
    const score = btn ? btn.dataset.score : '?';
    const total = btn ? btn.dataset.total : '10';
    const category = btn ? btn.dataset.category : '';
    const catName = QuestionBank.CATEGORIES[category]?.name || category;

    const text = `I scored ${score}/${total} on InsightSerenity's ${catName} quiz! 🧠 Take it at insightserenity.com/quiz-platform/`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        QuizUI.showToast('Copied to clipboard!');
      }).catch(() => this._fallbackCopy(text));
    } else {
      this._fallbackCopy(text);
    }
  },

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    QuizUI.showToast('Copied to clipboard!');
  }
};

window.addEventListener('DOMContentLoaded', () => QuizApp.init());
