// ─── ARCHIVO DE AUTENTICACIÓN - RakinMath ───
// Sistema unificado: TODO se guarda en raking_session

var AUTH_USERS = [
  { u: 'profe',   p: btoa('monix2026'), role: 'teacher', approved: true },
  { u: 'testers', p: btoa('testers'),   role: 'student', approved: true },
  { u: 'admin',   p: btoa('admin'),     role: 'teacher', approved: true },
  { u: 'cabros',  p: btoa('cabros'),    role: 'teacher', approved: true },
  { u: 'gabo01ignacio', p: btoa('miga0306'), role: 'superadmin', approved: true },
  { u: 'dani',    p: btoa('danielacabezas'), role: 'student', approved: true },
  { u: 'alumnas', p: btoa('alumnas2026'), role: 'student', approved: true }
];

var TEACHER_USERS = ['profe', 'admin', 'cabros'];
var SUPER_ADMIN = 'gabo01ignacio';
var REGISTERED_KEY = 'rakin_registered_users';
var SESSION_KEY = 'rakin_session';

// ─── SESSION UNIFICADA ───

function getSession() {
  try {
    var r = localStorage.getItem(SESSION_KEY);
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}

function createSession(user, extra) {
  var data = { user: user, ts: Date.now() };
  if (extra) {
    if (extra.grade !== undefined) data.grade = extra.grade;
    if (extra.mode !== undefined) data.mode = extra.mode;
    if (extra.isTeacher !== undefined) data.isTeacher = extra.isTeacher;
    if (extra.isSuperAdmin !== undefined) data.isSuperAdmin = extra.isSuperAdmin;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
}

function updateSession(updates) {
  var s = getSession();
  if (!s) return null;
  for (var k in updates) {
    if (updates.hasOwnProperty(k)) s[k] = updates[k];
  }
  s.ts = Date.now();
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}

function destroySession() {
  localStorage.removeItem(SESSION_KEY);
  // Limpiar clave legacy
  localStorage.removeItem('rm_user');
}

function isLoggedIn() {
  var s = getSession();
  return s && s.user;
}

function getCurrentUser() {
  var s = getSession();
  return s ? s.user : null;
}

function formatUserName(user) {
  if (!user) return 'Estudiante';
  var clean = String(user).trim();
  if (clean.toLowerCase() === 'gabo01ignacio') return 'Gabo01Ignacio';
  if (clean.toLowerCase() === 'profe') return 'Profesor/a';
  if (clean.toLowerCase() === 'admin') return 'Administrador';
  return clean.split(/[\s_-]+/)
              .map(function(w) {
                if (!w) return '';
                return w.charAt(0).toUpperCase() + w.slice(1);
              })
              .join(' ');
}

function getFormattedUser() {
  var u = getCurrentUser();
  return formatUserName(u);
}

// ─── USUARIOS REGISTRADOS ───

function getRegisteredUsers() {
  try {
    var r = localStorage.getItem(REGISTERED_KEY);
    return r ? JSON.parse(r) : [];
  } catch(e) { return []; }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
}

function getAllRegisteredUsers() {
  return getRegisteredUsers();
}

function findRegisteredUser(identifier) {
  var id = identifier.trim().toLowerCase();
  var users = getRegisteredUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === id || users[i].email === id) {
      return users[i];
    }
  }
  return null;
}

function userExists(username) {
  var u = username.trim().toLowerCase();
  for (var i = 0; i < AUTH_USERS.length; i++) {
    if (AUTH_USERS[i].u === u) return true;
  }
  var users = getRegisteredUsers();
  for (var j = 0; j < users.length; j++) {
    if (users[j].username === u) return true;
  }
  return false;
}

function emailExists(email) {
  var e = email.trim().toLowerCase();
  var users = getRegisteredUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === e) return true;
  }
  return false;
}

