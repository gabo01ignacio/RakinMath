/* ============================================================
   RakinMath — YouTube Video Embed
   Replaces manual video section with embedded YouTube iframes.
   ============================================================ */
(function(){
  var VIDEOS={
    'numeros-valor':'eNodAB9v6YM',
    'numeros-calculo-mental':'3t5Wi6-638k',
    'numeros-sumas':'L6NOkLq6kHk',
    'numeros-restas':'L6NOkLq6kHk',
    'numeros-tablas':'3t5Wi6-638k',
    'numeros-multiplicar':'AE4B0hgnz0E',
    'numeros-division':'hwNrpRxGyHY',
    'numeros-dinero':'L6NOkLq6kHk',
    'frac-representar':'antZqj9ePys',
    'frac-suma':'antZqj9ePys',
    'frac-resta':'antZqj9ePys',
    'frac-dec-suma':'WuT-Ka03i2k',
    'frac-dec-resta':'WuT-Ka03i2k',
    'alg-ecuaciones':'kezQnrXif-4',
    'alg-inecuaciones':'kezQnrXif-4',
    'alg-secuencias':'FGoSqeFl5zg',
    'geo-cuadricula':'0cUkAd2o1yw',
    'geo-figuras':'4G4aOfXFwoc',
    'geo-angulos':'-zLWJYY42GU',
    'geo-simetria':'4G4aOfXFwoc',
    'geo-transformaciones':'4G4aOfXFwoc',
    'geo-area':'cZozsc6-yAM',
    'geo-reloj':'XCgJB97DEGM',
    'medicion-tiempo':'XCgJB97DEGM',
    'medicion-longitud':'cZozsc6-yAM',
    'medicion-perimetro':'cZozsc6-yAM',
    'medicion-volumen':'cZozsc6-yAM',
    'datos-barras':'J-lDNbXM2wE',
    'datos-pictogramas':'J-lDNbXM2wE',
    'datos-frecuencias':'cyXenZEbGz4'
  };

  function getPageId(){
    var file=window.location.pathname.split('/').pop().replace('.html','');
    return VIDEOS[file]||null;
  }

  function init(){
    var vid=getPageId();
    if(!vid)return;

    var container=document.getElementById('videos-container')||document.getElementById('videosContainer');
    if(!container)return;

    var html='<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:20px;margin:0;box-shadow:0 8px 30px rgba(0,0,0,.08)">'+
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+vid+'" '+
      'title="YouTube video player" frameborder="0" '+
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '+
      'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen '+
      'loading="lazy" '+
      'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:20px"></iframe>'+
      '</div>';

    container.innerHTML=html;
    container.style.cssText='margin:0;padding:0;border:none;background:none';

    var section=container.closest('.section')||container.closest('.question-box')||container.parentElement;
    if(section){
      var p=section.querySelector('p');
      if(p && p.textContent.indexOf('Agrega links')!==-1){
        p.textContent='Material complementario para reforzar lo aprendido:';
      }
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
