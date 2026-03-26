const DragController = {
  draggedId: null,

  init(onDropCallback) {
    this._onDropCallback = onDropCallback;
    this.rebind();
  },

  rebind() {
    // Cards
    document.querySelectorAll('.card').forEach(el => {
      el.removeEventListener('dragstart', el._dragStart);
      el.removeEventListener('dragend',   el._dragEnd);

      el._dragStart = (e) => this.onDragStart(e);
      el._dragEnd   = (e) => this.onDragEnd(e);

      el.addEventListener('dragstart', el._dragStart);
      el.addEventListener('dragend',   el._dragEnd);
    });

    // Columns
    document.querySelectorAll('.column').forEach(col => {
      col.removeEventListener('dragover',  col._dragOver);
      col.removeEventListener('dragleave', col._dragLeave);
      col.removeEventListener('drop',      col._drop);

      col._dragOver  = (e) => this.onDragOver(e);
      col._dragLeave = (e) => this.onDragLeave(e);
      col._drop      = (e) => this.onDrop(e, col.dataset.col);

      col.addEventListener('dragover',  col._dragOver);
      col.addEventListener('dragleave', col._dragLeave);
      col.addEventListener('drop',      col._drop);
    });
  },

  onDragStart(e) {
    const card = e.currentTarget;
    this.draggedId = parseInt(card.dataset.id, 10);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(this.draggedId));
    setTimeout(() => {
      if (card) card.classList.add('dragging');
    }, 0);
  },

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  },

  onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  },

  onDrop(e, col) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const id = this.draggedId || parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (id && this._onDropCallback) {
      this._onDropCallback(id, col);
    }
    this.draggedId = null;
  },

  onDragEnd(e) {
    document.querySelectorAll('.card.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.column.drag-over').forEach(el => el.classList.remove('drag-over'));
    this.draggedId = null;
  }
};
