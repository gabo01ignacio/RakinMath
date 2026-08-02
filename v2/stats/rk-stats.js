/* ============================================================
   RakinMath — Central Statistics & Tracking System
   Handles game sessions, activity tracking, and progress data
   ============================================================ */

var RK = window.RK || {};

RK.Stats = (function() {
  var PREFIX = 'rakin_stats_';

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
    if (!key) return null;
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultStats();
    } catch(e) {
      return defaultStats();
    }
  }

  function save(data) {
    var key = getKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  function defaultStats() {
    return {
      games: {},
      activities: {},
      summary: {
        totalGamesPlayed: 0,
        totalActivitiesCompleted: 0,
        totalTimeSpent: 0,
        overallCorrect: 0,
        overallWrong: 0,
        overallAccuracy: 0,
        streak: 0,
        bestStreak: 0,
        lastActivity: null
      }
    };
  }

  // --- Round Config Modal ---
  function showRoundModal(gameName, gameEmoji, callback) {
    var overlay = document.createElement('div');
    overlay.className = 'rk-modal-overlay';
    overlay.innerHTML =
      '<div class="rk-modal">' +
        '<div class="rk-modal-header">' +
          '<div class="rk-modal-emoji">' + gameEmoji + '</div>' +
          '<h2>¿Cuántas rondas?</h2>' +
          '<p>' + gameName + '</p>' +
        '</div>' +
        '<div class="rk-rounds-grid">' +
          '<button class="rk-round-btn" data-r="5"><span class="rk-round-num">5</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn" data-r="10"><span class="rk-round-num">10</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn" data-r="15"><span class="rk-round-num">15</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn" data-r="20"><span class="rk-round-num">20</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn" data-r="25"><span class="rk-round-num">25</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn" data-r="30"><span class="rk-round-num">30</span><span class="rk-round-label">rondas</span></button>' +
          '<button class="rk-round-btn rk-round-infinite" data-r="0"><span class="rk-round-num">∞</span><span class="rk-round-label">libre</span></button>' +
        '</div>' +
        '<button class="rk-modal-skip">Saltar e iniciar</button>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '.rk-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;animation:fadeIn .3s ease both}' +
      '.rk-modal{background:#fff;border-radius:32px;padding:36px 32px;max-width:400px;width:100%;box-shadow:0 25px 80px rgba(0,0,0,.15);transform:scale(.92);animation:scaleIn .4s cubic-bezier(.2,.9,.3,1.2) .05s both}' +
      '.rk-modal-header{text-align:center;margin-bottom:28px}' +
      '.rk-modal-emoji{font-size:2.5rem;margin-bottom:10px}' +
      '.rk-modal-header h2{font-size:1.4rem;font-weight:700;letter-spacing:-.03em;margin-bottom:4px}' +
      '.rk-modal-header p{font-size:.9rem;color:#6e6e73}' +
      '.rk-rounds-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}' +
      '.rk-round-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px 8px;border-radius:20px;border:2px solid rgba(0,0,0,.08);background:rgba(245,245,247,.6);cursor:pointer;transition:all .2s;font-family:Inter,sans-serif}' +
      '.rk-round-btn:hover{border-color:#007aff;background:rgba(0,122,255,.06);transform:scale(1.04)}' +
      '.rk-round-btn:active{transform:scale(.96)}' +
      '.rk-round-num{font-size:1.5rem;font-weight:800;color:#1d1d1f}' +
      '.rk-round-label{font-size:.7rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:.04em}' +
      '.rk-round-infinite .rk-round-num{color:#007aff}' +
      '.rk-modal-skip{width:100%;padding:12px;border:none;border-radius:980px;background:transparent;color:#86868b;font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:color .15s}' +
      '.rk-modal-skip:hover{color:#1d1d1f}' +
      '@keyframes fadeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}';

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    var btns = overlay.querySelectorAll('.rk-round-btn');
    btns.forEach(function(b) {
      b.addEventListener('click', function() {
        var rounds = parseInt(b.dataset.r);
        overlay.remove();
        callback(rounds);
      });
    });

    overlay.querySelector('.rk-modal-skip').addEventListener('click', function() {
      overlay.remove();
      callback(0);
    });
  }

  // --- Round Counter HUD ---
  function createRoundHUD(current, total) {
    var hud = document.createElement('div');
    hud.id = 'rk-round-hud';
    hud.style.cssText =
      'position:fixed;top:12px;left:50%;transform:translateX(-50%);' +
      'background:rgba(255,255,255,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
      'border:1px solid rgba(0,0,0,.06);border-radius:980px;padding:8px 20px;' +
      'font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;color:#1d1d1f;' +
      'box-shadow:0 2px 12px rgba(0,0,0,.06);z-index:9998;display:flex;align-items:center;gap:8px;' +
      'animation:fadeIn .3s ease both';
    if (total > 0) {
      hud.innerHTML = '<span style="color:#007aff">●</span> Ronda <span id="rk-round-current">' + current + '</span> / ' + total;
    } else {
      hud.innerHTML = '<span style="color:#007aff">●</span> Ronda <span id="rk-round-current">' + current + '</span>';
    }
    document.body.appendChild(hud);
    return hud;
  }

  function updateRoundHUD(current, total) {
    var el = document.getElementById('rk-round-current');
    if (el) el.textContent = current;
    var hud = document.getElementById('rk-round-hud');
    if (hud && total > 0) {
      hud.innerHTML = '<span style="color:#007aff">●</span> Ronda ' + current + ' / ' + total;
    }
  }

  function removeRoundHUD() {
    var el = document.getElementById('rk-round-hud');
    if (el) el.remove();
  }

  // --- Session End Modal ---
  function showEndModal(gameName, stats) {
    var acc = stats.correct + stats.wrong > 0
      ? Math.round(stats.correct / (stats.correct + stats.wrong) * 100)
      : 0;
    var avgTime = stats.rounds > 0 ? Math.round(stats.totalTime / stats.rounds) : 0;

    var overlay = document.createElement('div');
    overlay.className = 'rk-modal-overlay';
    overlay.innerHTML =
      '<div class="rk-modal">' +
        '<div class="rk-modal-header">' +
          '<div class="rk-modal-emoji">🎉</div>' +
          '<h2>¡Sesión completada!</h2>' +
          '<p>' + gameName + '</p>' +
        '</div>' +
        '<div class="rk-stats-grid">' +
          '<div class="rk-stat-box"><div class="rk-stat-val">' + stats.score + '</div><div class="rk-stat-lbl">Puntaje</div></div>' +
          '<div class="rk-stat-box"><div class="rk-stat-val">' + stats.rounds + '</div><div class="rk-stat-lbl">Rondas</div></div>' +
          '<div class="rk-stat-box"><div class="rk-stat-val">' + acc + '%</div><div class="rk-stat-lbl">Precisión</div></div>' +
          '<div class="rk-stat-box"><div class="rk-stat-val">' + avgTime + 's</div><div class="rk-stat-lbl">Tiempo prom.</div></div>' +
        '</div>' +
        '<div class="rk-end-detail">' +
          '<span style="color:#34c759">✓ ' + stats.correct + ' correctas</span>' +
          ' · ' +
          '<span style="color:#ff3b30">✗ ' + stats.wrong + ' incorrectas</span>' +
        '</div>' +
        '<button class="rk-end-btn" onclick="window.location.reload()">Jugar de nuevo</button>' +
        '<a class="rk-end-link" href="menu.html">Volver al menú</a>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '.rk-stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}' +
      '.rk-stat-box{background:rgba(245,245,247,.6);border-radius:16px;padding:16px 12px;text-align:center}' +
      '.rk-stat-val{font-size:1.6rem;font-weight:800;color:#1d1d1f;letter-spacing:-.02em}' +
      '.rk-stat-lbl{font-size:.7rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:.04em;margin-top:2px}' +
      '.rk-end-detail{text-align:center;font-size:.9rem;color:#6e6e73;margin-bottom:20px}' +
      '.rk-end-btn{display:block;width:100%;padding:14px;border:none;border-radius:980px;background:#007aff;color:#fff;font-family:Inter,sans-serif;font-size:1rem;font-weight:600;cursor:pointer;transition:transform .15s,background .2s;margin-bottom:10px}' +
      '.rk-end-btn:hover{background:#0056b3}' +
      '.rk-end-btn:active{transform:scale(.97)}' +
      '.rk-end-link{display:block;text-align:center;font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;color:#86868b;text-decoration:none;transition:color .15s}' +
      '.rk-end-link:hover{color:#1d1d1f}';

    document.head.appendChild(style);
    document.body.appendChild(overlay);
  }

  // --- Core: Save Game Result ---
  function saveGameResult(gameId, result) {
    var user = getUser();
    var data = load();
    if (!data) return;

    if (!data.games[gameId]) {
      data.games[gameId] = {
        sessions: 0,
        totalScore: 0,
        bestScore: 0,
        totalTime: 0,
        correct: 0,
        wrong: 0,
        history: []
      };
    }

    var g = data.games[gameId];
    g.sessions++;
    g.totalScore += result.score;
    g.bestScore = Math.max(g.bestScore, result.score);
    g.totalTime += result.totalTime || 0;
    g.correct += result.correct || 0;
    g.wrong += result.wrong || 0;

    var totalAttempts = g.correct + g.wrong;
    g.avgScore = g.sessions > 0 ? Math.round(g.totalScore / g.sessions) : 0;
    g.avgTimePerRound = result.rounds > 0 ? Math.round((result.totalTime || 0) / result.rounds) : 0;
    g.accuracy = totalAttempts > 0 ? Math.round(g.correct / totalAttempts * 100) : 0;

    if (result.errors && result.errors.length > 0) {
      if (!g.commonErrors) g.commonErrors = {};
      result.errors.forEach(function(err) {
        g.commonErrors[err] = (g.commonErrors[err] || 0) + 1;
      });
    }

    g.history.unshift({
      date: new Date().toISOString(),
      score: result.score,
      rounds: result.rounds,
      totalTime: result.totalTime || 0,
      correct: result.correct || 0,
      wrong: result.wrong || 0,
      accuracy: result.rounds > 0 ? Math.round((result.correct || 0) / result.rounds * 100) : 0
    });

    if (g.history.length > 50) g.history = g.history.slice(0, 50);

    data.summary.totalGamesPlayed++;
    data.summary.totalTimeSpent += result.totalTime || 0;
    data.summary.overallCorrect += result.correct || 0;
    data.summary.overallWrong += result.wrong || 0;
    var totalAll = data.summary.overallCorrect + data.summary.overallWrong;
    data.summary.overallAccuracy = totalAll > 0 ? Math.round(data.summary.overallCorrect / totalAll * 100) : 0;
    data.summary.lastActivity = new Date().toISOString();

    save(data);

    // --- Firebase sync ---
    try {
      if (typeof UserStatsDB !== 'undefined' && UserStatsDB.saveGame && user) {
        UserStatsDB.saveGame(user, {
          gameId: gameId,
          score: result.score,
          totalTime: result.totalTime || 0,
          correct: result.correct || 0,
          wrong: result.wrong || 0
        });
        UserStatsDB.saveHistory(user, {
          gameId: gameId,
          gameName: gameId,
          score: result.score,
          rounds: result.rounds,
          correct: result.correct || 0,
          wrong: result.wrong || 0,
          accuracy: totalAttempts > 0 ? Math.round(g.correct / totalAttempts * 100) : 0,
          totalTime: result.totalTime || 0
        });
      }
    } catch(e) {}
  }

  // --- Core: Save Activity Result ---
  function saveActivityResult(activityId, result) {
    var user = getUser();
    var data = load();
    if (!data) return;

    if (!data.activities[activityId]) {
      data.activities[activityId] = {
        attempts: 0,
        correct: 0,
        wrong: 0,
        totalTime: 0,
        lastAttempt: null,
        history: []
      };
    }

    var a = data.activities[activityId];
    a.attempts++;
    if (result.correct) {
      a.correct++;
    } else {
      a.wrong++;
    }
    a.totalTime += result.time || 0;
    a.accuracy = a.attempts > 0 ? Math.round(a.correct / a.attempts * 100) : 0;
    a.lastAttempt = new Date().toISOString();

    a.history.unshift({
      date: new Date().toISOString(),
      correct: result.correct,
      time: result.time || 0,
      topic: result.topic || ''
    });

    if (a.history.length > 100) a.history = a.history.slice(0, 100);

    data.summary.totalActivitiesCompleted++;
    data.summary.totalTimeSpent += result.time || 0;
    data.summary.lastActivity = new Date().toISOString();

    save(data);

    // --- Firebase sync ---
    try {
      if (typeof UserStatsDB !== 'undefined' && UserStatsDB.saveActivity && user) {
        UserStatsDB.saveActivity(user, {
          activityId: activityId,
          correct: result.correct ? 1 : 0,
          wrong: result.correct ? 0 : 1,
          time: result.time || 0
        });
      }
    } catch(e) {}
  }

  // --- Core: Get Stats ---
  function getGameStats(gameId) {
    var data = load();
    if (!data || !data.games[gameId]) return null;
    return data.games[gameId];
  }

  function getActivityStats(activityId) {
    var data = load();
    if (!data || !data.activities[activityId]) return null;
    return data.activities[activityId];
  }

  function getSummary() {
    var data = load();
    if (!data) return null;
    return data.summary;
  }

  function getAllStats() {
    return load();
  }

  // --- Timer Helper ---
  function startTimer() {
    return Date.now();
  }

  function elapsed(startTime) {
    return Math.round((Date.now() - startTime) / 1000);
  }

  return {
    getUser: getUser,
    load: load,
    save: save,
    showRoundModal: showRoundModal,
    createRoundHUD: createRoundHUD,
    updateRoundHUD: updateRoundHUD,
    removeRoundHUD: removeRoundHUD,
    showEndModal: showEndModal,
    saveGameResult: saveGameResult,
    saveActivityResult: saveActivityResult,
    getGameStats: getGameStats,
    getActivityStats: getActivityStats,
    getSummary: getSummary,
    getAllStats: getAllStats,
    startTimer: startTimer,
    elapsed: elapsed
  };
})();
