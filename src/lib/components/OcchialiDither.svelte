<script>
  import { onMount, onDestroy } from 'svelte'

  let canvas
  let animId
  let video

  const VERT = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `

  // GLSL ES 1.0 compatibile — no array con indice variabile
  const FRAG = `
    precision mediump float;
    uniform sampler2D u_video;
    varying vec2 v_uv;

    float bayer(int x, int y) {
      int i = x + y * 4;
      if (i == 0)  return 0.0/16.0;
      if (i == 1)  return 8.0/16.0;
      if (i == 2)  return 2.0/16.0;
      if (i == 3)  return 10.0/16.0;
      if (i == 4)  return 12.0/16.0;
      if (i == 5)  return 4.0/16.0;
      if (i == 6)  return 14.0/16.0;
      if (i == 7)  return 6.0/16.0;
      if (i == 8)  return 3.0/16.0;
      if (i == 9)  return 11.0/16.0;
      if (i == 10) return 1.0/16.0;
      if (i == 11) return 9.0/16.0;
      if (i == 12) return 15.0/16.0;
      if (i == 13) return 7.0/16.0;
      if (i == 14) return 13.0/16.0;
      return 5.0/16.0;
    }

    vec3 palette(float t) {
      if (t < 0.25) return vec3(0.741, 0.961, 0.133); // #BDF522 verde
      if (t < 0.50) return vec3(0.482, 0.275, 0.973); // #7B46F8 viola
      if (t < 0.75) return vec3(0.651, 0.035, 0.941); // #A609F0 viola scuro
      return vec3(0.980, 0.318, 0.635);                // #FA51A2 pink
    }

    void main() {
      vec4 col = texture2D(u_video, v_uv);
      float luma = dot(col.rgb, vec3(0.299, 0.587, 0.114));

      // Sfondo nero -> trasparente
     if (col.a < 0.1) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

      int px = int(mod(gl_FragCoord.x, 4.0));
      int py = int(mod(gl_FragCoord.y, 4.0));
      float threshold = bayer(px, py);

      float q = clamp(luma + (threshold - 0.5) * 0.6, 0.0, 1.0);
      vec3 color = palette(q);

      gl_FragColor = vec4(color, 1.0);
    }
  `

  function compileShader(gl, type, src) {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s))
      return null
    }
    return s
  }

  function initGL() {
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true })
    if (!gl) { console.error('WebGL non supportato'); return }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
       1,-1,  1, 1,  -1,1
    ]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    function render() {
      if (video.readyState >= 2) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }
      animId = requestAnimationFrame(render)
    }
    render()
  }

  onMount(() => {
    video = document.createElement('video')
    video.src = '/videos/occhiali_alpha.webm'
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.play().catch(e => console.warn('Autoplay bloccato:', e))
    video.addEventListener('playing', initGL)
  })

  onDestroy(() => {
    cancelAnimationFrame(animId)
    video?.pause()
  })
</script>

<canvas bind:this={canvas} width="1920" height="1080"></canvas>

<style>
 canvas {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: contain;
  display: block;
  transform: translate(-20px,-70px) scale(1.8);
}
</style>