/* ============================================================
   RakinMath — Central Rewards, Avatars & Daily Missions Engine
   ============================================================ */

var RK = window.RK || {};

RK.Rewards = (function() {
  var PREFIX = 'rakin_rewards_';

  function getUser() {
    try {
      var s = localStorage.getItem('rakin_session');
      var sv = s ? JSON.parse(s) : null;
      if (sv && sv.user) return sv.user;
    } catch(e) {}
    return 'estudiante';
  }

  function getKey() {
    return PREFIX + getUser();
  }

  function defaultData() {
    return {
      coins: 100,
      xp: 0,
      level: 1,
      selectedPet: 'zorro',
      selectedHat: 'none',
      selectedTitle: 'Aventurero Matemático',
      inventory: {
        pets: ['zorro'],
        hats: ['none'],
        titles: ['Aventurero Matemático']
      },
      missions: generateDailyMissions()
    };
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function generateDailyMissions() {
    return [
      { id: 'm-play2', desc: 'Juega 2 partidas de cualquier juego', goal: 2, current: 0, reward: 50, claimed: false, date: todayStr() },
      { id: 'm-calc', desc: 'Logra 10 aciertos en Cálculo Mental', goal: 10, current: 0, reward: 60, claimed: false, date: todayStr() },
      { id: 'm-streak', desc: 'Consigue una racha de 5 aciertos seguidos', goal: 5, current: 0, reward: 75, claimed: false, date: todayStr() },
      { id: 'm-market', desc: 'Compra sin pasarte en El Mercado Chileno', goal: 1, current: 0, reward: 60, claimed: false, date: todayStr() }
    ];
  }

  function load() {
    try {
      var raw = localStorage.getItem(getKey());
      if (!raw) return defaultData();
      var data = JSON.parse(raw);
      // Verify mission dates
      var today = todayStr();
      if (!data.missions || !data.missions[0] || data.missions[0].date !== today) {
        data.missions = generateDailyMissions();
        save(data);
      }
      return data;
    } catch(e) {
      return defaultData();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(getKey(), JSON.stringify(data));
      // Sync to Firebase if online
      if (typeof UserStatsDB !== 'undefined' && UserStatsDB.saveUserInfo) {
        var user = getUser();
        UserStatsDB.saveUserInfo(user, {
          coins: data.coins,
          level: data.level,
          pet: data.selectedPet
        });
      }
    } catch(e) {}
  }

  function addCoins(amount) {
    var data = load();
    data.coins = Math.max(0, (data.coins || 0) + amount);
    data.xp = (data.xp || 0) + amount;
    data.level = Math.floor(data.xp / 150) + 1;
    save(data);
    updateDOMBadges();
    return data;
  }

  function spendCoins(amount) {
    var data = load();
    if (data.coins < amount) return false;
    data.coins -= amount;
    save(data);
    updateDOMBadges();
    return true;
  }

  function updateMissionProgress(missionId, amount) {
    var data = load();
    var m = data.missions.find(function(item) { return item.id === missionId; });
    if (m && !m.claimed) {
      m.current = Math.min(m.goal, (m.current || 0) + (amount || 1));
      save(data);
    }
  }

  function claimMission(missionId) {
    var data = load();
    var m = data.missions.find(function(item) { return item.id === missionId; });
    if (m && !m.claimed && m.current >= m.goal) {
      m.claimed = true;
      data.coins += m.reward;
      data.xp += m.reward;
      data.level = Math.floor(data.xp / 150) + 1;
      save(data);
      updateDOMBadges();
      return m.reward;
    }
    return 0;
  }

  function unlockItem(type, itemId, cost) {
    var data = load();
    if (data.inventory[type].indexOf(itemId) !== -1) return true;
    if (data.coins < cost) return false;
    data.coins -= cost;
    data.inventory[type].push(itemId);
    save(data);
    updateDOMBadges();
    return true;
  }

  function equipItem(type, itemId) {
    var data = load();
    if (type === 'pets') data.selectedPet = itemId;
    else if (type === 'hats') data.selectedHat = itemId;
    else if (type === 'titles') data.selectedTitle = itemId;
    save(data);
    updateDOMBadges();
  }

  function updateDOMBadges() {
    var data = load();
    var coinEls = document.querySelectorAll('.rk-coin-badge, #rk-user-coins');
    coinEls.forEach(function(el) {
      el.textContent = data.coins.toLocaleString();
    });
    var lvlEls = document.querySelectorAll('#rk-user-level');
    lvlEls.forEach(function(el) {
      el.textContent = 'Nivel ' + data.level;
    });
  }

  // Auto initialize DOM badges on load
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      updateDOMBadges();
    });
  }

  return {
    load: load,
    save: save,
    addCoins: addCoins,
    spendCoins: spendCoins,
    updateMissionProgress: updateMissionProgress,
    claimMission: claimMission,
    unlockItem: unlockItem,
    equipItem: equipItem,
    updateDOMBadges: updateDOMBadges,
    getUser: getUser
  };
})();
