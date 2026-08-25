/* ============================================================
   RakinMath — Progress Tracking System
   Tracks page completion, game plays, and overall progress
   ============================================================ */

var RK = window.RK || {};

RK.Progress = (function() {
  var PREFIX = 'rakin_progress_';

  function getUser() {
    try {
      var s = localStorage.getItem('rakin_session');
      var sv = s ? JSON.parse(s) : null;
      if (sv && sv.user) return sv.user;
    } catch(e) {}
    return null;
  }

  function getKey() {
    var user = getUser();
    return user ? PREFIX + user : null;
  }

  function load() {
    var key = getKey();
    if (!key) return defaultProgress();
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultProgress();
    } catch(e) {
      return defaultProgress();
    }
  }

  function save(data) {
    var key = getKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  function defaultProgress() {
    return {
      pages: {},
      games: {},
      quizzes: {},
      overall: {}
    };
  }

  // --- Page Tracking ---

  function markPageComplete(pageId, grado, eje) {
    var data = load();
    if (!data.pages[pageId]) {
      data.pages[pageId] = {
        completedAt: new Date().toISOString(),
        grado: grado,
        eje: eje
      };
      save(data);
      updateOverallProgress(data);
      return true; // new completion
    }
    return false; // already completed
  }

  function isPageComplete(pageId) {
    var data = load();
    return !!data.pages[pageId];
  }

  function getCompletedPages() {
    var data = load();
    return Object.keys(data.pages);
  }

  // --- Game Tracking ---

  function markGamePlayed(gameId) {
    var data = load();
    if (!data.games[gameId]) {
      data.games[gameId] = {
        playedAt: new Date().toISOString(),
        timesPlayed: 1
      };
      save(data);
      return true; // new play
    }
    data.games[gameId].timesPlayed = (data.games[gameId].timesPlayed || 1) + 1;
    data.games[gameId].lastPlayed = new Date().toISOString();
    save(data);
    return false;
  }

  function isGamePlayed(gameId) {
    var data = load();
    return !!data.games[gameId];
  }

  function getGamesPlayed() {
    var data = load();
    return Object.keys(data.games);
  }

  function getGamesPlayedCount() {
    var data = load();
    return Object.keys(data.games).length;
  }

  // --- Quiz Tracking ---

  function saveQuizScore(pageId, score, total) {
    var data = load();
    var pct = total > 0 ? Math.round((score / total) * 100) : 0;
    data.quizzes[pageId] = {
      score: score,
      total: total,
      percentage: pct,
      lastAttempt: new Date().toISOString()
    };
    // Update best score
    if (!data.quizzes[pageId + '_best'] || pct > data.quizzes[pageId + '_best']) {
      data.quizzes[pageId + '_best'] = pct;
    }
    save(data);
    return pct;
  }

  function getQuizScore(pageId) {
    var data = load();
    return data.quizzes[pageId] || null;
  }

  function getQuizBest(pageId) {
    var data = load();
    return data.quizzes[pageId + '_best'] || 0;
  }

  // --- Eje Progress ---

  function getEjeProgress(grado, eje, totalItems) {
    var data = load();
    var count = 0;
    Object.keys(data.pages).forEach(function(pageId) {
      var page = data.pages[pageId];
      if (page.grado === grado && page.eje === eje) {
        count++;
      }
    });
    return totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
  }

  function getEjeCompletedCount(grado, eje) {
    var data = load();
    var count = 0;
    Object.keys(data.pages).forEach(function(pageId) {
      var page = data.pages[pageId];
      if (page.grado === grado && page.eje === eje) {
        count++;
      }
    });
    return count;
  }

  // --- Grado Progress ---

  function updateOverallProgress(data) {
    var grados = {};
    Object.keys(data.pages).forEach(function(pageId) {
      var page = data.pages[pageId];
      var g = page.grado;
      if (!grados[g]) grados[g] = { total: 0, completed: 0, ejes: {} };
      grados[g].total++;
      grados[g].completed++;
      var e = page.eje;
      if (!grados[g].ejes[e]) grados[g].ejes[e] = 0;
      grados[g].ejes[e]++;
    });
    data.overall = grados;
    save(data);
  }

  function getGradoProgress(grado) {
    var data = load();
    updateOverallProgress(data);
    // Return percentage based on known totals
    var totals = {
      '4to': { numeros: 8, fracciones: 5, geometria: 6, medicion: 5, datos: 3, algebra: 3 },
      '5to': { numeros: 9, algebra: 2, geometria: 4, datos: 3 }
    };
    var total = 0;
    var completed = 0;
    var gradoTotals = totals[grado];
    if (gradoTotals) {
      Object.keys(gradoTotals).forEach(function(eje) {
        total += gradoTotals[eje];
        completed += getEjeCompletedCount(grado, eje);
      });
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  function getGradoCompletedCount(grado) {
    var data = load();
    var count = 0;
    Object.keys(data.pages).forEach(function(pageId) {
      var page = data.pages[pageId];
      if (page.grado === grado) count++;
    });
    return count;
  }

  // --- Stats ---

  function getStats() {
    var data = load();
    return {
      totalPages: Object.keys(data.pages).length,
      totalGames: Object.keys(data.games).length,
      totalQuizzes: Object.keys(data.quizzes).filter(function(k) { return k.indexOf('_best') === -1; }).length,
      grado4to: getGradoProgress('4to'),
      grado5to: getGradoProgress('5to')
    };
  }

  // --- Reset ---

  function reset() {
    var key = getKey();
    if (key) localStorage.removeItem(key);
  }

  return {
    markPageComplete: markPageComplete,
    isPageComplete: isPageComplete,
    getCompletedPages: getCompletedPages,
    markGamePlayed: markGamePlayed,
    isGamePlayed: isGamePlayed,
    getGamesPlayed: getGamesPlayed,
    getGamesPlayedCount: getGamesPlayedCount,
    saveQuizScore: saveQuizScore,
    getQuizScore: getQuizScore,
    getQuizBest: getQuizBest,
    getEjeProgress: getEjeProgress,
    getEjeCompletedCount: getEjeCompletedCount,
    getGradoProgress: getGradoProgress,
    getGradoCompletedCount: getGradoCompletedCount,
    getStats: getStats,
    reset: reset
  };
})();

window.RK = RK;
