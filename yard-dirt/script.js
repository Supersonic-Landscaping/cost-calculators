// dirt-calculator.js
import confetti from 'canvas-confetti';

(() => {
  const CSS_HREF = 'https://tools.supersoniclandscaping.com/style.css';

  // 1) Load shared stylesheet if missing
  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  // 2) Unit conversion to feet
  const toFeet = (value, unit) => {
    switch (unit) {
      case 'in': return value / 12;
      case 'ft': return value;
      case 'yd': return value * 3;
      case 'cm': return value / 30.48;
      case 'm':  return value * 3.28084;
      default:   return NaN;
    }
  };

  // 3) Calculate area by shape
  const calcArea = (shape, d) => {
    const π = Math.PI;
    switch (shape) {
      case 'square':      return d.side ** 2;
      case 'rectangle':   return d.length * d.width;
      case 'rect-border': {
        const fullW = d.innerWidth + 2 * d.border;
        const fullL = d.innerLength + 2 * d.border;
        return fullW * fullL - d.innerWidth * d.innerLength;
      }
      case 'circle':      return π * (d.diameter / 2) ** 2;
      case 'circ-border':
      case 'annulus': {
        const outer = shape === 'annulus'
          ? d.outerDiameter
          : d.innerDiameter + 2 * d.border;
        const inner = d.innerDiameter;
        return π * ((outer/2)**2 - (inner/2)**2);
      }
      case 'triangle': {
        const {a, b, c} = d;
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      }
      case 'trapezoid':   return ((d.a + d.b) / 2) * d.h;
      default:            return NaN;
    }
  };

  // 4) On DOM ready, build every widget
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.supersonic-dirt-calculator').forEach((widget, idx) => {
      const title = widget.dataset.title || 'Material Volume Calculator';

      // Helper to generate the 5-option unit <select>
      const unitOptions = `
        <option value="in">in</option>
        <option value="ft">ft</option>
        <option value="yd">yd</option>
        <option value="cm">cm</option>
        <option value="m">m</option>
      `;

      // Build the HTML
      widget.innerHTML = `
        <div class="dirt-widget" itemscope itemtype="https://schema.org/WebApplication">
          <h3>${title}</h3>

          <div class="dirt-field">
            <label for="shape-${idx}">Area Shape:</label>
            <select id="shape-${idx}">
              <option value="">-- Select Shape --</option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
              <option value="rect-border">Rectangle Border</option>
              <option value="circle">Circle</option>
              <option value="circ-border">Circle Border</option>
              <option value="annulus">Annulus</option>
              <option value="triangle">Triangle</option>
              <option value="trapezoid">Trapezoid</option>
            </select>
          </div>

          <!-- 1. Square -->
          <fieldset id="fs-square-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Square</legend>
            <div class="dirt-field">
              <label>Side:</label>
              <input class="dim" data-dim="side" type="number" min="0">
              <select class="unit" data-dim="side">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 2. Rectangle -->
          <fieldset id="fs-rectangle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Rectangle</legend>
            <div class="dirt-field">
              <label>Length:</label>
              <input class="dim" data-dim="length" type="number" min="0">
              <select class="unit" data-dim="length">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Width:</label>
              <input class="dim" data-dim="width" type="number" min="0">
              <select class="unit" data-dim="width">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 3. Rectangle Border -->
          <fieldset id="fs-rect-border-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Rectangle Border</legend>
            <div class="dirt-field">
              <label>Inner Length:</label>
              <input class="dim" data-dim="innerLength" type="number" min="0">
              <select class="unit" data-dim="innerLength">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Inner Width:</label>
              <input class="dim" data-dim="innerWidth" type="number" min="0">
              <select class="unit" data-dim="innerWidth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Border Width:</label>
              <input class="dim" data-dim="border" type="number" min="0">
              <select class="unit" data-dim="border">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 4. Circle -->
          <fieldset id="fs-circle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Circle</legend>
            <div class="dirt-field">
              <label>Diameter:</label>
              <input class="dim" data-dim="diameter" type="number" min="0">
              <select class="unit" data-dim="diameter">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 5. Circle Border -->
          <fieldset id="fs-circ-border-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Circle Border</legend>
            <div class="dirt-field">
              <label>Inner Diameter:</label>
              <input class="dim" data-dim="innerDiameter" type="number" min="0">
              <select class="unit" data-dim="innerDiameter">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Border Width:</label>
              <input class="dim" data-dim="border" type="number" min="0">
              <select class="unit" data-dim="border">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 6. Annulus -->
          <fieldset id="fs-annulus-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Annulus</legend>
            <div class="dirt-field">
              <label>Outer Diameter:</label>
              <input class="dim" data-dim="outerDiameter" type="number" min="0">
              <select class="unit" data-dim="outerDiameter">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Inner Diameter:</label>
              <input class="dim" data-dim="innerDiameter" type="number" min="0">
              <select class="unit" data-dim="innerDiameter">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 7. Triangle -->
          <fieldset id="fs-triangle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Triangle</legend>
            <div class="dirt-field">
              <label>Side A:</label>
              <input class="dim" data-dim="a" type="number" min="0">
              <select class="unit" data-dim="a">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Side B:</label>
              <input class="dim" data-dim="b" type="number" min="0">
              <select class="unit" data-dim="b">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Side C:</label>
              <input class="dim" data-dim="c" type="number" min="0">
              <select class="unit" data-dim="c">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- 8. Trapezoid -->
          <fieldset id="fs-trapezoid-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Trapezoid</legend>
            <div class="dirt-field">
              <label>Side A:</label>
              <input class="dim" data-dim="a" type="number" min="0">
              <select class="unit" data-dim="a">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Side B:</label>
              <input class="dim" data-dim="b" type="number" min="0">
              <select class="unit" data-dim="b">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Height (h):</label>
              <input class="dim" data-dim="h" type="number" min="0">
              <select class="unit" data-dim="h">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Depth:</label>
              <input class="dim" data-dim="depth" type="number" min="0">
              <select class="unit" data-dim="depth">${unitOptions}</select>
            </div>
            <div class="dirt-field">
              <label>Quantity:</label>
              <input class="dim" data-dim="quantity" type="number" min="1" value="1">
            </div>
          </fieldset>

          <!-- Price & Calculate -->
          <div class="dirt-field">
            <label for="price-${idx}">Price:</label>
            <input type="number" id="price-${idx}" min="0">
            <select id="price-unit-${idx}">
              <option value="in">$/in³</option>
              <option value="ft">$/ft³</option>
              <option value="yd">$/yd³</option>
              <option value="cm">$/cm³</option>
              <option value="m">$/m³</option>
            </select>
          </div>
          <button id="calc-${idx}">Calculate</button>

          <!-- Results -->
          <div id="results-${idx}" class="dirt-results">
            <p><strong>Vol:</strong>
              <span id="vol-yd-${idx}">0</span> yd³ |
              <span id="vol-ft-${idx}">0</span> ft³ |
              <span id="vol-m-${idx}">0</span> m³
            </p>
            <p><strong>Cost:</strong>
              <span id="cost-${idx}">$0.00</span>
            </p>
          </div>

          <p class="dirt-credit" style="font-style: 11px;">
            Tool by <a href="https://www.supersoniclandscaping.com" target="_blank">Supersonic Landscaping</a>
          </p>
        </div>
      `;

      // 5) Show/hide fieldsets
      const shapeSel = widget.querySelector(`#shape-${idx}`);
      const allFs   = widget.querySelectorAll('.dirt-shape-fs');
      const hideAll = () => allFs.forEach(fs => fs.style.display = 'none');
      hideAll();
      shapeSel.addEventListener('change', () => {
        hideAll();
        const fs = widget.querySelector(`#fs-${shapeSel.value}-${idx}`);
        if (fs) fs.style.display = 'block';
      });

      // 6) Calculate
      widget.querySelector(`#calc-${idx}`).addEventListener('click', () => {
        const shape = shapeSel.value;
        if (!shape) return alert('Please select a shape.');

        const activeFs = widget.querySelector(`#fs-${shape}-${idx}`);
        let valid = true;
        const dims = {};

        activeFs.querySelectorAll('.dim').forEach(inp => {
          const key = inp.dataset.dim;
          const raw = parseFloat(inp.value);
          if (key !== 'quantity') {
            if (isNaN(raw) || raw <= 0) valid = false;
            const unit = activeFs.querySelector(`.unit[data-dim="${key}"]`).value;
            dims[key] = toFeet(raw, unit);
          } else {
            dims[key] = raw;
          }
        });
        if (!valid) return alert('Please fill all fields correctly.');

        // Math
        const area  = calcArea(shape, dims);
        const volFt = area * dims.depth * dims.quantity;
        const yd3   = volFt / 27;
        const m3    = volFt / 35.3147;
        const in3   = volFt * 1728;
        const cm3   = volFt * 28316.8466;

        const price = parseFloat(widget.querySelector(`#price-${idx}`).value) || 0;
        const pUnit = widget.querySelector(`#price-unit-${idx}`).value;
        const costMap = {
          in: in3 * price,
          ft: volFt * price,
          yd: yd3 * price,
          cm: cm3 * price,
          m:  m3 * price
        };
        const totalCost = costMap[pUnit] || 0;

        // Render
        widget.querySelector(`#vol-yd-${idx}`).innerText = yd3.toFixed(3);
        widget.querySelector(`#vol-ft-${idx}`).innerText = volFt.toFixed(2);
        widget.querySelector(`#vol-m-${idx}`).innerText  = m3.toFixed(3);
        widget.querySelector(`#cost-${idx}`).innerText   = `$${totalCost.toFixed(2)}`;

        // Confetti
        const btn = widget.querySelector(`#calc-${idx}`);
        const r   = btn.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (r.left + r.width/2)/window.innerWidth,
            y: (r.top + r.height/2)/window.innerHeight
          }
        });
      });
    });
  });
})();
