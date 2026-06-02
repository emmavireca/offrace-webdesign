<script>
  import { T } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import * as THREE from 'three'
  import { config } from '$lib/config.svelte.js'

  const gltf = useGltf('/models/sci.glb')

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })

  let sci1 = $state(null)
  let sci2 = $state(null)

  $effect(() => {
  if (!$gltf) return

  const l = config.lunghezza
  const w = config.larghezza
  const r = config.raggio

  if (!sci1) {
    sci1 = $gltf.scene.clone(true)
    sci2 = $gltf.scene.clone(true)
    sci1.traverse((node) => { if (node instanceof THREE.Mesh) node.material = wireMat })
    sci2.traverse((node) => { if (node instanceof THREE.Mesh) node.material = wireMat })
  }

  const lunBase = config.venue === 'bormio' ? 222 : 214
  const radMin = config.venue === 'bormio' ? 45 : 40
  const radMax = config.venue === 'bormio' ? 55 : 50
  const raggioNorm = (r - radMin) / (radMax - radMin)

  for (const sci of [sci1, sci2]) {
    sci.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return
      node.parent.scale.z = l / lunBase
      node.parent.scale.x = w / 65
      if (node.morphTargetInfluences) {
        node.morphTargetInfluences[0] = raggioNorm
      }
    })
  }
})
</script>

{#if sci1 && sci2}
  <T is={sci1} position={[0.6, 0.2, -1]} />
  <T is={sci2} position={[1, 0.2, -0.9]} />
{/if}