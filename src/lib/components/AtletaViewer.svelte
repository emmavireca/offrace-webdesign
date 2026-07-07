<script>
  import { Canvas } from '@threlte/core'
  import AtletaScene from './AtletaScene.svelte'

  // Riceve sia il modello che l'rfd dalla pagina principale
  let { modello, rfd, deviazione } = $props()
</script>

<div class="viewer">
  <Canvas>
    <AtletaScene {modello} {rfd} {deviazione}/>
  </Canvas>
</div>

<style>
  .viewer {
    width: 100%;
    height: 100%;
  }
</style>