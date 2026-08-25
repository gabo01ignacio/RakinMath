/* ============================================================
   RakinMath Aprender — Shared Menu JavaScript
   Used by: menu.html, 4to/menu.html, 5to/menu.html

   Usage: Include after rk-progress.js and rk-medals.js.
          Set window.MENU_CONFIG before loading this script:
            loginPath:     relative path to login.html
            practicarPath: relative path to Juegos/menu.html
            grado:         '4to' | '5to' | null (main menu)
   ============================================================ */
(function(){
  var C=window.MENU_CONFIG||{};
  var LOGIN=C.loginPath||'../login.html';
  var PRACTICAR=C.practicarPath||'../Juegos/menu.html';
  var GRADO=C.grado||null;

  var $=function(id){return document.getElementById(id)};
  var SK='rakin_session';
  var uN='';

  /* --- Auth --- */
  try{
    var sr=localStorage.getItem(SK);
    var sv=sr?JSON.parse(sr):null;
    if(!sv||!sv.user){window.location.href=LOGIN;return}
    uN=sv.user;
  }catch(e){window.location.href=LOGIN;return}

  $('heroUser').textContent=uN.charAt(0).toUpperCase()+uN.slice(1);

  /* --- Theme --- */
  var theme=localStorage.getItem('rakin-theme')||'light';
  document.documentElement.setAttribute('data-theme',theme);

  /* --- Nav dropdown --- */
  var nW=$('nmw'),nB=$('nmb');
  nB.addEventListener('click',function(e){e.stopPropagation();nW.classList.toggle('open')});
  document.addEventListener('click',function(e){if(!nW.contains(e.target))nW.classList.remove('open')});

  /* --- Mode switcher --- */
  var nS=$('nS');
  function syncMode(m){
    var r=nS.querySelector('input[value="'+m+'"]');
    if(r)r.checked=true;
    nS.className='gs '+(m==='practicar'?'p':'a');
    nS.querySelectorAll('label').forEach(function(l){l.classList.remove('on')});
    var a=nS.querySelector('input:checked+label');
    if(a)a.classList.add('on');
    $('ni').textContent=m==='practicar'?'🎮':'📚';
    $('nt').textContent=m==='practicar'?'Practicar':'Aprender';
  }
  nS.querySelectorAll('input').forEach(function(r){
    r.addEventListener('change',function(){
      var v=nS.querySelector('input:checked').value;
      syncMode(v);
      if(v==='practicar')window.location.href=PRACTICAR;
    });
  });
  syncMode('aprender');

  /* --- Logout --- */
  $('lb').addEventListener('click',function(){
    localStorage.removeItem(SK);
    localStorage.removeItem('rakin_user_'+uN);
    window.location.href=LOGIN;
  });

  /* --- Progress --- */
  if(typeof RK!=='undefined'&&RK.Progress){
    if(GRADO){
      var p=RK.Progress.getGradoProgress(GRADO);
      if(p>0){$('gradoProgress').style.display='block';$('gradoProgressPct').textContent=p+'%';$('gradoProgressFill').style.width=p+'%'}
    }else{
      var p4=RK.Progress.getGradoProgress('4to');
      var p5=RK.Progress.getGradoProgress('5to');
      var total=Math.round((p4+p5)/2);
      if(total>0){$('heroProgress').style.display='block';$('heroProgressPct').textContent=total+'%';$('heroProgressFill').style.width=total+'%'}
    }
  }

  /* --- Medals --- */
  var medalsExpanded=false;
  function populateMedals(){
    if(typeof RK==='undefined'||!RK.Medals)return;
    var defs=RK.Medals.getAllDefinitions();
    var grid=$('medalsGrid');
    if(!grid)return;
    if(defs.length===0){$('medalsEmpty').style.display='block';grid.style.display='none';$('medalsNextWrap').style.display='none';return}
    var earnedList=defs.filter(function(m){return m.earned});
    var lockedList=defs.filter(function(m){return !m.earned});
    var previewLocked=lockedList.slice(0,2);
    var remainingLocked=lockedList.slice(2);
    var html='',idx=0;
    earnedList.forEach(function(m){
      var dateStr='';var medals=RK.Medals.getAll();var earned=medals.find(function(em){return em.id===m.id});
      if(earned&&earned.earnedAt){var d=new Date(earned.earnedAt);dateStr=d.toLocaleDateString('es-CL',{day:'numeric',month:'short'})}
      html+='<div class="medal-card earned" style="animation-delay:'+(idx*40)+'ms">';
      html+='<div class="medal-icon-wrap"><span class="medal-icon">'+m.icon+'</span></div>';
      html+='<div class="medal-name">'+m.name+'</div>';
      if(dateStr)html+='<div class="medal-date">'+dateStr+'</div>';
      html+='</div>';idx++;
    });
    previewLocked.forEach(function(m){
      html+='<div class="medal-card locked-preview" style="animation-delay:'+(idx*40)+'ms">';
      html+='<div class="medal-icon-wrap"><span class="medal-icon">'+m.icon+'</span></div>';
      html+='<div class="medal-name">'+m.name+'</div>';
      html+='</div>';idx++;
    });
    remainingLocked.forEach(function(m){
      html+='<div class="medal-card locked-hidden" style="animation-delay:'+(idx*40)+'ms;display:none">';
      html+='<div class="medal-icon-wrap"><span class="medal-icon">'+m.icon+'</span></div>';
      html+='<div class="medal-name">'+m.name+'</div>';
      html+='<span class="medal-lock">🔒</span>';
      html+='</div>';idx++;
    });
    grid.innerHTML=html;
    var medalCount=RK.Medals.getCount();
    var totalDefs=defs.length;
    var pct=totalDefs>0?Math.round((medalCount/totalDefs)*100):0;
    $('medalsEarnedCount').textContent=medalCount;
    $('medalsTotalCount').textContent=totalDefs;
    $('medalsPercent').textContent=pct+'%';
    $('medalsProgressPct').textContent=pct+'%';
    $('medalsProgressFill').style.width=pct+'%';
    $('medalsCountNav').textContent=medalCount;
    if(remainingLocked.length>0){$('medalsNextWrap').style.display='block';medalsExpanded=false;$('medalsNextText').textContent='Ver siguientes logros ↓'}
    else $('medalsNextWrap').style.display='none';
    if(medalCount===0){$('medalsEmpty').style.display='block';grid.style.display='none'}
    else{$('medalsEmpty').style.display='none';grid.style.display='grid'}
  }
  populateMedals();

  if($('medalsNextBtn')){
    $('medalsNextBtn').addEventListener('click',function(){
      var grid=$('medalsGrid');
      var hidden=grid.querySelectorAll('.locked-hidden');
      if(!medalsExpanded){hidden.forEach(function(c,i){c.style.display='';c.classList.add('locked-reveal');c.style.animationDelay=(i*80)+'ms'});medalsExpanded=true;$('medalsNextText').textContent='Mostrar menos ↑'}
      else{hidden.forEach(function(c){c.style.display='none';c.classList.remove('locked-reveal')});medalsExpanded=false;$('medalsNextText').textContent='Ver siguientes logros ↓'}
    });
  }

  /* --- Medals modal --- */
  function openMedalsModal(){$('medalsModal').classList.remove('hidden');document.body.style.overflow='hidden'}
  function closeMedalsModal(){$('medalsModal').classList.add('hidden');document.body.style.overflow=''}
  $('medalsBtn').addEventListener('click',function(e){e.stopPropagation();openMedalsModal()});
  $('medalsModalClose').addEventListener('click',function(e){e.stopPropagation();closeMedalsModal()});
  $('medalsModal').addEventListener('click',function(e){if(e.target===$('medalsModal'))closeMedalsModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('medalsModal').classList.contains('hidden'))closeMedalsModal()});

  /* --- Scroll to top --- */
  var stb=$('scrollTopBtn');
  window.addEventListener('scroll',function(){if(window.scrollY>300)stb.classList.add('show');else stb.classList.remove('show')});
  stb.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  /* --- Page loader --- */
  window.addEventListener('load',function(){
    var loader=document.getElementById('pageLoader');
    if(loader){loader.classList.add('done');setTimeout(function(){loader.remove()},300)}
  });
})();
