"use client";

import Image from "next/image";
import { AgeIssue } from "./age-issue";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PanelRig = { frame: THREE.Mesh; hero?: THREE.Mesh; home: THREE.Vector3; mesh: THREE.Mesh; rotation: number; size: THREE.Vector2; spread: THREE.Vector3 };
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const ease = (value: number) => { const progress = clamp01(value); return progress * progress * (3 - 2 * progress); };
const coverRatioForPanel = (mobile: boolean) => mobile ? (1024 / 1535) * (3 / 2) : (1420 / 1104) * (2 / 3);

export function CoverReader() {
  const [mobileCover, setMobileCover] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches);
  const readerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 800px)");
    const syncLayout = () => setMobileCover(query.matches);
    syncLayout();
    query.addEventListener("change", syncLayout);
    return () => query.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    const reader = readerRef.current;
    const stage = stageRef.current;
    if (!reader || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      stage.classList.add("is-reduced-motion");
      return () => stage.classList.remove("is-reduced-motion");
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f0ea);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.className = "manga-webgl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    stage.prepend(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.2 });
    const paperMaterial = new THREE.MeshBasicMaterial({ color: 0xfbfaf6, transparent: true, opacity: 1 });
    const spineMaterial = new THREE.MeshBasicMaterial({ color: 0xb72f27, transparent: true, opacity: 1 });
    const pageShadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMaterial);
    const backPage = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), paperMaterial);
    const redSpine = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), spineMaterial);
    pageShadow.position.z = -0.24;
    backPage.position.z = -0.16;
    redSpine.position.z = -0.08;
    root.add(pageShadow, backPage, redSpine);

    const particlePositions = new Float32Array(70 * 3);
    for (let index = 0; index < particlePositions.length; index += 3) {
      particlePositions[index] = (Math.random() - 0.5) * 9;
      particlePositions[index + 1] = (Math.random() - 0.5) * 6;
      particlePositions[index + 2] = 1 + Math.random() * 2.2;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x151515, size: 0.012, transparent: true, opacity: 0.16, sizeAttenuation: true });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    const panels: PanelRig[] = [];
    let disposed = false;
    let scrollProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;
    const spreadTargets = [
      [-0.08, 0.045, 0.2, -0.035], [0, 0.07, 0.06, 0.012], [0.08, 0.04, 0.17, 0.035],
      [-0.08, -0.035, 0.14, 0.028], [0, -0.065, 0.22, -0.012], [0.08, -0.045, 0.25, -0.035],
    ];
    const mobileSpreadTargets = [
      [-0.018, 0.018, 0.2, -0.018], [0.018, 0.016, 0.06, 0.014],
      [-0.018, 0.004, 0.14, 0.012], [0.018, -0.004, 0.22, -0.012],
      [-0.018, -0.018, 0.18, -0.014], [0.018, -0.018, 0.25, 0.018],
    ];
    const assetRevision = "20260817-2";
    const heroSources = ["/hero-1.webp", "/hero-2.webp", "/hero-3.webp", "/hero-4.webp", "/hero-5.webp", "/hero-6.webp"]
      .map((source) => `${source}?v=${assetRevision}`);

    const visibleSize = () => {
      const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      return { height, width: height * camera.aspect };
    };
    const layoutPanels = () => {
      const bounds = stage.getBoundingClientRect();
      camera.aspect = Math.max(bounds.width / Math.max(bounds.height, 1), 0.1);
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
      const visible = visibleSize();
      const columns = mobileCover ? 2 : 3;
      const rows = mobileCover ? 3 : 2;
      const coverRatio = mobileCover ? 1024 / 1535 : 1420 / 1104;
      const coverWidth = mobileCover
        ? visible.width * 0.96
        : Math.min(visible.width * 0.94, visible.height * 0.9 * coverRatio);
      const coverHeight = coverWidth / coverRatio;
      const tileWidth = coverWidth / columns;
      const tileHeight = coverHeight / rows;
      pageShadow.scale.set(coverWidth * 1.025, coverHeight * 1.035, 1);
      pageShadow.position.set(coverWidth * 0.035, -coverHeight * 0.045, -0.24);
      pageShadow.rotation.z = -0.018;
      backPage.scale.set(coverWidth * 1.018, coverHeight * 1.025, 1);
      backPage.position.set(-coverWidth * 0.018, coverHeight * 0.015, -0.16);
      backPage.rotation.z = 0.024;
      redSpine.scale.set(Math.max(coverWidth * 0.025, 0.055), coverHeight * 1.02, 1);
      redSpine.position.set(-coverWidth * 0.515, -coverHeight * 0.005, -0.08);
      redSpine.rotation.z = 0.018;
      panels.forEach((panel, index) => {
        const columns = mobileCover ? 2 : 3;
        const rows = mobileCover ? 3 : 2;
        const column = index % columns;
        const row = Math.floor(index / columns);
        panel.size.set(tileWidth, tileHeight);
        panel.mesh.scale.set(tileWidth, tileHeight, 1);
        panel.hero?.scale.set(tileWidth, tileHeight, 1);
        panel.frame.scale.set(tileWidth * 1.025, tileHeight * 1.035, 1);
        panel.home.set((column - (columns - 1) / 2) * tileWidth, ((rows - 1) / 2 - row) * tileHeight, 0);
        const target = mobileCover ? mobileSpreadTargets[index] : spreadTargets[index];
        panel.spread.set(target[0] * coverWidth, target[1] * coverHeight, target[2]);
        panel.rotation = target[3];
      });
    };

    const textureLoader = new THREE.TextureLoader();
    const coverSource = mobileCover ? "/mobile-banner-main.webp" : "/akshat-kadam-cover.webp";
    textureLoader.load(`${coverSource}?v=${assetRevision}`, (sourceTexture) => {
      if (disposed) { sourceTexture.dispose(); return; }
      sourceTexture.colorSpace = THREE.SRGBColorSpace;
      sourceTexture.minFilter = THREE.LinearFilter;
      sourceTexture.magFilter = THREE.LinearFilter;
      for (let index = 0; index < 6; index += 1) {
        const columns = mobileCover ? 2 : 3;
        const rows = mobileCover ? 3 : 2;
        const column = index % columns;
        const row = Math.floor(index / columns);
        const texture = sourceTexture.clone();
        texture.needsUpdate = true;
        texture.repeat.set(1 / columns, 1 / rows);
        texture.offset.set(column / columns, 1 - (row + 1) / rows);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0 }));
        frame.position.z = -0.025;
        root.add(frame, mesh);
        const panel: PanelRig = { frame, home: new THREE.Vector3(), mesh, rotation: 0, size: new THREE.Vector2(), spread: new THREE.Vector3() };
        panels.push(panel);
        textureLoader.load(heroSources[index], (heroTexture) => {
          if (disposed) { heroTexture.dispose(); return; }
          heroTexture.colorSpace = THREE.SRGBColorSpace;
          heroTexture.minFilter = THREE.LinearFilter;
          heroTexture.magFilter = THREE.LinearFilter;
          const image = heroTexture.image as { width?: number; height?: number };
          const imageRatio = (image.width ?? 1) / Math.max(image.height ?? 1, 1);
          const panelRatio = coverRatioForPanel(mobileCover);
          if (imageRatio > panelRatio) {
            heroTexture.repeat.x = panelRatio / imageRatio;
            heroTexture.offset.x = (1 - heroTexture.repeat.x) / 2;
          } else {
            heroTexture.repeat.y = imageRatio / panelRatio;
            heroTexture.offset.y = (1 - heroTexture.repeat.y) / 2;
          }
          const hero = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ map: heroTexture, transparent: true, opacity: 0, toneMapped: false }),
          );
          hero.position.z = 0.015;
          panel.hero = hero;
          root.add(hero);
          layoutPanels();
        });
      }
      layoutPanels();
      stage.classList.add("is-three-ready");
    });

    const updateScroll = () => {
      const range = Math.max(reader.offsetHeight - window.innerHeight, 1);
      scrollProgress = clamp01(-reader.getBoundingClientRect().top / range);
      reader.style.setProperty("--open-progress", scrollProgress.toFixed(4));
    };
    const updatePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const render = () => {
      const separation = reduceMotion ? 0 : ease((scrollProgress - 0.015) / 0.68);
      const float = reduceMotion ? 0 : ease((scrollProgress - 0.48) / 0.45);
      const approach = reduceMotion ? 0 : ease(scrollProgress / 0.28);
      const elapsed = performance.now() * 0.001;
      root.rotation.y += (pointerX * 0.035 - root.rotation.y) * 0.045;
      root.rotation.x += (-pointerY * 0.025 - root.rotation.x) * 0.045;
      root.rotation.z = Math.sin(elapsed * 0.48) * 0.0035 * (1 - separation);
      root.position.y = Math.sin(elapsed * 0.62) * 0.012 * (1 - separation);
      camera.position.x += (pointerX * 0.09 - camera.position.x) * 0.035;
      camera.position.y += (-pointerY * 0.06 - camera.position.y) * 0.035;
      camera.position.z += (6 - approach * 0.27 - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);
      shadowMaterial.opacity = Math.max(0, 0.2 * (1 - separation * 1.15));
      paperMaterial.opacity = Math.max(0, 1 - separation * 1.2);
      spineMaterial.opacity = Math.max(0, 1 - separation * 1.35);
      particles.rotation.z += 0.00012;
      particleMaterial.opacity = 0.16 * (1 - separation * 0.7);
      panels.forEach((panel, index) => {
        const pulse = Math.sin(performance.now() * 0.0012 + index * 0.28) * 0.025 * float;
        const imageMix = reduceMotion ? 0 : ease((scrollProgress - (0.48 + index * 0.045)) / 0.2);
        panel.mesh.position.copy(panel.home).addScaledVector(panel.spread, separation);
        panel.mesh.position.z += pulse;
        panel.mesh.rotation.z = panel.rotation * separation;
        const panelScale = 1 - separation * (mobileCover ? 0.14 : 0.055);
        panel.mesh.scale.set(panel.size.x * panelScale, panel.size.y * panelScale, 1);
        (panel.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - imageMix;
        (panel.mesh.material as THREE.MeshBasicMaterial).transparent = imageMix > 0;
        if (panel.hero) {
          panel.hero.position.copy(panel.mesh.position);
          panel.hero.position.z += 0.02;
          panel.hero.rotation.z = panel.mesh.rotation.z;
          panel.hero.scale.copy(panel.mesh.scale);
          (panel.hero.material as THREE.MeshBasicMaterial).opacity = imageMix;
        }
        panel.frame.position.copy(panel.mesh.position);
        panel.frame.position.z -= 0.035;
        panel.frame.rotation.z = panel.mesh.rotation.z;
        panel.frame.scale.set(panel.size.x * (panelScale + 0.018), panel.size.y * (panelScale + 0.025), 1);
        (panel.frame.material as THREE.MeshBasicMaterial).opacity = separation * 0.92;
      });
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    updateScroll();
    layoutPanels();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", layoutPanels);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    frameId = window.requestAnimationFrame(render);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", layoutPanels);
      window.removeEventListener("pointermove", updatePointer);
      panels.forEach(({ frame, hero, mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.MeshBasicMaterial).map?.dispose();
        (mesh.material as THREE.MeshBasicMaterial).dispose();
        frame.geometry.dispose();
        (frame.material as THREE.MeshBasicMaterial).dispose();
        if (hero) {
          hero.geometry.dispose();
          (hero.material as THREE.MeshBasicMaterial).map?.dispose();
          (hero.material as THREE.MeshBasicMaterial).dispose();
        }
      });
      pageShadow.geometry.dispose();
      backPage.geometry.dispose();
      redSpine.geometry.dispose();
      shadowMaterial.dispose();
      paperMaterial.dispose();
      spineMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mobileCover]);

  return <section className="cover-reader" ref={readerRef} aria-labelledby="cover-title">
    <div className="cover-stage" ref={stageRef}>
      <picture className="cover-fallback"><source media="(max-width: 800px)" srcSet="/mobile-banner-main.webp" /><Image src="/akshat-kadam-cover.webp" alt="Illustrated manga cover introducing Akshat Kadam" width={1420} height={1104} priority sizes="100vw" /></picture>
      <div className="reader-glyph" aria-hidden="true">始</div>
      <div className="reader-spine" aria-hidden="true"><span>ISSUE <AgeIssue /></span><span>AKSHAT KADAM</span><span>始まり</span></div>
      <div className="reader-topline"><span>AKSHAT KADAM · ISSUE <AgeIssue /></span><span>SCROLL TO OPEN</span></div>
      <div className="reader-chapter chapter-origin"><span>01</span><strong>My Story</strong><p>Talking points at a party</p></div>
      <div className="reader-chapter chapter-builder"><span>02</span><strong>9–5</strong><p>Hustle and Bustle</p></div>
      <div className="reader-chapter chapter-now"><span>03</span><strong>5–9</strong><p>What&apos;s not in my Resume</p></div>
      <div className="scroll-meter" aria-hidden="true"><i /></div>
      <div className="page-corner" aria-hidden="true"><span>OPEN</span><i>↘</i></div>
      <h1 className="sr-only" id="cover-title">Akshat Kadam | Personal archive, issue <AgeIssue /></h1>
    </div>
  </section>;
}
