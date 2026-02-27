/* ======================================================
   The Word of God — Bible API (Frontend Utility)
   KJV Bible · Public Domain
   ====================================================== */

var BibleAPI = (function () {

  var _data = [];       // All verses from kjv-bible.json
  var _loaded = false;

  /* ---- Load data ---- */
  function init() {
    return fetch('/scripture/data/kjv-bible.json')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        _data = json;
        _loaded = true;
        return json;
      });
  }

  /* ---- Today's verse (deterministic by calendar date) ---- */
  function getTodaysVerse() {
    var featured = _data.filter(function (v) { return v.isFeatured; });
    if (!featured.length) return _data[0];
    var d = new Date();
    var dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    return featured[dayOfYear % featured.length];
  }

  /* ---- Get all motivational verses ---- */
  function getMotivational() {
    return _data.filter(function (v) { return v.isMotivational; });
  }

  /* ---- Get verses by tag ---- */
  function getByTag(tag) {
    var q = tag.toLowerCase();
    return _data.filter(function (v) {
      return (v.tags || []).some(function (t) { return t.toLowerCase() === q; });
    });
  }

  /* ---- Get all unique tags (sorted) ---- */
  function getAllTags() {
    var tags = {};
    _data.forEach(function (v) {
      (v.tags || []).forEach(function (t) { tags[t] = true; });
    });
    return Object.keys(tags).sort();
  }

  /* ---- Get all verses for a book ---- */
  function getBook(bookName) {
    return _data.filter(function (v) {
      return v.book.toLowerCase() === bookName.toLowerCase();
    });
  }

  /* ---- Get a specific chapter ---- */
  function getChapter(bookName, chapter) {
    return _data.filter(function (v) {
      return v.book.toLowerCase() === bookName.toLowerCase() &&
             v.chapter === parseInt(chapter, 10);
    });
  }

  /* ---- Get chapters available for a book (sorted) ---- */
  function getChaptersForBook(bookName) {
    var chs = {};
    _data.forEach(function (v) {
      if (v.book.toLowerCase() === bookName.toLowerCase()) chs[v.chapter] = true;
    });
    return Object.keys(chs).map(Number).sort(function (a, b) { return a - b; });
  }

  /* ---- Get books available in JSON ---- */
  function getBooksInData() {
    var books = {};
    _data.forEach(function (v) { books[v.book] = true; });
    return Object.keys(books).sort();
  }

  /* ---- Random verse (from featured) ---- */
  function getRandom() {
    var pool = _data.filter(function (v) { return v.isFeatured; });
    if (!pool.length) pool = _data;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* ---- Search ---- */
  function search(query) {
    if (!query || query.trim().length < 2) return [];
    var q = query.trim().toLowerCase();

    // Book Chapter:Verse reference e.g. "John 3:16" or "Psalms 23:1"
    var refMatch = q.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (refMatch) {
      return _data.filter(function (v) {
        return v.book.toLowerCase().indexOf(refMatch[1]) !== -1 &&
               v.chapter === parseInt(refMatch[2], 10) &&
               v.verse   === parseInt(refMatch[3], 10);
      });
    }

    // Book + chapter e.g. "John 3"
    var chapterMatch = q.match(/^(.+?)\s+(\d+)$/);
    if (chapterMatch) {
      return _data.filter(function (v) {
        return v.book.toLowerCase().indexOf(chapterMatch[1]) !== -1 &&
               v.chapter === parseInt(chapterMatch[2], 10);
      });
    }

    // Full text / tag / book search
    return _data.filter(function (v) {
      return v.text.toLowerCase().indexOf(q) !== -1 ||
             v.book.toLowerCase().indexOf(q) !== -1 ||
             (v.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
    });
  }

  /* ---- Format verse reference ---- */
  function formatRef(v) {
    return v.book + ' ' + v.chapter + ':' + v.verse;
  }

  /* ---- Share verse text ---- */
  function shareVerse(v) {
    var text = '\u201c' + v.text + '\u201d \u2014 ' + formatRef(v) + ' (KJV)';
    if (navigator.share) {
      navigator.share({ title: 'The Word of God', text: text, url: window.location.href });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        if (window.EOLAW && window.EOLAW.showToast) {
          window.EOLAW.showToast('Verse copied to clipboard!', 'success');
        }
      });
    }
  }

  return {
    init: init,
    getTodaysVerse: getTodaysVerse,
    getMotivational: getMotivational,
    getByTag: getByTag,
    getAllTags: getAllTags,
    getBook: getBook,
    getChapter: getChapter,
    getChaptersForBook: getChaptersForBook,
    getBooksInData: getBooksInData,
    getRandom: getRandom,
    search: search,
    formatRef: formatRef,
    shareVerse: shareVerse,
    get data() { return _data; },
    get loaded() { return _loaded; },
  };
})();
