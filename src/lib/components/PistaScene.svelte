<!--
  PistaScene.svelte — scena 3D per la pista: camera angolata + luci + modello wireframe.
  Riceve `src` (path del glb) e lo passa a PistaModel.
-->
<script>
  import { T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import PistaModel from './PistaModel.svelte'

  let { src } = $props()

  // camera diversa per ogni pista
  let cam = $derived(
    src.includes('bormio')
      ? { pos: [6, 4, 7], fov: 60 }   // ← valori per BORMIO
      : { pos: [4, 3, 6], fov: 55 }   // ← valori per OLYMPIA
  )
</script>
{#key src}
<T.PerspectiveCamera makeDefault position={cam.pos} fov={cam.fov}>
  <OrbitControls
    enableZoom={false}
    enablePan={false}
    target={[0, -1.5, 0]}
    autoRotate
    autoRotateSpeed={1.5}
  />
</T.PerspectiveCamera>
<T.AmbientLight intensity={1} />

  <T.Group position={[0, src.includes('bormio') ? 1.4 : 0, 0]}>
  <PistaModel {src} />
</T.Group>
{/key}