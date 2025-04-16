// dirt-calculator.js
import confetti from 'canvas-confetti';

(() => {
  const CSS_HREF = 'https://tools.supersoniclandscaping.com/style.css';

  // Load shared stylesheet if missing
  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    document.head.appendChild(link);
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
    const widgets = document.querySelectorAll('.supersonic-dirt-calculator');

    widgets.forEach((widget, idx) => {
      const title = widget.dataset.title || 'Material Volume Calculator';

      // Inject HTML structure
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
            <label for="shape-${idx}">Area Shape:</label>
            <select id="shape-${idx}">
              <option value="">-- Select --</option>
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

          <!-- Fieldsets for each shape -->
          ${['square','rectangle','rect-border','circle','circ-border','annulus','triangle','trapezoid']
            .map(shape => `
              <fieldset id="fs-${shape}-${idx}" class="dirt-shape-fs">
                <legend>${shape.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</legend>
                ${{
                  square:    '<label>Side:</label><input class="dim" data-dim="side"><select class="unit" data-dim="side">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  rectangle: '<label>Length:</label><input class="dim" data-dim="length"><select class="unit" data-dim="length">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                              '<label>Width:</label><input class="dim" data-dim="width"><select class="unit" data-dim="width">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  'rect-border': '<label>Inner L:</label><input class="dim" data-dim="innerLength"><select class="unit" data-dim="innerLength">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Inner W:</label><input class="dim" data-dim="innerWidth"><select class="unit" data-dim="innerWidth">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Border:</label><input class="dim" data-dim="border"><select class="unit" data-dim="border">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  circle:    '<label>Diameter:</label><input class="dim" data-dim="diameter"><select class="unit" data-dim="diameter">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  'circ-border':'<label>Inner Dia:</label><input class="dim" data-dim="innerDiameter"><select class="unit" data-dim="innerDiameter">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Border:</label><input class="dim" data-dim="border"><select class="unit" data-dim="border">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  annulus:   '<label>Outer Dia:</label><input class="dim" data-dim="outerDiameter"><select class="unit" data-dim="outerDiameter">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Inner Dia:</label><input class="dim" data-dim="innerDiameter"><select class="unit" data-dim="innerDiameter">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  triangle:  '<label>Side a:</label><input class="dim" data-dim="a"><select class="unit" data-dim="a">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Side b:</label><input class="dim" data-dim="b"><select class="unit" data-dim="b">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>Side c:</label><input class="dim" data-dim="c"><select class="unit" data-dim="c">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>',
                  trapezoid:'<label>a:</label><input class="dim" data-dim="a"><select class="unit" data-dim="a">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>b:</label><input class="dim" data-dim="b"><select class="unit" data-dim="b">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>' +
                                 '<label>h:</label><input class="dim" data-dim="h"><select class="unit" data-dim="h">'+['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')+'</select>'
                }[shape]}
                <label>Depth:</label>
                <input class="dim" data-dim="depth"><select class="unit" data-dim="depth">${['in','ft','yd','cm','m'].map(u=>`<option>${u}</option>`).join('')}</select>
                <label>Quantity:</label>
                <input type="number" class="dim" data-dim="quantity" value="1" min="1">
              </fieldset>
            `).join('')}

          <!-- Cost inputs -->
          <div class="dirt-field">
            <label for="price-${idx}">Price:</label>
            <input type="number" id="price-${idx}" placeholder="0">
            <select id="price-unit-${idx}">
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

      const fsAll = widget.querySelectorAll('.dirt-shape-fs');
      const shapeSel = document.getElementById(`shape-${idx}`);
      const hideFs = () => fsAll.forEach(fs => fs.style.display = 'none');
      hideFs();

      // Show relevant fields
      shapeSel.addEventListener('change', () => {
        hideFs();
        const sel = shapeSel.value;
        if (sel) document.getElementById(`fs-${sel}-${idx}`).style.display = 'block';
      });

      // Calculate on click
      document.getElementById(`calc-${idx}`).addEventListener('click', () => {
        const shape = shapeSel.value;
        if (!shape) return alert('Please select a shape.');

        // Gather dims
        const dims = {};
        let valid = true;
        widget.querySelectorAll('.dim').forEach(inp => {
          const key = inp.dataset.dim;
          let val = parseFloat(inp.value);
          if (key !== 'quantity') {
            if (isNaN(val) || val <= 0) valid = false;
            val = toFeet(val, widget.querySelector(`.unit[data-dim="${key}"]`).value);
          }
          dims[key] = val;
        });
        if (!valid) return alert('Please fill all fields correctly.');

        const area = calcArea(shape, dims);
        const volFt = area * dims.depth * dims.quantity;
        const yd3   = volFt / 27;
        const m3    = volFt / 35.3147;
        const price = parseFloat(document.getElementById(`price-${idx}`).value) || 0;
        const pUnit = document.getElementById(`price-unit-${idx}`).value;
        const costMap = { yd: yd3 * price, ft: volFt * price, m: m3 * price };
        const totalCost = costMap[pUnit] || 0;

        // Render
        document.getElementById(`vol-yd-${idx}`).innerText = yd3.toFixed(3);
        document.getElementById(`vol-ft-${idx}`).innerText = volFt.toFixed(2);
        document.getElementById(`vol-m-${idx}`).innerText  = m3.toFixed(3);
        document.getElementById(`cost-${idx}`).innerText   = `$${totalCost.toFixed(2)}`;

        // Confetti
        const btn = document.getElementById(`calc-${idx}`);
        const r   = btn.getBoundingClientRect();
        confetti({ particleCount: 100, spread: 70,
          origin: { x: (r.left + r.width/2)/window.innerWidth, y: (r.top + r.height/2)/window.innerHeight }
        });
      });
    });
  });
})();