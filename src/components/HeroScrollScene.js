import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './HeroScrollScene.css';

const SUPPORTIVE_MESSAGES = [
  "It's okay to not be okay.",
  "You don't have to carry it all alone.",
  "Your feelings are valid, always.",
  "It takes courage to ask for help.",
  "You matter more than you know.",
  "Healing isn't linear, and that's okay.",
  "Someone out there cares about you.",
  "It's okay to take things one day at a time.",
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);
const stageProgress = (p, start, end) => smoothstep(clamp((p - start) / (end - start), 0, 1));

const MATS = {
  hullPlank: new THREE.MeshStandardMaterial({ color: 0x6b3d1f, roughness: 0.92, metalness: 0.05, transparent: false }),
  hullDark: new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.9, metalness: 0.08, transparent: false }),
  hullMid: new THREE.MeshStandardMaterial({ color: 0x5a3118, roughness: 0.9, metalness: 0.06, transparent: false }),
  hullHi: new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.9, metalness: 0.04, transparent: false }),
  trim: new THREE.MeshStandardMaterial({ color: 0x2a1608, roughness: 0.85, metalness: 0.12, transparent: false }),
  deck: new THREE.MeshStandardMaterial({ color: 0xa67c50, roughness: 0.82, metalness: 0.05, transparent: false }),
  mast: new THREE.MeshStandardMaterial({ color: 0x3d2214, roughness: 0.92, metalness: 0.08, transparent: false }),
  sail: new THREE.MeshStandardMaterial({ color: 0xf2e2bc, roughness: 1, metalness: 0, side: THREE.DoubleSide, transparent: false }),
  sailShade: new THREE.MeshStandardMaterial({ color: 0xd9c391, roughness: 1, metalness: 0, side: THREE.DoubleSide, transparent: false }),
  rope: new THREE.MeshStandardMaterial({ color: 0x1e1209, roughness: 0.95, transparent: false }),
  flag: new THREE.MeshStandardMaterial({ color: 0xff5569, side: THREE.DoubleSide, roughness: 0.85, transparent: false }),
  glow: new THREE.MeshStandardMaterial({ color: 0xffd688, emissive: 0xffaa5a, emissiveIntensity: 0.85, roughness: 0.45, transparent: false }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd4a44c, roughness: 0.55, metalness: 0.6, transparent: false }),
};

const sculptBulgingSail = (geo, bulge, droop = 0.08) => {
  const pos = geo.attributes.position;
  const w = geo.parameters.width;
  const h = geo.parameters.height;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (w / 2);
    const ny = y / (h / 2);
    const horizontal = (1 - nx * nx);
    const vertical = (1 - ny * ny * 0.6);
    pos.setZ(i, horizontal * vertical * bulge);
    pos.setY(i, y - Math.abs(nx) * droop);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
};

const buildMast = (x, height, sailWidth, baseY) => {
  const g = new THREE.Group();

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.095, height, 14), MATS.mast);
  mast.position.y = height / 2;
  g.add(mast);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), MATS.trim);
  knob.position.y = height + 0.05;
  g.add(knob);

  // Yards (horizontal spars)
  const yardLow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, sailWidth + 0.3, 10),
    MATS.mast
  );
  yardLow.rotation.z = Math.PI / 2;
  yardLow.position.y = height * 0.3;
  g.add(yardLow);

  const yardMid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, sailWidth * 0.78 + 0.2, 10),
    MATS.mast
  );
  yardMid.rotation.z = Math.PI / 2;
  yardMid.position.y = height * 0.58;
  g.add(yardMid);

  const yardHi = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, sailWidth * 0.55 + 0.15, 10),
    MATS.mast
  );
  yardHi.rotation.z = Math.PI / 2;
  yardHi.position.y = height * 0.82;
  g.add(yardHi);

  // Sails — curved square sails, billowed
  const mainSailGeo = sculptBulgingSail(
    new THREE.PlaneGeometry(sailWidth, height * 0.28, 18, 10),
    sailWidth * 0.23,
    0.12
  );
  const mainSail = new THREE.Mesh(mainSailGeo, MATS.sail);
  mainSail.position.y = height * 0.16;
  g.add(mainSail);

  const topSailGeo = sculptBulgingSail(
    new THREE.PlaneGeometry(sailWidth * 0.78, height * 0.22, 14, 8),
    sailWidth * 0.2,
    0.1
  );
  const topSail = new THREE.Mesh(topSailGeo, MATS.sail);
  topSail.position.y = height * 0.45;
  g.add(topSail);

  const royalGeo = sculptBulgingSail(
    new THREE.PlaneGeometry(sailWidth * 0.55, height * 0.17, 12, 6),
    sailWidth * 0.16,
    0.08
  );
  const royal = new THREE.Mesh(royalGeo, MATS.sail);
  royal.position.y = height * 0.7;
  g.add(royal);

  g.position.set(x, baseY, 0);

  // Attach refs for animation
  g.userData.sails = [mainSail, topSail, royal];
  return g;
};

