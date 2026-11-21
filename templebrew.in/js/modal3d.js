/**
 * TEMPLEBREW 3D PRODUCT INSPECTOR MODAL
 * Dedicated 360-degree interactive 3D box viewer with preset camera angles
 * Domain: https://templebrew.in
 */

(function () {
  'use strict';

  const PRODUCTS_DATA = {
    srirangam_cream: {
      title: 'TEMPLEBREW SRI RANGAM DEGREE COFFEE (CLASSIC)',
      weight: '250 g',
      origPrice: '₹300',
      sellPrice: '₹250',
      roast: 'Artisanal Slow Roasted',
      desc: 'A rich and aromatic traditional South Indian filter coffee blend inspired by the timeless coffee heritage of Srirangam. Slow-roasted to preserve the deep chocolaty notes and golden froth.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Sri Rangam Degree Coffee 250g for ₹250.',
      textures: {
        front: 'assets/textures/srirangam_cream/front.jpg',
        side_left: 'assets/textures/srirangam_cream/side_left.jpg',
        side_right: 'assets/textures/srirangam_cream/side_right.jpg',
        back: 'assets/textures/srirangam_cream/back.jpg',
        top: 'assets/textures/srirangam_cream/top.jpg',
        bottom: 'assets/textures/srirangam_cream/bottom.jpg'
      }
    },
    srirangam: {
      title: 'TEMPLEBREW SRI RANGAM DEGREE COFFEE',
      weight: '250 g',
      origPrice: '₹300',
      sellPrice: '₹250',
      roast: 'Artisanal Slow Roasted',
      desc: 'A rich and aromatic traditional South Indian filter coffee blend inspired by the timeless coffee heritage of Srirangam.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Sri Rangam Degree Coffee 250g for ₹250.',
      textures: {
        front: 'assets/textures/srirangam_cream/front.jpg',
        side_left: 'assets/textures/srirangam_cream/side_left.jpg',
        side_right: 'assets/textures/srirangam_cream/side_right.jpg',
        back: 'assets/textures/srirangam_cream/back.jpg',
        top: 'assets/textures/srirangam_cream/top.jpg',
        bottom: 'assets/textures/srirangam_cream/bottom.jpg'
      }
    },
    kumbakonam_cream: {
      title: 'TEMPLEBREW KUMBAKONAM DEGREE COFFEE (CLASSIC)',
      weight: '500 g',
      origPrice: '₹550',
      sellPrice: '₹500',
      roast: 'Heritage Double Roasted',
      desc: 'Enjoy the rich aroma, traditional taste and carefully roasted coffee experience inspired by Kumbakonam’s legendary coffee tradition. Strong, full-bodied decoction with an unforgettable aroma.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Kumbakonam Degree Coffee 500g for ₹500.',
      textures: {
        front: 'assets/textures/kumbakonam_cream/front.jpg',
        side_left: 'assets/textures/kumbakonam_cream/side_left.jpg',
        side_right: 'assets/textures/kumbakonam_cream/side_right.jpg',
        back: 'assets/textures/kumbakonam_cream/back.jpg',
        top: 'assets/textures/kumbakonam_cream/top.jpg',
        bottom: 'assets/textures/kumbakonam_cream/bottom.jpg'
      }
    },
    kumbakonam: {
      title: 'TEMPLEBREW KUMBAKONAM DEGREE COFFEE',
      weight: '500 g',
      origPrice: '₹550',
      sellPrice: '₹500',
      roast: 'Heritage Double Roasted',
      desc: 'Enjoy the rich aroma, traditional taste and carefully roasted coffee experience inspired by Kumbakonam’s coffee tradition.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Kumbakonam Degree Coffee 500g for ₹500.',
      textures: {
        front: 'assets/textures/kumbakonam_cream/front.jpg',
        side_left: 'assets/textures/kumbakonam_cream/side_left.jpg',
        side_right: 'assets/textures/kumbakonam_cream/side_right.jpg',
        back: 'assets/textures/kumbakonam_cream/back.jpg',
        top: 'assets/textures/kumbakonam_cream/top.jpg',
        bottom: 'assets/textures/kumbakonam_cream/bottom.jpg'
      }
    },
    srirangam_maroon: {
      title: 'TEMPLEBREW SRI RANGAM PREMIUM BLEND',
      weight: '250 g',
      origPrice: '₹350',
      sellPrice: '₹300',
      roast: 'Artisanal Slow Roasted',
      desc: 'Wrapped in our royal maroon heritage artwork, this blend offers a legacy of purity and richness brewed in the temple town.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Sri Rangam Premium Blend 250g for ₹300.',
      textures: {
        front: 'assets/textures/srirangam_maroon/front.jpg',
        side_left: 'assets/textures/srirangam_maroon/side_left.jpg',
        side_right: 'assets/textures/srirangam_maroon/side_right.jpg',
        back: 'assets/textures/srirangam_maroon/back.jpg',
        top: 'assets/textures/srirangam_maroon/top.jpg',
        bottom: 'assets/textures/srirangam_maroon/bottom.jpg'
      }
    },
    kumbakonam_dark: {
      title: 'TEMPLEBREW KUMBAKONAM PREMIUM BLEND',
      weight: '250 g',
      origPrice: '₹350',
      sellPrice: '₹300',
      roast: 'Heritage Double Roasted Reserve',
      desc: 'Our dark espresso reserve edition with intense aroma and bold roasted notes crafted for lovers of deep South Indian filter decoction.',
      whatsappMsg: 'Hello TEMPLEBREW, I would like to order Kumbakonam Premium Blend 250g for ₹300.',
      textures: {
        front: 'assets/textures/kumbakonam_dark/front.jpg',
        side_left: 'assets/textures/kumbakonam_dark/side_left.jpg',
        side_right: 'assets/textures/kumbakonam_dark/side_right.jpg',
        back: 'assets/textures/kumbakonam_dark/back.jpg',
        top: 'assets/textures/kumbakonam_dark/top.jpg',
        bottom: 'assets/textures/kumbakonam_dark/bottom.jpg'
      }
    }
  };

  let modalElem, canvasContainer;
  let scene, camera, renderer, controls, boxMesh;
  let isInitialized = false;
  let currentProductKey = 'srirangam';
  let animId = null;

  const textureLoader = new THREE.TextureLoader();

  function initModalScene() {
    canvasContainer = document.getElementById('modal3dCanvasContainer');
    if (!canvasContainer) return;

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (renderer.outputColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.shadowMap.enabled = true;
    canvasContainer.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 4.5;
      controls.maxDistance = 12.0;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
    }

    // LIGHTS
    const ambient = new THREE.AmbientLight(0x3B2118, 1.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xFFF2D1, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC99A43, 1.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bottomFill = new THREE.DirectionalLight(0x4A171C, 0.8);
    bottomFill.position.set(0, -4, 2);
    scene.add(bottomFill);

    // 3D BOX GEOMETRY
    const geometry = new THREE.BoxGeometry(2.8, 3.72, 1.05);
    boxMesh = new THREE.Mesh(geometry, getMaterials(currentProductKey));
    scene.add(boxMesh);

    isInitialized = true;
    animate();
  }

  function getMaterials(productKey) {
    const data = PRODUCTS_DATA[productKey] || PRODUCTS_DATA.srirangam;
    const texs = data.textures;

    const loadTex = (url) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const matCommon = { roughness: 0.38, metalness: 0.04 };

    return [
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.side_left) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.side_right) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.top) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.bottom) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.front) }),
      new THREE.MeshStandardMaterial({ ...matCommon, map: loadTex(texs.back) })
    ];
  }

  function setCameraAngle(angle) {
    if (!boxMesh || !camera) return;

    if (controls) controls.autoRotate = false;

    let targetRotY = 0, targetRotX = 0;

    switch (angle) {
      case 'front':
        targetRotY = 0;
        targetRotX = 0;
        break;
      case 'story': // Right side (+X)
        targetRotY = -Math.PI / 2;
        targetRotX = 0;
        break;
      case 'back': // -Z
        targetRotY = Math.PI;
        targetRotX = 0;
        break;
      case 'brew': // Left side (-X)
        targetRotY = Math.PI / 2;
        targetRotX = 0;
        break;
      case 'top': // +Y
        targetRotY = 0;
        targetRotX = Math.PI / 3;
        break;
    }

    if (window.gsap) {
      gsap.to(boxMesh.rotation, {
        y: targetRotY,
        x: targetRotX,
        z: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      });
      if (controls) {
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 7.2,
          duration: 0.8,
          onUpdate: () => controls.update()
        });
      }
    } else {
      boxMesh.rotation.set(targetRotX, targetRotY, 0);
    }
  }

  function openModal(productKey) {
    currentProductKey = productKey;
    const data = PRODUCTS_DATA[productKey];
    if (!data) return;

    modalElem = document.getElementById('productModal');
    if (!modalElem) return;

    // Populate data
    document.getElementById('modalProductTitle').textContent = data.title;
    document.getElementById('modalOrigPrice').textContent = data.origPrice;
    document.getElementById('modalSellPrice').textContent = data.sellPrice;
    document.getElementById('modalWeight').textContent = data.weight;
    document.getElementById('modalRoast').textContent = data.roast;
    document.getElementById('modalProductDesc').textContent = `"${data.desc}"`;

    const waBtn = document.getElementById('modalWhatsAppBtn');
    if (waBtn) {
      waBtn.href = `https://wa.me/918072435415?text=${encodeURIComponent(data.whatsappMsg)}`;
    }

    // Reset Angle Buttons
    document.querySelectorAll('.angle-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === 0);
    });

    // Notify Cart module for weight variations
    if (window.TempleBrewCart && typeof window.TempleBrewCart.onModalOpen === 'function') {
      window.TempleBrewCart.onModalOpen(productKey);
    }

    // Show modal
    modalElem.classList.add('active');
    modalElem.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Init or update Three.js
    if (!isInitialized) {
      setTimeout(initModalScene, 80);
    } else {
      boxMesh.material = getMaterials(productKey);
      boxMesh.rotation.set(0, 0, 0);
      if (controls) {
        controls.reset();
        controls.autoRotate = true;
      }
      onModalResize();
    }
  }

  function closeModal() {
    if (!modalElem) modalElem = document.getElementById('productModal');
    if (modalElem) {
      modalElem.classList.remove('active');
      modalElem.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (controls) controls.autoRotate = false;
    }
  }

  function onModalResize() {
    if (!canvasContainer || !renderer || !camera) return;
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Setup DOM events
  function setupEvents() {
    // View Product Buttons in Slide 2
    document.querySelectorAll('.btn-view-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productKey = e.currentTarget.getAttribute('data-product') || 'srirangam';
        openModal(productKey);
      });
    });

    // Close Modal Button
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Backdrop Click
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Angle Preset Buttons
    document.querySelectorAll('.angle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.angle-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const angle = e.currentTarget.getAttribute('data-angle');
        setCameraAngle(angle);
      });
    });

    window.addEventListener('resize', onModalResize);
  }

  window.TempleBrewModal = {
    open: openModal,
    close: closeModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEvents);
  } else {
    setupEvents();
  }
})();

