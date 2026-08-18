"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type RoomHotspot = "library" | "watch" | "play" | "read";
type Props = { active: RoomHotspot | null; onHotspot: (hotspot: RoomHotspot) => void; onReady: () => void };
type HotspotRig = { aura: THREE.LineSegments; id: RoomHotspot; object: THREE.Object3D };

const palette = {
  amber: 0xd88838, cream: 0xeee0bf, green: 0x263f35, ink: 0x100e0d,
  oxblood: 0x6f201d, rain: 0x49657c, walnut: 0x4b2517, wood: 0x6c371f,
};

function screenTexture() {
  const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 576;
  const context = canvas.getContext("2d"); if (!context) return null;
  context.fillStyle = "#12110f"; context.fillRect(0, 0, 1024, 576);
  context.fillStyle = "#efe2c6"; context.fillRect(0, 0, 220, 576);
  context.fillStyle = "#171412"; context.font = "700 30px monospace"; context.fillText("MEDIA / 01", 40, 70);
  ["FILMS", "TELEVISION", "ANIME", "WATCHLIST"].forEach((label, index) => context.fillText(label, 40, 165 + index * 68));
  context.fillStyle = "#efe2c6"; context.font = "900 54px Georgia"; context.fillText("THE SCREENING ROOM", 275, 88);
  const colors = ["#b23d2e", "#d09a32", "#355e78", "#496b55"];
  colors.forEach((color, index) => { context.fillStyle = color; context.fillRect(275 + index * 175, 150, 140, 250); context.strokeStyle = "#efe2c6"; context.lineWidth = 5; context.strokeRect(275 + index * 175, 150, 140, 250); });
  context.fillStyle = "#efe2c6"; context.font = "700 24px monospace"; context.fillText("SELECT THE SCREEN TO ENTER", 275, 480);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function bookTexture(title: string, color: string, glyph: string) {
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 768;
  const context = canvas.getContext("2d"); if (!context) return null;
  context.fillStyle = color; context.fillRect(0, 0, 512, 768);
  context.strokeStyle = "#171310"; context.lineWidth = 16; context.strokeRect(18, 18, 476, 732);
  context.fillStyle = "#efe2c6"; context.fillRect(45, 475, 422, 150);
  context.beginPath(); context.arc(256, 280, 125, 0, Math.PI * 2); context.fillStyle = "#171310"; context.fill();
  context.fillStyle = "#efe2c6"; context.textAlign = "center"; context.font = "900 108px Georgia"; context.fillText(glyph, 256, 318);
  context.fillStyle = "#171310"; context.font = "900 44px Georgia"; context.fillText(title, 256, 545);
  context.font = "700 18px monospace"; context.fillText("AKSHAT KADAM / ARCHIVE", 256, 596);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

export function RecRoomScene({ active, onHotspot, onReady }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x17110e); scene.fog = new THREE.FogExp2(0x17110e, .018);
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 80); camera.position.set(0, 3.8, 13.8);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); }
    catch { queueMicrotask(() => { setWebglUnavailable(true); onReady(); }); return; }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.55));
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = innerWidth > 700; renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = "rec-room-canvas"; mount.appendChild(renderer.domElement);

    const geometries: THREE.BufferGeometry[] = []; const materials: THREE.Material[] = []; const textures: THREE.Texture[] = [];
    const world = new THREE.Group(); scene.add(world);
    const mat = (color: number, roughness = .75, emissive = 0) => { const value = new THREE.MeshStandardMaterial({ color, roughness, emissive, emissiveIntensity: emissive ? .18 : 0 }); materials.push(value); return value; };
    const walnut = mat(palette.walnut, .62); const darkWood = mat(0x24140f, .72); const cream = mat(palette.cream, .8); const ink = mat(palette.ink, .55); const green = mat(palette.green, .95); const metal = mat(0x272829, .35);
    const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent = world) => { const geometry = new THREE.BoxGeometry(w, h, d); geometries.push(geometry); const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; };
    const cylinder = (radius: number, height: number, material: THREE.Material, x: number, y: number, z: number, parent = world) => { const geometry = new THREE.CylinderGeometry(radius, radius * .9, height, 20); geometries.push(geometry); const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh; };

    // Architectural shell and soft furnishings.
    box(15, .25, 10, darkWood, 0, -.12, 2.2); box(15, 8.5, .22, mat(0x322118, .92), 0, 4.1, -1.9);
    const rug = box(8.5, .035, 4.8, mat(0x632821, .94), 1.1, .035, 2.8); rug.rotation.y = -.035;
    for (let stripe = 0; stripe < 8; stripe += 1) box(7.9 - stripe * .18, .012, 4.2 - stripe * .18, mat(stripe % 2 ? 0xb38148 : 0x17100d, .95), 1.1, .06 + stripe * .001, 2.8);
    const couch = new THREE.Group(); couch.position.set(-3.2, .55, 4.45); couch.rotation.y = .08; world.add(couch);
    box(5.5, .75, 1.15, green, 0, .25, 0, couch); box(5.4, 1.15, .55, green, 0, 1.05, .35, couch);
    [-2.05, -.7, .7, 2.05].forEach((x, index) => { const cushion = box(1.18, 1.02, .36, mat(index === 1 ? 0x7a2f29 : palette.green, .98), x, 1.05, -.05, couch); cushion.rotation.z = index % 2 ? -.04 : .04; });
    [-2.35, 2.35].forEach((x) => box(.75, .95, 1.35, green, x, .75, 0, couch));

    // Built-in library with dense background books and smaller category volumes.
    const shelf = new THREE.Group(); shelf.position.set(-4.7, 3.05, -1.35); world.add(shelf);
    box(4.55, 5.9, .5, darkWood, 0, 0, 0, shelf); box(4.7, .22, .82, walnut, 0, 2.95, .2, shelf); box(4.7, .3, .9, walnut, 0, -2.95, .2, shelf);
    [-2.23, 2.23].forEach((x) => box(.22, 6, .86, walnut, x, 0, .2, shelf));
    [-1.75, -.55, .65, 1.85].forEach((y) => box(4.45, .16, .82, walnut, 0, y, .2, shelf));
    const fillerColors = [0x35596b, 0x9a3b2e, 0xc68b2c, 0x526c46, 0x81515f, 0xddd0ad, 0x70452d];
    for (let row = 0; row < 5; row += 1) for (let slot = 0; slot < 14; slot += 1) {
      const width = .19 + ((slot + row) % 3) * .04; const height = .72 + ((slot * 3 + row) % 4) * .08;
      box(width, height, .42, mat(fillerColors[(slot + row * 2) % fillerColors.length], .82), -1.95 + slot * .29, -2.25 + row * 1.2 + (height - .72) / 2, .52, shelf);
    }
    const categoryTextures = [bookTexture("WRITING", "#9c382d", "書"), bookTexture("IDEAS", "#c88d2d", "考"), bookTexture("RECS", "#315a73", "薦"), bookTexture("NOTES", "#526b47", "録")];
    categoryTextures.forEach((texture) => { if (texture) textures.push(texture); });
    const categoryGroup = new THREE.Group(); categoryGroup.position.set(0, .75, .88); shelf.add(categoryGroup);
    categoryTextures.forEach((texture, index) => { const material = new THREE.MeshStandardMaterial({ map: texture ?? undefined, roughness: .62 }); materials.push(material); box(.72, 1.02, .12, material, -1.25 + index * .84, 0, 0, categoryGroup); });

    // Rain window and city backdrop.
    const cityMaterial = new THREE.MeshBasicMaterial({ color: palette.rain }); materials.push(cityMaterial);
    const city = box(3.35, 4.65, .06, cityMaterial, -.05, 4.3, -1.72); city.castShadow = false;
    const loader = new THREE.TextureLoader();
    loader.load("/mumbai-monsoon-window.webp", (texture) => { texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture); cityMaterial.map = texture; cityMaterial.needsUpdate = true; onReady(); }, undefined, () => onReady());
    box(.16, 4.9, .18, darkWood, -1.82, 4.3, -1.55); box(.16, 4.9, .18, darkWood, 1.72, 4.3, -1.55); box(3.7, .16, .18, darkWood, -.05, 6.72, -1.55); box(3.7, .16, .18, darkWood, -.05, 1.88, -1.55); box(.11, 4.72, .16, darkWood, -.05, 4.3, -1.5);
    const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8ca9bb, transparent: true, opacity: .13, roughness: .18, transmission: .25 }); materials.push(glassMaterial); box(3.5, 4.72, .045, glassMaterial, -.05, 4.3, -1.35);
    for (let drop = 0; drop < 34; drop += 1) { const material = new THREE.MeshBasicMaterial({ color: 0xc7d9df, transparent: true, opacity: .28 }); materials.push(material); box(.012, .12 + (drop % 5) * .06, .01, material, -1.65 + (drop % 17) * .2, 2.1 + ((drop * 37) % 420) / 100, -1.28); }

    // Television, console and media credenza.
    const media = new THREE.Group(); media.position.set(4.35, 2.7, -1.05); world.add(media);
    box(4.4, 1.05, .72, walnut, 0, -1.45, .15, media); [-1.7, 0, 1.7].forEach((x) => box(.12, .9, .62, darkWood, x, -1.45, .16, media));
    const tvTexture = screenTexture(); if (tvTexture) textures.push(tvTexture);
    const tvMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tvTexture ?? undefined, emissive: 0x4e2b16, emissiveIntensity: .7, roughness: .22 }); materials.push(tvMaterial);
    box(4.2, 2.65, .2, ink, 0, .25, 0, media); const tvScreen = box(3.94, 2.4, .04, tvMaterial, 0, .25, .13, media);
    const consoleBody = box(1.65, .28, .62, cream, .75, -1.35, .62, media); box(1.25, .04, .66, metal, .75, -1.19, .62, media); box(.1, .1, .03, mat(0x55a65d, .4, 0x55a65d), 1.42, -1.35, .95, media);

    // Coffee table, open commonplace book and coffee.
    const table = new THREE.Group(); table.position.set(1.15, .58, 3.05); table.rotation.y = -.035; world.add(table);
    const top = box(5.15, .3, 2.35, walnut, 0, .35, 0, table); top.receiveShadow = true; [-2.1, 2.1].forEach((x) => [-.8, .8].forEach((z) => box(.26, .75, .26, darkWood, x, -.1, z, table)));
    const book = new THREE.Group(); book.position.set(-.55, .58, 0); book.rotation.x = -.06; table.add(book);
    const leftPage = box(1.55, .08, 1.65, cream, -.78, 0, 0, book); leftPage.rotation.z = -.06; const rightPage = box(1.55, .08, 1.65, cream, .78, 0, 0, book); rightPage.rotation.z = .06;
    for (let line = 0; line < 7; line += 1) { box(1.05, .008, .018, ink, -.78, .055, -.48 + line * .16, book); box(1.05, .008, .018, ink, .78, .055, -.48 + line * .16, book); }
    const mugMaterial = mat(0x88725d, .5); cylinder(.28, .55, mugMaterial, 1.65, .82, .25, table); const coffeeMaterial = mat(0x1a0c07, .25); cylinder(.24, .012, coffeeMaterial, 1.65, 1.1, .25, table);
    const handleGeometry = new THREE.TorusGeometry(.24, .055, 10, 20); geometries.push(handleGeometry); const handle = new THREE.Mesh(handleGeometry, mugMaterial); handle.position.set(1.95, .83, .25); handle.rotation.y = Math.PI / 2; table.add(handle);
    const steamMaterial = new THREE.MeshBasicMaterial({ color: 0xe8ddcd, transparent: true, opacity: .22, depthWrite: false }); materials.push(steamMaterial);
    const steam: THREE.Mesh[] = []; for (let index = 0; index < 3; index += 1) { const geometry = new THREE.TorusGeometry(.1 + index * .035, .012, 8, 20, Math.PI * 1.2); geometries.push(geometry); const swirl = new THREE.Mesh(geometry, steamMaterial); swirl.position.set(1.65, 1.25 + index * .18, .25); swirl.rotation.x = Math.PI / 2; table.add(swirl); steam.push(swirl); }

    // Lived-in detail: plants, lamp and framed ink studies.
    const leaf = mat(0x294b35, .92); const pot = mat(0x805036, .85);
    [[-2.15, 2.15, -1.1], [1.35, 2.05, -1.2], [6.2, 1.85, -1.15]].forEach(([x, y, z]) => { cylinder(.25, .5, pot, x, y, z); for (let leafIndex = 0; leafIndex < 7; leafIndex += 1) { const geometry = new THREE.SphereGeometry(.22, 10, 8); geometries.push(geometry); const mesh = new THREE.Mesh(geometry, leaf); mesh.scale.set(.65, 1.5, .5); mesh.position.set(x + Math.sin(leafIndex) * .3, y + .45 + (leafIndex % 3) * .18, z + Math.cos(leafIndex) * .18); world.add(mesh); } });
    [2.55, 4.65].forEach((x, index) => { box(1.25, 1.55, .08, darkWood, x, 5.65, -1.55); box(1.05, 1.35, .04, index ? cream : mat(0x7b342b, .82), x, 5.65, -1.47); });
    box(.65, 2.1, .65, darkWood, 6.45, 1.05, -.6); const shade = cylinder(.55, .75, cream, 6.45, 2.35, -.6); shade.scale.set(1, .75, 1);

    // Restrained aura objects used for raycasting and interaction feedback.
    const hotspots: HotspotRig[] = [];
    const addAura = (id: RoomHotspot, object: THREE.Object3D, width: number, height: number, x: number, y: number, z: number, parent = world) => { const material = new THREE.LineBasicMaterial({ color: 0xff5a3d, transparent: true, opacity: .55, depthTest: false }); materials.push(material); const sourceGeometry = new THREE.BoxGeometry(width, height, .06); geometries.push(sourceGeometry); const edges = new THREE.EdgesGeometry(sourceGeometry); geometries.push(edges); const aura = new THREE.LineSegments(edges, material); aura.position.set(x, y, z); aura.renderOrder = 8; parent.add(aura); hotspots.push({ aura, id, object }); };
    addAura("library", categoryGroup, 3.55, 1.4, 0, .75, 1.0, shelf); addAura("watch", tvScreen, 4.35, 2.8, 0, .25, .2, media); addAura("play", consoleBody, 1.9, .52, .75, -1.35, .86, media); addAura("read", book, 3.45, .34, -.55, .62, .05, table);

    scene.add(new THREE.HemisphereLight(0xa9bfd0, 0x3a1d12, 3.6));
    const lampLight = new THREE.PointLight(0xffae62, 92, 14, 1.5); lampLight.position.set(5.8, 4.5, 2.2); lampLight.castShadow = innerWidth > 900; scene.add(lampLight);
    const windowLight = new THREE.RectAreaLight(0x779dc2, 18, 3.5, 5); windowLight.position.set(0, 4.2, -.4); windowLight.lookAt(0, 3, 4); scene.add(windowLight);
    const tvGlow = new THREE.PointLight(0xe8613e, 13, 8); tvGlow.position.set(4.2, 3, 1); scene.add(tvGlow);

    const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2(); let hovered: HotspotRig | undefined;
    const updatePointer = (event: PointerEvent) => { const rect = renderer.domElement.getBoundingClientRect(); pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1); raycaster.setFromCamera(pointer, camera); hovered = hotspots.find((rig) => raycaster.intersectObject(rig.object, true).length > 0 || raycaster.intersectObject(rig.aura, false).length > 0); renderer.domElement.style.cursor = hovered ? "pointer" : "default"; };
    const click = (event: PointerEvent) => { updatePointer(event); if (hovered) onHotspot(hovered.id); };
    renderer.domElement.addEventListener("pointermove", updatePointer); renderer.domElement.addEventListener("pointerdown", click);
    const resize = () => { const rect = mount.getBoundingClientRect(); const mobile = rect.width < 700; camera.fov = mobile ? 46 : 35; camera.aspect = rect.width / Math.max(rect.height, 1); camera.updateProjectionMatrix(); renderer.setSize(rect.width, rect.height, false); };
    resize(); addEventListener("resize", resize);

    let frame = 0; let disposed = false; const startedAt = performance.now();
    const render = () => { const elapsed = (performance.now() - startedAt) / 1000; const mobile = mount.clientWidth < 700; const target = new THREE.Vector3(0, mobile ? 3.15 : 3.25, .3); const basePosition = mobile ? new THREE.Vector3(0, 4.2, 16.2) : new THREE.Vector3(0, 3.8, 13.8); const focusPositions: Record<RoomHotspot, THREE.Vector3> = { library: new THREE.Vector3(-3.6, 3.8, 8.4), watch: new THREE.Vector3(3.5, 3.5, 8.2), play: new THREE.Vector3(3.8, 2.1, 7.8), read: new THREE.Vector3(.7, 2.15, 8.4) }; const cameraTarget = activeRef.current ? focusPositions[activeRef.current] : basePosition; camera.position.lerp(cameraTarget, reducedMotion ? 1 : .045); if (!activeRef.current && !reducedMotion) camera.position.x += Math.sin(elapsed * .22) * .012; camera.lookAt(target); hotspots.forEach((rig, index) => { const selected = activeRef.current === rig.id; const material = rig.aura.material as THREE.LineBasicMaterial; material.opacity = selected || hovered === rig ? .95 : .46 + Math.sin(elapsed * 2.3 + index) * .08; rig.aura.scale.setScalar(selected || hovered === rig ? 1.035 : 1); }); steam.forEach((swirl, index) => { swirl.position.y = 1.25 + index * .18 + Math.sin(elapsed * .8 + index) * .05; swirl.rotation.z = elapsed * .12 + index; }); renderer.render(scene, camera); if (!disposed) frame = requestAnimationFrame(render); };
    frame = requestAnimationFrame(render);
    return () => { disposed = true; cancelAnimationFrame(frame); removeEventListener("resize", resize); renderer.domElement.removeEventListener("pointermove", updatePointer); renderer.domElement.removeEventListener("pointerdown", click); geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose()); textures.forEach((texture) => texture.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, [onHotspot, onReady]);

  if (webglUnavailable) return <div className="rec-room-fallback" role="img" aria-label="Illustrated recreation room fallback"><span>THE REC ROOM</span></div>;
  return <div className="rec-room-scene" ref={mountRef} />;
}
