// Waterboy landing — carousel + product page interactivity
// Behavior is identical to the original HTML prototype, with the product-page
// state wired to real Shopify variants when a product is attached.

(function () {
  // ———————— Social proof carousel ————————
  var row = document.getElementById('proofRow');
  if (row) {
    var dots = document.querySelectorAll('#dots .dot');
    var prev = document.getElementById('prevBtn');
    var next = document.getElementById('nextBtn');
    var current = 0;
    var cards = row.querySelectorAll('.proof-card');

    function setActive(i) {
      if (!cards.length) return;
      current = (i + cards.length) % cards.length;
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === current);
      });
      if (row.scrollWidth > row.clientWidth) {
        var card = cards[current];
        row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: 'smooth' });
      }
    }

    prev && prev.addEventListener('click', function () { setActive(current - 1); });
    next && next.addEventListener('click', function () { setActive(current + 1); });
    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { setActive(idx); });
    });

    var scrollTimer;
    row.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var closest = 0;
        var minDist = Infinity;
        cards.forEach(function (c, idx) {
          var dist = Math.abs(c.offsetLeft - row.offsetLeft - row.scrollLeft);
          if (dist < minDist) { minDist = dist; closest = idx; }
        });
        if (closest !== current) {
          current = closest;
          dots.forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
        }
      }, 80);
    });
  }
})();

