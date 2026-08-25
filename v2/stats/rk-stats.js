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
      },
      dailyStreak: {
        current: 0,
        best: 0,
        lastPlayed: null,
        freezes: 1,
        history: []
      }
    };
  }

  // --- Date Helpers ---
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function daysBetween(d1, d2) {
    var a = new Date(d1 + 'T00:00:00');
    var b = new Date(d2 + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  // --- Daily Streak ---
  function updateDailyStreak() {
    var data = load();
    if (!data) return { current: 0, best: 0, changed: false };

    if (!data.dailyStreak) {
      data.dailyStreak = { current: 0, best: 0, lastPlayed: null, freezes: 1, history: [] };
    }

    var ds = data.dailyStreak;
    var today = todayStr();
    var changed = false;

    if (ds.lastPlayed === today) {
      return { current: ds.current, best: ds.best, changed: false, milestone: null };
    }

    var milestone = null;
    if (!ds.lastPlayed) {
      ds.current = 1;
      changed = true;
    } else {
      var gap = daysBetween(ds.lastPlayed, today);
      if (gap === 1) {
        ds.current++;
        changed = true;
      } else if (gap > 1) {
        if (ds.freezes > 0 && gap === 2) {
          ds.freezes--;
          ds.current++;
          changed = true;
        } else {
          ds.current = 1;
          changed = true;
        }
      }
    }

    ds.lastPlayed = today;
    if (ds.current > ds.best) ds.best = ds.current;

    if (ds.current === 7) milestone = 'week';
    else if (ds.current === 30) milestone = 'month';
    else if (ds.current === 100) milestone = 'legend';
    else if (ds.current === 365) milestone = 'year';

    if (ds.history.indexOf(today) === -1) {
      ds.history.push(today);
      if (ds.history.length > 30) ds.history = ds.history.slice(-30);
    }

    save(data);

    try {
      var user = getUser();
      if (user && typeof UserStatsDB !== 'undefined' && UserStatsDB.saveUserInfo) {
        UserStatsDB.saveUserInfo(user, { dailyStreak: ds.current, bestStreak: ds.best });
      }
    } catch(e) {}

    return { current: ds.current, best: ds.best, changed: changed, milestone: milestone };
  }

  function getDailyStreak() {
    var data = load();
    if (!data || !data.dailyStreak) return { current: 0, best: 0, freezes: 1, history: [] };
    return data.dailyStreak;
  }

  function useStreakFreeze() {
    var data = load();
    if (!data) return false;
    if (!data.dailyStreak) data.dailyStreak = { current: 0, best: 0, lastPlayed: null, freezes: 1, history: [] };
    if (data.dailyStreak.freezes > 0) {
      data.dailyStreak.freezes--;
      save(data);
      return true;
    }
    return false;
  }

  function getStreakEmoji(count) {
    if (count >= 365) return '🌟';
    if (count >= 100) return '👑';
    if (count >= 30) return '🏆';
    if (count >= 7) return '🎉';
    if (count >= 3) return '🔥';
    if (count >= 1) return '✨';
    return '💤';
  }

  function getStreakMessage(count) {
    if (count >= 365) return '¡Un año completo! Eres legendario';
    if (count >= 100) return '¡100 días! Eres imparable';
    if (count >= 30) return '¡Un mes entero! Increíble';
    if (count >= 14) return '¡Dos semanas! Sigue así';
    if (count >= 7) return '¡Una semana! Gran logro';
    if (count >= 3) return '¡Buen comienzo! No pares';
    if (count >= 1) return '¡Día uno! El primer paso';
    return '¡Comienza tu racha hoy!';
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
      '.rk-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px;overflow-y:auto;opacity:0;animation:fadeIn .3s ease both}' +
      '.rk-modal{background:#fff;border-radius:28px;padding:28px 24px;max-width:min(400px,92vw);width:100%;max-height:calc(100dvh - 24px);overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,.15);transform:scale(.92);animation:scaleIn .4s cubic-bezier(.2,.9,.3,1.2) .05s both}' +
      '.rk-modal-header{text-align:center;margin-bottom:20px}' +
      '.rk-modal-emoji{font-size:2.2rem;margin-bottom:8px}' +
      '.rk-modal-header h2{font-size:1.25rem;font-weight:700;letter-spacing:-.03em;margin-bottom:4px}' +
      '.rk-modal-header p{font-size:.85rem;color:#6e6e73}' +
      '.rk-rounds-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}' +
      '.rk-round-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 6px;border-radius:16px;border:2px solid rgba(0,0,0,.08);background:rgba(245,245,247,.6);cursor:pointer;transition:all .2s;font-family:Inter,sans-serif}' +
      '.rk-round-btn:hover{border-color:#007aff;background:rgba(0,122,255,.06);transform:scale(1.04)}' +
      '.rk-round-btn:active{transform:scale(.96)}' +
      '.rk-round-num{font-size:1.3rem;font-weight:800;color:#1d1d1f}' +
      '.rk-round-label{font-size:.65rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:.04em}' +
      '.rk-round-infinite .rk-round-num{color:#007aff}' +
      '.rk-modal-skip{width:100%;padding:12px;border:none;border-radius:980px;background:transparent;color:#86868b;font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:color .15s}' +
      '.rk-modal-skip:hover{color:#1d1d1f}' +
      '@media(max-width:480px){.rk-modal{padding:20px 16px;max-height:calc(100dvh - 16px)}.rk-modal-header{margin-bottom:14px}.rk-rounds-grid{grid-template-columns:repeat(3,1fr);gap:6px}.rk-round-btn{padding:10px 4px}}' +
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

    if (result.level) {
      g.bestLevel = Math.max(g.bestLevel || 1, result.level);
    }
    if (result.streak) {
      g.bestStreak = Math.max(g.bestStreak || 0, result.streak);
    }

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
      level: result.level || 1,
      streak: result.streak || 0,
      rounds: result.rounds,
      totalTime: result.totalTime || 0,
      correct: result.correct || 0,
      wrong: result.wrong || 0,
      errors: result.errors || [],
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
          level: result.level || 1,
          streak: result.streak || 0,
          totalTime: result.totalTime || 0,
          correct: result.correct || 0,
          wrong: result.wrong || 0,
          errors: result.errors || []
        });
        UserStatsDB.saveHistory(user, {
          gameId: gameId,
          gameName: gameId,
          score: result.score,
          level: result.level || 1,
          rounds: result.rounds,
          correct: result.correct || 0,
          wrong: result.wrong || 0,
          errors: result.errors || [],
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
    elapsed: elapsed,
    updateDailyStreak: updateDailyStreak,
    getDailyStreak: getDailyStreak,
    useStreakFreeze: useStreakFreeze,
    getStreakEmoji: getStreakEmoji,
    getStreakMessage: getStreakMessage,
    todayStr: todayStr
  };
})();
