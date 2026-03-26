const KanbanStorage = {
  KEY: 'kanban_tasks',

  _defaults() {
    return [
      { id: 1,  title: 'Set up data pipeline',      desc: 'Configure ETL pipeline for new client',             priority: 'high',   col: 'backlog',    dueDate: '2026-03-20' },
      { id: 2,  title: 'Write blog post draft',      desc: 'Article on RAG systems for production',             priority: 'medium', col: 'backlog',    dueDate: '2026-04-05' },
      { id: 3,  title: 'Build dashboard UI',         desc: 'Sales analytics dashboard with Chart.js',           priority: 'high',   col: 'inprogress', dueDate: '2026-03-28' },
      { id: 4,  title: 'Client discovery call',      desc: '30-min call with retail client',                    priority: 'medium', col: 'inprogress', dueDate: '2026-03-26' },
      { id: 5,  title: 'Code review - API',          desc: 'Review REST API implementation',                    priority: 'low',    col: 'review',     dueDate: '2026-04-01' },
      { id: 6,  title: 'Proposal document',          desc: 'Write project proposal for ML project',             priority: 'medium', col: 'review',     dueDate: '2026-03-22' },
      { id: 7,  title: 'Budget tracker app',         desc: 'Personal finance tracker with charts',              priority: 'medium', col: 'done',       dueDate: '2026-03-15' },
      { id: 8,  title: 'TSU presentation',           desc: 'Present data analysis project',                     priority: 'high',   col: 'done',       dueDate: '2026-03-18' },
    ];
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : this._defaults();
    } catch (e) {
      return this._defaults();
    }
  },

  save(tasks) {
    localStorage.setItem(this.KEY, JSON.stringify(tasks));
  },

  add(task) {
    const tasks = this.load();
    tasks.push(task);
    this.save(tasks);
    return tasks;
  },

  update(id, changes) {
    const tasks = this.load();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...changes };
    }
    this.save(tasks);
    return tasks;
  },

  remove(id) {
    const tasks = this.load().filter(t => t.id !== id);
    this.save(tasks);
    return tasks;
  },

  move(id, newCol) {
    return this.update(id, { col: newCol });
  },

  getStats(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const byCol = { backlog: 0, inprogress: 0, review: 0, done: 0 };
    let overdue = 0;

    tasks.forEach(t => {
      if (byCol[t.col] !== undefined) byCol[t.col]++;
      if (t.dueDate && t.col !== 'done') {
        const due = new Date(t.dueDate + 'T00:00:00');
        if (due < today) overdue++;
      }
    });

    const total = tasks.length;
    const completionPct = total > 0 ? Math.round((byCol.done / total) * 100) : 0;

    return { total, byCol, overdue, completionPct };
  }
};
