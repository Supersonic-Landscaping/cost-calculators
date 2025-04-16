import confetti from 'canvas-confetti';

(async function() {
  // Try to load the Vite manifest from the root.
  let manifest = null;
  try {
    const resp = await fetch('https://tools.supersoniclandscaping.com/manifest.json');
    if (resp.ok) {
      manifest = await resp.json();
    } else {
      console.warn('Manifest not found; using fallback CSS URL.');
    }
  } catch (err) {
    console.warn('Error fetching manifest:', err, 'Falling back to default CSS URL.');
  }

  // Determine the CSS URL.
  // If manifest exists and contains the key for your CSS file (adjust the key if needed),
  // use that path; otherwise, fall back to the absolute URL.
  // Here we assume that your CSS was imported from 'src/assets/style.css'.
  const cssKey = 'src/assets/style.css';
  let cssUrl = "https://tools.supersoniclandscaping.com/style.css"; // fallback
  if (manifest && manifest[cssKey] && manifest[cssKey].file) {
    cssUrl = `https://tools.supersoniclandscaping.com/${manifest[cssKey].file}`;
  }

  // Ensure the link element for the stylesheet is added.
  var existingLink = document.querySelector(`link[href^="https://tools.supersoniclandscaping.com/"]`);
  if (existingLink) {
    existingLink.href = cssUrl;
  } else {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  document.addEventListener("DOMContentLoaded", function() {
    var calculators = document.getElementsByClassName("supersonic-hedgetrimming-calculator");

    for (var i = 0; i < calculators.length; i++) {
      // Get custom title or default.
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      var baseFeeStr = calculators[i].getAttribute("data-base-fee");
      var baseFee = (baseFeeStr && !isNaN(parseFloat(baseFeeStr))) ? parseFloat(baseFeeStr) : 100;
      
      // Inject the widget HTML including a disposal fee checkbox.
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
          
          // Rate per foot: $3.25 for hedges under 6 ft; $4.50 for hedges 6 ft or taller.
          var ratePerFoot = (height >= 6) ? 4.50 : 3.25;
          var cost = length * ratePerFoot;
          
          if (disposalChecked) {
            cost += disposalFee;
          }
          
          if (cost < 75) {
            cost = 75;
          }
          
          priceEl.innerText = "$" + cost.toFixed(2);
          
          // Confetti: launch from the center of the calculate button.
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


