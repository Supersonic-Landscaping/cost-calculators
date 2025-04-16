import confetti from 'canvas-confetti';

(async function() {
  // Check if a <link> ending with "style.css" exists and ensure it uses the absolute URL.
  var existingLink = document.querySelector('link[href$="style.css"]');
  if (existingLink) {
    if (existingLink.href !== "https://tools.supersoniclandscaping.com/style.css") {
      existingLink.href = "https://tools.supersoniclandscaping.com/style.css";
    }
  } else {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://tools.supersoniclandscaping.com/style.css";
    document.head.appendChild(link);
  }

  // Load the manifest (if available) to get hashed filenames for CSS if needed
  let manifest = null;
  try {
    const resp = await fetch('https://tools.supersoniclandscaping.com/manifest.json');
    if (resp.ok) {
      manifest = await resp.json();
    }
  } catch (err) {
    console.warn('Manifest fetch error, proceeding with default CSS URL:', err);
  }

  document.addEventListener("DOMContentLoaded", function() {
    var calculators = document.getElementsByClassName("supersonic-hedgetrimming-calculator");

    for (var i = 0; i < calculators.length; i++) {
      // Get custom title or default.
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      // Get the minimum base fee.
      var baseFeeStr = calculators[i].getAttribute("data-base-fee");
      var baseFee = (baseFeeStr && !isNaN(parseFloat(baseFeeStr))) ? parseFloat(baseFeeStr) : 100;
      
      // Equipment surcharge is still retrieved as before.
      var equipmentSurchargeStr = calculators[i].getAttribute("data-equipment-surcharge");
      var equipmentSurcharge = (equipmentSurchargeStr && !isNaN(parseFloat(equipmentSurchargeStr))) ? parseFloat(equipmentSurchargeStr) : 50;

      // NEW: Get the disposal fee from data-disposal-fee attribute; default to $50 if not provided.
      var disposalFeeAttr = calculators[i].getAttribute("data-disposal-fee");
      var disposalFee = (disposalFeeAttr && !isNaN(parseFloat(disposalFeeAttr))) ? parseFloat(disposalFeeAttr) : 50;
      
      // Inject the widget HTML with a disposal checkbox.
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
            <label for="htc-disposal-${i}">Include debris disposal (add $${disposalFee})</label>
          </div>
          <button id="htc-calc-${i}" class="button">Calculate</button>
          <div id="htc-results-${i}" class="htc-results">
            <p><strong>Estimated Price:</strong> <span id="htc-price-${i}">—</span></p>
          </div>
          <p class="htc-disclaimer" style="font-size:12px;">*This estimate covers basic hedge trimming costs only.</p>
          <p class="htc-credit">Tool by <a href="https://www.supersoniclandscaping.com" target="_blank">Supersonic Landscaping</a></p>
        </div>
      `;
  
      // Attach the calculation event listener.
      (function(index) {
        var calcButton = document.getElementById("htc-calc-" + index);
        calcButton.addEventListener("click", function() {
          var length = parseFloat(document.getElementById("htc-length-" + index).value);
          var height = parseFloat(document.getElementById("htc-height-" + index).value);
          var priceEl = document.getElementById("htc-price-" + index);
          var disposalChecked = document.getElementById("htc-disposal-" + index).checked;
  
          if (isNaN(length) || length <= 0 || isNaN(height) || height <= 0) {
            priceEl.innerText = "Please enter valid hedge length and height.";
            return;
          }
          
          // Determine the rate per foot:
          // - Use $3.25/ft for hedges under 6 ft tall.
          // - Use $4.50/ft for hedges 6 ft or taller.
          var ratePerFoot = (height >= 6) ? 4.50 : 3.25;
          var cost = length * ratePerFoot;
  
          // Add disposal fee if the checkbox is checked.
          if (disposalChecked) {
            cost += disposalFee;
          }
  
          // Enforce a minimum service fee of $75.
          if (cost < 75) {
            cost = 75;
          }
          
          priceEl.innerText = "$" + cost.toFixed(2);
  
          // Launch confetti from the center of the Calculate button.
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


