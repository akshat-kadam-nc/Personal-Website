"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { libraryVolumes, type LibraryVolume } from "./library-data";

type Props = { cabinet: number; onSelect: (volume: LibraryVolume) => void; selectedId: string | null };
type BookRig = { mesh: THREE.Mesh; home: THREE.Vector3; volume: LibraryVolume };

const colors = { ink: 0x111111, paper: 0xe7e2d7, red: 0xb72f27, gray: 0x8b8a85 };

function spineTexture(volume: LibraryVolume) {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const dark = volume.color === "ink" || volume.color === "red";
  context.fillStyle = `#${colors[volume.color].toString(16).padStart(6, "0")}`;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = dark ? "#f4f0e7" : "#111111";
  context.lineWidth = 9; context.strokeRect(14, 14, 228, 996);
  context.fillStyle = dark ? "#f4f0e7" : "#111111";
  context.textAlign = "center";
  context.font = "700 42px monospace"; context.fillText(volume.number, 128, 80);
  context.save(); context.translate(128, 545); context.rotate(Math.PI / 2);
  context.font = "900 50px Georgia"; context.fillText(volume.title.toUpperCase(), 0, 0);
  context.restore();
  context.font = "700 28px monospace"; context.fillText("AK", 128, 970);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function BookshelfScene({ cabinet, onSelect, selectedId }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cabinetRef = useRef(cabinet);
  const selectedRef = useRef(selectedId);
  useEffect(() => { cabinetRef.current = cabinet; }, [cabinet]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, .15, 12.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "library-webgl";
    mount.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xfff8e7, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 3.4); key.position.set(-4, 7, 8); scene.add(key);
    const red = new THREE.PointLight(0xb72f27, 18, 18); red.position.set(5, 1, 5); scene.add(red);

    const world = new THREE.Group(); scene.add(world);
    const wood = new THREE.MeshStandardMaterial({ color: 0x201a17, roughness: .72, metalness: .05 });
    const edge = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: .55 });
    const books: BookRig[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [wood, edge];
    const textures: THREE.Texture[] = [];
    const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z = 0) => {
      const geometry = new THREE.BoxGeometry(w, h, d); geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); return mesh;
    };
    for (let cabinetIndex = 0; cabinetIndex < 3; cabinetIndex += 1) {
      const cabinetGroup = new THREE.Group(); cabinetGroup.position.x = cabinetIndex * 9;
      cabinetGroup.add(box(8.25, .28, 1.25, wood, 0, 4.25), box(8.25, .34, 1.4, wood, 0, -4.25), box(.34, 8.8, 1.4, wood, -4.12, 0), box(.34, 8.8, 1.4, wood, 4.12, 0));
      for (let shelf = 0; shelf < 4; shelf += 1) cabinetGroup.add(box(7.95, .22, 1.25, wood, 0, 2.2 - shelf * 2.05));
      const backing = box(7.92, 8.1, .12, edge, 0, 0, -.62); cabinetGroup.add(backing);
      const active = libraryVolumes.filter((volume) => volume.cabinet === cabinetIndex);
      active.forEach((volume) => {
        const shelfY = 3.18 - volume.shelf * 2.05;
        for (let slot = 0; slot < 9; slot += 1) {
          const isFeature = slot === 4;
          const width = .58 + ((slot * 7 + volume.shelf) % 3) * .1;
          const height = 1.42 + ((slot * 5 + cabinetIndex) % 4) * .09;
          const x = -3.35 + slot * .84;
          let material: THREE.Material;
          if (isFeature) {
            const texture = spineTexture(volume); if (texture) textures.push(texture);
            material = new THREE.MeshStandardMaterial({ color: colors[volume.color], map: texture ?? undefined, roughness: .62 }); materials.push(material);
          } else {
            const palette = [0x171717, 0xddd8cd, 0x676662, 0x2a2522];
            material = new THREE.MeshStandardMaterial({ color: palette[(slot + volume.shelf) % palette.length], roughness: .8 }); materials.push(material);
          }
          const book = box(width, height, .86, material, x, shelfY - (1.62 - height) / 2, .02 + (slot % 2) * .04);
          book.rotation.z = slot === 8 ? -.045 : slot === 0 ? .035 : 0;
          cabinetGroup.add(book);
          if (isFeature) books.push({ mesh: book, home: book.position.clone(), volume });
        }
      });
      world.add(cabinetGroup);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    };
    const click = (event: PointerEvent) => {
      updatePointer(event); raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(books.map((book) => book.mesh), false)[0];
      const rig = books.find((book) => book.mesh === hit?.object);
      if (rig) onSelect(rig.volume);
    };
    const move = (event: PointerEvent) => {
      updatePointer(event); raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(books.map((book) => book.mesh), false)[0];
      renderer.domElement.style.cursor = hit ? "pointer" : "grab";
    };
    renderer.domElement.addEventListener("pointerdown", click);
    renderer.domElement.addEventListener("pointermove", move);
    const resize = () => { const rect = mount.getBoundingClientRect(); camera.aspect = rect.width / Math.max(rect.height, 1); camera.updateProjectionMatrix(); renderer.setSize(rect.width, rect.height, false); };
    resize(); window.addEventListener("resize", resize);
    let frame = 0; let disposed = false;
    const render = () => {
      const targetX = -cabinetRef.current * 9;
      world.position.x += (targetX - world.position.x) * .075;
      books.forEach((book) => {
        const selected = selectedRef.current === book.volume.id;
        const targetZ = selected ? 3.2 : book.home.z;
        const targetXBook = book.home.x + (selected ? .32 : 0);
        book.mesh.position.z += (targetZ - book.mesh.position.z) * .1;
        book.mesh.position.x += (targetXBook - book.mesh.position.x) * .1;
        book.mesh.rotation.y += ((selected ? -.52 : 0) - book.mesh.rotation.y) * .09;
        book.mesh.rotation.z += ((selected ? -.08 : 0) - book.mesh.rotation.z) * .09;
      });
      camera.position.x = Math.sin(performance.now() * .00025) * .08;
      camera.lookAt(0, 0, 0); renderer.render(scene, camera);
      if (!disposed) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true; cancelAnimationFrame(frame); window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", click); renderer.domElement.removeEventListener("pointermove", move);
      geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose()); textures.forEach((texture) => texture.dispose()); renderer.dispose(); renderer.domElement.remove();
    };
  }, [onSelect]);
  return <div className="library-scene" ref={mountRef} aria-label="Three-dimensional library bookshelf" />;
}
