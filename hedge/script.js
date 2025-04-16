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
      // Retrieve parameters from data attributes.
      var titleText = calculators[i].getAttribute("data-title") || "Hedge Trimming Estimate";
      var baseFeeStr = calculators[i].getAttribute("data-base-fee");
      var baseFee = (baseFeeStr && !isNaN(parseFloat(baseFeeStr))) ? parseFloat(baseFeeStr) : 100;
      var equipmentSurchargeStr = calculators[i].getAttribute("data-equipment-surcharge");
      var equipmentSurcharge = (equipmentSurchargeStr && !isNaN(parseFloat(equipmentSurchargeStr))) ? parseFloat(equipmentSurchargeStr) : 50;
      // NEW: Read the disposal fee, defaulting to $50.
      var disposalFeeStr = calculators[i].getAttribute("data-disposal-fee");
      var disposalFee = (disposalFeeStr && !isNaN(parseFloat(disposalFeeStr))) ? parseFloat(disposalFeeStr) : 50;

      // Inject the widget HTML.
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
            This is an estimated quote; final pricing may vary.
          </p>
  
          <div class="htc-field">
            <label>Hedge Length (ft):</label>
            <input type="number" id="htc-length-${i}" placeholder="Enter hedge length">
          </div>
          <div class="htc-field">
            <label>Hedge Height (ft):</label>
            <input type="number" id="htc-height-${i}" placeholder="Enter hedge height">
          </div>
          <div class="htc-field inline-disposal">
            <input type="checkbox" id="htc-disposal-${i}">
            <label for="htc-disposal-${i}">Include debris disposal (add $${disposalFee})</label>
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
          var priceEl = document.getElementById("htc-price-" + index);
          var disposalChecked = document.getElementById("htc-disposal-" + index).checked;
  
          if (isNaN(length) || length <= 0 || isNaN(height) || height <= 0) {
            priceEl.innerText = "Please enter valid hedge length and height.";
            return;
          }
  
          // Rate per foot: $3.25 for hedges under 6 ft; $4.50 for hedges 6 ft or taller.
          var ratePerFoot = (height >= 6) ? 4.50 : 3.25;
          var cost = length * ratePerFoot;
  
          // Add disposal fee if selected.
          if (disposalChecked) {
            cost += disposalFee;
          }
  
          if (cost < baseFee) {
            cost = baseFee;
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


