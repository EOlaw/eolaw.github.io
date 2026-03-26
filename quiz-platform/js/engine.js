/* quiz-platform/js/engine.js */
const QuizEngine = {

  state: {
    category: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    streak: 0,
    maxStreak: 0,
    startTime: null,
    timePerQ: 30,
    timerInterval: null,
    isPractice: false,
    timeLeft: 30
  },

  start(category, difficulty, isPractice) {
    const timeMap = { easy: 45, medium: 30, hard: 20 };
    const timePerQ = timeMap[difficulty] || 30;

    this.state = {
      category,
      questions: QuestionBank.get(category, 10),
      currentIndex: 0,
      score: 0,
      answers: [],
      streak: 0,
      maxStreak: 0,
      startTime: Date.now(),
      timePerQ,
      timerInterval: null,
      isPractice: !!isPractice,
      timeLeft: timePerQ
    };
  },

  getCurrentQuestion() {
    return this.state.questions[this.state.currentIndex];
  },

  submitAnswer(optionIndex) {
    this.stopTimer();
    const q = this.getCurrentQuestion();
    const isCorrect = optionIndex === q.correct;

    if (isCorrect) {
      this.state.score++;
      this.state.streak++;
      if (this.state.streak > this.state.maxStreak) {
        this.state.maxStreak = this.state.streak;
      }
    } else {
      this.state.streak = 0;
    }

    this.state.answers.push({
      questionId: q.id,
      question: q,
      selected: optionIndex,
      correct: isCorrect,
      timeLeft: this.state.timeLeft
    });

    return {
      isCorrect,
      correctIndex: q.correct,
      explanation: q.explanation
    };
  },

  nextQuestion() {
    this.state.currentIndex++;
    this.state.timeLeft = this.state.timePerQ;
    return this.state.currentIndex < this.state.questions.length;
  },

  startTimer(onTick, onExpire) {
    this.stopTimer();
    this.state.timeLeft = this.state.timePerQ;

    this.state.timerInterval = setInterval(() => {
      this.state.timeLeft--;
      if (typeof onTick === 'function') onTick(this.state.timeLeft);
      if (this.state.timeLeft <= 0) {
        this.stopTimer();
        if (typeof onExpire === 'function') onExpire();
      }
    }, 1000);
  },

  stopTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
  },

  getResults() {
    const { score, questions, answers, maxStreak, startTime, category } = this.state;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    return {
      score,
      total,
      percentage,
      grade: this.getGrade(percentage),
      streak: maxStreak,
      answers,
      timeTaken,
      category
    };
  },

  getGrade(pct) {
    if (pct >= 90) return 'Expert 🏆';
    if (pct >= 70) return 'Advanced ⭐';
    if (pct >= 50) return 'Intermediate 👍';
    return 'Keep Learning 📚';
  }
};
