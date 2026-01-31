/**
 * @typedef {import('../core/light-component-base.js').default} LightComponentBase
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
 * Slot collector mixin.
 *
 * **Constraint:** Can only be applied to classes extending `LightComponentBase`
 * (ensures LitElement APIs like `updateComplete` / `requestUpdate` exist).
 *
 * @template {Constructor<LightComponentBase>} TBase
 * @param {TBase} Base
 * @returns {Constructor<LightComponentBase & SlotCollectorApi> & TBase}
 */
export default function SlotCollectorMixin(Base) {
    return class SlotCollector extends Base {
        #slotNodes = [];
        #isCollected = false;

        /** @type {WeakSet<Element>} */
        #hiddenByCollector = new WeakSet();

        constructor(...args) {
            super(...args);
            this.#collectSlots(); // başlangıçta DOM'a bağlıysa çalışır
        }

        connectedCallback() {
            super.connectedCallback?.();
            if (!this.#isCollected) {
                this.#isCollected = true;
                this.#collectSlots(); // sonradan DOM'a bağlandıysa çalışır
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
                isElement && node.removeAttribute('slot');

                if (!this.validateNode(node, nodeSlotName)) {
                    node.remove();
                    continue;
                }

                if (node instanceof Element && this.#hiddenByCollector.has(node)) {
                    node.removeAttribute('hidden');
                    this.#hiddenByCollector.delete(node);
                }

                if (node instanceof HTMLTemplateElement) {
                    const nodes = this.#extractTemplateContent(node, nodeSlotName);
                    this.#pushToMapArray(bySlot, nodeSlotName, ...nodes);
                    node.remove();
                    continue;
                }

                this.#pushToMapArray(bySlot, nodeSlotName, node);
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
        afterSlotsBinded() {}

        /**
         * @param {Map<string, (Element|Text)[]>} map
         * @param {string} key
         * @param {...(Element|Text)} value
         */
        #pushToMapArray(map, key, ...value) {
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(...value);
        }

        #extractTemplateContent(template, slotName) {
            return template.content
                ? Array.from(template.content.childNodes).filter(node => {
                      if (!this.validateNode(node, slotName)) return false;

                      if (node.nodeType === Node.ELEMENT_NODE) {
                          node.removeAttribute('slot');
                          return true;
                      }

                      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
                  })
                : [];
        }

        async #firstUpdateCompleted() {
            await this.updateComplete;
            this.bindSlots(this.#slotNodes); // Tüm slot placeholder'larını bul
            this.requestUpdate();
            await this.updateComplete;
            this.afterSlotsBinded();
        }

        #collectSlots() {
            if (this.#slotNodes.length > 0) return;

            const slots = Array.from(this.childNodes).filter(node => {
                const isTextNode = node.nodeType === Node.TEXT_NODE;

                if (isTextNode)
                    node.remove(); // detach nodes
                else if (node instanceof Element && !node.hasAttribute('hidden')) {
                    node.setAttribute('hidden', '');
                    this.#hiddenByCollector.add(node);
                }

                return node.nodeType === Node.ELEMENT_NODE || (isTextNode && node.textContent.trim());
            });

            this.#slotNodes = slots;
        }
    };
}

// template testleri
// new testleri
// DOM üzerinde başlama testleri
// validateNode override testleri
// lit component ile entegrasyon testleri
// dinamik slot testleri