const addRope = (ship, from, to) => {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const rope = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, length, 6),
    MATS.rope
  );
  rope.position.copy(from).add(to).multiplyScalar(0.5);
  rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  ship.add(rope);
  return rope;
};

const buildShip = () => {
  const ship = new THREE.Group();

  // ---- HULL (main lower hull) ----
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-2.55, 0.25);
  hullShape.lineTo(-2.3, -0.1);
  hullShape.bezierCurveTo(-1.7, -0.95, 1.7, -0.95, 2.3, -0.25);
  hullShape.lineTo(2.65, 0.25);
  hullShape.lineTo(-2.55, 0.25);

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 1.55,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.09,
    bevelThickness: 0.11,
    curveSegments: 24,
    steps: 1,
  });
  hullGeo.translate(0, 0, -0.775);
  const hull = new THREE.Mesh(hullGeo, MATS.hullMid);
  ship.add(hull);

  // Planking strips (horizontal trim lines)
  for (let i = 0; i < 5; i++) {
    const y = 0.15 - i * 0.2;
    const width = 5.05 - i * 0.2 - Math.abs(i - 2) * 0.05;
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.028, 1.63),
      MATS.trim
    );
    plank.position.set(0, y, 0);
    ship.add(plank);
  }

  // Gunwale (top rail of hull)
  const rail = new THREE.Mesh(new THREE.BoxGeometry(5.25, 0.1, 1.62), MATS.trim);
  rail.position.set(0, 0.35, 0);
  ship.add(rail);

  // Main deck (visible upper surface)
  const deck = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.05, 1.4), MATS.deck);
  deck.position.set(0, 0.32, 0);
  ship.add(deck);

  // Deck planking lines (faint)
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const line = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.002, 0.01), MATS.trim);
    line.position.set(0, 0.345, i * 0.25);
    ship.add(line);
  }

  // ---- POOP DECK (raised stern) ----
  const poopHull = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.45, 1.5), MATS.hullDark);
  poopHull.position.set(1.9, 0.57, 0);
  ship.add(poopHull);

  const poopRail = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.54), MATS.trim);
  poopRail.position.set(1.9, 0.83, 0);
  ship.add(poopRail);

  // Stern cabin
  const sternCabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.3), MATS.hullMid);
  sternCabin.position.set(1.9, 1.15, 0);
  ship.add(sternCabin);

  const cabinTrim = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 1.34), MATS.trim);
  cabinTrim.position.set(1.9, 1.48, 0);
  ship.add(cabinTrim);

  const cabinRoof = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.4), MATS.hullDark);
  cabinRoof.position.set(1.9, 1.51, 0);
  ship.add(cabinRoof);

  // Stern windows (glow)
  for (let i = -1; i <= 1; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.05), MATS.glow);
    win.position.set(1.9 + i * 0.28, 1.15, 0.67);
    ship.add(win);
  }

  // Stern ornament
  const ornament = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), MATS.gold);
  ornament.position.set(2.55, 0.85, 0);
  ship.add(ornament);

  // ---- FORECASTLE (raised bow) ----
  const forecastle = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 1.45), MATS.hullDark);
  forecastle.position.set(-2.1, 0.5, 0);
  ship.add(forecastle);

  const bowRail = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 1.48), MATS.trim);
  bowRail.position.set(-2.1, 0.67, 0);
  ship.add(bowRail);

  // Bow cap / stempost ornament
  const bowCap = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.22), MATS.gold);
  bowCap.position.set(-2.6, 0.38, 0);
  ship.add(bowCap);

  // Cannon ports — small dark squares down each side
  for (let s = -1; s <= 1; s += 2) {
    for (let i = -1; i <= 1; i++) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), MATS.trim);
      port.position.set(i * 0.9, -0.05, s * 0.79);
      port.rotation.y = s < 0 ? Math.PI : 0;
      ship.add(port);
    }
  }

  // Captain's wheel on poop deck
  const wheelRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.022, 8, 20),
    MATS.gold
  );
  wheelRing.position.set(1.55, 1.0, 0);
  wheelRing.rotation.y = Math.PI / 2;
  ship.add(wheelRing);
  const wheelHub = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), MATS.trim);
  wheelHub.position.set(1.55, 1.0, 0);
  ship.add(wheelHub);
  for (let k = 0; k < 6; k++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.32, 0.02), MATS.trim);
    spoke.rotation.x = (k * Math.PI) / 6;
    spoke.position.set(1.55, 1.0, 0);
    ship.add(spoke);
  }

  // ---- MASTS ----
  const foreMast = buildMast(-1.35, 3.0, 1.7, 0.35);
  ship.add(foreMast);

  const mainMast = buildMast(0.25, 3.75, 1.95, 0.35);
  ship.add(mainMast);

  const mizzenMast = buildMast(1.9, 2.55, 1.2, 0.8);
  ship.add(mizzenMast);

  // Crow's nest on main mast
  const crowsNest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.22, 12, 1, false),
    MATS.trim
  );
  crowsNest.position.set(0.25, 2.55, 0);
  ship.add(crowsNest);
  const crowsFloor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.04, 12),
    MATS.hullDark
  );
  crowsFloor.position.set(0.25, 2.44, 0);
  ship.add(crowsFloor);

  // ---- RIGGING / ROPES ----
  const foreTop = new THREE.Vector3(-1.35, 3.4, 0);
  const mainTop = new THREE.Vector3(0.25, 4.15, 0);
  const mizzenTop = new THREE.Vector3(1.9, 3.4, 0);

  // Headstay running down to the bow tip (replaces the bowsprit)
  addRope(ship, new THREE.Vector3(-2.35, 0.55, 0), foreTop);
  addRope(ship, foreTop, mainTop);
  addRope(ship, mainTop, mizzenTop);
  addRope(ship, mizzenTop, new THREE.Vector3(2.55, 0.85, 0));
  // Shrouds (angled sides)
  addRope(ship, new THREE.Vector3(-1.35, 0.35, 0.7), foreTop);
  addRope(ship, new THREE.Vector3(-1.35, 0.35, -0.7), foreTop);
  addRope(ship, new THREE.Vector3(0.25, 0.35, 0.7), mainTop);
  addRope(ship, new THREE.Vector3(0.25, 0.35, -0.7), mainTop);
  addRope(ship, new THREE.Vector3(1.9, 0.82, 0.7), mizzenTop);
  addRope(ship, new THREE.Vector3(1.9, 0.82, -0.7), mizzenTop);

  // ---- FLAG at top of main mast ----
  const flagGeo = new THREE.PlaneGeometry(0.55, 0.3, 12, 4);
  const flag = new THREE.Mesh(flagGeo, MATS.flag);
  flag.position.set(0.55, 4.3, 0);
  ship.add(flag);
  ship.userData.flag = flag;

  // Anchor
  const anchor = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 10), MATS.trim);
  anchor.position.set(-2.05, -0.1, 0.7);
  anchor.rotation.x = Math.PI / 2;
  ship.add(anchor);
  const anchorArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.04), MATS.trim);
  anchorArm.position.set(-2.05, -0.25, 0.7);
  ship.add(anchorArm);

  ship.userData.sailGroups = [foreMast, mainMast, mizzenMast];
  return ship;
};