function registerUser(username, email, password) {
  if (!username || !email || !password) {
    return { ok: false, msg: 'Completa todos los campos' };
  }
  var u = username.trim().toLowerCase();
  var e = email.trim().toLowerCase();
  if (u.length < 3) {
    return { ok: false, msg: 'El usuario debe tener al menos 3 caracteres' };
  }
  if (password.length < 4) {
    return { ok: false, msg: 'La contraseña debe tener al menos 4 caracteres' };
  }
  if (e.indexOf('@') === -1 || e.indexOf('.') === -1) {
    return { ok: false, msg: 'Ingresa un correo válido' };
  }
  if (userExists(u)) {
    return { ok: false, msg: 'Este usuario ya existe' };
  }
  if (emailExists(e)) {
    return { ok: false, msg: 'Este correo ya está registrado' };
  }
  var registered = getRegisteredUsers();
  registered.push({
    username: u,
    email: e,
    password: password,
    role: 'student',
    approved: false,
    requestedAt: new Date().toISOString(),
    approvedAt: null
  });
  saveRegisteredUsers(registered);
  // Sync to Firebase
  if (typeof RegistrationsDB !== 'undefined' && typeof RegistrationsDB.save === 'function') {
    RegistrationsDB.save(u, { email: e, password: password, role: 'student', grade: '' }).catch(function(err) {
      console.error('Error guardando registro en Firebase:', err);
    });
  }
  if (typeof UserStatsDB !== 'undefined' && typeof UserStatsDB.saveUserInfo === 'function') {
    UserStatsDB.saveUserInfo(u, { email: e, displayName: u }).catch(function() {});
  }
  return { ok: true, msg: '¡Solicitud enviada! Espera a que un administrador apruebe tu cuenta.' };
}

// ─── AUTH FUNCTIONS ───

function isSuperAdmin() {
  var s = getSession();
  return s && s.user === SUPER_ADMIN;
}

function isTeacher() {
  var s = getSession();
  if (!s || !s.user) return false;
  if (s.user === SUPER_ADMIN) return true;
  if (s.isTeacher || s.isSuperAdmin) return true;
  if (TEACHER_USERS.indexOf(s.user) > -1) return true;
  var role = getUserRole(s.user);
  return role === 'teacher' || role === 'superadmin';
}

function isAdmin() {
  return isTeacher();
}

function getUserRole(user) {
  var u = user.trim().toLowerCase();
  for (var i = 0; i < AUTH_USERS.length; i++) {
    if (AUTH_USERS[i].u === u) return AUTH_USERS[i].role || 'student';
  }
  var reg = findRegisteredUser(u);
  if (reg) return reg.role || 'student';
  return 'student';
}

function isUserApproved(user) {
  var u = user.trim().toLowerCase();
  for (var i = 0; i < AUTH_USERS.length; i++) {
    if (AUTH_USERS[i].u === u) return true;
  }
  var reg = findRegisteredUser(u);
  if (reg) return reg.approved === true;
  return false;
}

function withTimeout(promise, ms) {
  return new Promise(function(resolve) {
    var timer = setTimeout(function() {
      resolve({ ok: false, msg: 'Sin conexión. Intenta de nuevo.' });
    }, ms);
    promise.then(function(result) {
      clearTimeout(timer);
      resolve(result);
    }).catch(function() {
      clearTimeout(timer);
      resolve({ ok: false, msg: 'Error de conexión. Intenta de nuevo.' });
    });
  });
}

