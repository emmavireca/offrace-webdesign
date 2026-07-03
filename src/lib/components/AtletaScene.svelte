<script>
  import { T, useTask } from '@threlte/core'
  import { useGltf, OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'

  let { modello, rfd = 3500, deviazione = 5 } = $props()

  const gltf = useGltf(modello)

  // Mappiamo la deviazione (che va da 5 a 40) in un moltiplicatore di disturbo (es. da 0.0 a 0.15)
  // Più la deviazione è alta, più i vertici tremeranno visibilmente.
  let percentualeDev = $derived((deviazione - 5) / (40 - 5))
  let intensitaDisturbo = $derived(percentualeDev * 0.02) // Regola lo 0.12 per aumentare/diminuire il glitch

  // Shader personalizzato per l'effetto tremolio/glitch sui vertici
  const glitchMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    uniforms: {
      uTime: { value: 0 },
      uDisordine: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uDisordine;
      
      // Funzione pseudo-casuali per generare il disturbo
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      
      void main() {
        vec3 pos = position;
        
        if (uDisordine > 0.0) {
          // Creiamo un finto rumore basato sulla posizione del vertice e sul tempo
          float fintoRumoreX = hash(pos.x + pos.y + uTime) - 0.5;
          float fintoRumoreY = hash(pos.y + pos.z + uTime * 1.2) - 0.5;
          float fintoRumoreZ = hash(pos.z + pos.x + uTime * 0.8) - 0.5;
          
          // Applichiamo l'offset ai vertici
          pos.x += fintoRumoreX * uDisordine;
          pos.y += fintoRumoreY * uDisordine;
          pos.z += fintoRumoreZ * uDisordine;
        }
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      void main() {
        // Colore nero per il wireframe
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `
  })

  let atleta = $state(null)

  $effect(() => {
    if (!$gltf) return
    if (!atleta) {
      atleta = $gltf.scene.clone(true)
      atleta.traverse((node) => {
        if (node instanceof THREE.Mesh) node.material = glitchMaterial
      })
    }
  })

  // Teniamo aggiornata l'intensità del disturbo negli uniforms dello shader
  $effect(() => {
    glitchMaterial.uniforms.uDisordine.value = intensitaDisturbo
  })

  // Usiamo il task loop di Threlte per far scorrere il tempo (uTime) nello shader, creando il tremolio continuo
  useTask((delta) => {
    glitchMaterial.uniforms.uTime.value += delta * 4.0 // Velocità del tremolio
  })

  // Calcolo della velocità di rotazione (dall'interazione precedente)
  let percentualeRfd = $derived((rfd - 2800) / (6000 - 2800))
  let autoRotateSpeed = $derived(0.5 + percentualeRfd * (12.0 - 0.5))
</script>

<T.PerspectiveCamera makeDefault position={[1, 1, 4]} fov={40}>
  <OrbitControls
    autoRotate
    {autoRotateSpeed}
    enableZoom={false}
  />
</T.PerspectiveCamera>

<T.DirectionalLight position={[2, 3, 2]} intensity={2} />
<T.AmbientLight intensity={0.5} />

{#if atleta}
   <T is={atleta} scale={1} position={[0, -0.9, 0]} />
{/if}