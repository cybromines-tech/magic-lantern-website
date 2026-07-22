/**
 * <ml-scene> — the Magic Lantern WebGL backdrop.
 *
 * variant="hero"    extruded 3D ML monogram, flickering lantern light, embers
 * variant="orbit"   the same monogram on a slow continuous spin (inner heroes)
 * variant="ambient" embers and dust only, no monogram (section backgrounds)
 *
 * three.js is pulled in via dynamic import so it lands in its own chunk and
 * never blocks first paint. The element degrades to nothing if WebGL is
 * unavailable or the visitor prefers reduced motion.
 */
import type * as THREE_NS from 'three';

type Variant = 'hero' | 'orbit' | 'ambient';

const MONOGRAM_URL = '/assets/logo-mark.svg';

let spriteTexture: THREE_NS.CanvasTexture | null = null;

/** Soft radial ember sprite, generated once and shared by every instance. */
function emberSprite(THREE: typeof THREE_NS): THREE_NS.CanvasTexture {
  if (spriteTexture) return spriteTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,180,120,0.9)');
  grd.addColorStop(1, 'rgba(255,90,60,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  spriteTexture = new THREE.CanvasTexture(c);
  return spriteTexture;
}

function glowSprite(THREE: typeof THREE_NS, color: string, size: number): THREE_NS.Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, color);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const material = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  return sprite;
}

function makeEmbers(
  THREE: typeof THREE_NS,
  count: number,
  spread: number,
  color: number
): THREE_NS.Points {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const speed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
    speed[i] = 0.15 + Math.random() * 0.5;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));

  const mat = new THREE.PointsMaterial({
    color,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: emberSprite(THREE),
  });

  const points = new THREE.Points(geo, mat);
  points.userData.spread = spread;
  return points;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

class MLScene extends HTMLElement {
  private variant: Variant = 'hero';
  private booted = false;
  private stopped = false;
  private visible = true;

  private renderer?: THREE_NS.WebGLRenderer;
  private scene?: THREE_NS.Scene;
  private camera?: THREE_NS.PerspectiveCamera;
  private embers?: THREE_NS.Points;
  private keyLight?: THREE_NS.PointLight;
  private glow?: THREE_NS.Sprite;
  private monogram?: THREE_NS.Group;

  private pointer = { x: 0, y: 0 };
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private onPointerMove = (e: PointerEvent) => {
    this.pointer.x = e.clientX / window.innerWidth - 0.5;
    this.pointer.y = e.clientY / window.innerHeight - 0.5;
  };

  connectedCallback() {
    if (this.booted) return;
    this.booted = true;
    this.variant = (this.getAttribute('variant') as Variant) || 'hero';

    if (prefersReducedMotion()) return;

    // Idle-time load: content paints first, the scene fades in behind it.
    const boot = () => void this.boot();
    if ('requestIdleCallback' in window) {
      requestIdleCallback(boot, { timeout: 600 });
    } else {
      setTimeout(boot, 120);
    }
  }

  disconnectedCallback() {
    this.stopped = true;
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }

  private async boot() {
    if (this.stopped) return;

    let THREE: typeof THREE_NS;
    let SVGLoader: typeof import('three/addons/loaders/SVGLoader.js').SVGLoader;
    try {
      [THREE, { SVGLoader }] = await Promise.all([
        import('three'),
        import('three/addons/loaders/SVGLoader.js'),
      ]);
    } catch {
      return; // No three.js, no scene — the CSS gradient behind it still reads.
    }
    if (this.stopped) return;

    const width = this.clientWidth || 1;
    const height = this.clientHeight || 1;
    const isAmbient = this.variant === 'ambient';

    let renderer: THREE_NS.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isAmbient,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // WebGL unavailable.
    }

