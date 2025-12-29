/**
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * @template TInstance
 * @typedef {new (...args: any[]) => TInstance} Constructor
 */

/**
 * @typedef {{
 *   bindSlots(collectedNodes?: (Element|Text)[]): void
 *   afterSlotsBinded(): void
 *   validateNode(node: Node, slotName: string): boolean
 * }} SlotCollectorApi
 */

/**
 * @template {Constructor<LitElement>} TBase
 * @param {TBase} Base
 * @returns {Constructor<LitElement & SlotCollectorApi> & TBase}
 */
export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        #slotNodes = [];
        #isCollected = false;

        constructor(...args) {
            super(...args);
            this.#slotNodes = this.#collectSlots(); // başlangıçta DOM'a bağlıysa çalışır
            queueMicrotask(() => this.toggleAttribute('data-not-ready', true));
        }

        connectedCallback() {
            super.connectedCallback?.();

            if (!this.#isCollected) {
                this.#isCollected = true;
                this.#slotNodes.push(...this.#collectSlots()); // sonradan DOM'a bağlandıysa çalışır
                this.#firstUpdateCompleted();
            }
        }

        /**
         * Binds the collected nodes to their respective slot elements.
         * @param {(HTMLElement|Text)[]} collectedNodes - Collected nodes to bind to slots.
         */
        bindSlots(collectedNodes = []) {
            const slotElements = Array.from(this.querySelectorAll('slot'));

            for (const slotEl of slotElements) {
                const slotName = slotEl.getAttribute('name') || 'default';
                const fragment = document.createDocumentFragment();

                for (const node of collectedNodes) {
                    const isElement = node instanceof Element;
                    const nodeSlot = (isElement && node.getAttribute('slot')) || 'default';

                    if (!this.validateNode(node, slotName)) {
                        node.remove();
                    } else if (nodeSlot === slotName) {
                        fragment.appendChild(node);
                        isElement && node.removeAttribute('slot');
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
