/**
 * TEMPLEBREW 3D SCENE (Hero Section)
 * Realistic 3D Coffee Packaging Model with authentic packaging texture mapping.
 * Domain: https://templebrew.in
 */

(function () {
  'use strict';

  // Texture definitions for available blends
  const BLEND_TEXTURES = {
    srirangam_cream: {
      name: 'Sri Rangam Degree Coffee (250g)',
      front: 'assets/textures/srirangam_cream/front.jpg',
      side_left: 'assets/textures/srirangam_cream/side_left.jpg',
      side_right: 'assets/textures/srirangam_cream/side_right.jpg',
      back: 'assets/textures/srirangam_cream/back.jpg',
      top: 'assets/textures/srirangam_cream/top.jpg',
      bottom: 'assets/textures/srirangam_cream/bottom.jpg'
    },
    srirangam: {
      name: 'Sri Rangam Degree Coffee (250g)',
      front: 'assets/textures/srirangam_cream/front.jpg',
      side_left: 'assets/textures/srirangam_cream/side_left.jpg',
      side_right: 'assets/textures/srirangam_cream/side_right.jpg',
      back: 'assets/textures/srirangam_cream/back.jpg',
      top: 'assets/textures/srirangam_cream/top.jpg',
      bottom: 'assets/textures/srirangam_cream/bottom.jpg'
    },
    kumbakonam_cream: {
      name: 'Kumbakonam Degree Coffee (500g)',
      front: 'assets/textures/kumbakonam_cream/front.jpg',
      side_left: 'assets/textures/kumbakonam_cream/side_left.jpg',
      side_right: 'assets/textures/kumbakonam_cream/side_right.jpg',
      back: 'assets/textures/kumbakonam_cream/back.jpg',
      top: 'assets/textures/kumbakonam_cream/top.jpg',
      bottom: 'assets/textures/kumbakonam_cream/bottom.jpg'
    },
    kumbakonam: {
      name: 'Kumbakonam Degree Coffee (500g)',
      front: 'assets/textures/kumbakonam_cream/front.jpg',
      side_left: 'assets/textures/kumbakonam_cream/side_left.jpg',
      side_right: 'assets/textures/kumbakonam_cream/side_right.jpg',
      back: 'assets/textures/kumbakonam_cream/back.jpg',
      top: 'assets/textures/kumbakonam_cream/top.jpg',
      bottom: 'assets/textures/kumbakonam_cream/bottom.jpg'
    },
    srirangam_maroon: {
      name: 'Sri Rangam Royal Maroon Edition (250g)',
      front: 'assets/textures/srirangam_maroon/front.jpg',
      side_left: 'assets/textures/srirangam_maroon/side_left.jpg',
      side_right: 'assets/textures/srirangam_maroon/side_right.jpg',
      back: 'assets/textures/srirangam_maroon/back.jpg',
      top: 'assets/textures/srirangam_maroon/top.jpg',
      bottom: 'assets/textures/srirangam_maroon/bottom.jpg'
    },
    kumbakonam_dark: {
      name: 'Kumbakonam Dark Reserve (500g)',
      front: 'assets/textures/kumbakonam_dark/front.jpg',
      side_left: 'assets/textures/kumbakonam_dark/side_left.jpg',
      side_right: 'assets/textures/kumbakonam_dark/side_right.jpg',
      back: 'assets/textures/kumbakonam_dark/back.jpg',
      top: 'assets/textures/kumbakonam_dark/top.jpg',
      bottom: 'assets/textures/kumbakonam_dark/bottom.jpg'
    }
  };

  let currentBlendKey = 'srirangam_cream';
  let container, scene, camera, renderer;
  let boxMesh, shadowMesh, particleSystem;
  let keyLight, rimLight, fillLight, ambientLight;
  
  // Dimensions matching packaging aspect ratio (383 x 509 x 113)
  const BOX_WIDTH = 2.8;
  const BOX_HEIGHT = 3.72;
  const BOX_DEPTH = 1.05;

  // Interaction State
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0.08, targetRotationY = -0.25;
  let targetPosX = 1.8, targetPosY = 0;
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let dragVelocity = { x: 0, y: 0 };
  let clock;
  let isMobile = false;

  const textureLoader = new THREE.TextureLoader();

  // Create radial contact shadow canvas texture
  function createShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.3, 'rgba(15, 6, 3, 0.5)');
    grad.addColorStop(0.7, 'rgba(23, 9, 5, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }

  // Load materials for a given blend
  function createMaterialsForBlend(blendKey) {
    const b = BLEND_TEXTURES[blendKey] || BLEND_TEXTURES.srirangam;
    const loadTex = (url) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      return tex;
    };

    // Material index order in Three.js BoxGeometry:
    // 0: +X (Right) -> side_left ("OUR BRAND STORY")
    // 1: -X (Left) -> side_right ("HOW TO BREW")
    // 2: +Y (Top) -> top flap (TEMPLEBREW with flourish)
    // 3: -Y (Bottom) -> bottom flap
    // 4: +Z (Front) -> front face (TEMPLEBREW DEGREE COFFEE)
    // 5: -Z (Back) -> back face (About & Nutrition Facts)
    const matCommon = {
      roughness: 0.38,
      metalness: 0.04
    };

    return [
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.side_left) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.side_right) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.top) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.bottom) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.front) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(b.back) })
    ];
  }

  // Setup Gold Aroma Particles
  function setupParticles() {
    const count = isMobile ? 180 : 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const c1 = new THREE.Color(0xC99A43); // Antique gold
    const c2 = new THREE.Color(0xE6B96A); // Warm gold
    const c3 = new THREE.Color(0xF7D488); // Light gold

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      const mixedColor = Math.random() > 0.5 ? (Math.random() > 0.5 ? c1 : c2) : c3;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 0.08 + 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle point texture (circular soft glow)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 2, 16, 16, 15);
    pGrad.addColorStop(0, 'rgba(255, 240, 200, 1)');
    pGrad.addColorStop(0.4, 'rgba(230, 185, 106, 0.8)');
    pGrad.addColorStop(1, 'rgba(201, 154, 67, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function init() {
    container = document.getElementById('hero3dContainer');
    if (!container) return;

    clock = new THREE.Clock();
    isMobile = window.innerWidth <= 860;

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    const fov = 42;
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (renderer.outputColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTING
    ambientLight = new THREE.AmbientLight(0x3B2118, 1.4);
    scene.add(ambientLight);

    // Key Spotlight (Warm light casting soft shadow)
    keyLight = new THREE.SpotLight(0xFFF2D1, 2.4);
    keyLight.position.set(4.5, 5.0, 5.5);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.6;
    keyLight.decay = 1.2;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Rim Lighting (Antique Gold Highlight on silhouette)
    rimLight = new THREE.DirectionalLight(0xC99A43, 1.8);
    rimLight.position.set(-4.5, 3.0, -3.5);
    scene.add(rimLight);

    // Fill Light (Deep warm maroon tone from bottom)
    fillLight = new THREE.DirectionalLight(0x4A171C, 0.65);
    fillLight.position.set(0, -3.5, 3.0);
    scene.add(fillLight);

    // 3D BOX GEOMETRY & MATERIALS
    const geometry = new THREE.BoxGeometry(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH);
    const materials = createMaterialsForBlend(currentBlendKey);
    boxMesh = new THREE.Mesh(geometry, materials);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = false;

    // Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(BOX_WIDTH * 1.5, BOX_DEPTH * 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -BOX_HEIGHT / 2 - 0.22;
    scene.add(shadowMesh);

    // Default positioning
    updateLayoutPosition();
    boxMesh.position.set(targetPosX, targetPosY, 0);
    boxMesh.rotation.set(targetRotationX, targetRotationY, 0);
    scene.add(boxMesh);

    // Setup particles
    setupParticles();

    // Hide loading indicator
    const loaderElem = document.getElementById('boxLoadingOverlay');
    if (loaderElem) {
      setTimeout(() => {
        loaderElem.style.opacity = '0';
        setTimeout(() => loaderElem.remove(), 500);
      }, 400);
    }

    // Cinematic Intro Reveal Animation with GSAP
    if (window.gsap) {
      boxMesh.position.y = targetPosY - 1.2;
      boxMesh.scale.set(0.65, 0.65, 0.65);
      boxMesh.rotation.y = -1.2;
      keyLight.intensity = 0.2;

      gsap.to(boxMesh.position, {
        y: targetPosY,
        duration: 2.2,
        ease: 'power3.out'
      });
      gsap.to(boxMesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 2.4,
        ease: 'power3.out'
      });
      gsap.to(boxMesh.rotation, {
        y: targetRotationY,
        x: targetRotationX,
        duration: 2.6,
        ease: 'power2.out'
      });
      gsap.to(keyLight, {
        intensity: 2.4,
        duration: 2.0,
        ease: 'power2.inOut'
      });
    }

    // Attach Event Listeners
    initEventListeners();

    // Start Animation Loop
    animate();
  }

  function updateLayoutPosition() {
    isMobile = window.innerWidth <= 860;
    if (isMobile) {
      targetPosX = 0;
      targetPosY = 0.6;
      if (boxMesh) boxMesh.scale.set(0.85, 0.85, 0.85);
      if (camera) camera.position.z = 8.5;
    } else if (window.innerWidth <= 1100) {
      targetPosX = 1.2;
      targetPosY = 0;
      if (boxMesh) boxMesh.scale.set(0.95, 0.95, 0.95);
      if (camera) camera.position.z = 8.0;
    } else {
      targetPosX = 1.9;
      targetPosY = 0;
      if (boxMesh) boxMesh.scale.set(1.05, 1.05, 1.05);
      if (camera) camera.position.z = 7.6;
    }
  }

  function initEventListeners() {
    // Window Resize
    window.addEventListener('resize', onWindowResize);

    // Mouse Movement for Parallax
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
    });

    // Drag to Rotate Box
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !boxMesh) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      dragVelocity.x = deltaX * 0.006;
      dragVelocity.y = deltaY * 0.006;

      targetRotationY += dragVelocity.x;
      targetRotationX += dragVelocity.y;

      // Clamp X rotation to avoid unnatural flipping
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));
    });

    // Touch Support for Mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !boxMesh || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
    }, { passive: true });

    // Blend Switcher Buttons (Handles all pills dynamically)
    document.querySelectorAll('.blend-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const blend = e.currentTarget.getAttribute('data-blend');
        if (blend) switchBlend(blend);
      });
    });

    // Scroll Interaction with GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Slide 1 to Slide 2 transition
      ScrollTrigger.create({
        trigger: '#slide-2',
        start: 'top bottom',
        end: 'top top',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          if (boxMesh) {
            // As user scrolls down, box rotates to reveal side angle & story
            boxMesh.rotation.y = targetRotationY + progress * 1.5;
            boxMesh.position.y = targetPosY - progress * 1.8;
            boxMesh.position.z = -progress * 2.0;
          }
        }
      });
    }
  }

  function switchBlend(blendKey) {
    if (blendKey === currentBlendKey || !boxMesh) return;
    currentBlendKey = blendKey;

    document.querySelectorAll('.blend-pill').forEach(btn => {
      const match = btn.getAttribute('data-blend') === blendKey || 
                    (blendKey.startsWith('srirangam') && btn.getAttribute('data-blend') === 'srirangam_cream') ||
                    (blendKey.startsWith('kumbakonam') && btn.getAttribute('data-blend') === 'kumbakonam_cream');
      btn.classList.toggle('active', match);
    });

    // Smooth 3D flip animation during texture swap
    if (window.gsap) {
      gsap.to(boxMesh.rotation, {
        y: boxMesh.rotation.y + Math.PI * 2,
        duration: 0.9,
        ease: 'power2.inOut',
        onStart: () => {
          setTimeout(() => {
            boxMesh.material = createMaterialsForBlend(blendKey);
          }, 350);
        }
      });
    } else {
      boxMesh.material = createMaterialsForBlend(blendKey);
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    updateLayoutPosition();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Idle gentle floating animation
    const floatOffset = Math.sin(elapsedTime * 1.6) * 0.08;
    const idleTiltZ = Math.sin(elapsedTime * 1.2) * 0.015;

    // Smooth Lerp for Mouse Parallax & Drag
    if (boxMesh) {
      const targetYWithParallax = isDragging ? targetRotationY : targetRotationY + mouseX * 0.22;
      const targetXWithParallax = isDragging ? targetRotationX : targetRotationX - mouseY * 0.15;

      boxMesh.rotation.y += (targetYWithParallax - boxMesh.rotation.y) * 0.06;
      boxMesh.rotation.x += (targetXWithParallax - boxMesh.rotation.x) * 0.06;
      boxMesh.rotation.z = idleTiltZ;

      boxMesh.position.x += (targetPosX - boxMesh.position.x) * 0.05;
      boxMesh.position.y = targetPosY + floatOffset;

      // Update contact shadow position and softness
      if (shadowMesh) {
        shadowMesh.position.x = boxMesh.position.x;
        shadowMesh.position.z = boxMesh.position.z;
        shadowMesh.material.opacity = 0.55 - floatOffset * 0.8;
      }

      // If not dragging, add very slow continuous rotation
      if (!isDragging) {
        targetRotationY += 0.0018;
      }
    }

    // Particles Drift Animation
    if (particleSystem) {
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.007; // Rise upward
        if (positions[i] > 6) {
          positions[i] = -5; // Reset at bottom
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.02;
    }

    // Camera slight parallax response
    if (camera) {
      camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.18 - camera.position.y) * 0.04;
      camera.lookAt(boxMesh ? boxMesh.position.x * 0.5 : 0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  // Expose global switch for external UI triggers
  window.TempleBrewHero3D = {
    switchBlend: switchBlend
  };

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

