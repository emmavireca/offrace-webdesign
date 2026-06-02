<script>
  import { Canvas } from '@threlte/core'
  import AtletaScene from './AtletaScene.svelte'

  let { modello } = $props()
</script>

<div class="viewer">
  <Canvas>
    <AtletaScene {modello} />
  </Canvas>
</div>

<style>
  .viewer {
    width: 100%;
    height: 100%;
  }
</style>