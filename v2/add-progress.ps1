$base = "C:\Users\monix\RakinMath\v2\Aprender"

$files = @(
  # 4to files
  @{ path="4to\numeros-valor.html"; pageId="numeros-valor"; grado="4to"; eje="numeros"; checkFn="checkQ"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\numeros-sumas.html"; pageId="numeros-sumas"; grado="4to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='\u00a1Correcto!'" },
  @{ path="4to\numeros-restas.html"; pageId="numeros-restas"; grado="4to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='\u00a1Correcto!'" },
  @{ path="4to\numeros-multiplicar.html"; pageId="numeros-multiplicar"; grado="4to"; eje="numeros"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\numeros-division.html"; pageId="numeros-division"; grado="4to"; eje="numeros"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\numeros-potencias.html"; pageId="numeros-potencias"; grado="4to"; eje="numeros"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\numeros-tablas.html"; pageId="numeros-tablas"; grado="4to"; eje="numeros"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\numeros-calculo-mental.html"; pageId="numeros-calculo-mental"; grado="4to"; eje="numeros"; checkFn="checkMental"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\numeros-dinero.html"; pageId="numeros-dinero"; grado="4to"; eje="numeros"; checkFn="checkMoney"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\frac-suma.html"; pageId="frac-suma"; grado="4to"; eje="fracciones"; checkFn="checkQ"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\frac-resta.html"; pageId="frac-resta"; grado="4to"; eje="fracciones"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\frac-representar.html"; pageId="frac-representar"; grado="4to"; eje="fracciones"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\frac-dec-suma.html"; pageId="frac-dec-suma"; grado="4to"; eje="fracciones"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\frac-dec-resta.html"; pageId="frac-dec-resta"; grado="4to"; eje="fracciones"; checkFn="checkQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\geo-figuras.html"; pageId="geo-figuras"; grado="4to"; eje="geometria"; checkFn="showViews"; correctPattern="classList.add('filled')" },
  @{ path="4to\geo-angulos.html"; pageId="geo-angulos"; grado="4to"; eje="geometria"; checkFn="checkAngle"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\geo-cuadricula.html"; pageId="geo-cuadricula"; grado="4to"; eje="geometria"; checkFn="checkCoord"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\geo-area.html"; pageId="geo-area"; grado="4to"; eje="geometria"; checkFn="checkQ"; correctPattern="fb.textContent='\u00a1Correcto!'" },
  @{ path="4to\geo-reloj.html"; pageId="geo-reloj"; grado="4to"; eje="geometria"; checkFn="checkTime"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\geo-simetria.html"; pageId="geo-simetria"; grado="4to"; eje="geometria"; checkFn="checkSymQ"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\geo-transformaciones.html"; pageId="geo-transformaciones"; grado="4to"; eje="geometria"; checkFn="checkTransQ"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\medicion-longitud.html"; pageId="medicion-longitud"; grado="4to"; eje="medicion"; checkFn="checkLen"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\medicion-tiempo.html"; pageId="medicion-tiempo"; grado="4to"; eje="medicion"; checkFn="checkConv"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\medicion-perimetro.html"; pageId="medicion-perimetro"; grado="4to"; eje="medicion"; checkFn="checkPerim"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\medicion-volumen.html"; pageId="medicion-volumen"; grado="4to"; eje="medicion"; checkFn="checkVol"; correctPattern="fb.textContent='¿Correcto!'" },
  @{ path="4to\datos-barras.html"; pageId="datos-barras"; grado="4to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\datos-frecuencias.html"; pageId="datos-frecuencias"; grado="4to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\datos-pictogramas.html"; pageId="datos-pictogramas"; grado="4to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\alg-ecuaciones.html"; pageId="alg-ecuaciones"; grado="4to"; eje="algebra"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\alg-secuencias.html"; pageId="alg-secuencias"; grado="4to"; eje="algebra"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="4to\alg-inecuaciones.html"; pageId="alg-inecuaciones"; grado="4to"; eje="algebra"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },

  # 5to files
  @{ path="5to\grandes-numeros.html"; pageId="grandes-numeros"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\redondeo.html"; pageId="redondeo"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\sumas-restas.html"; pageId="sumas-restas"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\multiplicacion.html"; pageId="multiplicacion"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\division.html"; pageId="division"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\factores-multiplos.html"; pageId="factores-multiplos"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\suma-fracciones.html"; pageId="suma-fracciones"; grado="5to"; eje="fracciones"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\decimales.html"; pageId="decimales"; grado="5to"; eje="numeros"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\ecuaciones.html"; pageId="ecuaciones"; grado="5to"; eje="algebra"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\sucesiones.html"; pageId="sucesiones"; grado="5to"; eje="algebra"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\unidades.html"; pageId="unidades"; grado="5to"; eje="medicion"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\plano-cartesiano.html"; pageId="plano-cartesiano"; grado="5to"; eje="geometria"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\congruencia.html"; pageId="congruencia"; grado="5to"; eje="geometria"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\perimetro-area.html"; pageId="perimetro-area"; grado="5to"; eje="geometria"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\promedio.html"; pageId="promedio"; grado="5to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\tallo-hojas.html"; pageId="tallo-hojas"; grado="5to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" },
  @{ path="5to\graficos.html"; pageId="graficos"; grado="5to"; eje="datos"; checkFn="checkQuiz"; correctPattern="fb.textContent='¡Correcto!'" }
)

$progressCall = "if(typeof RK!=='undefined'&&RK.Progress){RK.Progress.markPageComplete('$($f.pageId)','$($f.grado)','$($f.eje)');}"
$scriptTag = '<script src="../../stats/rk-progress.js"></script>'

foreach ($f in $files) {
    $fullPath = Join-Path $base $f.path
    if (-not (Test-Path $fullPath)) {
        Write-Host "SKIP: $($f.path) not found"
        continue
    }
    
    $content = Get-Content $fullPath -Raw -Encoding UTF8
    $modified = $false
    
    # Step 1: Add rk-progress.js script before </body> if not already present
    if ($content -notmatch 'rk-progress\.js') {
        # Try to add before </script> then </body>
        if ($content -match '</script>\s*</body>') {
            $content = $content -replace '</script>\s*</body>', "$scriptTag`n</script>`n</body>", 1
            $modified = $true
        } elseif ($content -match '</body>') {
            $content = $content -replace '</body>', "$scriptTag`n</body>", 1
            $modified = $true
        }
    }
    
    # Step 2: Add markPageComplete call in the correct answer branch
    # Find the correct answer pattern and add the call after it
    $escapedPattern = [regex]::Escape($f.correctPattern)
    
    if ($content -notmatch 'markPageComplete') {
        # Try different patterns for the correct answer branch
        # Pattern 1: fb.textContent='¡Correcto!';fb.className='feedback correct'
        # Pattern 2: fb.textContent='¿Correcto!';fb.className='feedback correct'
        # Pattern 3: fb.className='feedback correct'
        
        $patterns = @(
            "(fb\.className='feedback correct';)",
            "(fb\.textContent='[^']*Correcto[^']*';fb\.className='feedback correct')"
        )
        
        foreach ($pat in $patterns) {
            if ($content -match $pat) {
                $match = $content | Select-String -Pattern $pat -AllMatches | Select-Object -First 1
                if ($match) {
                    $matchedText = $match.Matches[0].Groups[1].Value
                    # Only add if not already present after this specific match
                    $replacement = "$matchedText$progressCall"
                    $content = $content -replace [regex]::Escape($matchedText), $replacement, 1
                    $modified = $true
                    break
                }
            }
        }
    }
    
    if ($modified) {
        [System.IO.File]::WriteAllText($fullPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "UPDATED: $($f.path)"
    } else {
        Write-Host "NO CHANGE: $($f.path)"
    }
}