(function () {
  // ———————— Product page interactivity ————————
  var root = document.querySelector('[data-waterboy-product]');
  if (!root) return;

  var dataEl = root.querySelector('[data-waterboy-product-data]');
  var productData = null;
  if (dataEl) {
    try { productData = JSON.parse(dataEl.textContent); } catch (e) { productData = null; }
  }

  var moneyFormat = root.dataset.moneyFormat || '${{amount}}';
  var hasShopifyProduct = !!(productData && productData.variants && productData.variants.length);

  var ppMain = root.querySelector('#ppMain');
  var canSub = root.querySelector('#canSub');
  var flavorName = root.querySelector('#flavorName');
  var currentPrice = root.querySelector('#currentPrice');
  var currentWas = root.querySelector('#currentWas');
  var atcPrice = root.querySelector('#atcPrice');
  var atcBtn = root.querySelector('#atcBtn');
  var qtyVal = root.querySelector('#qtyVal');
  var variantIdInput = root.querySelector('#variantIdInput');
  var qtyInput = root.querySelector('#qtyInput');
  var sellingPlanInput = root.querySelector('#sellingPlanInput');
  var form = root.querySelector('#atcForm');

  function formatMoney(cents) {
    if (typeof cents !== 'number') return '';
    var amount = cents / 100;
    var hasFraction = Math.round(amount * 100) % 100 !== 0;
    var formatted = hasFraction ? amount.toFixed(2) : amount.toFixed(0);
    return moneyFormat.replace(/\{\{\s*amount(_no_decimals)?\s*\}\}/g, formatted);
  }

  var state = {
    flavor: root.dataset.defaultFlavor || 'Berry',
    size: null,
    price: null,
    was: null,
    delivery: 'onetime',
    qty: 1,
    variantId: variantIdInput ? variantIdInput.value : null,
    sellingPlanId: null
  };

  function findVariant(flavorValue, sizeValue) {
    if (!hasShopifyProduct) return null;
    var flavorIdx = productData.options.flavorIndex;
    var sizeIdx = productData.options.sizeIndex;
    return productData.variants.find(function (v) {
      var okFlavor = flavorIdx === -1 || !flavorValue || v.options[flavorIdx] === flavorValue;
      var okSize = sizeIdx === -1 || !sizeValue || v.options[sizeIdx] === sizeValue;
      return okFlavor && okSize;
    });
  }

  function recalc() {
    var unitCents;

    if (hasShopifyProduct) {
      var sizeVal = state.size != null ? String(state.size) : null;
      var variant = findVariant(state.flavor, sizeVal) || productData.variants[0];
      state.variantId = variant.id;
      unitCents = variant.price;
      var wasCents = variant.compare_at_price || null;

      if (state.delivery === 'subscribe' && productData.sellingPlans && productData.sellingPlans.length) {
        var plan = productData.sellingPlans[0];
        state.sellingPlanId = plan.id;
        if (typeof plan.percentage === 'number') {
          unitCents = Math.round(unitCents * (1 - plan.percentage / 100));
        }
      } else {
        state.sellingPlanId = null;
      }

      if (variantIdInput) variantIdInput.value = variant.id;
      if (sellingPlanInput) sellingPlanInput.value = state.sellingPlanId || '';
      if (atcBtn) {
        atcBtn.disabled = !variant.available;
        if (!variant.available) {
          var priceSpan = atcBtn.querySelector('.atc-btn-price');
          atcBtn.firstChild.nodeValue = 'Sold Out ';
          if (priceSpan) priceSpan.textContent = '';
        } else {
          atcBtn.firstChild.nodeValue = 'Add to Cart ';
        }
      }

      if (currentPrice) currentPrice.textContent = formatMoney(unitCents);
      if (currentWas) {
        if (wasCents && wasCents > unitCents) {
          currentWas.textContent = formatMoney(wasCents);
          currentWas.style.display = '';
        } else {
          currentWas.style.display = 'none';
        }
      }
      if (atcPrice) atcPrice.textContent = formatMoney(unitCents * state.qty);
    } else {
      // Fallback: static placeholder pricing from data-attributes (preview mode)
      var unit = state.price;
      if (state.delivery === 'subscribe') unit = Math.round(unit * 0.9 * 100) / 100;
      var total = Math.round(unit * state.qty * 100) / 100;
      var totalStr = '$' + (Number.isInteger(total) ? total : total.toFixed(2));
      if (currentPrice) currentPrice.textContent = '$' + unit;
      if (currentWas) currentWas.textContent = '$' + state.was;
      if (atcPrice) atcPrice.textContent = totalStr;
    }

    if (qtyInput) qtyInput.value = state.qty;
  }

  // Flavor swap
  var pills = root.querySelectorAll('#flavorRow .flavor-pill');
  var thumbs = root.querySelectorAll('.pp-thumbs .pp-thumb[data-flavor]');
  function setFlavor(f) {
    state.flavor = f;
    pills.forEach(function (p) { p.classList.toggle('active', p.dataset.flavor === f); });
    thumbs.forEach(function (t) { t.classList.toggle('active', t.dataset.flavor === f); });
    if (ppMain) ppMain.dataset.flavor = f;
    if (canSub) canSub.textContent = (root.dataset.canSubPrefix || 'Recovery Mix') + ' · ' + f;
    if (flavorName) flavorName.textContent = f;
    recalc();
  }
  pills.forEach(function (p) {
    p.addEventListener('click', function () { setFlavor(p.dataset.flavor); });
  });
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { setFlavor(t.dataset.flavor); });
  });

  // Size swap
  var sizes = root.querySelectorAll('#sizeStack .size-card');
  sizes.forEach(function (s) {
    s.addEventListener('click', function () {
      sizes.forEach(function (x) { x.classList.remove('active'); });
      s.classList.add('active');
      state.size = s.dataset.size;
      state.price = +s.dataset.price;
      state.was = +s.dataset.was;
      recalc();
    });
  });
  // Pick initial size from active card
  var initialSize = root.querySelector('#sizeStack .size-card.active');
  if (initialSize) {
    state.size = initialSize.dataset.size;
    state.price = +initialSize.dataset.price;
    state.was = +initialSize.dataset.was;
  }

  // Delivery swap
  var deliveries = root.querySelectorAll('#deliveryRow .delivery-opt');
  deliveries.forEach(function (d) {
    d.addEventListener('click', function () {
      deliveries.forEach(function (x) { x.classList.remove('active'); });
      d.classList.add('active');
      state.delivery = d.dataset.delivery;
      recalc();
    });
  });

  // Quantity
  var minus = root.querySelector('#qtyMinus');
  var plus = root.querySelector('#qtyPlus');
  if (minus) minus.addEventListener('click', function () {
    if (state.qty > 1) { state.qty--; qtyVal.textContent = state.qty; recalc(); }
  });
  if (plus) plus.addEventListener('click', function () {
    if (state.qty < 10) { state.qty++; qtyVal.textContent = state.qty; recalc(); }
  });

  // ATC — submit to Shopify's cart when a product is wired, otherwise flash
  if (form && atcBtn) {
    form.addEventListener('submit', function (e) {
      if (!hasShopifyProduct) {
        e.preventDefault();
        var original = atcBtn.innerHTML;
        atcBtn.innerHTML = '✓ Added to Cart';
        atcBtn.style.background = 'var(--blue)';
        setTimeout(function () {
          atcBtn.innerHTML = original;
          atcBtn.style.background = '';
        }, 1600);
        return;
      }
      // Native form POST to /cart/add submits normally; Shopify will redirect to cart.
    });
  }

  recalc();
})();
