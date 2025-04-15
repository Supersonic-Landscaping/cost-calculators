import confetti from 'canvas-confetti';

(function() {
  // Ensure the absolute stylesheet URL is used.
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

  document.addEventListener("DOMContentLoaded", function() {
    var calculators = document.getElementsByClassName("supersonic-hedgetrimming-calculator");

    for (var i = 0; i < calculators.length; i++) {
      // Get custom title or default.
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      // Set a minimum service fee.
      var minFee = 75;

      // Inject widget HTML.
      // Note: We now only ask for Hedge Length and Hedge Height.
      // A disposal checkbox is added to optionally include a fixed fee.
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
          <div class="htc-field">
            <input type="checkbox" id="htc-disposal-${i}">
            <label for="htc-disposal-${i}">Include debris disposal (add \$50)</label>
          </div>
          <button id="htc-calc-${i}" class="button">Calculate</button>
          <div id="htc-results-${i}" class="htc-results">
            <p><strong>Estimated Price:</strong> <span id="htc-price-${i}">—</span></p>
          </div>
          <p class="htc-disclaimer" style="font-size:12px;">*This estimate is for basic trimming. Additional services may incur extra fees.</p>
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
          // Check if disposal checkbox is ticked.
          var disposalChecked = document.getElementById("htc-disposal-" + index).checked;
          var disposalFee = 50;
          
          // Validate inputs.
          if (isNaN(length) || length <= 0 || isNaN(height) || height <= 0) {
            priceEl.innerText = "Please enter valid hedge length and height.";
            return;
          }
          
          // Determine rate per foot based on hedge height.
          // For hedges under 6 ft tall: use ~$3.25/ft; for hedges 6 ft or taller (up to 12 ft): ~$4.50/ft.
          var ratePerFoot = (height >= 6) ? 4.50 : 3.25;
          var baseCost = length * ratePerFoot;
          
          // If disposal is selected, add the fee.
          if (disposalChecked) {
            baseCost += disposalFee;
          }
          
          // Enforce a minimum service fee.
          if (baseCost < minFee) {
            baseCost = minFee;
          }
  
          priceEl.innerText = "$" + baseCost.toFixed(2);
  
          // Calculate the calculate-button's center as confetti origin.
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



