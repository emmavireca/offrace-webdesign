<!--
  Scene.svelte — contenuto 3D: camera, luci, ambiente, modello

  Tutto ciò che è figlio di <Canvas> (in +page.svelte) è una scena Three.js.
  <T.XYZ> è la sintassi Threlte per creare oggetti Three.js:
    <T.PerspectiveCamera> → new THREE.PerspectiveCamera(...)
    <T.DirectionalLight>  → new THREE.DirectionalLight(...)
  I props corrispondono alle proprietà Three.js dell'oggetto.
-->
<script>
  import { T, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
  import { config } from '$lib/config.svelte.js'
  import Model from './Model.svelte'

  // useThrelte() espone il renderer WebGL e la scena Three.js
  const { renderer, scene } = useThrelte()
  
</script>

<!--
  makeDefault: rende questa la camera attiva per il Canvas
  I figli di <T.PerspectiveCamera> ricevono la camera come contesto
-->
<T.PerspectiveCamera makeDefault position={[ 2.0553, 1.2376, 2.0134 ]} fov={50.25}>
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
  position={[ 10, 5, 7 ]}
  intensity={3}
  color={'#ffffff'}
  castShadow
/>

<!-- Luce ambientale: illumina uniformemente tutta la scena -->
<T.AmbientLight intensity={0.5} />

<!-- Il modello 3D -->
<Model />
