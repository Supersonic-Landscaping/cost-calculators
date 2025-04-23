// Folder: /concrete-demolition/script.js
import confetti from 'canvas-confetti';

(() => {
  // 1) Load shared stylesheet if missing
  const CSS_HREF = 'https://tools.supersoniclandscaping.com/style.css';
  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  // 2) Widget initialization on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.getElementsByClassName('supersonic-demolition-calculator');
    Array.from(widgets).forEach((widget, idx) => {
      // 3) Read customizable data-attributes (with defaults)
      const laborRate        = parseFloat(widget.getAttribute('data-labor-rate'))        || 4.5;
      const rebarSurcharge   = parseFloat(widget.getAttribute('data-rebar-surcharge'))   || 1.5;
      const haulCost         = parseFloat(widget.getAttribute('data-haul-cost'))         || 1.25;
      const accessMultiplier = parseFloat(widget.getAttribute('data-access-multiplier')) || 1.25;
      const minimumCharge    = parseFloat(widget.getAttribute('data-minimum-charge'))    || 600;

      // 4) Define thickness & method multipliers
      const thicknessMult = { '4-6"': 1, '6-8"': 1.2, '8+"': 1.4 };
      const methodMult    = { 'Manual': 1, 'Mechanical': 0.8 };

      // 5) Build the widget UI
      widget.innerHTML = `
        <div class="cdm-widget">
          <h3>Concrete Demolition Cost Calculator</h3>

          <div class="cdm-field">
            <label for="cdm-area-${idx}">Total Area (sq ft):</label>
            <input type="number" id="cdm-area-${idx}" placeholder="e.g. 500" />
          </div>

          <div class="cdm-field">
            <label for="cdm-thickness-${idx}">Slab Thickness:</label>
            <select id="cdm-thickness-${idx}">
              <option value='4-6"'>4"–6"</option>
              <option value='6-8"'>6"–8"</option>
              <option value='8+"'>8"+</option>
            </select>
          </div>

          <div class="cdm-field">
            <label for="cdm-reinforce-${idx}">Reinforcement:</label>
            <select id="cdm-reinforce-${idx}">
              <option value="None">None</option>
              <option value="Reinforced">Mesh Wire or Rebar</option>
            </select>
          </div>

          <div class="cdm-field">
            <label for="cdm-method-${idx}">Demolition Method:</label>
            <select id="cdm-method-${idx}">
              <option value="Manual">Manual</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div class="cdm-field">
            <label for="cdm-access-${idx}">Site Access:</label>
            <select id="cdm-access-${idx}">
              <option value="Easy">Easy Access</option>
              <option value="Limited">Limited Access</option>
            </select>
          </div>

          <button class="button" id="cdm-calc-${idx}">Calculate</button>

          <div class="cdm-results">
            <p><strong>Total Cost:</strong> <span id="cdm-cost-${idx}">—</span></p>
          </div>

          <p class="cdm-disclaimer" style="font-size: 12px">*This estimate does not include permit fees or taxes. Contact us for a final quote.*</p>
<small style="font-size: 10px;">
  <a href="https://www.supersoniclandscaping.com/landscaping-calculators/concrete-demolition-cost-calculator" target="_blank" rel="noopener">
    This calculator
  </a> is provided by 
  <a href="https://www.supersoniclandscaping.com" target="_blank" rel="noopener">
    Supersonic Landscaping
  </a>.
</small>

        </div>
      `;

      // 6) Calculation logic
      const btn = document.getElementById(`cdm-calc-${idx}`);
      btn.addEventListener('click', () => {
        const area       = parseFloat(document.getElementById(`cdm-area-${idx}`).value);
        const thickness  = document.getElementById(`cdm-thickness-${idx}`).value;
        const reinforce  = document.getElementById(`cdm-reinforce-${idx}`).value;
        const method     = document.getElementById(`cdm-method-${idx}`).value;
        const access     = document.getElementById(`cdm-access-${idx}`).value;
        const costEl     = document.getElementById(`cdm-cost-${idx}`);

        if (isNaN(area) || area <= 0) {
          costEl.innerText = 'Please enter a valid area.';
          return;
        }

        // Base cost (area × labor × thickness × method)
        let total = area * laborRate * (thicknessMult[thickness] || 1) * (methodMult[method] || 1);

        // Reinforcement surcharge
        if (reinforce === 'Reinforced') {
          total += area * rebarSurcharge;
        }

        // Hauling & disposal
        total += area * haulCost;

        // Site access adjustment
        if (access === 'Limited') {
          total *= accessMultiplier;
        }

        // Minimum charge enforcement
        if (total < minimumCharge) {
          total = minimumCharge;
        }

        // Display
        costEl.innerText = `$${total.toFixed(2)}`;

        // Confetti!
        const rect = btn.getBoundingClientRect();
        confetti({ particleCount: 50, spread: 60, origin: { x: (rect.left+rect.width/2)/window.innerWidth, y: (rect.top+rect.height/2)/window.innerHeight } });
      });
    });
  });
})();

