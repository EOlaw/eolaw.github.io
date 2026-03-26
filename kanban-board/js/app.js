const KanbanApp = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
  editingId: null,

  COLS: [
    { id: 'backlog',    label: 'Backlog',     dot: '#94a3b8' },
    { id: 'inprogress', label: 'In Progress', dot: '#60a5fa' },
    { id: 'review',     label: 'Review',      dot: '#ffc451' },
    { id: 'done',       label: 'Done',        dot: '#34d399' },
  ],

  init() {
    this.tasks = KanbanStorage.load();
    if (!localStorage.getItem(KanbanStorage.KEY)) {
      KanbanStorage.save(this.tasks);
    }

    this.renderBoard();
    DragController.init((id, col) => this.handleDrop(id, col));
    this._bindEvents();
  },

  _bindEvents() {
    // Search
    const searchEl = document.getElementById('searchInput');
    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderBoard();
      });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.renderBoard();
      });
    });

    // Add task button
    const addBtn = document.getElementById('addTaskBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openModal(null, 'backlog'));
    }

    // Modal save/cancel
    document.getElementById('modalSaveBtn').addEventListener('click', () => this.saveModal());
    document.getElementById('modalCancelBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCloseBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalOverlay')) this.closeModal();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.openModal(null, 'backlog');
      }
      if (e.ctrlKey && e.key === 'Enter') {
        if (document.getElementById('modalOverlay').classList.contains('open')) {
          this.saveModal();
        }
      }
    });

    // Column add buttons
    document.querySelectorAll('.col-add-btn').forEach(btn => {
      btn.addEventListener('click', () => this.openModal(null, btn.dataset.col));
    });
  },

  _isOverdue(task) {
    if (!task.dueDate || task.col === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate + 'T00:00:00');
    return due < today;
  },

  getVisibleTasks(col) {
    return this.tasks.filter(t => {
      if (t.col !== col) return false;
      if (this.filter !== 'all' && t.priority !== this.filter) return false;
      if (this.searchQuery) {
        const q = this.searchQuery;
        return t.title.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q);
      }
      return true;
    });
  },

  renderBoard() {
    this.COLS.forEach(cfg => this.renderColumn(cfg.id, cfg));
    this.updateStats();
  },

  renderColumn(colId, colConfig) {
    const colTasks = this.getVisibleTasks(colId);
    const list = document.getElementById('list-' + colId);
    const countEl = document.getElementById('count-' + colId);

    if (!list) return;

    if (colTasks.length === 0) {
      list.innerHTML = '<div class="col-empty">Drop cards here</div>';
    } else {
      list.innerHTML = colTasks.map(t => this.renderCard(t)).join('');
    }

    if (countEl) countEl.textContent = colTasks.length;

    DragController.rebind();
  },

  renderCard(task) {
    const overdue = this._isOverdue(task);
    const descSnip = task.desc ? task.desc.substring(0, 80) + (task.desc.length > 80 ? '...' : '') : '';
    const dueBadge = task.dueDate
      ? `<span class="due-date ${overdue ? 'overdue-date' : ''}">${overdue ? '⚠ ' : '📅 '}${task.dueDate}</span>`
      : '';

    return `
      <div class="card ${task.priority}${overdue ? ' overdue' : ''}" data-id="${task.id}" draggable="true">
        <div class="card-title">${this._esc(task.title)}</div>
        ${descSnip ? `<div class="card-desc">${this._esc(descSnip)}</div>` : ''}
        <div class="card-footer">
          <div class="card-meta">
            <span class="priority-badge ${task.priority}">${task.priority}</span>
            ${dueBadge}
          </div>
          <div class="card-actions">
            <button class="card-btn" onclick="KanbanApp.openModal(${task.id})" title="Edit">✏️</button>
            <button class="card-btn delete" onclick="KanbanApp.deleteTask(${task.id})" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  },

  openModal(taskId, defaultCol) {
    const isEdit = taskId !== null && taskId !== undefined;

    if (isEdit) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;
      this.editingId = task.id;
      document.getElementById('modalTitle').textContent        = 'Edit Task';
      document.getElementById('modalSaveBtn').textContent      = 'Save Changes';
      document.getElementById('taskTitle').value               = task.title;
      document.getElementById('taskDesc').value                = task.desc || '';
      document.getElementById('taskPriority').value            = task.priority;
      document.getElementById('taskCol').value                 = task.col;
      document.getElementById('taskDueDate').value             = task.dueDate || '';
    } else {
      this.editingId = null;
      document.getElementById('modalTitle').textContent        = 'Add Task';
      document.getElementById('modalSaveBtn').textContent      = 'Add Task';
      document.getElementById('taskTitle').value               = '';
      document.getElementById('taskDesc').value                = '';
      document.getElementById('taskPriority').value            = 'medium';
      document.getElementById('taskCol').value                 = defaultCol || 'backlog';
      document.getElementById('taskDueDate').value             = '';
    }

    document.getElementById('modalOverlay').classList.add('open');
    setTimeout(() => document.getElementById('taskTitle').focus(), 150);
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    this.editingId = null;
  },

  saveModal() {
    const title    = document.getElementById('taskTitle').value.trim();
    const desc     = document.getElementById('taskDesc').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const col      = document.getElementById('taskCol').value;
    const dueDate  = document.getElementById('taskDueDate').value;

    if (!title) {
      document.getElementById('taskTitle').focus();
      this.showToast('Please enter a task title.');
      return;
    }

    if (this.editingId !== null) {
      this.tasks = KanbanStorage.update(this.editingId, { title, desc, priority, col, dueDate });
      this.showToast('Task updated!');
    } else {
      const newTask = { id: Date.now(), title, desc, priority, col, dueDate };
      this.tasks = KanbanStorage.add(newTask);
      this.showToast('Task added to ' + this._colLabel(col));
    }

    this.closeModal();
    this.renderBoard();
  },

  handleDrop(taskId, newCol) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    const oldCol = task.col;
    if (oldCol === newCol) return;
    this.tasks = KanbanStorage.move(taskId, newCol);
    this.renderBoard();
    this.showToast('Moved to ' + this._colLabel(newCol));
  },

  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    if (!confirm(`Delete "${task.title}"?`)) return;
    this.tasks = KanbanStorage.remove(id);
    this.renderBoard();
    this.showToast('Task deleted.');
  },

  updateStats() {
    const stats = KanbanStorage.getStats(this.tasks);
    const totalEl      = document.getElementById('statTotal');
    const completionEl = document.getElementById('statCompletion');
    const overdueEl    = document.getElementById('statOverdue');

    if (totalEl)      totalEl.textContent      = 'Total Tasks ' + stats.total;
    if (completionEl) completionEl.textContent = 'Completion ' + stats.completionPct + '%';
    if (overdueEl)    overdueEl.textContent    = 'Overdue ' + stats.overdue;
  },

  showToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2400);
  },

  _colLabel(col) {
    return { backlog: 'Backlog', inprogress: 'In Progress', review: 'Review', done: 'Done' }[col] || col;
  },

  _esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

document.addEventListener('DOMContentLoaded', () => KanbanApp.init());
