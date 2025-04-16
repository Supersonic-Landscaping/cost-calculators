import confetti from 'canvas-confetti';

(async function() {
  // Dynamically load manifest.json from the same origin as the script.
  let manifest = {};
  try {
    const response = await fetch('https://tools.supersoniclandscaping.com/manifest.json');
    manifest = await response.json();
  } catch (err) {
    console.error('Error loading manifest:', err);
  }

  // Determine the CSS asset URL from manifest.
  // The key will be relative to the project root; adjust if needed.
  // For example, if style.css is imported as 'src/assets/style.css'
  const styleAsset = manifest['src/assets/style.css'];
  const cssUrl = styleAsset ? `https://tools.supersoniclandscaping.com/${styleAsset}` : 'https://tools.supersoniclandscaping.com/style.css';

  // Check if a link with our CSS is already present; if not, add it.
  if (!document.querySelector(`link[href^="https://tools.supersoniclandscaping.com/"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  document.addEventListener("DOMContentLoaded", function() {
    var calculators = document.getElementsByClassName("supersonic-hedgetrimming-calculator");
    for (var i = 0; i < calculators.length; i++) {
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      var baseFeeStr = calculators[i].getAttribute("data-base-fee");
      var baseFee = (baseFeeStr && !isNaN(parseFloat(baseFeeStr))) ? parseFloat(baseFeeStr) : 100;
      // Inject widget HTML, including a disposal checkbox
      calculators[i].innerHTML = `
        <div class="htc-widget" itemscope itemtype="https://schema.org/WebApplication">
          <meta itemprop="name" content="${titleText}">
          <meta itemprop="description" content="Estimate your hedge trimming cost based on hedge length and height.">
          <meta itemprop="applicationCategory" content="UtilitiesApplication">
          <meta itemprop="operatingSystem" content="All">
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="price" content="0">
            <meta itemprop="priceCurrency" content="USD">
          </div>
          <div itemprop="creator" itemscope itemtype="https://schema.org/Organization">
            <meta itemprop="name" content="Supersonic Landscaping">
            <meta itemprop="url" content="https://www.supersoniclandscaping.com/">
          </div>
  
          <h3>${titleText}</h3>
          <p class="htc-estimate-note" style="font-style: italic; font-size: 0.9em; color: #555; text-align: left; margin-bottom: 18px;">
            Enter your hedge dimensions to estimate your trimming cost.
          </p>
          <div class="htc-field">
            <label>Hedge Length (ft):</label>
            <input type="number" id="htc-length-${i}" placeholder="e.g., 50">
          </div>
          <div class="htc-field">
            <label>Hedge Height (ft):</label>
            <input type="number" id="htc-height-${i}" placeholder="e.g., 5 or 8">
          </div>
          <div class="htc-field inline-disposal">
            <input type="checkbox" id="htc-disposal-${i}">
            <label for="htc-disposal-${i}">Include debris disposal (add $50)</label>
          </div>
          <button id="htc-calc-${i}" class="button">Calculate</button>
          <div id="htc-results-${i}" class="htc-results">
            <p><strong>Estimated Price:</strong> <span id="htc-price-${i}">—</span></p>
          </div>
          <p class="htc-disclaimer" style="font-size:12px;">*This estimate covers basic hedge trimming costs only.</p>
          <p class="htc-credit">Tool by <a href="https://www.supersoniclandscaping.com" target="_blank">Supersonic Landscaping</a></p>
        </div>
      `;
  
      (function(index) {
        var calcButton = document.getElementById("htc-calc-" + index);
        calcButton.addEventListener("click", function() {
          var length = parseFloat(document.getElementById("htc-length-" + index).value);
          var height = parseFloat(document.getElementById("htc-height-" + index).value);
          var priceEl = document.getElementById("htc-price-" + index);
          var disposalChecked = document.getElementById("htc-disposal-" + index).checked;
          var disposalFee = 50;
  
          if (isNaN(length) || length <= 0 || isNaN(height) || height <= 0) {
            priceEl.innerText = "Please enter valid hedge length and height.";
            return;
          }
  
          var ratePerFoot = (height >= 6) ? 4.50 : 3.25;
          var cost = length * ratePerFoot;
  
          if (disposalChecked) {
            cost += disposalFee;
          }
  
          if (cost < 75) {
            cost = 75;
          }
  
          priceEl.innerText = "$" + cost.toFixed(2);
  
          var rect = calcButton.getBoundingClientRect();
          var originX = (rect.left + rect.width / 2) / window.innerWidth;
          var originY = (rect.top + rect.height / 2) / window.innerHeight;
  
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: originX, y: originY }
          });
        });
      })(i);
    }
  });
})();

