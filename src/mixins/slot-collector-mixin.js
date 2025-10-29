export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        connectedCallback() {
            super.connectedCallback();
            this.#collectSlots();
            this.#firstUpdateCompleted();
        }

        #collectSlots() {
            this._slotNodes = Array.from(this.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
        }

        bindSlots() {
            const slotElements = Array.from(this.querySelectorAll('slot'));

            for (const slotEl of slotElements) {
                const slotName = slotEl.getAttribute('name') || 'default';

                for (const node of this._slotNodes) {
                    const nodeSlot = node.getAttribute?.('slot') || 'default';

                    if (nodeSlot === slotName) {
                        slotEl.parentNode.insertBefore(node, slotEl);
                    }
                }
                // Slot placeholder'ını kaldır (isteğe bağlı)
                slotEl.remove();
            }
        }

        async #firstUpdateCompleted() {
            await this.updateComplete;
            // Tüm slot placeholder'larını bul
            this.bindSlots();
        }
    };
}
