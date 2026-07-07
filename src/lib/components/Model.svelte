<script>
  import { T } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import * as THREE from 'three'
  import { config } from '$lib/config.svelte.js'

  // 1. Accettiamo l'URL dell'atleta inviato da Scene.svelte
  let { url } = $props()

  // Carichiamo gli sci di base (wireframe)
  const gltfSci = useGltf('/models/sci.glb')
  // Carichiamo l'atleta in modo reattivo basandoci sull'URL (uomo/donna)
  const gltfAtleta = $derived(useGltf(url))

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })

  let sci1 = $state(null)
  let sci2 = $state(null)
  let atletaScene = $state(null)

  // Effetto 1: Gestione degli sci a reticolo (wireframe)
  $effect(() => {
    if (!$gltfSci) return

    const l = config.lunghezza
    const w = config.larghezza
    const r = config.raggio

    if (!sci1) {
      sci1 = $gltfSci.scene.clone(true)
      sci2 = $gltfSci.scene.clone(true)
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

  // Effetto 2: Deformazione e scala applicata all'atleta (Uomo o Donna)
  $effect(() => {
    // Se l'atleta asincrono non è ancora pronto, esci
    if (!$gltfAtleta) return

    // Otteniamo la scena del modello corrente (F o M)
    atletaScene = $gltfAtleta.scene

    const l = config.lunghezza
    const w = config.larghezza
    const r = config.raggio

    const lunBase = config.venue === 'bormio' ? 222 : 214
    const radMin = config.venue === 'bormio' ? 45 : 40
    const radMax = config.venue === 'bormio' ? 55 : 50
    const raggioNorm = (r - radMin) / (radMax - radMin)

    // Applichiamo la stessa identica deformazione geometrica agli sci calzati dall'atleta
    atletaScene.traverse((node) => {
      // Cerchiamo le mesh che contengono la parola "ski" o "sci" nel modello dell'atleta
      if (node.isMesh && (node.name.toLowerCase().includes('ski') || node.name.toLowerCase().includes('sci'))) {
        node.parent.scale.z = l / lunBase
        node.parent.scale.x = w / 65
        if (node.morphTargetInfluences) {
          node.morphTargetInfluences[0] = raggioNorm
        }
      }
    })
  })
</script>

<!-- Rendering degli sci wireframe di sfondo -->
{#if sci1 && sci2}
  <T is={sci1} position={[0.6, 0.2, -1]} />
  <T is={sci2} position={[1, 0.2, -0.9]} />
{/if}

<!-- Rendering dell'Atleta dinamico (Uomo / Donna) -->
{#if atletaScene}
  <T is={atletaScene} position={[0, 0, 0]} />
{/if}