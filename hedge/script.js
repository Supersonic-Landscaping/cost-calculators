import confetti from 'canvas-confetti';

(function() {
  // Load the shared stylesheet from /public/style.css if not already loaded.
  if (!document.querySelector('link[href="https://tools.supersoniclandscaping.com/style.css"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://tools.supersoniclandscaping.com/style.css";
    document.head.appendChild(link);
  }

  document.addEventListener("DOMContentLoaded", function() {
    var calculators = document.getElementsByClassName("supersonic-hedgetrimming-calculator");

    for (var i = 0; i < calculators.length; i++) {
      // Custom title, or default if not provided.
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      // Base fee for the job (minimum charge), default $100.
      var baseFeeStr = calculators[i].getAttribute("data-base-fee");
      var baseFee = (baseFeeStr && !isNaN(parseFloat(baseFeeStr))) ? parseFloat(baseFeeStr) : 100;
      
      // Equipment surcharge, default $50.
      var equipmentSurchargeStr = calculators[i].getAttribute("data-equipment-surcharge");
      var equipmentSurcharge = (equipmentSurchargeStr && !isNaN(parseFloat(equipmentSurchargeStr))) ? parseFloat(equipmentSurchargeStr) : 50;
      
      // Inject the widget HTML with embedded schema markup.
      calculators[i].innerHTML = `
        <div class="htc-widget" itemscope itemtype="https://schema.org/WebApplication">
          <meta itemprop="name" content="${titleText}">
          <meta itemprop="description" content="This tool provides an estimated hedge trimming quote based on hedge dimensions and labor/equipment costs. Note: disposal fees are not included.">
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
            This is an estimated quote; final pricing may vary based on project specifics.<br>
            <strong>Note:</strong> Disposal fees are not included.
          </p>
  
          <div class="htc-field">
            <label>Hedge Length (ft):</label>
            <input type="number" id="htc-length-${i}" placeholder="Enter hedge length">
          </div>
          <div class="htc-field">
            <label>Hedge Height (ft):</label>
            <input type="number" id="htc-height-${i}" placeholder="Enter hedge height">
          </div>
          <div class="htc-field">
            <label>Hedge Width (ft):</label>
            <input type="number" id="htc-width-${i}" placeholder="Enter hedge width">
          </div>
          <button id="htc-calc-${i}" class="button">Calculate</button>
          <div id="htc-results-${i}" class="htc-results">
            <p><strong>Estimated Price:</strong> <span id="htc-price-${i}">—</span></p>
          </div>
          <p class="htc-disclaimer" style="font-size:12px;">*This estimate includes labor and equipment costs. Disposal fees are not included.</p>
          <p class="htc-credit">Tool by <a href="https://www.supersoniclandscaping.com" target="_blank">Supersonic Landscaping</a></p>
        </div>
      `;
  
// Attach the calculation event listener.
(function(index) {
    var calcButton = document.getElementById("htc-calc-" + index);
    calcButton.addEventListener("click", function() {
      var length = parseFloat(document.getElementById("htc-length-" + index).value);
      var height = parseFloat(document.getElementById("htc-height-" + index).value);
      var width  = parseFloat(document.getElementById("htc-width-" + index).value);
      var priceEl = document.getElementById("htc-price-" + index);

      // Validate all inputs.
      if (isNaN(length) || isNaN(height) || isNaN(width) || length <= 0 || height <= 0 || width <= 0) {
        priceEl.innerText = "Please enter valid dimensions for length, height, and width.";
        return;
      }

      // Determine the per linear foot rate based on hedge height:
      // - For hedges below 6 ft: $3.00 per linear foot.
      // - For hedges 6 ft or taller: $5.00 per linear foot.
      var ratePerFoot = (height >= 6) ? 5.00 : 3.00;

      // Calculate initial cost based on labor (length * rate).
      var cost = length * ratePerFoot;

      // Apply the minimum base fee if the labor cost is lower.
      if (cost < baseFee) {
        cost = baseFee;
      }

      // Always add the equipment surcharge.
      cost += equipmentSurcharge;

      // Adjust cost for unusually thick hedges:
      // For each additional foot above 4 ft in width, add 10%.
      if (width > 4) {
        var extra = width - 4;
        var multiplier = 1 + (0.10 * extra);
        cost = cost * multiplier;
      }

      // Display the estimated price.
      priceEl.innerText = "$" + cost.toFixed(2);

      // Calculate the button's center coordinates for confetti origin.
      var rect = calcButton.getBoundingClientRect();
      var originX = (rect.left + rect.width / 2) / window.innerWidth;
      var originY = (rect.top + rect.height / 2) / window.innerHeight;

      // Launch confetti from the button's position.
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