function authCheck(identifier, pass) {
  if (!identifier || !pass) return Promise.resolve({ ok: false, msg: 'Completa todos los campos' });
  var id = identifier.trim().toLowerCase();
  var p = pass;

  // 1. Usuarios hardcodeados
  for (var i = 0; i < AUTH_USERS.length; i++) {
    if (AUTH_USERS[i].u === id && atob(AUTH_USERS[i].p) === p) {
      return Promise.resolve({ ok: true, user: AUTH_USERS[i].u, role: AUTH_USERS[i].role });
    }
  }

  // 2. Buscar en registrados (localStorage)
  var reg = findRegisteredUser(id);
  if (reg && reg.password === p && reg.approved) {
    return Promise.resolve({ ok: true, user: reg.username, role: reg.role || 'student' });
  }

  // 2b. Contraseña correcta pero no aprobado localmente: verificar Firebase
  if (reg && reg.password === p && !reg.approved) {
    if (typeof RegistrationsDB !== 'undefined' && typeof RegistrationsDB.getAll === 'function') {
      return withTimeout(
        RegistrationsDB.getAll().then(function(fbUsers) {
          var fbUser = null;
          for (var j = 0; j < fbUsers.length; j++) {
            if (fbUsers[j].username === reg.username) { fbUser = fbUsers[j]; break; }
          }
          if (fbUser && fbUser.approved) {
            syncApprovedToLocalStorage(fbUser.username);
            return { ok: true, user: fbUser.username, role: fbUser.role || 'student' };
          }
          return { ok: false, msg: 'Tu cuenta está pendiente de aprobación.' };
        }),
        5000
      );
    }
    return Promise.resolve({ ok: false, msg: 'Tu cuenta está pendiente de aprobación.' });
  }

  // 3. No en localStorage, buscar en Firebase (por username o email)
  if (typeof RegistrationsDB !== 'undefined' && typeof RegistrationsDB.getAll === 'function') {
    return withTimeout(
      RegistrationsDB.getAll().then(function(fbUsers) {
        var fbUser = null;
        for (var j = 0; j < fbUsers.length; j++) {
          if (fbUsers[j].username === id || fbUsers[j].email === id) { fbUser = fbUsers[j]; break; }
        }
        if (fbUser && fbUser.password === p && fbUser.approved) {
          syncApprovedToLocalStorage(fbUser.username);
          return { ok: true, user: fbUser.username, role: fbUser.role || 'student' };
        }
        if (fbUser && fbUser.password === p && !fbUser.approved) {
          return { ok: false, msg: 'Tu cuenta está pendiente de aprobación.' };
        }
        return { ok: false, msg: 'Usuario o contraseña incorrectos' };
      }),
      5000
    );
  }

  return Promise.resolve({ ok: false, msg: 'Usuario o contraseña incorrectos' });
}

function authCheckLocal(id, p) {
  var reg = findRegisteredUser(id);
  if (reg && reg.password === p) {
    if (!reg.approved) {
      return { ok: false, msg: 'Tu cuenta está pendiente de aprobación.' };
    }
    return { ok: true, user: reg.username, role: reg.role || 'student' };
  }
  return { ok: false, msg: 'Usuario o contraseña incorrectos' };
}

function syncApprovedToLocalStorage(username) {
  var users = getRegisteredUsers();
  var found = false;
  for (var k = 0; k < users.length; k++) {
    if (users[k].username === username) {
      users[k].approved = true;
      if (!users[k].approvedAt) users[k].approvedAt = new Date().toISOString();
      found = true;
      break;
    }
  }
  saveRegisteredUsers(users);
}

// ─── USUARIO GUARDADO ───

function getUserData(username) {
  try {
    var r = localStorage.getItem('rakin_user_' + username);
    return r ? JSON.parse(r) : null;
  } catch(e) { return null; }
}

function saveUserData(username, data) {
  localStorage.setItem('rakin_user_' + username, JSON.stringify(data));
  // Sync grade to Firebase
  try {
    if (typeof UserStatsDB !== 'undefined' && UserStatsDB.saveUserInfo && data.grade) {
      UserStatsDB.saveUserInfo(username, { grade: data.grade });
    }
  } catch(err) {}
}

// ─── ADMIN: GESTIÓN DE USUARIOS ───

function getPendingUsers() {
  var users = getRegisteredUsers();
  return users.filter(function(u) { return u.approved === false; });
}

function getApprovedUsers() {
  var users = getRegisteredUsers();
  return users.filter(function(u) { return u.approved === true; });
}

function approveUser(username) {
  var u = username.trim().toLowerCase();
  var users = getRegisteredUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === u) {
      users[i].approved = true;
      users[i].approvedAt = new Date().toISOString();
      saveRegisteredUsers(users);
      return { ok: true, msg: u + ' ha sido aprobado' };
    }
  }
  return { ok: false, msg: 'Usuario no encontrado' };
}

function rejectUser(username) {
  var u = username.trim().toLowerCase();
  var users = getRegisteredUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === u) {
      users.splice(i, 1);
      saveRegisteredUsers(users);
      return { ok: true, msg: u + ' ha sido eliminado' };
    }
  }
  return { ok: false, msg: 'Usuario no encontrado' };
}

function deleteUser(username) {
  return rejectUser(username);
}
