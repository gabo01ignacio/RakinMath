// Firebase Config - RakinMath

var firebaseConfig = {
  apiKey: "AIzaSyA6SZ1G63gIPzkTszoOo_FE8lllpYWmBwI",
  authDomain: "rakinpuntajes.firebaseapp.com",
  databaseURL: "https://rakinpuntajes-default-rtdb.firebaseio.com",
  projectId: "rakinpuntajes",
  storageBucket: "rakinpuntajes.firebasestorage.app",
  messagingSenderId: "889978024361",
  appId: "1:889978024361:web:a2e41513b3ecccfcc414b8"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var leaderboardRef = null;
var userStatsRef = null;
if (typeof firebase !== 'undefined' && firebase.database) {
  leaderboardRef = firebase.database().ref('leaderboard');
  userStatsRef = firebase.database().ref('userStats');
}

// ─── LEADERBOARD ───
var LeaderboardDB = {
  sendScore: function(data) {
    if (!leaderboardRef) return Promise.reject('Firebase no configurado');
    return leaderboardRef.push({
      name: data.name,
      score: data.score,
      correct: data.correct || 0,
      time: data.time || 0,
      date: data.date || Date.now(),
      category: data.category || 'custom'
    });
  },
  getTopScores: function(limit) {
    if (!leaderboardRef) return Promise.reject('Firebase no configurado');
    return leaderboardRef.orderByChild('score').limitToLast(limit || 10).once('value')
      .then(function(snapshot) {
        var scores = [];
        snapshot.forEach(function(child) { scores.unshift(child.val()); });
        return scores;
      });
  }
};

// ─── STATS POR USUARIO (TODOS LOS JUEGOS) ───
var UserStatsDB = {
  // Guardar resultado de un juego
  saveGame: function(userName, gameData) {
    if (!userStatsRef || !userName) return Promise.reject('Firebase no configurado');
    var gameRef = userStatsRef.child(userName).child('games').child(gameData.gameId);
    return gameRef.transaction(function(current) {
      if (!current) {
        current = {
          sessions: 0,
          totalScore: 0,
          bestScore: 0,
          totalTime: 0,
          totalCorrect: 0,
          totalWrong: 0,
          accuracy: 0,
          lastPlayed: Date.now()
        };
      }
      current.sessions++;
      current.totalScore += gameData.score || 0;
      current.totalTime += gameData.totalTime || 0;
      current.totalCorrect += gameData.correct || 0;
      current.totalWrong += gameData.wrong || 0;
      current.lastPlayed = Date.now();
      if ((gameData.score || 0) > (current.bestScore || 0)) {
        current.bestScore = gameData.score;
      }
      var total = current.totalCorrect + current.totalWrong;
      current.accuracy = total > 0 ? Math.round(current.totalCorrect / total * 100) : 0;
      current.avgScore = current.sessions > 0 ? Math.round(current.totalScore / current.sessions) : 0;
      current.avgTimePerRound = current.sessions > 0 ? Math.round(current.totalTime / current.sessions) : 0;
      return current;
    });
  },

  // Guardar resultado de una actividad
  saveActivity: function(userName, activityData) {
    if (!userStatsRef || !userName) return Promise.reject('Firebase no configurado');
    var actRef = userStatsRef.child(userName).child('activities').child(activityData.activityId);
    return actRef.transaction(function(current) {
      if (!current) {
        current = {
          attempts: 0,
          correct: 0,
          wrong: 0,
          totalTime: 0,
          accuracy: 0,
          lastAttempt: Date.now()
        };
      }
      current.attempts++;
      current.correct += activityData.correct || 0;
      current.wrong += activityData.wrong || 0;
      current.totalTime += activityData.time || 0;
      current.lastAttempt = Date.now();
      var total = current.correct + current.wrong;
      current.accuracy = total > 0 ? Math.round(current.correct / total * 100) : 0;
      return current;
    });
  },

  // Guardar info del usuario (email, grade)
  saveUserInfo: function(userName, info) {
    if (!userStatsRef || !userName) return Promise.reject('Firebase no configurado');
    var infoRef = userStatsRef.child(userName).child('info');
    return infoRef.transaction(function(current) {
      if (!current) current = {};
      if (info.email) current.email = info.email;
      if (info.grade) current.grade = info.grade;
      if (info.displayName) current.displayName = info.displayName;
      current.lastActive = Date.now();
      return current;
    });
  },

  // Obtener stats de un usuario
  getUserStats: function(userName) {
    if (!userStatsRef || !userName) return Promise.reject('Firebase no configurado');
    return userStatsRef.child(userName).once('value')
      .then(function(snap) { return snap.val(); });
  },

  // Obtener stats de todos los usuarios
  getAllUserStats: function() {
    if (!userStatsRef) return Promise.reject('Firebase no configurado');
    return userStatsRef.once('value')
      .then(function(snap) {
        var results = [];
        snap.forEach(function(child) {
          var data = child.val();
          var info = data.info || {};
          var games = data.games || {};
          // Also read legacy juego8 data (old format)
          if (data.juego8 && !games.juego8) {
            games.juego8 = {
              sessions: data.juego8.totalGames || 0,
              totalScore: data.juego8.bestScore || 0,
              bestScore: data.juego8.bestScore || 0,
              totalTime: data.juego8.totalTime || 0,
              totalCorrect: data.juego8.totalCorrect || 0,
              totalWrong: data.juego8.totalWrong || 0,
              accuracy: ((data.juego8.totalCorrect||0)+(data.juego8.totalWrong||0))>0 ? Math.round((data.juego8.totalCorrect||0)/((data.juego8.totalCorrect||0)+(data.juego8.totalWrong||0))*100) : 0,
              lastPlayed: data.juego8.lastPlayed || 0
            };
          }
          if (Object.keys(games).length > 0 || data.activities) {
            results.push({
              userName: child.key,
              info: info,
              games: games,
              activities: data.activities || {}
            });
          }
        });
        results.sort(function(a, b) {
          return ((b.info && b.info.lastActive) || 0) - ((a.info && a.info.lastActive) || 0);
        });
        return results;
      });
  },

  // Guardar historial de partida
  saveHistory: function(userName, historyData) {
    if (!userStatsRef || !userName) return Promise.reject('Firebase no configurado');
    var histRef = userStatsRef.child(userName).child('history');
    return histRef.push({
      gameId: historyData.gameId,
      gameName: historyData.gameName || historyData.gameId,
      score: historyData.score || 0,
      rounds: historyData.rounds || 0,
      correct: historyData.correct || 0,
      wrong: historyData.wrong || 0,
      accuracy: historyData.accuracy || 0,
      totalTime: historyData.totalTime || 0,
      date: Date.now()
    });
  }
};

// ─── REGISTRACIONES (solicitudes de acceso) ───
var registrationsRef = null;
if (typeof firebase !== 'undefined' && firebase.database) {
  registrationsRef = firebase.database().ref('registrations');
}

var RegistrationsDB = {
  save: function(username, data) {
    if (!registrationsRef || !username) return Promise.reject('Firebase no configurado');
    return registrationsRef.child(username).set({
      username: username,
      email: data.email || '',
      password: data.password || '',
      role: data.role || 'student',
      grade: data.grade || '',
      approved: false,
      requestedAt: Date.now(),
      approvedAt: null
    });
  },
  getAll: function() {
    if (!registrationsRef) return Promise.reject('Firebase no configurado');
    return registrationsRef.once('value')
      .then(function(snap) {
        var results = [];
        snap.forEach(function(child) {
          results.push(child.val());
        });
        return results;
      });
  },
  approve: function(username) {
    if (!registrationsRef || !username) return Promise.reject('Firebase no configurado');
    return registrationsRef.child(username).update({
      approved: true,
      approvedAt: Date.now()
    });
  },
  remove: function(username) {
    if (!registrationsRef || !username) return Promise.reject('Firebase no configurado');
    return registrationsRef.child(username).remove();
  }
};