const HeroScrollScene = ({ user }) => {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const sideLeftRef = useRef(null);
  const sideRightRef = useRef(null);
  const botRevealRef = useRef(null);
  const scrollHintRef = useRef(null);

  const progressRef = useRef(0);
  const typingProgressRef = useRef(0);

  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [message] = useState(() =>
    SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)]
  );

  useEffect(() => {
    let interval;
    const timer = setTimeout(() => {
      setHasStarted(true);
      let idx = 0;
      interval = setInterval(() => {
        if (idx < message.length) {
          idx += 1;
          typingProgressRef.current = idx / message.length;
          setDisplayedText(message.slice(0, idx));
        } else {
          clearInterval(interval);
          typingProgressRef.current = 1;
          setTimeout(() => setIsFinished(true), 600);
        }
      }, 85);
    }, 1500);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [message]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 1.0, 12);
    camera.lookAt(0, 0.4, 0);

    const ambient = new THREE.AmbientLight(0xffe2b5, 0.75);
    scene.add(ambient);
    const sunLight = new THREE.DirectionalLight(0xffd09a, 1.45);
    sunLight.position.set(6, 9, 5);
    scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0xff7a4a, 0.6);
    rimLight.position.set(-7, 3, -4);
    scene.add(rimLight);
    const fillLight = new THREE.HemisphereLight(0xffe4b5, 0x4a8fb8, 0.5);
    scene.add(fillLight);

    const ship = buildShip();
    ship.scale.setScalar(0.82);
    scene.add(ship);

    // Capture original flag vertex positions for wave animation
    const flag = ship.userData.flag;
    const flagPos = flag.geometry.attributes.position;
    const flagBaseX = new Float32Array(flagPos.count);
    const flagBaseY = new Float32Array(flagPos.count);
    for (let i = 0; i < flagPos.count; i++) {
      flagBaseX[i] = flagPos.getX(i);
      flagBaseY[i] = flagPos.getY(i);
    }

    const sizeCanvas = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    sizeCanvas();

    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', sizeCanvas);

    const updateProgress = () => {
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      if (total <= 0) {
        progressRef.current = 0;
        return;
      }
      progressRef.current = clamp(-rect.top / total, 0, 1);
    };
    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    let smoothed = progressRef.current;
    const clock = new THREE.Clock();
    let rafId;

    const shipMaterials = [];
    ship.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        if (Array.isArray(obj.material)) shipMaterials.push(...obj.material);
        else shipMaterials.push(obj.material);
      }
    });
    const uniqueMats = Array.from(new Set(shipMaterials));

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      smoothed = lerp(smoothed, progressRef.current, 1 - Math.pow(0.001, dt));

      const isNarrow = canvas.clientWidth < 900;

      // Stage timings
      const slideIn = stageProgress(smoothed, 0.0, 0.44);
      const sailOff = stageProgress(smoothed, 0.62, 0.98);

      const startX = isNarrow ? 2.8 : 4.2;
      const offscreenX = isNarrow ? -18 : -24;
      const shipXCentered = lerp(startX, 0.1, slideIn);
      const shipX = lerp(shipXCentered, offscreenX, sailOff);

      // Camera stays fixed — no zoom-out. Ship stays the same size throughout.
      const camZ = 12;
      const camY = 1.0;
      const lookY = 0.4;
      camera.position.set(0, camY, camZ);
      camera.lookAt(0, lookY, 0);

      // Ship Y tracks camera so the hull stays at the waterline (MorningTide
      // waves occupy ~14% of viewport bottom). Derived from perspective math:
      //   targetScreenNDC_y = -0.72 → ship hull bottom sits on the wave line.
      const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(38 / 2));
      const TARGET_NDC_Y = -0.88; // hull bottom projects near the bottom of the viewport
      const HULL_BOTTOM_OFFSET = -0.78; // ship.position.y + this = hull bottom world y
      const hullBottomWorldY = lookY + TARGET_NDC_Y * camZ * HALF_FOV_TAN;
      const shipBaseY = hullBottomWorldY - HULL_BOTTOM_OFFSET;

      // Sailing motion — synced with MorningTide wave layer periods (20s, 13s, 10s, 7s).
      const w20 = (2 * Math.PI) / 20;
      const w13 = (2 * Math.PI) / 13;
      const w10 = (2 * Math.PI) / 10;
      const w7 = (2 * Math.PI) / 7;

      const bob =
        Math.sin(t * w20) * 0.15 +
        Math.sin(t * w13 + 1.2) * 0.08 +
        Math.sin(t * w10 + 2.3) * 0.055 +
        Math.sin(t * w7 + 0.5) * 0.04;
      // Pitch is roughly the wave slope — same frequencies, 90° phase shift.
      const pitch =
        Math.cos(t * w20) * 0.06 +
        Math.cos(t * w13 + 1.2) * 0.03 +
        Math.cos(t * w10 + 2.3) * 0.02;
      const roll =
        Math.sin(t * w20 + 1.5) * 0.055 +
        Math.sin(t * w13 + 0.8) * 0.025 +
        Math.sin(t * w7 + 2.1) * 0.015;
      const yaw = Math.sin(t * w20 + 0.4) * 0.04;
      const surge = Math.sin(t * w20 + 0.9) * 0.07;

      ship.position.x = shipX + surge;
      ship.position.y = shipBaseY + bob;
      ship.position.z = 0;
      ship.rotation.x = pitch;
      ship.rotation.z = roll;
      ship.rotation.y = yaw;

      // Ship fades in as the hero typing nears completion (from ~70% typed → done).
      // Fade applied to the whole canvas so the ship reads as a single solid object
      // instead of revealing its inner rigging through semi-transparent outer meshes.
      const introFade = smoothstep(clamp((typingProgressRef.current - 0.7) / 0.3, 0, 1));
      canvas.style.opacity = introFade;
      ship.scale.setScalar(0.82);

      // Flag waving
      for (let i = 0; i < flagPos.count; i++) {
        const bx = flagBaseX[i];
        const by = flagBaseY[i];
        const dist = (bx + 0.275) / 0.55;
        const wave = Math.sin(t * 5 - dist * 4) * 0.06 * dist;
        flagPos.setZ(i, wave);
        flagPos.setY(i, by + Math.cos(t * 4 - dist * 3) * 0.015 * dist);
      }
      flagPos.needsUpdate = true;

      // Subtle sail billow pulse
      const billow = 1 + Math.sin(t * 1.4) * 0.015;
      for (const mastGroup of ship.userData.sailGroups) {
        mastGroup.scale.x = billow;
      }

      // ---- DOM overlays ----
      const textFade = 1 - stageProgress(smoothed, 0.02, 0.14);
      if (textRef.current) {
        textRef.current.style.opacity = textFade;
        textRef.current.style.transform = `translateY(${(1 - textFade) * -24}px)`;
        textRef.current.style.pointerEvents = textFade < 0.1 ? 'none' : 'auto';
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = textFade;
        scrollHintRef.current.style.pointerEvents = textFade < 0.1 ? 'none' : 'auto';
      }

      const sideIn = stageProgress(smoothed, 0.46, 0.54);
      const sideOut = stageProgress(smoothed, 0.56, 0.62);
      const sideFade = sideIn * (1 - sideOut);
      if (sideLeftRef.current) {
        sideLeftRef.current.style.opacity = sideFade;
        sideLeftRef.current.style.transform = `translateY(-50%) translateX(${-60 * (1 - sideIn) - 40 * sideOut}px)`;
      }
      if (sideRightRef.current) {
        sideRightRef.current.style.opacity = sideFade;
        sideRightRef.current.style.transform = `translateY(-50%) translateX(${60 * (1 - sideIn) + 40 * sideOut}px)`;
      }

      const botIn = stageProgress(smoothed, 0.86, 0.95);
      if (botRevealRef.current) {
        botRevealRef.current.style.opacity = botIn;
        botRevealRef.current.style.transform = `scale(${lerp(0.78, 1, botIn)})`;
        botRevealRef.current.style.pointerEvents = botIn > 0.6 ? 'auto' : 'none';
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('resize', sizeCanvas);
      resizeObserver.disconnect();
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  const goTalk = (e) => {
    e.stopPropagation();
    navigate(user ? '/chat' : '/login');
  };

  return (
    <div ref={stageRef} className="hero-stage">
      <div className="hero-stage__sticky">
        <canvas ref={canvasRef} className="hero-stage__canvas" />

        <div ref={textRef} className="hero-stage__text">
          <div className="typing-hero__text-wrapper">
            <p className="typing-hero__text">
              {displayedText}
              {hasStarted && !isFinished && <span className="typing-hero__cursor">|</span>}
            </p>
            <div className={`typing-hero__cta ${isFinished ? 'typing-hero__cta--visible' : ''}`}>
              <button className="echo-btn" onClick={goTalk}>
                <div className="echo-btn__outline"></div>
                <div className="echo-btn__state echo-btn__state--default">
                  <div className="echo-btn__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20">
                      <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>
                  <p>
                    {'Talk'.split('').map((ch, i) => (
                      <span key={i} style={{ '--i': i }}>{ch}</span>
                    ))}
                    <span key="space" style={{ '--i': 4 }}>&nbsp;</span>
                    {'to'.split('').map((ch, i) => (
                      <span key={`to-${i}`} style={{ '--i': i + 5 }}>{ch}</span>
                    ))}
                    <span key="space2" style={{ '--i': 7 }}>&nbsp;</span>
                    {'Echo'.split('').map((ch, i) => (
                      <span key={`echo-${i}`} style={{ '--i': i + 8 }}>{ch}</span>
                    ))}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <aside ref={sideLeftRef} className="hero-stage__side hero-stage__side--left">
          <h3>Who we are</h3>
          <p>
            EarMeOut is a student-led nonprofit building a safe, stigma-free space
            for mental health conversations — whenever, wherever you need one.
          </p>
        </aside>

        <aside ref={sideRightRef} className="hero-stage__side hero-stage__side--right">
          <h3>What we do</h3>
          <p>
            We pair compassionate tech with community events and peer support so
            no one has to navigate hard days alone. Every conversation matters.
          </p>
        </aside>

        <div ref={scrollHintRef} className="hero-stage__scroll-hint" aria-hidden="true">
          <span className="hero-stage__scroll-hint-text">Scroll down</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-stage__scroll-hint-arrow">
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
        </div>

        <div ref={botRevealRef} className="hero-stage__bot-reveal">
          <img src="/earmeout-bot.png" alt="EarMeOut Bot" className="hero-stage__bot-img" />
          <p className="hero-stage__bot-caption">Echo is here, whenever you need.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroScrollScene;
