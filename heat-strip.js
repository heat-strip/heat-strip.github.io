/**
 * HeatStrip Web Component
 * A 1-dimensional heatmap component for displaying status sequences
 */
class HeatStrip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Observed attributes that trigger attributeChangedCallback
     */
    static get observedAttributes() {
        return ['data', 'size'];
    }

    /**
     * Called when the element is connected to the DOM
     */
    connectedCallback() {
        this.render();
    }

    /**
     * Called when an observed attribute changes
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    /**
     * Get the data attribute as an array
     */
    getData() {
        const dataAttr = this.getAttribute('data') || '';
        return dataAttr.split(',').map(item => item.trim()).filter(item => item);
    }

    /**
     * Get the size attribute
     */
    getSize() {
        return this.getAttribute('size') || 'medium';
    }

    /**
     * Get color for a given state
     */
    getColor(state) {
        const colors = {
            'ok': '#22c55e',        // green
            'warning': '#eab308',   // yellow
            'error': '#ef4444'      // red
        };
        return colors[state.toLowerCase()] || '#94a3b8'; // default gray for unknown states
    }

    /**
     * Get block dimensions based on size
     */
    getDimensions(size) {
        const dimensions = {
            'small': { width: 8, height: 20, gap: 2 },
            'medium': { width: 12, height: 30, gap: 3 },
            'large': { width: 16, height: 40, gap: 4 }
        };
        return dimensions[size] || dimensions['medium'];
    }

    /**
     * Render the heat strip
     */
    render() {
        const data = this.getData();
        const size = this.getSize();
        const dims = this.getDimensions(size);

        // Create styles
        const styles = `
            <style>
                :host {
                    display: inline-block;
                }
                .heat-strip-container {
                    display: flex;
                    gap: ${dims.gap}px;
                    padding: 4px;
                    background: transparent;
                    border-radius: 4px;
                }
                .heat-block {
                    width: ${dims.width}px;
                    height: ${dims.height}px;
                    border-radius: 2px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    cursor: pointer;
                }
                .heat-block:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .heat-block[data-state="ok"] {
                    background-color: #22c55e;
                }
                .heat-block[data-state="warning"] {
                    background-color: #eab308;
                }
                .heat-block[data-state="error"] {
                    background-color: #ef4444;
                }
            </style>
        `;

        // Create blocks
        const blocks = data.map((state, index) => {
            const color = this.getColor(state);
            return `<div class="heat-block" data-state="${state.toLowerCase()}" title="${state} (${index + 1})"></div>`;
        }).join('');

        // Update shadow DOM
        this.shadowRoot.innerHTML = `
            ${styles}
            <div class="heat-strip-container">
                ${blocks}
            </div>
        `;
    }
}

// Register the custom element
customElements.define('heat-strip', HeatStrip);