    // Deliberately below devicePixelRatio. At DPR 2 the source's 1.6 cap put a
    // full-viewport MSAA canvas at ~3.3 megapixels every frame, which starves
    // the compositor and makes scrolling stutter. The scene is a soft,
    // out-of-focus backdrop, so the lost sharpness is invisible.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isAmbient ? 1 : 1.25));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.opacity = '0';
    renderer.domElement.style.transition = 'opacity .8s ease';
    this.appendChild(renderer.domElement);
    requestAnimationFrame(() => {
      renderer.domElement.style.opacity = '1';
    });
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, isAmbient ? 16 : 13);

    // Lighting: warm lantern key, crimson rim, cool fill to keep edges readable.
    scene.add(new THREE.AmbientLight(0x3a2622, 0.7));
    const key = new THREE.PointLight(0xff5a35, 2.4, 60, 2);
    key.position.set(2.5, 3.5, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb22319, 1.1);
    rim.position.set(-6, 2, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.35);
    fill.position.set(4, -3, 6);
    scene.add(fill);
    this.keyLight = key;

    if (!isAmbient) {
      const glow = glowSprite(THREE, 'rgba(255,90,50,0.55)', 22);
      glow.position.set(1.5, 1.5, -3);
      scene.add(glow);
      this.glow = glow;
    }

    this.embers = makeEmbers(THREE, isAmbient ? 120 : 190, isAmbient ? 34 : 26, 0xff7a45);
    scene.add(this.embers);

    this.scene = scene;
    this.camera = camera;

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);

    // Idle the render loop whenever the scene scrolls off screen.
    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        this.visible = entries[0]!.isIntersecting;
      },
      { threshold: 0.01 }
    );
    this.visibilityObserver.observe(this);

    if (isAmbient) {
      this.start();
    } else {
      this.loadMonogram(THREE, SVGLoader);
    }
  }

  /** Extrudes the flame monogram SVG into a bevelled 3D solid. */
  private loadMonogram(
    THREE: typeof THREE_NS,
    SVGLoader: typeof import('three/addons/loaders/SVGLoader.js').SVGLoader
  ) {
    new SVGLoader().load(
      MONOGRAM_URL,
      (data) => {
        if (this.stopped || !this.scene) return;

        const material = new THREE.MeshStandardMaterial({
          color: 0x9a1f17,
          metalness: 0.45,
          roughness: 0.32,
          emissive: 0x2a0705,
          emissiveIntensity: 0.6,
          side: THREE.DoubleSide,
        });

        const group = new THREE.Group();
        for (const path of data.paths) {
          for (const shape of SVGLoader.createShapes(path)) {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 26,
              bevelEnabled: true,
              bevelThickness: 4,
              bevelSize: 3,
              bevelSegments: 3,
              curveSegments: 14,
            });
            group.add(new THREE.Mesh(geometry, material));
          }
        }

        // SVG space is y-down and arbitrarily offset: centre it, then flip y.
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        for (const child of group.children) {
          (child as THREE_NS.Mesh).geometry.translate(-center.x, -center.y, -center.z);
        }
        const scale = 7.5 / Math.max(size.x, size.y);
        group.scale.set(scale, -scale, scale);

        const pivot = new THREE.Group();
        pivot.add(group);
        this.scene.add(pivot);
        this.monogram = pivot;

        this.start();
      },
      undefined,
      () => this.start() // Monogram failed to load — run embers only.
    );
  }

  private resize() {
    if (!this.renderer || !this.camera) return;
    const width = this.clientWidth || 1;
    const height = this.clientHeight || 1;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private start() {
    const t0 = performance.now();
    /* Cap the scene at ~60fps. On a 120Hz ProMotion display rAF fires twice as
       often, and rendering the backdrop 120x/sec buys nothing visually while
       doubling the GPU time competing with scroll. */
    const minFrameMs = 1000 / 60 - 1;
    let lastRender = 0;

    const loop = (now: number) => {
      if (this.stopped) return;
      requestAnimationFrame(loop);
      if (document.hidden || !this.visible) return;
      if (now - lastRender < minFrameMs) return;
      lastRender = now;

      const { renderer, scene, camera, embers } = this;
      if (!renderer || !scene || !camera || !embers) return;

      const t = (now - t0) / 1000;

      // Embers drift upward and wrap, with a lazy horizontal sway.
      const pos = embers.geometry.attributes.position as THREE_NS.BufferAttribute;
      const speed = embers.geometry.attributes.aSpeed as THREE_NS.BufferAttribute;
      const spread = embers.userData.spread as number;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + speed.getX(i) * 0.012;
        if (y > spread / 2) y = -spread / 2;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin((t + i) * 0.3) * 0.004);
      }
      pos.needsUpdate = true;
      embers.rotation.y = t * 0.02;

      // Two detuned sines give the lantern an irregular, candle-like flicker.
      if (this.keyLight) {
        this.keyLight.intensity = 2.1 + Math.sin(t * 7.3) * 0.18 + Math.sin(t * 2.1) * 0.22;
      }
      if (this.glow) {
        this.glow.material.opacity = 0.5 + Math.sin(t * 3.1) * 0.08;
      }

      if (this.monogram) {
        this.monogram.rotation.y =
          this.variant === 'orbit' ? t * 0.35 : Math.sin(t * 0.4) * 0.55 + 0.15;
        this.monogram.rotation.x = Math.sin(t * 0.5) * 0.08;
        this.monogram.position.y = Math.sin(t * 0.9) * 0.25;
      }

      // Camera eases toward the pointer for depth parallax.
      camera.position.x += (this.pointer.x * 2.2 - camera.position.x) * 0.05;
      camera.position.y += (-this.pointer.y * 1.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    requestAnimationFrame(loop);
  }
}

if (!customElements.get('ml-scene')) {
  customElements.define('ml-scene', MLScene);
}
