<!--
  Scene.svelte — contenuto 3D: camera, luci, ambiente, modello

  Tutto ciò che è figlio di <Canvas> (in +page.svelte) è una scena Three.js.
  <T.XYZ> è la sintassi Threlte per creare oggetti Three.js:
    <T.PerspectiveCamera> → new THREE.PerspectiveCamera(...)
    <T.DirectionalLight>  → new THREE.DirectionalLight(...)
  I props corrispondono alle proprietà Three.js dell'oggetto.
-->
<script lang="ts">
  import { T, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
  import { config, atmosphereSettings } from '$lib/config.svelte.js'
  import Model from './Model.svelte'

  // useThrelte() espone il renderer WebGL e la scena Three.js
  const { renderer, scene } = useThrelte()

  // Imposta RoomEnvironment come mappa di riflessione/illuminazione
  // PMREMGenerator pre-filtra la texture per PBR (Physically Based Rendering)
  // Questo avviene una sola volta al mount del componente
  $effect(() => {
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture
    pmrem.dispose()
  })

  // Aggiorna il colore dello sfondo al cambio di atmosfera
  $effect(() => {
    scene.background = new THREE.Color(atmosphereSettings[config.atmosphere].bg)
  })

  // Valori derivati dall'atmosfera selezionata
  // $derived: si ricalcola automaticamente quando config.atmosphere cambia
  let lightColor     = $derived(atmosphereSettings[config.atmosphere].lightColor)
  let lightIntensity = $derived(atmosphereSettings[config.atmosphere].lightIntensity)
  let ambientIntensity = $derived(atmosphereSettings[config.atmosphere].ambientIntensity)
</script>

<!--
  makeDefault: rende questa la camera attiva per il Canvas
  I figli di <T.PerspectiveCamera> ricevono la camera come contesto
-->
<T.PerspectiveCamera makeDefault position={[ 1.0553, 1.2376, 7.0134 ]} fov={48.25}>
  <!--
    OrbitControls: ruota con il mouse, zoom con la rotella
    enableDamping: inerzia fluida (aggiornato ogni frame automaticamente da Threlte)
  -->
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    minDistance={2}
    maxDistance={8}
    maxPolarAngle={Math.PI / 1.8}
  />
</T.PerspectiveCamera>

<!-- Luce principale: simula il sole o una fonte luminosa direzionale -->
<T.DirectionalLight
  position={[ 10, 10, 5 ]}
  intensity={lightIntensity}
  color={lightColor}
  castShadow
/>

<!-- Luce ambientale: illumina uniformemente tutta la scena -->
<T.AmbientLight intensity={ambientIntensity} />

<!-- Il modello 3D -->
<Model />
