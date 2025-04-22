// /asphalt-driveway/script.js
import confetti from 'canvas-confetti';

(() => {
  const CSS_HREF = 'https://tools.supersoniclandscaping.com/style.css';
  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.supersonic-asphalt-driveway-calculator')
      .forEach((widget, idx) => {
        // 1) Read rates via data-attributes (landscaper sets these)
        const baseRate         = parseFloat(widget.dataset.baseRate)         || 5.50; // $/ft² @2" thickness
        const demoRate         = parseFloat(widget.dataset.demolitionRate)   || 1.50; // $/ft²
        const sealcoatRate     = parseFloat(widget.dataset.sealcoatSurcharge)|| 0.70;  // $/ft²
        const fabricRate       = parseFloat(widget.dataset.fabricSurcharge)  || 0.50;  // $/ft²
        const drainFee         = parseFloat(widget.dataset.drainFee)         || 750;   // flat
        const gradingRate      = parseFloat(widget.dataset.gradingSurcharge) || 0.75;  // $/ft²
        const minimumCharge    = parseFloat(widget.dataset.minimumCharge)    || 2500;  // $

        // 2) Thickness multipliers relative to 2"
        const thicknessMult = { '2': 1, '3': 1.5, '4': 2 };

        // 3) Build compact UI
        widget.innerHTML = `
          <div class="asdw-widget">
            <h3>Asphalt Driveway Cost Calculator</h3>

            <div class="asdw-field">
              <label for="asdw-width-${idx}">Width (ft):</label>
              <input type="number" id="asdw-width-${idx}" placeholder="e.g. 20" min="0" step="any"/>
            </div>
            <div class="asdw-field">
              <label for="asdw-length-${idx}">Length (ft):</label>
              <input type="number" id="asdw-length-${idx}" placeholder="e.g. 40" min="0" step="any"/>
            </div>
            <div class="asdw-field">
              <label for="asdw-thick-${idx}">Thickness:</label>
              <select id="asdw-thick-${idx}">
                <option value="2">2″</option>
                <option value="3">3″</option>
                <option value="4">4″</option>
              </select>
            </div>

            <div class="asdw-field">
              <label>Remove old asphalt?</label>
              <label><input type="radio" name="asdw-demo-${idx}" value="no" checked> No</label>
              <label><input type="radio" name="asdw-demo-${idx}" value="yes"> Yes (+$${demoRate}/ft²)</label>
            </div>

            <div class="asdw-field">
              <label><input type="checkbox" id="asdw-seal-${idx}"> Add Sealcoat (+$${sealcoatRate}/ft²)</label>
            </div>
            <div class="asdw-field">
              <label><input type="checkbox" id="asdw-fab-${idx}"> Geotextile Fabric (+$${fabricRate}/ft²)</label>
            </div>
            <div class="asdw-field">
              <label><input type="checkbox" id="asdw-drain-${idx}"> Trench Drain (+$${drainFee} flat)</label>
            </div>
            <div class="asdw-field">
              <label><input type="checkbox" id="asdw-grade-${idx}"> Extra Grading (+$${gradingRate}/ft²)</label>
            </div>

            <button class="button" id="asdw-calc-${idx}">Calculate</button>

            <div class="asdw-results">
              <p><strong>Total Cost:</strong> <span id="asdw-cost-${idx}">—</span></p>
            </div>

            <p class="asdw-disclaimer" style="font-size:12px">
              * Excludes permits & taxes. Contact us for a firm quote.
            </p>
            <small class="asdw-credit" style="font-size:10px">
              <a href="https://www.supersoniclandscaping.com/landscaping-calculators/asphalt-driveway-cost-calculator" target="_blank" rel="noopener">
                This calculator
              </a> by 
              <a href="https://www.supersoniclandscaping.com" target="_blank" rel="noopener">
                Supersonic Landscaping
              </a>.
            </small>
          </div>
        `;

        // 4) Calculation logic
        document.getElementById(`asdw-calc-${idx}`).addEventListener('click', () => {
          // read and validate inputs
          const w   = parseFloat(document.getElementById(`asdw-width-${idx}`).value);
          const l   = parseFloat(document.getElementById(`asdw-length-${idx}`).value);
          const t   = document.getElementById(`asdw-thick-${idx}`).value;
          const costEl = document.getElementById(`asdw-cost-${idx}`);

          if (isNaN(w)|| w<=0 || isNaN(l)|| l<=0) {
            costEl.textContent = 'Enter valid dimensions.';
            return;
          }

          // area and thickness adjust
          const area      = w * l;
          const thickMul  = thicknessMult[t] || 1;
          let total       = area * baseRate * thickMul;

          // demo
          if (document.querySelector(`input[name="asdw-demo-${idx}"]:checked`).value === 'yes') {
            total += area * demoRate;
          }

          // extras
          if (document.getElementById(`asdw-seal-${idx}`).checked) total += area * sealcoatRate;
          if (document.getElementById(`asdw-fab-${idx}`).checked)  total += area * fabricRate;
          if (document.getElementById(`asdw-drain-${idx}`).checked) total += drainFee;
          if (document.getElementById(`asdw-grade-${idx}`).checked) total += area * gradingRate;

          // minimum
          if (total < minimumCharge) total = minimumCharge;

          costEl.textContent = `$${total.toFixed(2)}`;

          // confetti!
          const rect = costEl.getBoundingClientRect();
          confetti({
            particleCount: 40,
            spread: 50,
            origin: {
              x: (rect.left + rect.width/2) / window.innerWidth,
              y: rect.top / window.innerHeight
            }
          });
        });
      });
  });
})();
