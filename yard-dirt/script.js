// dirt-calculator.js
import confetti from 'canvas-confetti';

(() => {
  const CSS_HREF = 'https://tools.supersoniclandscaping.com/style.css';

  // Load shared stylesheet if missing
  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = CSS_HREF;
    document.head.appendChild(linkEl);
  }

  // Unit conversion to feet
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

  // Calculate area by shape
  const calcArea = (shape, d) => {
    const π = Math.PI;
    switch (shape) {
      case 'square':
        return d.side ** 2;
      case 'rectangle':
        return d.length * d.width;
      case 'rect-border': {
        const fullW = d.innerWidth + 2 * d.border;
        const fullL = d.innerLength + 2 * d.border;
        return fullW * fullL - d.innerWidth * d.innerLength;
      }
      case 'circle':
        return π * (d.diameter / 2) ** 2;
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
      case 'trapezoid':
        return ((d.a + d.b) / 2) * d.h;
      default:
        return NaN;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.supersonic-dirt-calculator').forEach((widget, idx) => {
      const title = widget.dataset.title || 'Material Volume Calculator';

      widget.innerHTML = `
        <div class="dirt-widget" itemscope itemtype="https://schema.org/WebApplication">
          <meta itemprop="name" content="${title}">
          <meta itemprop="description" content="Calculate volumes & cost for dirt, mulch, gravel, cement, etc.">
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

          <h3>${title}</h3>

          <div class="dirt-field">
            <select id="shape-${idx}" aria-label="Area Shape">
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

          <fieldset id="fs-square-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Square</legend>
            <input class="dim" data-dim="side" placeholder="Side length">
            <select class="unit" data-dim="side" aria-label="Side unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-rectangle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Rectangle</legend>
            <input class="dim" data-dim="length" placeholder="Length">
            <select class="unit" data-dim="length" aria-label="Length unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="width" placeholder="Width">
            <select class="unit" data-dim="width" aria-label="Width unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-rect-border-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Rectangle Border</legend>
            <input class="dim" data-dim="innerLength" placeholder="Inner length">
            <select class="unit" data-dim="innerLength" aria-label="Inner length unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="innerWidth" placeholder="Inner width">
            <select class="unit" data-dim="innerWidth" aria-label="Inner width unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="border" placeholder="Border width">
            <select class="unit" data-dim="border" aria-label="Border width unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-circle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Circle</legend>
            <input class="dim" data-dim="diameter" placeholder="Diameter">
            <select class="unit" data-dim="diameter" aria-label="Diameter unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-circ-border-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Circle Border</legend>
            <input class="dim" data-dim="innerDiameter" placeholder="Inner diameter">
            <select class="unit" data-dim="innerDiameter" aria-label="Inner diameter unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="border" placeholder="Border width">
            <select class="unit" data-dim="border" aria-label="Border width unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-annulus-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Annulus</legend>
            <input class="dim" data-dim="outerDiameter" placeholder="Outer diameter">
            <select class="unit" data-dim="outerDiameter" aria-label="Outer diameter unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="innerDiameter" placeholder="Inner diameter">
            <select class="unit" data-dim="innerDiameter" aria-label="Inner diameter unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-triangle-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Triangle</legend>
            <input class="dim" data-dim="a" placeholder="Side a">
            <select class="unit" data-dim="a" aria-label="Side a unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="b" placeholder="Side b">
            <select class="unit" data-dim="b" aria-label="Side b unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="c" placeholder="Side c">
            <select class="unit" data-dim="c" aria-label="Side c unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <fieldset id="fs-trapezoid-${idx}" class="dirt-shape-fs" style="display:none;">
            <legend>Trapezoid</legend>
            <input class="dim" data-dim="a" placeholder="Side a">
            <select class="unit" data-dim="a" aria-label="Side a unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="b" placeholder="Side b">
            <select class="unit" data-dim="b" aria-label="Side b unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="h" placeholder="Height h">
            <select class="unit" data-dim="h" aria-label="Height unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input class="dim" data-dim="depth" placeholder="Depth">
            <select class="unit" data-dim="depth" aria-label="Depth unit">
              <option>ft</option><option>yd</option><option>in</option><option>m</option><option>cm</option>
            </select>
            <input type="number" class="dim" data-dim="quantity" min="1" placeholder="Quantity" value="1">
          </fieldset>

          <div class="dirt-field">
            <input type="number" id="price-${idx}" placeholder="Price">
            <select id="price-unit-${idx}" aria-label="Price unit">
              <option value="yd">$/yd³</option>
              <option value="ft">$/ft³</option>
              <option value="m">$/m³</option>
            </select>
          </div>

          <button id="calc-${idx}" class="button">Calculate</button>

          <div id="results-${idx}" class="dirt-results">
            <p><strong>Vol:</strong> <span id="vol-yd-${idx}">0</span> yd³ | <span id="vol-ft-${idx}">0</span> ft³ | <span id="vol-m-${idx}">0</span> m³</p>
            <p><strong>Cost:</strong> <span id="cost-${idx}">$0.00</span></p>
          </div>

          <p class="dirt-credit">Tool by <a href="https://www.supersoniclandscaping.com" target="_blank">Supersonic Landscaping</a></p>
        </div>
      `;

      // hide all fieldsets initially
      const shapeSel = document.getElementById(`shape-${idx}`);
      const fsAll    = widget.querySelectorAll('.dirt-shape-fs');
      const hideAll  = () => fsAll.forEach(fs => fs.style.display = 'none');
      hideAll();

      // show the correct fieldset when shape changes
      shapeSel.addEventListener('change', () => {
        hideAll();
        const sel = shapeSel.value;
        if (sel) {
          const el = document.getElementById(`fs-${sel}-${idx}`);
          if (el) el.style.display = 'block';
        }
      });

      // calculate on button click
      document.getElementById(`calc-${idx}`).addEventListener('click', () => {
        const shape = shapeSel.value;
        if (!shape) return alert('Please select a shape.');

        let valid = true;
        const dims = {};
        widget.querySelectorAll('.dim').forEach(inp => {
          const key = inp.dataset.dim;
          const raw = parseFloat(inp.value);
          if (key !== 'quantity') {
            if (isNaN(raw) || raw <= 0) valid = false;
            const unit = widget.querySelector(`.unit[data-dim="${key}"]`).value;
            dims[key] = toFeet(raw, unit);
          } else {
            dims[key] = raw;
          }
        });
        if (!valid) return alert('Please fill all fields correctly.');

        const area  = calcArea(shape, dims);
        const volFt = area * dims.depth * dims.quantity;
        const yd3   = volFt / 27;
        const m3    = volFt / 35.3147;
        const price = parseFloat(document.getElementById(`price-${idx}`).value) || 0;
        const pUnit = document.getElementById(`price-unit-${idx}`).value;
        const costMap = { yd: yd3 * price, ft: volFt * price, m: m3 * price };
        const totalCost = costMap[pUnit] || 0;

        // render results
        document.getElementById(`vol-yd-${idx}`).innerText = yd3.toFixed(3);
        document.getElementById(`vol-ft-${idx}`).innerText = volFt.toFixed(2);
        document.getElementById(`vol-m-${idx}`).innerText  = m3.toFixed(3);
        document.getElementById(`cost-${idx}`).innerText   = `$${totalCost.toFixed(2)}`;

        // confetti celebration
        const btn = document.getElementById(`calc-${idx}`);
        const r   = btn.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (r.left + r.width / 2) / window.innerWidth,
            y: (r.top + r.height / 2) / window.innerHeight
          }
        });
      });
    });
  });
})();
