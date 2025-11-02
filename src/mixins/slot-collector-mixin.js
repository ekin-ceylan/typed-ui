export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        connectedCallback() {
            super.connectedCallback();
            this.#collectSlots();
            this.#firstUpdateCompleted();
        }

        #collectSlots() {
            this._slotNodes = Array.from(this.childNodes) //
                .filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
        }

        bindSlots() {
            const slotElements = Array.from(this.querySelectorAll('slot'));

            for (const slotEl of slotElements) {
                const slotName = slotEl.getAttribute('name') || 'default';
                const fragment = document.createDocumentFragment();

                for (const node of this._slotNodes) {
                    const nodeSlot = node.getAttribute?.('slot') || 'default';

                    if (nodeSlot === slotName) {
                        fragment.appendChild(node);
                    }
                }

                fragment.hasChildNodes() //
                    ? slotEl.replaceWith(fragment)
                    : slotEl.replaceWith(...slotEl.childNodes);
            }
        }

        async #firstUpdateCompleted() {
            await this.updateComplete;
            this.bindSlots(); // Tüm slot placeholder'larını bul
        }
    };
}
