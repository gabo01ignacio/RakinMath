/* ═══════════════════════════════════════════
   RK.Feedback — Sistema de mensajes variados
   Incluye mascota Rakín en feedback visual
   ═══════════════════════════════════════════ */
var RK=window.RK||{};
RK.Feedback=(function(){
var streak=0;

/* ─── Pools de mensajes ─── */
var success={
early:[
  {e:'✨',t:'¡Bien!',m:'happy'},
  {e:'👍',t:'¡Ok!',m:'normal'},
  {e:'🎯',t:'¡Claro!',m:'happy'},
  {e:'✅',t:'¡Sí!',m:'happy'},
  {e:'💫',t:'¡Va!',m:'normal'}
],
mid:[
  {e:'🔥',t:'¡Genial!',m:'happy'},
  {e:'⭐',t:'¡Brillante!',m:'happy'},
  {e:'🏆',t:'¡Wow!',m:'happy'},
  {e:'💪',t:'¡Fuerte!',m:'happy'},
  {e:'🎉',t:'¡Súper!',m:'happy'},
  {e:'🧠',t:'¡Listo!',m:'thinking'},
  {e:'🚀',t:'¡Rápido!',m:'happy'}
],
high:[
  {e:'👑',t:'¡Rey!',m:'happy'},
  {e:'💎',t:'¡Diamante!',m:'happy'},
  {e:'🌟',t:'¡Leyenda!',m:'happy'},
  {e:'🦄',t:'¡Increíble!',m:'happy'},
  {e:'🏅',t:'¡Campeón!',m:'happy'},
  {e:'⚡',t:'¡Imparable!',m:'happy'}
],
streak3:[
  {e:'🔥',t:'¡Racha de 3!',m:'happy'},
  {e:'💥',t:'¡Tres seguidas!',m:'happy'}
],
streak5:[
  {e:'🌋',t:'¡Racha de 5!',m:'happy'},
  {e:'⚡',t:'¡Cinco seguidas!',m:'happy'},
  {e:'🔥',t:'¡En llamas!',m:'happy'}
],
streak10:[
  {e:'💎',t:'¡Racha de 10!',m:'happy'},
  {e:'👑',t:'¡Diez seguidas!',m:'happy'},
  {e:'🦄',t:'¡Invencible!',m:'happy'}
]
};

var error={
soft:[
  {e:'🤔',t:'Casi...',m:'thinking'},
  {e:'😅',t:'No era...',m:'confused'},
  {e:'💡',t:'Pista:',m:'thinking'},
  {e:'🔍',t:'Revisa...',m:'thinking'}
],
hard:[
  {e:'😔',t:'No',m:'confused'},
  {e:'❌',t:'Fallaste',m:'confused'}
]
};

/* ─── Rakín SVG paths ─── */
var rakinSVG={
  happy:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#9C27B0"/><circle cx="50" cy="50" r="38" fill="#AB47BC"/><circle cx="35" cy="40" r="12" fill="#fff"/><circle cx="65" cy="40" r="12" fill="#fff"/><circle cx="37" cy="40" r="6" fill="#1565C0"/><circle cx="67" cy="40" r="6" fill="#1565C0"/><circle cx="38" cy="38" r="2" fill="#fff"/><circle cx="68" cy="38" r="2" fill="#fff"/><path d="M42 58 Q50 66 58 58" stroke="#FF9800" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 25 L40 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M70 25 L60 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><circle cx="25" cy="20" r="2" fill="#FFD54F"/><circle cx="75" cy="20" r="2" fill="#FFD54F"/><circle cx="50" cy="15" r="2" fill="#FFD54F"/></svg>',
  normal:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#9C27B0"/><circle cx="50" cy="50" r="38" fill="#AB47BC"/><circle cx="35" cy="40" r="12" fill="#fff"/><circle cx="65" cy="40" r="12" fill="#fff"/><circle cx="37" cy="40" r="6" fill="#1565C0"/><circle cx="67" cy="40" r="6" fill="#1565C0"/><circle cx="38" cy="38" r="2" fill="#fff"/><circle cx="68" cy="38" r="2" fill="#fff"/><path d="M44 58 L56 58" stroke="#FF9800" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 25 L40 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M70 25 L60 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/></svg>',
  thinking:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#9C27B0"/><circle cx="50" cy="50" r="38" fill="#AB47BC"/><circle cx="35" cy="40" r="12" fill="#fff"/><circle cx="65" cy="40" r="12" fill="#fff"/><circle cx="37" cy="42" r="6" fill="#1565C0"/><circle cx="67" cy="42" r="6" fill="#1565C0"/><circle cx="38" cy="40" r="2" fill="#fff"/><circle cx="68" cy="40" r="2" fill="#fff"/><path d="M45 60 Q50 63 55 60" stroke="#FF9800" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M30 25 L40 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M70 25 L60 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><circle cx="78" cy="28" r="6" fill="none" stroke="#FFD54F" stroke-width="1.5"/><circle cx="78" cy="28" r="1.5" fill="#FFD54F"/></svg>',
  confused:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#9C27B0"/><circle cx="50" cy="50" r="38" fill="#AB47BC"/><circle cx="35" cy="40" r="12" fill="#fff"/><circle cx="65" cy="40" r="12" fill="#fff"/><circle cx="39" cy="41" r="6" fill="#1565C0"/><circle cx="63" cy="41" r="6" fill="#1565C0"/><circle cx="40" cy="39" r="2" fill="#fff"/><circle cx="64" cy="39" r="2" fill="#fff"/><path d="M44 62 Q50 57 56 62" stroke="#FF9800" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M28 28 L38 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M72 28 L62 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M32 22 L36 26" stroke="#E91E63" stroke-width="1.5" stroke-linecap="round"/><path d="M36 22 L32 26" stroke="#E91E63" stroke-width="1.5" stroke-linecap="round"/><path d="M64 22 L68 26" stroke="#E91E63" stroke-width="1.5" stroke-linecap="round"/><path d="M68 22 L64 26" stroke="#E91E63" stroke-width="1.5" stroke-linecap="round"/></svg>',
  waving:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#9C27B0"/><circle cx="50" cy="50" r="38" fill="#AB47BC"/><circle cx="35" cy="40" r="12" fill="#fff"/><circle cx="65" cy="40" r="12" fill="#fff"/><circle cx="37" cy="40" r="6" fill="#1565C0"/><circle cx="67" cy="40" r="6" fill="#1565C0"/><circle cx="38" cy="38" r="2" fill="#fff"/><circle cx="68" cy="38" r="2" fill="#fff"/><path d="M42 58 Q50 66 58 58" stroke="#FF9800" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 25 L40 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M70 25 L60 30" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/><path d="M82 35 Q90 25 88 18" stroke="#AB47BC" stroke-width="4" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0 82 35;15 82 35;-10 82 35;0 82 35" dur="0.8s" repeatCount="indefinite"/></path><circle cx="88" cy="16" r="4" fill="#AB47BC"/></svg>'
};

/* ─── Toast DOM ─── */
var toastEl=null;
var progressEl=null;
var mascotEl=null;
var timer=null;

function createToast(){
if(toastEl)return;
toastEl=document.createElement('div');
toastEl.id='rk-feedback';
toastEl.innerHTML='<div class="rk-fb-mascot"></div><div class="rk-fb-content"><div class="rk-fb-inner"><span class="rk-fb-emoji"></span><span class="rk-fb-text"></span></div><div class="rk-fb-progress"></div></div>';
document.body.appendChild(toastEl);
progressEl=toastEl.querySelector('.rk-fb-progress');
mascotEl=toastEl.querySelector('.rk-fb-mascot');

var style=document.createElement('style');
style.textContent=
'#rk-feedback{'+
  'position:fixed;bottom:calc(24px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%) translateY(120px);'+
  'z-index:9999;pointer-events:none;'+
  'display:flex;align-items:center;gap:10px;'+
  'min-width:180px;max-width:90vw;'+
  'border-radius:980px;'+
  'padding:0;'+
  'overflow:hidden;'+
  'box-shadow:0 8px 32px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.08);'+
  'transition:transform .4s cubic-bezier(.2,.9,.3,1.2),opacity .3s ease;'+
  'opacity:0;'+
  'font-family:Inter,system-ui,sans-serif;'+
'}'+
'#rk-feedback.show{'+
  'transform:translateX(-50%) translateY(0);'+
  'opacity:1;'+
'}'+
'#rk-feedback.success{'+
  'background:linear-gradient(135deg,#34C759,#30B350);'+
  'color:#fff;'+
'}'+
'#rk-feedback.error{'+
  'background:linear-gradient(135deg,#FF3B30,#E0352B);'+
  'color:#fff;'+
'}'+
'#rk-feedback.info{'+
  'background:linear-gradient(135deg,#007AFF,#0063D1);'+
  'color:#fff;'+
'}'+
'.rk-fb-mascot{'+
  'width:40px;height:40px;'+
  'flex-shrink:0;'+
  'padding:4px;'+
  'animation:rkMascotPop .4s cubic-bezier(.34,1.56,.64,1) both;'+
'}'+
'.rk-fb-mascot svg{'+
  'width:100%;height:100%;'+
'}'+
'@keyframes rkMascotPop{'+
  '0%{transform:scale(0) rotate(-20deg);opacity:0}'+
  '100%{transform:scale(1) rotate(0);opacity:1}'+
'}'+
'.rk-fb-content{'+
  'display:flex;flex-direction:column;'+
  'flex:1;min-width:0;'+
'}'+
'.rk-fb-inner{'+
  'display:flex;align-items:center;gap:8px;'+
  'padding:10px 16px 4px;'+
  'white-space:normal;word-break:break-word;'+
'}'+
'.rk-fb-emoji{font-size:1.125rem;line-height:1;}'+
'.rk-fb-text{font-size:.875rem;font-weight:700;letter-spacing:-.01em;}'+
'.rk-fb-progress{'+
  'height:3px;width:100%;'+
  'background:rgba(255,255,255,.35);'+
  'transform-origin:left;'+
  'transform:scaleX(1);'+
  'transition:none;'+
  'margin:0 16px 8px;'+
  'border-radius:2px;'+
'}'+
'.rk-fb-progress.anim{'+
  'transition:transform linear;'+
  'transform:scaleX(0);'+
'}'+
'@media(max-width:480px){'+
  '#rk-feedback{bottom:calc(16px + env(safe-area-inset-bottom,0px));min-width:160px}'+
  '.rk-fb-mascot{width:32px;height:32px;padding:2px}'+
  '.rk-fb-inner{padding:8px 12px 4px;gap:6px}'+
  '.rk-fb-text{font-size:.8125rem}'+
'}';
document.head.appendChild(style);
}

/* ─── Pick random ─── */
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}

/* ─── Public API ─── */
function show(type,customText,customEmoji,duration){
createToast();
clearTimeout(timer);

var msg;
if(customText){
  msg={e:customEmoji||'',t:customText,m:'normal'};
}else if(type==='success'){
  streak++;
  if(streak>=10)msg=pick(success.streak10);
  else if(streak>=5)msg=pick(success.streak5);
  else if(streak>=3)msg=pick(success.streak3);
  else if(streak>=2)msg=pick(success.mid);
  else msg=pick(success.early);
}else if(type==='error'){
  streak=0;
  msg=pick(error.soft);
}else{
  streak=0;
  msg={e:customEmoji||'💡',t:customText||'',m:'thinking'};
}

var dur=duration||(type==='success'?1400:2000);

// Set mascot SVG
var mascotType=msg.m||'normal';
mascotEl.innerHTML=rakinSVG[mascotType]||rakinSVG.normal;

toastEl.querySelector('.rk-fb-emoji').textContent=msg.e;
toastEl.querySelector('.rk-fb-text').textContent=msg.t;
toastEl.className='rk-fb '+type;

// Force reflow
void toastEl.offsetWidth;
toastEl.classList.add('show');

// Progress bar
progressEl.classList.remove('anim');
void progressEl.offsetWidth;
progressEl.style.transitionDuration=dur+'ms';
progressEl.classList.add('anim');

clearTimeout(timer);
timer=setTimeout(function(){
  toastEl.classList.remove('show');
},dur);
}

function reset(){streak=0}

/* ─── Get SVG for external use ─── */
function getSVG(type){return rakinSVG[type]||rakinSVG.normal}

return{show:show,reset:reset,getSVG:getSVG};
})();
