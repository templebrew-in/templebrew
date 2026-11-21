/**
 * TEMPLEBREW SHOPPING CART & WEIGHT VARIATIONS MODULE
 * Handles 250g & 500g weight variations, dynamic pricing, cart drawer, and WhatsApp checkout
 * Domain: https://templebrew.in
 */

(function () {
  'use strict';

  // Master Products Catalog with 250g and 500g variations
  const PRODUCTS_CATALOG = {
    srirangam_degree: {
      id: 'srirangam_degree',
      title: 'TEMPLEBREW SRI RANGAM DEGREE COFFEE',
      shortTitle: 'Srirangam Degree Coffee',
      modalKey: 'srirangam_cream',
      image: 'assets/images/product_srirangam_cream.png',
      weights: {
        '250g': { price: 250, origPrice: 300, save: 50, label: '250 g' },
        '500g': { price: 500, origPrice: 550, save: 50, label: '500 g' }
      },
      defaultWeight: '250g'
    },
    kumbakonam_degree: {
      id: 'kumbakonam_degree',
      title: 'TEMPLEBREW KUMBAKONAM DEGREE COFFEE',
      shortTitle: 'Kumbakonam Degree Coffee',
      modalKey: 'kumbakonam_cream',
      image: 'assets/images/product_kumbakonam_cream.png',
      weights: {
        '250g': { price: 250, origPrice: 300, save: 50, label: '250 g' },
        '500g': { price: 500, origPrice: 550, save: 50, label: '500 g' }
      },
      defaultWeight: '250g'
    },
    srirangam_blend: {
      id: 'srirangam_blend',
      title: 'TEMPLEBREW SRI RANGAM PREMIUM BLEND',
      shortTitle: 'Srirangam Premium Blend',
      modalKey: 'srirangam_maroon',
      image: 'assets/images/product_srirangam_maroon.png',
      weights: {
        '250g': { price: 300, origPrice: 350, save: 50, label: '250 g' },
        '500g': { price: 600, origPrice: 700, save: 100, label: '500 g' }
      },
      defaultWeight: '250g'
    },
    kumbakonam_blend: {
      id: 'kumbakonam_blend',
      title: 'TEMPLEBREW KUMBAKONAM PREMIUM BLEND',
      shortTitle: 'Kumbakonam Premium Blend',
      modalKey: 'kumbakonam_dark',
      image: 'assets/images/product_kumbakonam_dark.png',
      weights: {
        '250g': { price: 300, origPrice: 350, save: 50, label: '250 g' },
        '500g': { price: 600, origPrice: 700, save: 100, label: '500 g' }
      },
      defaultWeight: '250g'
    }
  };

  // State
  const state = {
    selectedWeights: {
      srirangam_degree: '250g',
      kumbakonam_degree: '250g',
      srirangam_blend: '250g',
      kumbakonam_blend: '250g'
    },
    modalSelectedWeight: '250g',
    currentModalProductKey: 'srirangam_cream',
    cart: []
  };

  const STORAGE_KEY = 'templebrew_cart_v1';
  const WHATSAPP_PHONE = '918072435415';

  // Load cart from localStorage
  function loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.cart = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
      state.cart = [];
    }
    updateCartUI();
  }

  // Save cart to localStorage
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
    updateCartUI();
  }

  // Generate WhatsApp Direct Order Link for a single product variation
  function generateWhatsAppLink(product, weightKey) {
    const w = product.weights[weightKey];
    const msg = `Hello TEMPLEBREW, I would like to order ${product.shortTitle} ${weightKey} for ₹${w.price}.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  // Update card UI when weight changes
  function updateProductCardWeight(productId, weightKey) {
    const product = PRODUCTS_CATALOG[productId];
    if (!product || !product.weights[weightKey]) return;

    state.selectedWeights[productId] = weightKey;
    const w = product.weights[weightKey];

    // Find card elements
    const card = document.querySelector(`[data-product-card="${productId}"]`);
    if (!card) return;

    // Update weight buttons active class
    const buttons = card.querySelectorAll('.weight-pill-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-weight') === weightKey) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    // Update weight tag label
    const weightLabel = card.querySelector('.product-weight-val');
    if (weightLabel) {
      weightLabel.textContent = w.label;
    }

    // Update prices
    const priceHighlight = card.querySelector('.price-highlight');
    if (priceHighlight) {
      priceHighlight.textContent = `₹${w.price}`;
    }

    const priceStrike = card.querySelector('.price-strikethrough');
    if (priceStrike) {
      priceStrike.textContent = `₹${w.origPrice}`;
    }

    const savingsPill = card.querySelector('.savings-pill');
    if (savingsPill) {
      savingsPill.textContent = `Save ₹${w.save}`;
    }

    // Update WhatsApp order link
    const waBtn = card.querySelector('[data-wa-btn]');
    if (waBtn) {
      waBtn.href = generateWhatsAppLink(product, weightKey);
      const btnSpan = waBtn.querySelector('span');
      if (btnSpan) {
        btnSpan.textContent = `ORDER ${weightKey.toUpperCase()} (₹${w.price})`;
      }
    }

    // Update Buy Showcase card in Slide 3 if present
    const buyCard = document.querySelector(`[data-buy-unit="${productId}"]`);
    if (buyCard) {
      const bButtons = buyCard.querySelectorAll('.weight-pill-btn');
      bButtons.forEach(btn => {
        if (btn.getAttribute('data-weight') === weightKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      const bPrice = buyCard.querySelector('.buy-price');
      if (bPrice) bPrice.textContent = `₹${w.price}`;
      const bStrike = buyCard.querySelector('.buy-strike');
      if (bStrike) bStrike.textContent = `₹${w.origPrice}`;
      const bWeight = buyCard.querySelector('.buy-weight-label');
      if (bWeight) bWeight.textContent = `${weightKey.toUpperCase()} PACK`;
      const bWa = buyCard.querySelector('.btn-buy-whatsapp');
      if (bWa) {
        bWa.href = generateWhatsAppLink(product, weightKey);
        const bSpan = bWa.querySelector('span');
        if (bSpan) bSpan.textContent = `BUY ${weightKey.toUpperCase()} VIA WHATSAPP (₹${w.price})`;
      }
    }
  }

  // Add Item to Cart
  function addToCart(productId, weightKey, quantity) {
    quantity = quantity || 1;
    const product = PRODUCTS_CATALOG[productId];
    if (!product || !product.weights[weightKey]) return;

    const w = product.weights[weightKey];
    const itemKey = `${productId}_${weightKey}`;

    const existingIndex = state.cart.findIndex(item => item.key === itemKey);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        key: itemKey,
        productId: productId,
        title: product.shortTitle,
        fullTitle: product.title,
        weight: weightKey,
        weightLabel: w.label,
        price: w.price,
        origPrice: w.origPrice,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    showToast(`Added ${product.shortTitle} (${weightKey} • ₹${w.price}) to Cart!`);
    openCart();
  }

  // Update item quantity in cart
  function updateQuantity(itemKey, delta) {
    const index = state.cart.findIndex(item => item.key === itemKey);
    if (index === -1) return;

    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }

  // Remove item from cart
  function removeFromCart(itemKey) {
    state.cart = state.cart.filter(item => item.key !== itemKey);
    saveCart();
    showToast('Item removed from cart.');
  }

  // Clear entire cart
  function clearCart() {
    if (state.cart.length === 0) return;
    if (confirm('Are you sure you want to clear all items from your cart?')) {
      state.cart = [];
      saveCart();
      showToast('Cart has been cleared.');
    }
  }

  // Open & Close Cart Drawer
  function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Show Toast Notification
  function showToast(message) {
    const toast = document.getElementById('cartToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  // Render Cart UI
  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update badges
    const headerBadge = document.getElementById('cartCountBadge');
    if (headerBadge) {
      headerBadge.textContent = totalCount;
      headerBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    const floatingBadge = document.getElementById('floatingCartBadge');
    if (floatingBadge) {
      floatingBadge.textContent = totalCount;
      floatingBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    const drawerCount = document.getElementById('cartHeaderCount');
    if (drawerCount) {
      drawerCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
    }

    // Update items container & empty state
    const itemsList = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const footerPanel = document.getElementById('cartFooterPanel');

    if (!itemsList || !emptyState || !footerPanel) return;

    if (state.cart.length === 0) {
      itemsList.innerHTML = '';
      emptyState.style.display = 'flex';
      footerPanel.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    footerPanel.style.display = 'block';

    // Build items HTML
    let itemsHTML = '';
    state.cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
      itemsHTML += `
        <div class="cart-item-row" data-key="${item.key}">
          <div class="cart-item-img-wrap">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-head">
              <h4 class="cart-item-title">${item.title}</h4>
              <button type="button" class="btn-remove-item" onclick="window.TempleBrewCart.removeFromCart('${item.key}')" aria-label="Remove ${item.title}">
                <i data-lucide="trash-2" class="w-4 h-4 text-warm-gold"></i>
              </button>
            </div>
            
            <div class="cart-weight-pill">
              <i data-lucide="package" class="w-3.5 h-3.5 text-warm-gold mr-1 inline"></i>
              <span>Weight: <strong>${item.weight}</strong></span>
              <span class="cart-unit-price">(&#8377;${item.price} each)</span>
            </div>

            <div class="cart-item-bottom">
              <div class="cart-qty-ctrl">
                <button type="button" class="btn-qty" onclick="window.TempleBrewCart.updateQuantity('${item.key}', -1)" aria-label="Decrease quantity">
                  <i data-lucide="minus" class="w-3 h-3"></i>
                </button>
                <span class="qty-num">${item.quantity}</span>
                <button type="button" class="btn-qty" onclick="window.TempleBrewCart.updateQuantity('${item.key}', 1)" aria-label="Increase quantity">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                </button>
              </div>
              <div class="cart-item-total">
                <span class="item-total-price">&#8377;${lineTotal}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    itemsList.innerHTML = itemsHTML;

    // Update totals
    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;

    const totalEl = document.getElementById('cartTotalAmount');
    if (totalEl) totalEl.textContent = `₹${subtotal}`;

    // Refresh Lucide icons inside cart
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Proceed to WhatsApp Checkout with structured order summary
  function proceedToCheckout() {
    if (state.cart.length === 0) {
      alert('Your cart is empty. Please select coffee items to order.');
      return;
    }

    const nameInput = document.getElementById('custName');
    const phoneInput = document.getElementById('custPhone');
    const addressInput = document.getElementById('custAddress');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    if (!name) {
      alert('Please enter your Full Name.');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!phone) {
      alert('Please enter your WhatsApp / Mobile Number.');
      if (phoneInput) phoneInput.focus();
      return;
    }
    if (!address) {
      alert('Please enter your Delivery Address & Pincode.');
      if (addressInput) addressInput.focus();
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Format WhatsApp message with exact items, weights, prices, and customer details
    let message = `*TEMPLEBREW COFFEE ORDER*\n`;
    message += `Website: https://templebrew.in\n`;
    message += `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
    message += `*ORDERED ITEMS:*\n`;

    state.cart.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      message += `${index + 1}. *${item.title}*\n`;
      message += `   - Package Weight: *${item.weight}*\n`;
      message += `   - Unit Price: ₹${item.price}\n`;
      message += `   - Quantity: ${item.quantity}\n`;
      message += `   - Subtotal: *₹${lineTotal}*\n\n`;
    });

    message += `*TOTAL AMOUNT:* ₹${subtotal}\n`;
    message += `*DELIVERY:* FREE Fresh Roast Dispatch\n\n`;
    message += `*DELIVERY DETAILS:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `Please confirm my order and share payment/dispatch confirmation. Thank you!`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // Update Modal for Weight Variation
  function updateModalWeight(weightKey) {
    state.modalSelectedWeight = weightKey;
    const key = state.currentModalProductKey;

    // Map modal key to product id
    let productId = 'srirangam_degree';
    if (key.includes('kumbakonam') && key.includes('cream')) productId = 'kumbakonam_degree';
    else if (key.includes('kumbakonam')) productId = 'kumbakonam_blend';
    else if (key.includes('maroon')) productId = 'srirangam_blend';

    const product = PRODUCTS_CATALOG[productId];
    if (!product || !product.weights[weightKey]) return;

    const w = product.weights[weightKey];

    // Update modal buttons
    const mButtons = document.querySelectorAll('.modal-weight-btn');
    mButtons.forEach(btn => {
      if (btn.getAttribute('data-weight') === weightKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update modal price and weight
    const origPriceEl = document.getElementById('modalOrigPrice');
    const sellPriceEl = document.getElementById('modalSellPrice');
    const weightEl = document.getElementById('modalWeight');

    if (origPriceEl) origPriceEl.textContent = `₹${w.origPrice}`;
    if (sellPriceEl) sellPriceEl.textContent = `₹${w.price}`;
    if (weightEl) weightEl.textContent = w.label;

    // Update modal WhatsApp button
    const mWaBtn = document.getElementById('modalWhatsAppBtn');
    if (mWaBtn) {
      mWaBtn.href = generateWhatsAppLink(product, weightKey);
      const span = mWaBtn.querySelector('span');
      if (span) span.textContent = `ORDER ${weightKey.toUpperCase()} VIA WHATSAPP (₹${w.price})`;
    }
  }

  // Initialize Event Listeners
  function init() {
    // 1. Weight selection button clicks on cards
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.weight-pill-btn');
      if (btn) {
        e.preventDefault();
        const productId = btn.getAttribute('data-product');
        const weight = btn.getAttribute('data-weight');
        if (productId && weight) {
          updateProductCardWeight(productId, weight);
        }
      }
    });

    // 2. Add to Cart button clicks on cards
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-cart-btn]');
      if (btn) {
        e.preventDefault();
        const productId = btn.getAttribute('data-cart-btn');
        const weight = state.selectedWeights[productId] || '250g';
        addToCart(productId, weight, 1);
      }
    });

    // 3. Header and Floating Cart Button clicks
    const headerCartBtn = document.getElementById('headerCartBtn');
    if (headerCartBtn) {
      headerCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openCart();
      });
    }

    const floatingCartBtn = document.getElementById('floatingCartBtn');
    if (floatingCartBtn) {
      floatingCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openCart();
      });
    }

    // 4. Cart close button and backdrop clicks
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', function () {
        closeCart();
      });
    }

    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeCart();
      });
    }

    // 5. Checkout button
    const checkoutBtn = document.getElementById('btnProceedCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        proceedToCheckout();
      });
    }

    // 6. Clear cart button
    const clearBtn = document.getElementById('btnClearCart');
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearCart();
      });
    }

    // 7. Modal Add to Cart
    const modalCartBtn = document.getElementById('modalAddToCartBtn');
    if (modalCartBtn) {
      modalCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let productId = 'srirangam_degree';
        const key = state.currentModalProductKey;
        if (key.includes('kumbakonam') && key.includes('cream')) productId = 'kumbakonam_degree';
        else if (key.includes('kumbakonam')) productId = 'kumbakonam_blend';
        else if (key.includes('maroon')) productId = 'srirangam_blend';

        addToCart(productId, state.modalSelectedWeight || '250g', 1);
      });
    }

    // 8. Modal weight buttons
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.modal-weight-btn');
      if (btn) {
        e.preventDefault();
        const weight = btn.getAttribute('data-weight');
        if (weight) {
          updateModalWeight(weight);
        }
      }
    });

    // Load initial cart
    loadCart();

    // Initialize all cards to 250g
    Object.keys(PRODUCTS_CATALOG).forEach(pId => {
      updateProductCardWeight(pId, '250g');
    });
  }

  // Hook for modal product open
  function onModalOpen(productKey) {
    state.currentModalProductKey = productKey;
    state.modalSelectedWeight = '250g';
    updateModalWeight('250g');
  }

  // Export public API
  window.TempleBrewCart = {
    init: init,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    clearCart: clearCart,
    openCart: openCart,
    closeCart: closeCart,
    proceedToCheckout: proceedToCheckout,
    updateProductCardWeight: updateProductCardWeight,
    updateModalWeight: updateModalWeight,
    onModalOpen: onModalOpen,
    catalog: PRODUCTS_CATALOG
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

