export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        #slotNodes = [];
        #isCollected = false;

        constructor() {
            super();
            this.#slotNodes = this.#collectSlots(); // başlangıçta DOM'a bağlıysa çalışır
            queueMicrotask(() => this.toggleAttribute('data-not-ready', true));
            this.#firstUpdateCompleted();
        }

        connectedCallback() {
            super.connectedCallback();

            if (!this.#isCollected) {
                this.#isCollected = true;
                this.#slotNodes.push(...this.#collectSlots()); // sonradan DOM'a bağlandıysa çalışır
            }
        }

        /**
         * Binds the collected nodes to their respective slot elements.
         * @param {Node[]} collectedNodes - Collected nodes to bind to slots.
         */
        bindSlots(collectedNodes = []) {
            const slotElements = Array.from(this.querySelectorAll('slot'));

            for (const slotEl of slotElements) {
                const slotName = slotEl.getAttribute('name') || 'default';
                const fragment = document.createDocumentFragment();

                for (const node of collectedNodes) {
                    const nodeSlot = node.getAttribute?.('slot') || 'default';

                    if (!this.validateNode(node, slotName)) {
                        node.remove();
                    } else if (nodeSlot === slotName) {
                        fragment.appendChild(node);
                        node?.removeAttribute?.('slot');
                    }
                }

                fragment.hasChildNodes() //
                    ? slotEl.replaceWith(fragment)
                    : slotEl.replaceWith(...slotEl.childNodes);
            }
        }

        validateNode(node, slotName) {
            // Override edilebilir
            return true;
        }

        afterSlotsBinded() {
            // Override edilebilir
        }

        async #firstUpdateCompleted() {
            await this.updateComplete;
            this.bindSlots(this.#slotNodes); // Tüm slot placeholder'larını bul
            this.toggleAttribute('data-not-ready', false);
            this.afterSlotsBinded();
        }

        #collectSlots() {
            return Array.from(this.childNodes).filter(node => {
                node.remove(); // detach nodes
                return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            });
        }
    };
}
