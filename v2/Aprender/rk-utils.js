/* ============================================================
   RakinMath — Shared Utilities
   KaTeX rendering, Chart.js helpers, quiz system
   ============================================================ */

/* --- KATEX AUTO-RENDER --- */
function renderMath() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false,
      trust: true
    });
  }
}

/* --- MATH HELPERS --- */
function frac(num, den) {
  return '\\frac{' + num + '}{' + den + '}';
}

function sqrt(expr) {
  return '\\sqrt{' + expr + '}';
}

function power(base, exp) {
  return '{' + base + '}^{' + exp + '}';
}

function mixedNum(whole, num, den) {
  return whole + '\\frac{' + num + '}{' + den + '}';
}

function algebrit(num, den) {
  return frac(num, den);
}

/* --- CHART.JS WRAPPER --- */
function createBarChart(canvasId, labels, data, colors) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  
  var defaultColors = [
    'rgba(0,122,255,0.8)',
    'rgba(52,199,89,0.8)',
    'rgba(255,149,0,0.8)',
    'rgba(175,82,222,0.8)',
    'rgba(255,45,85,0.8)',
    'rgba(90,200,250,0.8)',
    'rgba(88,86,214,0.8)',
    'rgba(255,59,48,0.8)'
  ];

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || defaultColors.slice(0, data.length),
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 36
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1d1d1f',
          titleFont: { family: 'Inter', weight: '600' },
          bodyFont: { family: 'Inter' },
          cornerRadius: 12,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { family: 'Inter', weight: '600' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

function createLineChart(canvasId, labels, data, label, color) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label || 'Datos',
        data: data,
        borderColor: color || 'rgba(0,122,255,1)',
        backgroundColor: (color || 'rgba(0,122,255,1)').replace('1)', '0.1)'),
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: color || 'rgba(0,122,255,1)',
        pointBorderWidth: 3,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { font: { family: 'Inter', weight: '600' } }
        },
        tooltip: {
          backgroundColor: '#1d1d1f',
          cornerRadius: 12,
          padding: 12
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { family: 'Inter', weight: '600' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

function createPieChart(canvasId, labels, data, colors) {
  var ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || [
          'rgba(0,122,255,0.8)',
          'rgba(52,199,89,0.8)',
          'rgba(255,149,0,0.8)',
          'rgba(175,82,222,0.8)',
          'rgba(255,45,85,0.8)'
        ],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Inter', weight: '600' },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 12
          }
        }
      }
    }
  });
}

/* --- STEP SYSTEM --- */
var RK = window.RK || {};

RK.Steps = function(containerId, stepTextId, options) {
  this.steps = [];
  this.current = 0;
  this.container = document.getElementById(containerId);
  this.textEl = document.getElementById(stepTextId);
  this.prevBtn = document.getElementById(options.prevBtn || 'prevStep');
  this.nextBtn = document.getElementById(options.nextBtn || 'nextStep');
  this.resetBtn = document.getElementById(options.resetBtn || 'resetBtn');
  this.onStep = options.onStep || function(){};

  var self = this;
  if (this.nextBtn) this.nextBtn.addEventListener('click', function() { self.go(self.current + 1); });
  if (this.prevBtn) this.prevBtn.addEventListener('click', function() { self.go(self.current - 1); });
  if (this.resetBtn) this.resetBtn.addEventListener('click', function() { self.go(0); });
};

RK.Steps.prototype.go = function(idx) {
  if (idx < 0 || idx >= this.steps.length) return;
  this.current = idx;
  this.render();
};

RK.Steps.prototype.render = function() {
  var step = this.steps[this.current];
  if (!step) return;
  if (this.textEl) this.textEl.innerHTML = step.html || step.text;
  if (this.prevBtn) this.prevBtn.disabled = this.current === 0;
  if (this.nextBtn) this.nextBtn.disabled = this.current === this.steps.length - 1;
  this.onStep(step, this.current);
};

RK.Steps.prototype.add = function(step) {
  this.steps.push(step);
  return this;
};

RK.Steps.prototype.start = function() {
  this.current = 0;
  this.render();
  return this;
};

/* --- QUIZ SYSTEM --- */
RK.Quiz = function(options) {
  this.el = document.getElementById(options.containerId || 'quiz');
  this.answer = 0;
  this.score = 0;
  this.total = 0;
  this.generate = options.generate;
  this.check = options.check || this.defaultCheck.bind(this);
  this.onCorrect = options.onCorrect || function(){};
  this.onWrong = options.onWrong || function(){};
  this.render();
};

RK.Quiz.prototype.defaultCheck = function(userAnswer) {
  return userAnswer === this.answer;
};

RK.Quiz.prototype.render = function() {
  var data = this.generate();
  this.answer = data.answer;
  this.question = data.question;
  this.hint = data.hint || '';
  
  var html = '<div class="quiz-box">';
  html += '<h4>' + (this.question || 'Resuelve') + '</h4>';
  if (data.display) html += '<div class="math-display">' + data.display + '</div>';
  html += '<div class="quiz-row">';
  html += '<input class="quiz-input" type="text" id="quizInput" placeholder="?" autocomplete="off">';
  html += '<button class="btn btn-primary" id="quizCheck">Comprobar</button>';
  html += '</div>';
  html += '<div class="feedback" id="quizFeedback"></div>';
  if (this.hint) html += '<div class="tip-box" style="margin-top:12px"><h4>Hint</h4><p>' + this.hint + '</p></div>';
  html += '<div style="margin-top:14px;text-align:center"><button class="btn btn-ghost" id="quizNew">Nueva pregunta</button></div>';
  html += '<div style="margin-top:8px;text-align:center;font-size:.8125rem;color:var(--text-tertiary)">Puntaje: <strong id="quizScore">0</strong> / <strong id="quizTotal">0</strong></div>';
  html += '</div>';
  
  this.el.innerHTML = html;
  
  var self = this;
  var input = document.getElementById('quizInput');
  var checkBtn = document.getElementById('quizCheck');
  var newBtn = document.getElementById('quizNew');
  var fb = document.getElementById('quizFeedback');
  
  function doCheck() {
    var val = input.value.trim();
    if (!val) { fb.textContent = 'Escribe una respuesta'; fb.className = 'feedback wrong'; return; }
    self.total++;
    if (self.check(val, self.answer)) {
      self.score++;
      fb.textContent = 'Correcto! ' + self.question;
      fb.className = 'feedback correct';
      self.onCorrect();
    } else {
      fb.textContent = 'Intenta de nuevo. ' + (self.hint || '');
      fb.className = 'feedback wrong';
      self.onWrong();
    }
    document.getElementById('quizScore').textContent = self.score;
    document.getElementById('quizTotal').textContent = self.total;
  }
  
  checkBtn.addEventListener('click', doCheck);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') doCheck(); });
  newBtn.addEventListener('click', function() { self.render(); });
  
  input.focus();
};

/* --- UTILITY --- */
function esc(s) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { var t = b; b = a % b; a = t; }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ]
    });
  }
});

window.RK = RK;
