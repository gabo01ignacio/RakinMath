/* ============================================================
   RakinMath — Medals & Achievements System
   Tracks earned medals and checks achievement conditions
   ============================================================ */

var RK = window.RK || {};

RK.Medals = (function() {
  var PREFIX = 'rakin_medals_';
  var STORAGE_KEY = 'rakin_medals';

  // Medal definitions
  var MEDALS = {
    // Theme completion medals
    'theme-numeros': { name: 'Maestro de Números', icon: '🔢', description: 'Completar todas las páginas de Números', category: 'theme' },
    'theme-fracciones': { name: 'Maestro de Fracciones', icon: '🍕', description: 'Completar todas las páginas de Fracciones', category: 'theme' },
    'theme-geometria': { name: 'Maestro de Geometría', icon: '📐', description: 'Completar todas las páginas de Geometría', category: 'theme' },
    'theme-medicion': { name: 'Maestro de Medición', icon: '📏', description: 'Completar todas las páginas de Medición', category: 'theme' },
    'theme-datos': { name: 'Maestro de Datos', icon: '📊', description: 'Completar todas las páginas de Datos', category: 'theme' },
    'theme-algebra': { name: 'Maestro de Álgebra', icon: '⚖️', description: 'Completar todas las páginas de Álgebra', category: 'theme' },

    // Quiz medals
    'perfect-quiz': { name: 'Perfección', icon: '💎', description: 'Obtener 100% en cualquier quiz', category: 'quiz' },

    // Streak medals
    'streak-3': { name: 'Racha de 3', icon: '🔥', description: '3 días consecutivos', category: 'streak' },
    'streak-7': { name: 'Racha de 7', icon: '⚡', description: '7 días consecutivos', category: 'streak' },
    'streak-14': { name: 'Racha de 14', icon: '🌟', description: '14 días consecutivos', category: 'streak' },
    'streak-30': { name: 'Racha de 30', icon: '👑', description: '30 días consecutivos', category: 'streak' },

    // Special medals
    'first-page': { name: 'Primera Lección', icon: '📖', description: 'Completar tu primera página', category: 'special' },
    'all-games': { name: 'Explorador', icon: '🎮', description: 'Jugar todos los juegos', category: 'special' },
    'quiz-master': { name: 'Maestro de Quizzes', icon: '🧠', description: 'Completar 10 quizzes', category: 'special' },
    'grado-4to': { name: 'Graduado 4°', icon: '🎓', description: 'Completar todo 4° básico', category: 'special' },
    'grado-5to': { name: 'Graduado 5°', icon: '🎓', description: 'Completar todo 5° básico', category: 'special' }
  };

  // Eje to medal mapping
  var EJE_MEDALS = {
    'numeros': 'theme-numeros',
    'fracciones': 'theme-fracciones',
    'geometria': 'theme-geometria',
    'medicion': 'theme-medicion',
    'datos': 'theme-datos',
    'algebra': 'theme-algebra'
  };

  // Eje total items for completion check
  var EJE_TOTALS = {
    '4to': { numeros: 8, fracciones: 5, geometria: 6, medicion: 5, datos: 3, algebra: 3 },
    '5to': { numeros: 9, algebra: 2, geometria: 4, datos: 3 }
  };

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
    if (!key) return [];
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  }

  function save(medals) {
    var key = getKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(medals));
  }

  // --- Core Functions ---

  function award(medalId) {
    if (!MEDALS[medalId]) return false;
    var medals = load();
    var already = medals.some(function(m) { return m.id === medalId; });
    if (already) return false;

    var medal = {
      id: medalId,
      name: MEDALS[medalId].name,
      icon: MEDALS[medalId].icon,
      earnedAt: new Date().toISOString()
    };
    medals.push(medal);
    save(medals);

    // Show celebration toast
    showCelebration(medal);

    return true;
  }

  function has(medalId) {
    var medals = load();
    return medals.some(function(m) { return m.id === medalId; });
  }

  function getAll() {
    var medals = load();
    return medals.map(function(m) {
      return {
        id: m.id,
        name: m.name,
        icon: m.icon,
        earnedAt: m.earnedAt,
        info: MEDALS[m.id] || {}
      };
    });
  }

  function getAllDefinitions() {
    return Object.keys(MEDALS).map(function(id) {
      return {
        id: id,
        name: MEDALS[id].name,
        icon: MEDALS[id].icon,
        description: MEDALS[id].description,
        category: MEDALS[id].category,
        earned: has(id)
      };
    });
  }

  function getCount() {
    return load().length;
  }

  // --- Achievement Checks ---

  function checkQuizPerfect(score, total) {
    if (total > 0 && score === total) {
      return award('perfect-quiz');
    }
    return false;
  }

  function checkFirstPage() {
    return award('first-page');
  }

  function checkThemeComplete(eje, grado) {
    var medalId = EJE_MEDALS[eje];
    if (!medalId) return false;

    var totals = EJE_TOTALS[grado];
    if (!totals || !totals[eje]) return false;

    var completed = RK.Progress ? RK.Progress.getEjeCompletedCount(grado, eje) : 0;
    if (completed >= totals[eje]) {
      return award(medalId);
    }
    return false;
  }

  function checkAllGames() {
    var gamesPlayed = RK.Progress ? RK.Progress.getGamesPlayedCount() : 0;
    var totalGames = 13; // Total games in RakinMath
    if (gamesPlayed >= totalGames) {
      return award('all-games');
    }
    return false;
  }

  function checkQuizMaster() {
    var stats = RK.Progress ? RK.Progress.getStats() : null;
    if (stats && stats.totalQuizzes >= 10) {
      return award('quiz-master');
    }
    return false;
  }

  function checkGradoComplete(grado) {
    var progress = RK.Progress ? RK.Progress.getGradoProgress(grado) : 0;
    if (progress >= 100) {
      return award('grado-' + grado);
    }
    return false;
  }

  function checkStreak() {
    var streakData = null;
    try {
      var statsRaw = localStorage.getItem('rakin_stats_' + getUser());
      if (statsRaw) {
        var stats = JSON.parse(statsRaw);
        streakData = stats.dailyStreak;
      }
    } catch(e) {}

    if (!streakData) return false;

    var current = streakData.current || 0;
    if (current >= 30) award('streak-30');
    if (current >= 14) award('streak-14');
    if (current >= 7) award('streak-7');
    if (current >= 3) return award('streak-3');

    return false;
  }

  // --- Celebration Toast ---

  function showCelebration(medal) {
    // Remove existing toast
    var existing = document.querySelector('.medal-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'medal-toast';
    toast.innerHTML = '<div class="medal-toast-icon">' + medal.icon + '</div>' +
      '<div class="medal-toast-text">' +
      '<div class="medal-toast-title">¡Nueva medalla!</div>' +
      '<div class="medal-toast-name">' + medal.name + '</div>' +
      '</div>';

    // Styles
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);' +
      'display:flex;align-items:center;gap:12px;padding:16px 24px;border-radius:20px;' +
      'background:linear-gradient(135deg,#58cc02,#46a302);color:white;' +
      'box-shadow:0 8px 30px rgba(88,204,2,0.4);z-index:10000;' +
      'font-family:Inter,-apple-system,system-ui,sans-serif;' +
      'animation:medalToastIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;';

    // Add animation
    if (!document.getElementById('medalToastStyle')) {
      var style = document.createElement('style');
      style.id = 'medalToastStyle';
      style.textContent = '@keyframes medalToastIn{0%{transform:translateX(-50%) translateY(100px) scale(0.8);opacity:0}100%{transform:translateX(-50%) translateY(0) scale(1);opacity:1}}' +
        '@keyframes medalToastOut{0%{transform:translateX(-50%) translateY(0) scale(1);opacity:1}100%{transform:translateX(-50%) translateY(100px) scale(0.8);opacity:0}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(function() {
      toast.style.animation = 'medalToastOut 0.4s ease forwards';
      setTimeout(function() { toast.remove(); }, 400);
    }, 3000);
  }

  // --- Reset ---

  function reset() {
    var key = getKey();
    if (key) localStorage.removeItem(key);
  }

  return {
    award: award,
    has: has,
    getAll: getAll,
    getAllDefinitions: getAllDefinitions,
    getCount: getCount,
    checkQuizPerfect: checkQuizPerfect,
    checkFirstPage: checkFirstPage,
    checkThemeComplete: checkThemeComplete,
    checkAllGames: checkAllGames,
    checkQuizMaster: checkQuizMaster,
    checkGradoComplete: checkGradoComplete,
    checkStreak: checkStreak,
    MEDALS: MEDALS,
    reset: reset
  };
})();

window.RK = RK;
