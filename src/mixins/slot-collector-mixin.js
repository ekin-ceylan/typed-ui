export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        #slotNodes = [];
        #runFlag = false;

        connectedCallback() {
            super.connectedCallback();

            if (this.#runFlag) return;
            this.#runFlag = true;
            this.#slotNodes = this.#collectSlots();
            this.#firstUpdateCompleted();
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
            this.afterSlotsBinded();
        }

        #collectSlots() {
            return Array.from(this.childNodes) //
                .filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
        }
    };
}
