"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function SunsetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 20, 100);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,
      0.8,
      0.7
    );
    composer.addPass(bloom);

    /* ───── sky — steel-blue base with film grain ───── */

    const skyUniforms = { uProgress: { value: 0 } };
    const skyMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.999, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uProgress;
          varying vec2 vUv;

          vec3 g4(float y, vec3 a, vec3 b, vec3 c, vec3 d) {
            return y > 0.67 ? mix(c, d, (y - 0.67) / 0.33)
                 : y > 0.33 ? mix(b, c, (y - 0.33) / 0.34)
                 :             mix(a, b, y / 0.33);
          }

          void main() {
            float y = vUv.y;
            float p = uProgress;

            // dusty steel blue — matches Suns poster reference
            vec3 s0 = g4(y,
              vec3(0.22, 0.36, 0.50), vec3(0.24, 0.38, 0.53),
              vec3(0.26, 0.40, 0.56), vec3(0.20, 0.34, 0.50));
            // warming at horizon
            vec3 s1 = g4(y,
              vec3(0.50, 0.38, 0.30), vec3(0.42, 0.46, 0.50),
              vec3(0.30, 0.42, 0.54), vec3(0.22, 0.36, 0.50));
            // deep sunset — dusky rose / warm at bottom
            vec3 s2 = g4(y,
              vec3(0.50, 0.22, 0.22), vec3(0.55, 0.30, 0.38),
              vec3(0.20, 0.24, 0.40), vec3(0.12, 0.18, 0.35));
            // twilight
            vec3 s3 = g4(y,
              vec3(0.08, 0.06, 0.12), vec3(0.14, 0.10, 0.22),
              vec3(0.10, 0.12, 0.26), vec3(0.06, 0.10, 0.22));
            // night
            vec3 s4 = g4(y,
              vec3(0.02, 0.02, 0.05), vec3(0.05, 0.04, 0.10),
              vec3(0.04, 0.06, 0.12), vec3(0.02, 0.04, 0.08));

            vec3 col = p < 0.25 ? mix(s0, s1, p / 0.25)
                     : p < 0.5  ? mix(s1, s2, (p - 0.25) / 0.25)
                     : p < 0.75 ? mix(s2, s3, (p - 0.5) / 0.25)
                     :            mix(s3, s4, (p - 0.75) / 0.25);

            // soft peach horizon glow
            float glow = exp(-pow((y - 0.32) * 5.0, 2.0));
            float glowAmt = sin(clamp(p * 3.14159, 0.0, 3.14159)) * 0.14;
            col += mix(vec3(1.0, 0.85, 0.6), vec3(0.7, 0.3, 0.4), p) * glow * glowAmt;

            // film grain
            float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
            col += (grain - 0.5) * 0.035;

            gl_FragColor = vec4(col, 1.0);
          }
        `,
        depthWrite: false,
        depthTest: false,
      })
    );
    skyMesh.renderOrder = -1000;
    skyMesh.frustumCulled = false;
    scene.add(skyMesh);

    /* ───── sun — soft cream / peach disc with wide bloom ───── */

    const sunUniforms = { uProgress: { value: 0 } };
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(28, 64),
      new THREE.ShaderMaterial({
        uniforms: sunUniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uProgress;
          varying vec2 vUv;

          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float core = 1.0 - smoothstep(0.0, 0.35, d);
            float mid  = 1.0 - smoothstep(0.05, 0.65, d);
            float rim  = 1.0 - smoothstep(0.2, 1.0, d);

            // warm peach center → orange → crimson as sun sets
            vec3 cc = mix(vec3(2.8, 2.1, 1.5), vec3(3.5, 1.0, 0.4), uProgress);
            vec3 mc = mix(vec3(1.8, 1.2, 0.7), vec3(1.8, 0.5, 0.3), uProgress);
            vec3 rc = mix(vec3(1.1, 0.65, 0.35), vec3(0.7, 0.15, 0.12), uProgress);

            vec3 col = cc * core + mc * mid * 0.4 + rc * rim * 0.2;
            float a = rim * mix(1.0, 0.3, uProgress);
            gl_FragColor = vec4(col, a);
          }
        `,
        transparent: true,
        depthWrite: false,
      })
    );
    sun.position.set(0, 44, -80);
    scene.add(sun);

    /* ───── desert mountain silhouettes — blue-gray ───── */

    const mtDefs = [
      { y: -30, h: 25, z: -60, color: 0x2a3a4e, op: 1 },
      { y: -32, h: 30, z: -95, color: 0x1e2e42, op: 0.9 },
      { y: -35, h: 35, z: -135, color: 0x162038, op: 0.75 },
    ];

    const mountains = mtDefs.map((d) => {
      const pts: THREE.Vector2[] = [];
      for (let i = 0; i <= 80; i++) {
        const x = (i / 80 - 0.5) * 600;
        const yy =
          Math.sin(i * 0.08 + d.z * 0.01) * d.h +
          Math.sin(i * 0.15 + 2 + d.z * 0.02) * d.h * 0.4 +
          Math.sin(i * 0.03 + 5 + d.z * 0.005) * d.h * 0.6 +
          d.y;
        pts.push(new THREE.Vector2(x, yy));
      }
      pts.push(new THREE.Vector2(300, -200), new THREE.Vector2(-300, -200));

      const mat = new THREE.MeshBasicMaterial({
        color: d.color,
        transparent: true,
        opacity: d.op,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(
        new THREE.ShapeGeometry(new THREE.Shape(pts)),
        mat
      );
      mesh.position.z = d.z;
      scene.add(mesh);
      return mesh;
    });

    /* ───── grid — white lines matching reference ───── */

    const gm = () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        transparent: true,
        opacity: 0.22,
      });

    const box1 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(14, 14)),
      gm()
    );
    box1.position.set(-50, 18, -25);
    scene.add(box1);

    const gridGrp = new THREE.Group();
    for (let i = 0; i <= 6; i++) {
      const o = -7 + i * (14 / 6);
      const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(o, -7, 0),
        new THREE.Vector3(o, 7, 0),
      ]);
      gridGrp.add(new THREE.Line(vGeo, gm()));
      const hGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7, o, 0),
        new THREE.Vector3(7, o, 0),
      ]);
      gridGrp.add(new THREE.Line(hGeo, gm()));
    }
    gridGrp.position.set(-50, 18, -24.5);
    scene.add(gridGrp);

    const box2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(18, 18)),
      gm()
    );
    box2.position.set(48, 34, -35);
    scene.add(box2);

    const hLines = [3, 10, 17].map((yp, i) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-200, yp, -45),
        new THREE.Vector3(200, yp, -45),
      ]);
      const l = new THREE.Line(geo, gm());
      (l.material as THREE.LineBasicMaterial).opacity = 0.28 - i * 0.06;
      scene.add(l);
      return l;
    });

    const circlePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      circlePts.push(
        new THREE.Vector3(Math.cos(a) * 10, Math.sin(a) * 10, 0)
      );
    }
    const circ = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(circlePts),
      gm()
    );
    circ.position.set(-55, -8, -30);
    scene.add(circ);

    const gridMats = [
      box1.material,
      box2.material,
      circ.material,
      ...gridGrp.children.map((c) => (c as THREE.Line).material),
      ...hLines.map((l) => l.material),
    ] as THREE.LineBasicMaterial[];

    const gridColors = [
      new THREE.Color(1.0, 1.0, 1.0),
      new THREE.Color(1.0, 0.88, 0.78),
      new THREE.Color(0.85, 0.55, 0.60),
      new THREE.Color(0.40, 0.30, 0.45),
      new THREE.Color(0.15, 0.12, 0.20),
    ];

    /* ───── stars ───── */

    const STAR_COUNT = 3000;
    const sPos = new Float32Array(STAR_COUNT * 3);
    const sSizes = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 300 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.8 + 0.2);
      sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 30;
      sPos[i * 3 + 2] = -r * Math.cos(phi);
      sSizes[i] = Math.random() * 2 + 0.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(sSizes, 1));

    const starUniforms = { uTime: { value: 0 }, uOpacity: { value: 0 } };
    const stars = new THREE.Points(
      starGeo,
      new THREE.ShaderMaterial({
        uniforms: starUniforms,
        vertexShader: `
          attribute float size;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (200.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          uniform float uTime;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = (1.0 - smoothstep(0.0, 0.5, d)) * uOpacity;
            float twinkle = 0.8 + 0.2 * sin(uTime * 2.0 + gl_FragCoord.x * 0.1);
            gl_FragColor = vec4(1.0, 0.95, 0.9, a * twinkle);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(stars);

    /* ───── scroll ───── */

    let progress = 0;
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) progress = Math.min(window.scrollY / max, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ───── animation loop ───── */

    let frameId: number;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;

      skyUniforms.uProgress.value = progress;
      sunUniforms.uProgress.value = progress;
      sun.position.y = 44 - progress * 72;

      bloom.strength =
        progress < 0.55
          ? 0.3 + progress * 1.2
          : 0.3 + 0.66 - ((progress - 0.55) / 0.45) * 1.0;

      starUniforms.uTime.value = t;
      starUniforms.uOpacity.value = Math.max(0, (progress - 0.4) / 0.6);

      const gi = progress * (gridColors.length - 1);
      const gLow = Math.floor(gi);
      const gHigh = Math.min(gLow + 1, gridColors.length - 1);
      const gc = gridColors[gLow].clone().lerp(gridColors[gHigh], gi - gLow);
      const baseOp = 0.22 * (1 - progress * 0.7);
      gridMats.forEach((m) => {
        m.color.copy(gc);
        m.opacity = baseOp;
      });

      mountains.forEach((m, i) => {
        (m.material as THREE.MeshBasicMaterial).color.setHSL(
          0.60 + i * 0.01,
          0.25 + progress * 0.1,
          Math.max(0.12 + i * 0.02 - progress * 0.04, 0.02)
        );
      });

      camera.position.x = Math.sin(t * 0.08) * 1.5;
      camera.position.y = 20 + Math.cos(t * 0.12) * 0.8;
      camera.lookAt(0, 15, -50);

      composer.render();
    };
    tick();

    /* ───── resize ───── */

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ───── cleanup ───── */

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material))
            m.material.forEach((mm) => mm.dispose());
          else m.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
