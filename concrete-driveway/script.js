import confetti from 'canvas-confetti';

(() => {
  // 0) Unit conversion helper (now only in, ft, yd)
  const toFeet = (value, unit) => {
    switch (unit) {
      case 'in': return value / 12;
      case 'ft': return value;
      case 'yd': return value * 3;
      default:   return NaN;
    }
  };

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
      // Read data-attrs or use defaults
      const baseRate          = parseFloat(widget.dataset.baseRate)         || 8.00;
      const demoRate          = parseFloat(widget.dataset.demolitionRate)   || 2.00;
      const coloredSurcharge  = parseFloat(widget.dataset.coloredSurcharge) || 3.00;
      const exposedSurcharge  = parseFloat(widget.dataset.exposedSurcharge) || 4.00;
      const stampedSurcharge  = parseFloat(widget.dataset.stampedSurcharge) || 8.00;
      const rebarSurcharge    = parseFloat(widget.dataset.rebarSurcharge)   || 2.00;
      const drainFee          = parseFloat(widget.dataset.drainFee)         || 1000;
      const gradingSurcharge  = parseFloat(widget.dataset.gradingSurcharge) || 1.00;
      const minimumCharge     = parseFloat(widget.dataset.minimumCharge)    || 3000;

      // 1) Only three unit options now
      const unitOptions = `
        <option value="in">in</option>
        <option value="ft" selected>ft</option>
        <option value="yd">yd</option>
      `;

      // 2) Build HTML
      widget.innerHTML = `
        <div class="sdw-widget">
          <h3>Concrete Driveway Cost Calculator</h3>

          <div class="sdw-field">
            <label for="sdw-width-${idx}">Width:</label>
            <input type="number" id="sdw-width-${idx}" placeholder="e.g. 10" min="0" step="any" />
            <select id="sdw-width-unit-${idx}">${unitOptions}</select>
          </div>

          <div class="sdw-field">
            <label for="sdw-length-${idx}">Length:</label>
            <input type="number" id="sdw-length-${idx}" placeholder="e.g. 60" min="0" step="any" />
            <select id="sdw-length-unit-${idx}">${unitOptions}</select>
          </div>

          <div class="sdw-field">
            <label>Demolish Existing?</label>
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
            <label><input type="checkbox" id="sdw-drain-${idx}"/> Include Trench Drain (+$${drainFee} flat)</label>
          </div>
          <div class="sdw-field">
            <label><input type="checkbox" id="sdw-grade-${idx}"/> Extra Site Grading (+$${gradingSurcharge}/sq ft)</label>
          </div>

          <button class="button" id="sdw-calc-${idx}">Calculate</button>

          <div class="sdw-results">
            <p><strong>Total Cost:</strong> <span id="sdw-cost-${idx}">—</span></p>
          </div>

          <p class="sdw-disclaimer" style="font-size:12px">
            * Estimates exclude permits & taxes. Contact us for a firm quote.
          </p>
          <small style="font-size:10px">
            <a href="https://www.supersoniclandscaping.com/landscaping-calculators/concrete-driveway" target="_blank" rel="noopener">
              Concrete Driveway Calculator
            </a> by 
            <a href="https://www.supersoniclandscaping.com/" target="_blank" rel="noopener">
              Supersonic Landscaping
            </a>
          </small>
        </div>
      `;

      // 3) Calculation logic, now converting only in|ft|yd
      document.getElementById(`sdw-calc-${idx}`).addEventListener('click', () => {
        // Read & convert dimensions
        const rawW  = parseFloat(document.getElementById(`sdw-width-${idx}`).value);
        const uW     = document.getElementById(`sdw-width-unit-${idx}`).value;
        const rawL  = parseFloat(document.getElementById(`sdw-length-${idx}`).value);
        const uL     = document.getElementById(`sdw-length-unit-${idx}`).value;
        const wFt   = toFeet(rawW,  uW);
        const lFt   = toFeet(rawL,  uL);

        const costEl = document.getElementById(`sdw-cost-${idx}`);
        if (isNaN(wFt) || isNaN(lFt) || wFt <= 0 || lFt <= 0) {
          costEl.innerText = 'Enter valid dimensions.';
          return;
        }

        let total = (wFt * lFt) * baseRate;
        // demolition
        if (document.querySelector(`input[name="sdw-demo-${idx}"]:checked`).value === 'yes') {
          total += (wFt * lFt) * demoRate;
        }

        // finish surcharge
        switch (document.getElementById(`sdw-finish-${idx}`).value) {
          case 'colored': total += (wFt * lFt) * coloredSurcharge; break;
          case 'exposed': total += (wFt * lFt) * exposedSurcharge; break;
          case 'stamped': total += (wFt * lFt) * stampedSurcharge; break;
        }

        if (document.getElementById(`sdw-rebar-${idx}`).checked) total += (wFt * lFt) * rebarSurcharge;
        if (document.getElementById(`sdw-drain-${idx}`).checked) total += drainFee;
        if (document.getElementById(`sdw-grade-${idx}`).checked) total += (wFt * lFt) * gradingSurcharge;

        if (total < minimumCharge) total = minimumCharge;
        costEl.innerText = `$${total.toFixed(2)}`;

        // 🎉 Confetti!
        const rect = costEl.getBoundingClientRect();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: (rect.left + rect.width/2) / window.innerWidth,
                    y: (rect.top) / window.innerHeight }
        });
      });
    });
  });
})();
