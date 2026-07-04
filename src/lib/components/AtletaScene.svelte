<script>
  import { T } from '@threlte/core'
  import { useGltf, OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'

  let { modello } = $props()

  const gltf = useGltf(modello)

  const wireMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })

  let atleta = $state(null)

  $effect(() => {
    if (!$gltf) return
    if (!atleta) {
      atleta = $gltf.scene.clone(true)
      atleta.traverse((node) => {
        if (node instanceof THREE.Mesh) node.material = wireMat
      })
    }
  })
</script>

<T.PerspectiveCamera makeDefault position={[1, 1, 4]} fov={40}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={2}
    enableZoom={false}
  />
</T.PerspectiveCamera>

<T.DirectionalLight position={[2, 3, 2]} intensity={2} />
<T.AmbientLight intensity={0.5} />

{#if atleta}
   <T is={atleta} scale={1} position={[0, -0.9, 0]} />
{/if}