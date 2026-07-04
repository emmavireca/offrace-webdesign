<!--
  PistaModel.svelte — carica un GLB e lo mostra in wireframe nero.
  Riceve il path del file via prop `src`.
-->
<script>
  import { T } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import * as THREE from 'three'

  let { src } = $props()

  // ricarica il gltf ogni volta che cambia src
  let gltf = $derived(useGltf(src))

  // applica un materiale wireframe nero a tutte le mesh del modello
  function wireframe(scene) {
    if (!scene) return scene
    scene.traverse((o) => {
      if (o.isMesh) {
        o.material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true,
        })
      }
    })
    return scene
  }
</script>

{#if $gltf}
  <T is={wireframe($gltf.scene)} />
{/if}