<script>
  import { T, useThrelte, useTask } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import * as THREE from 'three'
  import { config } from '$lib/config.svelte.js'
  import Model from './Model.svelte'

  const { renderer, scene } = useThrelte()

  let cameraObj = $state(null)
  let controls = $state(null)
  let durata = 260

  const fuochi = {
    length: { zoom: 0.40, off: new THREE.Vector3( 0.2,  0.3, 0.1) },
    width:  { zoom: 0.45, off: new THREE.Vector3(0.3,  -0.1, -0.3) },
    radius: { zoom: 0.55, off: new THREE.Vector3( 0.20, 0.0, 0.0) },
  }

  const DURATA = { length: 260, width: 260, radius: 600 }

  function easeInOut(t) {
    return t >= 0.5 ? 1 - Math.pow(-2 * t + 2, 2) / 2 : 2 * t * t
  }

  const returnPos    = new THREE.Vector3()
  const returnTarget = new THREE.Vector3()
  const focusPos     = new THREE.Vector3()
  const focusTarget  = new THREE.Vector3()
  const fromPos      = new THREE.Vector3()
  const fromTarget   = new THREE.Vector3()
  const toPos        = new THREE.Vector3()
  const toTarget     = new THREE.Vector3()
  const curPos       = new THREE.Vector3()
  const curTarget    = new THREE.Vector3()

  let fase  = 'idle'
  let tStart = 0

  function startTransizione(dPos, dTarget) {
    fromPos.copy(curPos)
    fromTarget.copy(curTarget)
    toPos.copy(dPos)
    toTarget.copy(dTarget)
    tStart = performance.now()
  }

  function calcolaFuoco(key) {
    if (key === 'radius') {
      focusTarget.set(1.5, 0.2, -0.3)
      focusPos.set(1.0, 1.6, -0.8)
      return
    }
    const f = fuochi[key]
    focusTarget.copy(returnTarget).add(f.off)
    focusPos.copy(returnPos).sub(returnTarget).multiplyScalar(f.zoom).add(returnTarget).add(f.off)
  }

  $effect(() => {
    const key = config.zoomTarget
    if (!cameraObj || !controls) return

    if (key) {
      if (fase === 'idle') {
        returnPos.copy(cameraObj.position)
        returnTarget.copy(controls.target)
        curPos.copy(cameraObj.position)
        curTarget.copy(controls.target)
      }
      calcolaFuoco(key)
      durata = DURATA[key] ?? 260
      startTransizione(focusPos, focusTarget)
      fase = 'andata'
      controls.enabled = false
      controls.enableDamping = false
      config.zoomAttivo = true
    } else {
      if (fase === 'andata' || fase === 'fermo') {
        startTransizione(returnPos, returnTarget)
        fase = 'ritorno'
      }
    }
  })

  useTask(() => {
    if (fase !== 'andata' && fase !== 'ritorno') return
    if (!cameraObj || !controls) return

    const t = Math.min((performance.now() - tStart) / durata, 1)
    const e = easeInOut(t)

    curPos.copy(fromPos).lerp(toPos, e)
    curTarget.copy(fromTarget).lerp(toTarget, e)

    cameraObj.position.copy(curPos)
    controls.target.copy(curTarget)
    controls.enableDamping = false
    controls.update()

    if (t >= 1) {
      if (fase === 'andata') {
        fase = 'fermo'
      } else {
        fase = 'idle'
        controls.enabled = true
        controls.enableDamping = true
        config.zoomAttivo = false
      }
    }
  })
</script>

<T.PerspectiveCamera bind:ref={cameraObj} makeDefault position={[ 2.0553, 1.2376, 2.0134 ]} fov={50.25}>
  <OrbitControls
    bind:ref={controls}
    enableDamping
    dampingFactor={0.05}
    minDistance={2}
    maxDistance={8}
    maxPolarAngle={Math.PI / 1.8}
  />
</T.PerspectiveCamera>

<T.DirectionalLight position={[ 10, 5, 7 ]} intensity={3} color={'#ffffff'} castShadow />
<T.AmbientLight intensity={0.5} />

<Model />