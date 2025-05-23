import confetti from 'canvas-confetti';

(function() {
  // Ensure our stylesheet is loaded
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
    var calculators = document.getElementsByClassName("supersonic-lawnmowing-calculator");

    // Define your cost brackets from the table
    const COST_BRACKETS = [
      { maxArea: 5445,  minCost: 29,  maxCost: 50  },
      { maxArea: 10890, minCost: 41,  maxCost: 65  },
      { maxArea: 21780, minCost: 55,  maxCost: 88  },
      { maxArea: 43560, minCost: 102, maxCost: 168 }
    ];

    for (var i = 0; i < calculators.length; i++) {
      var titleText    = calculators[i].getAttribute("data-title")       || "Lawn Mowing Estimate";
      var laborPriceStr = calculators[i].getAttribute("data-labor-price");
      var laborPrice    = (laborPriceStr && !isNaN(parseFloat(laborPriceStr)))
                          ? parseFloat(laborPriceStr)
                          : 65.0;

      calculators[i].innerHTML = `
        <div class="lmc-widget" itemscope itemtype="https://schema.org/WebApplication">
          <meta itemprop="name" content="${titleText}">
          <meta itemprop="description" content="This tool provides an estimated lawn mowing price based on the total area and terrain difficulty.">
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
          <p class="lmc-estimate-note" style="font-style: italic; font-size: 0.9em; color: #555; text-align: left; margin-bottom: 18px;">
            This is an estimated quote; final pricing may vary based on project specifics.<br>
            <strong>Contact us for a final quote.</strong>
          </p>
          <div class="lmc-field">
            <label>Total Area (sq ft):</label>
            <input type="number" id="lmc-area-${i}" placeholder="Enter total area">
          </div>
          <div class="lmc-field">
            <label>Terrain Type:</label>
            <select id="lmc-terrain-${i}">
              <option value="1.0">Flat</option>
              <option value="1.25">Slightly Hilly</option>
              <option value="1.5">Moderately Hilly</option>
              <option value="1.75">Very Hilly</option>
              <option value="2.0">Steep/Complex</option>
            </select>
          </div>
          <button id="lmc-calc-${i}" class="button">Calculate</button>
          <div id="lmc-results-${i}" class="lmc-results">
            <p><strong>Estimated Mowing Time:</strong> <span id="lmc-time-${i}">—</span></p>
            <p><strong>Final Cost:</strong> <span id="lmc-cost-${i}">—</span></p>
          </div>
          <p class="lmc-disclaimer" style="font-size:12px;">*Note: This estimate includes only labor costs.</p>
          <small style="font-size: 10px;">
  <a href="https://www.supersoniclandscaping.com/landscaping-calculators/lawn-mowing-cost" target="_blank" rel="noopener">
    This calculator
  </a> is provided by 
  <a href="https://www.supersoniclandscaping.com" target="_blank" rel="noopener">
    Supersonic Landscaping
  </a>.
</small>
        </div>
      `;

      (function(index) {
        var calcButton = document.getElementById("lmc-calc-" + index);
        calcButton.addEventListener("click", function() {
          var area          = parseFloat(document.getElementById("lmc-area-" + index).value);
          var terrainFactor = parseFloat(document.getElementById("lmc-terrain-" + index).value);
          var timeEl        = document.getElementById("lmc-time-" + index);
          var costEl        = document.getElementById("lmc-cost-" + index);

          if (isNaN(area) || area <= 0) {
            timeEl.innerText = "Please enter a valid area.";
            costEl.innerText = "";
            return;
          }

          // 1. Find the matching cost bracket
          var bracket = COST_BRACKETS.find(b => area <= b.maxArea)
                     || COST_BRACKETS[COST_BRACKETS.length - 1];

          // 2. Compute the midpoint of the cost range
          var baseCost = (bracket.minCost + bracket.maxCost) / 2;

          // 3. Apply terrain factor
          var finalCost = baseCost * terrainFactor;

          // 4. Derive time from cost & hourly rate
          var finalTime = finalCost / laborPrice;

          timeEl.innerText = finalTime.toFixed(2) + " hours";
          costEl.innerText = "$" + finalCost.toFixed(2);

          // Confetti celebration
          var rect = calcButton.getBoundingClientRect();
          var originX = (rect.left + rect.width / 2) / window.innerWidth;
          var originY = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({ particleCount: 100, spread: 70, origin: { x: originX, y: originY } });
        });
      })(i);
    }
  });
})();
