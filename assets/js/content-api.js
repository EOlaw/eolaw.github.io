/* ================================================================
   InsightSerenity — Content API
   Loads blog-posts.json and case-studies.json, exposes query methods.
   Pattern mirrors scripture/js/bible.js
   ================================================================ */

var ContentAPI = (function () {
  'use strict';

  var _posts    = [];
  var _projects = [];

  /* ── Loaders ──────────────────────────────────────────────────── */
  function loadPosts() {
    return fetch('/assets/data/blog-posts.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load blog posts');
        return r.json();
      })
      .then(function (data) {
        _posts = data;
        return data;
      });
  }

  function loadProjects() {
    return fetch('/assets/data/case-studies.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load case studies');
        return r.json();
      })
      .then(function (data) {
        _projects = data;
        return data;
      });
  }

  /* ── Blog Posts ───────────────────────────────────────────────── */
  function getAllPosts() {
    return _posts.slice();
  }

  function getPostsByCategory(category) {
    if (!category || category === 'all') return _posts.slice();
    return _posts.filter(function (p) { return p.category === category; });
  }

  function getFeaturedPost() {
    return _posts.find(function (p) { return p.featured; }) || _posts[0] || null;
  }

  function getRegularPosts() {
    return _posts.filter(function (p) { return !p.featured; });
  }

  function getPostBySlug(slug) {
    return _posts.find(function (p) { return p.slug === slug; }) || null;
  }

  function getRelatedPosts(post, limit) {
    limit = limit || 3;
    return _posts
      .filter(function (p) { return p.slug !== post.slug && p.category === post.category; })
      .slice(0, limit);
  }

  /* ── Case Studies ─────────────────────────────────────────────── */
  function getAllProjects() {
    return _projects.slice();
  }

  function getProjectsByCategory(category) {
    if (!category || category === 'all') return _projects.slice();
    return _projects.filter(function (p) { return p.category === category; });
  }

  function getFeaturedProject() {
    return _projects.find(function (p) { return p.featured; }) || _projects[0] || null;
  }

  function getRegularProjects() {
    return _projects.filter(function (p) { return !p.featured; });
  }

  function getProjectBySlug(slug) {
    return _projects.find(function (p) { return p.slug === slug; }) || null;
  }

  function getRelatedProjects(project, limit) {
    limit = limit || 3;
    return _projects
      .filter(function (p) { return p.slug !== project.slug && p.category === project.category; })
      .slice(0, limit);
  }

  /* ── Public API ───────────────────────────────────────────────── */
  return {
    loadPosts:            loadPosts,
    loadProjects:         loadProjects,
    getAllPosts:           getAllPosts,
    getPostsByCategory:   getPostsByCategory,
    getFeaturedPost:      getFeaturedPost,
    getRegularPosts:      getRegularPosts,
    getPostBySlug:        getPostBySlug,
    getRelatedPosts:      getRelatedPosts,
    getAllProjects:        getAllProjects,
    getProjectsByCategory:getProjectsByCategory,
    getFeaturedProject:   getFeaturedProject,
    getRegularProjects:   getRegularProjects,
    getProjectBySlug:     getProjectBySlug,
    getRelatedProjects:   getRelatedProjects
  };

})();
