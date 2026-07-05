<script>
  import { T, useTask } from '@threlte/core'
  import { useGltf, OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'

  let { modello, rfd = 3500, deviazione = 5 } = $props()

  const gltf = useGltf(modello)

  // Mappiamo la deviazione (che va da 5 a 40) in un moltiplicatore di disturbo
  let percentualeDev = $derived((deviazione - 5) / (40 - 5))
  let intensitaDisturbo = $derived(percentualeDev * 0.02) 

  // Oggetto condiviso per passare il tempo e il disordine al materiale modificato
  const shaderParams = {
    uTime: 0,
    uDisordine: 0
  }

  // Creiamo un materiale base nativo (che supporta AUTOMATICAMENTE lo scheletro dell'uomo)
  const glitchMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
  })

  // Iniettiamo il nostro codice di tremolio dentro il materiale nativo di Three.js
  glitchMaterial.onBeforeCompile = (shader) => {
    // 1. Aggiungiamo le nostre variabili uniform
    shader.uniforms.uTime = { get value() { return shaderParams.uTime } }
    shader.uniforms.uDisordine = { get value() { return shaderParams.uDisordine } }

    // 2. Iniettiamo la funzione hash nel Vertex Shader prima del main
    shader.vertexShader = `
      uniform float uTime;
      uniform float uDisordine;
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
    ` + shader.vertexShader;

    // 3. Applichiamo il tremolio sui vertici DOPO che Three.js ha calcolato la posizione (sia per Mesh che per SkinnedMesh)
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
      #include <project_vertex>
      if (uDisordine > 0.0) {
        float fintoRumoreX = hash(gl_Position.x + gl_Position.y + uTime) - 0.5;
        float fintoRumoreY = hash(gl_Position.y + gl_Position.z + uTime * 1.2) - 0.5;
        float fintoRumoreZ = hash(gl_Position.z + gl_Position.x + uTime * 0.8) - 0.5;
        
        gl_Position.x += fintoRumoreX * uDisordine * gl_Position.w;
        gl_Position.y += fintoRumoreY * uDisordine * gl_Position.w;
        gl_Position.z += fintoRumoreZ * uDisordine * gl_Position.w;
      }
      `
    );
  };

  let atleta = $state(null)

  // Effetto: Rigenera l'atleta quando cambia il file .glb inserito nella prop 'modello'
  $effect(() => {
    if (!$gltf) {
      atleta = null
      return
    }
    
    // Cloniamo il modello (Uomo o Donna) e applichiamo il materiale modificato
    const clone = $gltf.scene.clone(true)
    clone.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material = glitchMaterial
      }
    })
    atleta = clone
  })

  // Teniamo aggiornato il valore del disordine in modo reattivo
  $effect(() => {
    shaderParams.uDisordine = intensitaDisturbo
  })

  // Usiamo il task loop per far scorrere il tempo e far tremare i vertici
  useTask((delta) => {
    shaderParams.uTime += delta * 4.0 // Velocità del tremolio
  })

  // Calcolo della velocità di rotazione
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