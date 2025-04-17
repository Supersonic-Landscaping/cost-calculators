// fence-calculator/script.js
// Supersonic Landscaping — Fence Cost Calculator Widget
// -----------------------------------------------------
// Drop the compiled bundle with:
// <div class="supersonic-fence-calculator"
//      data-title="Fence Cost Estimator"
//      data-basic-4x4="57" data-basic-6x6="60"
//      data-full-4x4="65"  data-full-6x6="68"
//      data-min-charge="3000"></div>
// <script src="https://tools.supersoniclandscaping.com/fence-calculator/fence-calculator.js" crossorigin="anonymous"></script>
// -----------------------------------------------------

import confetti from 'canvas-confetti';

(function () {
  /* --------------------------------------------------
   * 1. Ensure shared stylesheet is present
   * -------------------------------------------------- */
  var existingLink = document.querySelector('link[href$="style.css"]');
  if (existingLink) {
    if (existingLink.href !== 'https://tools.supersoniclandscaping.com/style.css') {
      existingLink.href = 'https://tools.supersoniclandscaping.com/style.css';
    }
  } else {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://tools.supersoniclandscaping.com/style.css';
    document.head.appendChild(link);
  }

  /* --------------------------------------------------
   * 2. Default configuration
   * -------------------------------------------------- */
  const DEFAULT_RATES = {
    basic: { '4x4': 57, '6x6': 60 },
    full:  { '4x4': 65, '6x6': 68 }
  };
  const DEFAULT_MIN_CHARGE = 3000;

  /* --------------------------------------------------
   * 3. Initialise the widget(s) once DOM is ready
   * -------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var calculators = document.getElementsByClassName('supersonic-fence-calculator');

    for (var i = 0; i < calculators.length; i++) {
      /* 3a. Read data-* overrides */
      var el = calculators[i];
      var rates = {
        basic: {
          '4x4': parseFloat(el.getAttribute('data-basic-4x4')) || DEFAULT_RATES.basic['4x4'],
          '6x6': parseFloat(el.getAttribute('data-basic-6x6')) || DEFAULT_RATES.basic['6x6']
        },
        full: {
          '4x4': parseFloat(el.getAttribute('data-full-4x4'))  || DEFAULT_RATES.full['4x4'],
          '6x6': parseFloat(el.getAttribute('data-full-6x6'))  || DEFAULT_RATES.full['6x6']
        }
      };
      var MIN_CHARGE = parseFloat(el.getAttribute('data-min-charge')) || DEFAULT_MIN_CHARGE;
      var titleText  = el.getAttribute('data-title') || 'Fence Cost Estimator';

      /* 3b. Unique IDs per instance */
      var styleName      = 'fence-style-' + i;
      var postName       = 'fence-post-'  + i;
      var feetInputId    = 'fence-feet-'  + i;
      var btnId          = 'fence-btn-'   + i;
      var resultWrapId   = 'fence-res-'   + i;

      /* 3c. Build widget HTML */
      el.innerHTML = `
        <div class="fence-widget" itemscope itemtype="https://schema.org/WebApplication">
          <meta itemprop="name" content="${titleText}">
          <meta itemprop="description" content="Estimate privacy‑fence costs based on style, post size, and length.">
          <div itemprop="creator" itemscope itemtype="https://schema.org/Organization">
            <meta itemprop="name" content="Supersonic Landscaping">
            <meta itemprop="url"  content="https://www.supersoniclandscaping.com/">
          </div>
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="price" content="0">
            <meta itemprop="priceCurrency" content="USD">
          </div>

          <h3>${titleText}</h3>

          <div class="fence-field" itemscope itemtype="https://schema.org/Thing">
            <label>Fence Style:</label>
            <label><input type="radio" name="${styleName}" value="basic" checked><span>Basic Privacy</span></label>
            <label><input type="radio" name="${styleName}" value="full"><span>Full / Semi‑Privacy</span></label>
          </div>

          <div class="fence-field">
            <label>Post Size:</label>
            <label><input type="radio" name="${postName}" value="4x4" checked><span>4×4</span></label>
            <label><input type="radio" name="${postName}" value="6x6"><span>6×6</span></label>
          </div>

          <div class="fence-field">
            <label for="${feetInputId}">How many linear feet?</label>
            <input type="number" id="${feetInputId}" placeholder="e.g. 120" min="1">
          </div>

          <button id="${btnId}" class="button">Calculate</button>

          <div id="${resultWrapId}" class="fence-results" style="display:none;">
            <p><strong>Estimated Cost:</strong> <span class="fence-cost">—</span></p>
          </div>

          <p class="fence-disclaimer" style="font-size:12px;">* $${MIN_CHARGE.toLocaleString()} minimum charge. Gates, double gates, and old fence removal are extra. <strong>Contact us for a final quote.</strong></p>
          <small class="fence-credit">
            <a href="https://www.supersoniclandscaping.com/landscaping-calculators/fencing-cost-calculator" target="_blank" rel="noopener">This calculator</a> is provided by 
            <a href="https://www.supersoniclandscaping.com" target="_blank" rel="noopener">Supersonic Landscaping</a>.
          </small>
        </div>`;

      /* 3d. Wire up calculation logic */
      (function (idx) {
        var btn   = document.getElementById(btnId);
        var feet  = document.getElementById(feetInputId);
        var resEl = document.querySelector('#' + resultWrapId + ' .fence-cost');
        var wrap  = document.getElementById(resultWrapId);

        btn.addEventListener('click', function () {
          var feetVal = parseFloat(feet.value);
          if (isNaN(feetVal) || feetVal <= 0) {
            resEl.textContent = 'Please enter a valid length.';
            wrap.style.display = 'block';
            return;
          }

          var style = document.querySelector('input[name="' + styleName + '"]:checked').value;
          var post  = document.querySelector('input[name="' + postName  + '"]:checked').value;

          var cost = feetVal * rates[style][post];
          if (cost < MIN_CHARGE) cost = MIN_CHARGE;

          resEl.textContent = '$' + cost.toLocaleString() + '*';
          wrap.style.display = 'block';

          // Confetti celebration — burst from button centre
          var rect = btn.getBoundingClientRect();
          var originX = (rect.left + rect.width  / 2) / window.innerWidth;
          var originY = (rect.top  + rect.height / 2) / window.innerHeight;
          confetti({ particleCount: 80, spread: 60, origin: { x: originX, y: originY } });
        });
      })(i);
    }
  });
})();
