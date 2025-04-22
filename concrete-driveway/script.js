// File: /concrete-driveway/script.js
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
    const widgets = document.getElementsByClassName('supersonic-driveway-calculator');
    Array.from(widgets).forEach((widget, idx) => {
      // Read your data‑attributes or use defaults
      const baseRate         = parseFloat(widget.dataset.baseRate)         || 8.00;
      const demoRate         = parseFloat(widget.dataset.demolitionRate)   || 2.00;
      const coloredSurcharge = parseFloat(widget.dataset.coloredSurcharge) || 3.00;
      const exposedSurcharge = parseFloat(widget.dataset.exposedSurcharge) || 4.00;
      const stampedSurcharge = parseFloat(widget.dataset.stampedSurcharge) || 8.00;
      const rebarSurcharge   = parseFloat(widget.dataset.rebarSurcharge)   || 2.00;
      const drainFee         = parseFloat(widget.dataset.drainFee)         || 1000;
      const gradingSurcharge = parseFloat(widget.dataset.gradingSurcharge) || 1.00;
      const minimumCharge    = parseFloat(widget.dataset.minimumCharge)    || 3000;

      // Build a super-compact UI: just total area + your existing options
      widget.innerHTML = `
        <div class="sdw-widget">
          <h3>Concrete Driveway Cost Calculator</h3>
          
          <div class="sdw-field">
            <label for="sdw-area-${idx}">Total Area (sq ft):</label>
            <input type="number" id="sdw-area-${idx}" placeholder="e.g. 600" min="0" step="any"/>
          </div>

          <div class="sdw-field">
            <label>Demo existing slab?</label>
            <label><input type="radio" name="sdw-demo-${idx}" value="no" checked/> No</label>
            <label><input type="radio" name="sdw-demo-${idx}" value="yes"/> Yes (+$${demoRate}/sq ft)</label>
          </div>

          <div class="sdw-field">
            <label>Finish Type:</label>
            <select id="sdw-finish-${idx}">
              <option value="base">Standard Broom (base rate)</option>
              <option value="colored">Colored (+$${coloredSurcharge}/sq ft)</option>
              <option value="exposed">Exposed Agg. (+$${exposedSurcharge}/sq ft)</option>
              <option value="stamped">Stamped (+$${stampedSurcharge}/sq ft)</option>
            </select>
          </div>

          <div class="sdw-field">
            <label><input type="checkbox" id="sdw-rebar-${idx}"/> Add Rebar (+$${rebarSurcharge}/sq ft)</label>
          </div>
          <div class="sdw-field">
            <label><input type="checkbox" id="sdw-drain-${idx}"/> Include Trench Drain (+$${drainFee} flat)</label>
          </div>
          <div class="sdw-field">
            <label><input type="checkbox" id="sdw-grade-${idx}"/> Extra Grading (+$${gradingSurcharge}/sq ft)</label>
          </div>

          <button class="button" id="sdw-calc-${idx}">Calculate</button>

          <div class="sdw-results">
            <p><strong>Total Cost:</strong> <span id="sdw-cost-${idx}">—</span></p>
          </div>
          
          <p class="sdw-disclaimer" style="font-size:12px">
            * Excludes permits & taxes. Contact us for a firm quote.
          </p>
          <small style="font-size: 10px;">
  <a href="https://www.supersoniclandscaping.com/landscaping-calculators/concrete-driveway" target="_blank" rel="noopener">
    This calculator
  </a> is provided by 
  <a href="https://www.supersoniclandscaping.com" target="_blank" rel="noopener">
    Supersonic Landscaping
  </a>.
</small>
        </div>
      `;

      // Calculation logic
      document.getElementById(`sdw-calc-${idx}`).addEventListener('click', () => {
        const area = parseFloat(document.getElementById(`sdw-area-${idx}`).value);
        const costEl = document.getElementById(`sdw-cost-${idx}`);
        if (isNaN(area) || area <= 0) {
          costEl.innerText = 'Enter valid area.';
          return;
        }

        let total = area * baseRate;

        // Demo
        if (document.querySelector(`input[name="sdw-demo-${idx}"]:checked`).value === 'yes') {
          total += area * demoRate;
        }

        // Finish surcharge
        switch (document.getElementById(`sdw-finish-${idx}`).value) {
          case 'colored': total += area * coloredSurcharge; break;
          case 'exposed': total += area * exposedSurcharge; break;
          case 'stamped': total += area * stampedSurcharge; break;
        }

        // Add‑ons
        if (document.getElementById(`sdw-rebar-${idx}`).checked) total += area * rebarSurcharge;
        if (document.getElementById(`sdw-drain-${idx}`).checked) total += drainFee;
        if (document.getElementById(`sdw-grade-${idx}`).checked) total += area * gradingSurcharge;

        // Enforce minimum
        if (total < minimumCharge) total = minimumCharge;
        costEl.innerText = `$${total.toFixed(2)}`;

        // Confetti 🎉
        const rect = costEl.getBoundingClientRect();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: (rect.left+rect.width/2)/window.innerWidth, y: (rect.top)/window.innerHeight }
        });
      });
    });
  });
})();
