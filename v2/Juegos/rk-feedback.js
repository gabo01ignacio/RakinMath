/* ═══════════════════════════════════════════
   RK.Feedback — Sistema de mensajes variados
   ═══════════════════════════════════════════ */
var RK=window.RK||{};
RK.Feedback=(function(){
var streak=0;

/* ─── Pools de mensajes ─── */
var success={
early:[
  {e:'✨',t:'¡Bien!'},
  {e:'👍',t:'¡Ok!'},
  {e:'🎯',t:'¡Claro!'},
  {e:'✅',t:'¡Sí!'},
  {e:'💫',t:'¡Va!'}
],
mid:[
  {e:'🔥',t:'¡Genial!'},
  {e:'⭐',t:'¡Brillante!'},
  {e:'🏆',t:'¡Wow!'},
  {e:'💪',t:'¡Fuerte!'},
  {e:'🎉',t:'¡Súper!'},
  {e:'🧠',t:'¡Listo!'},
  {e:'🚀',t:'¡Rápido!'}
],
high:[
  {e:'👑',t:'¡Rey!'},
  {e:'💎',t:'¡Diamante!'},
  {e:'🌟',t:'¡Leyenda!'},
  {e:'🦄',t:'¡Increíble!'},
  {e:'🏅',t:'¡Campeón!'},
  {e:'⚡',t:'¡Imparable!'}
],
streak3:[
  {e:'🔥',t:'¡Racha de 3!'},
  {e:'💥',t:'¡Tres seguidas!'}
],
streak5:[
  {e:'🌋',t:'¡Racha de 5!'},
  {e:'⚡',t:'¡Cinco seguidas!'},
  {e:'🔥',t:'¡En llamas!'}
],
streak10:[
  {e:'💎',t:'¡Racha de 10!'},
  {e:'👑',t:'¡Diez seguidas!'},
  {e:'🦄',t:'¡Invencible!'}
]
};

var error={
soft:[
  {e:'🤔',t:'Casi...'},
  {e:'😅',t:'No era...'},
  {e:'💡',t:'Pista:'},
  {e:'🔍',t:'Revisa...'}
],
hard:[
  {e:'😔',t:'No'},
  {e:'❌',t:'Fallaste'}
]
};

/* ─── Toast DOM ─── */
var toastEl=null;
var progressEl=null;
var timer=null;

function createToast(){
if(toastEl)return;
toastEl=document.createElement('div');
toastEl.id='rk-feedback';
toastEl.innerHTML='<div class="rk-fb-inner"><span class="rk-fb-emoji"></span><span class="rk-fb-text"></span></div><div class="rk-fb-progress"></div>';
document.body.appendChild(toastEl);
progressEl=toastEl.querySelector('.rk-fb-progress');

var style=document.createElement('style');
style.textContent=
'#rk-feedback{'+
  'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(120px);'+
  'z-index:9999;pointer-events:none;'+
  'min-width:160px;max-width:90vw;'+
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
'.rk-fb-inner{'+
  'display:flex;align-items:center;gap:8px;'+
  'padding:12px 20px;'+
  'white-space:nowrap;'+
'}'+
'.rk-fb-emoji{font-size:1.25rem;line-height:1;}'+
'.rk-fb-text{font-size:.9375rem;font-weight:700;letter-spacing:-.01em;}'+
'.rk-fb-progress{'+
  'height:3px;width:100%;'+
  'background:rgba(255,255,255,.35);'+
  'transform-origin:left;'+
  'transform:scaleX(1);'+
  'transition:none;'+
'}'+
'.rk-fb-progress.anim{'+
  'transition:transform linear;'+
  'transform:scaleX(0);'+
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
  msg={e:customEmoji||'',t:customText};
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
  msg={e:customEmoji||'💡',t:customText||''};
}

var dur=duration||(type==='success'?1400:2000);

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

return{show:show,reset:reset};
})();
