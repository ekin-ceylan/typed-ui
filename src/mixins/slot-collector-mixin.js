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
            /** @type {Map<string, (Element|Text)[]>} */
            const bySlot = new Map();

            // validate nodes and group by slot name
            for (const node of collectedNodes) {
                const isElement = node instanceof Element;
                const nodeSlotName = (isElement && node.getAttribute('slot')) || 'default';

                if (!this.validateNode(node, nodeSlotName)) {
                    node.remove();
                    continue;
                }

                this.#pushToMapArray(bySlot, nodeSlotName, node);
                isElement && node.removeAttribute('slot');
            }

            const slotElements = Array.from(this.querySelectorAll('slot'));

            // Replace placeholder slots with collected nodes
            for (const slotEl of slotElements) {
                const slotName = slotEl.getAttribute('name') || 'default';
                const nodes = bySlot.get(slotName);

                if (nodes?.length) {
                    const fragment = document.createDocumentFragment();
                    fragment.append(...nodes);
                    slotEl.replaceWith(fragment);
                    bySlot.delete(slotName); // Aynı isimli ikinci bir <slot> varsa (nadir) sil
                } else {
                    slotEl.replaceWith(...slotEl.childNodes); // Fallback içerik
                }
            }
        }

        #pushToMapArray(map, key, value) {
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(value);
        }

        /**
         * Validates nodes for slot binding.
         * @param {HTMLElement|Text} node
         * @param {String} slotName
         * @returns {Boolean}
         */
        validateNode(node, slotName) {
            return true;
        }

        /** Called after slots have been bound. */
        afterSlotsBinded() {
            this.requestUpdate();
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
