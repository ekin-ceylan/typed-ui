import { html, nothing } from 'lit';
import LightComponentBase from '../../core/light-component-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';
import { stringFormat } from '../../modules/utilities.js';

/**
 * Light DOM pagination component for page-based navigation.
 * Provides overridable render hooks for pagination links and ellipsis content.
 * @summary Pagination component with sibling-based visible page calculation.
 * @extends LightComponentBase
 */
export default class Pagination extends SlotCollectorMixin(LightComponentBase) {
    static get properties() {
        return {
            currentPage: { type: Number, attribute: 'current-page' },
            pageCount: { type: Number, attribute: 'page-count' },
            siblingCount: { type: Number, attribute: 'sibling-count' },
            ariaLabel: { type: String, attribute: 'aria-label' },
            firstPageLabel: { type: String, attribute: 'first-page-label' },
            lastPageLabel: { type: String, attribute: 'last-page-label' },
            prevPageLabel: { type: String, attribute: 'prev-page-label' },
            nextPageLabel: { type: String, attribute: 'next-page-label' },
            pageLabel: { type: String, attribute: 'page-label' },
        };
    }

    /** @returns {number} Total page count normalized to a minimum value of 1. */
    get normalizedPageCount() {
        return Math.max(1, Number(this.pageCount) || 1);
    }

    /** @returns {number} Current page clamped into the valid page range. */
    get normalizedCurrentPage() {
        return this.#clampPage(this.currentPage);
    }

    get isFirstPage() {
        return this.normalizedCurrentPage === 1;
    }

    get isLastPage() {
        return this.normalizedCurrentPage === this.normalizedPageCount;
    }

    /** @returns {boolean} True when pagination should be rendered. */
    get showPagination() {
        return this.normalizedPageCount > 1;
    }

    /** @returns {number[]} Visible page numbers around the current page. */
    get visiblePages() {
        const siblingCount = Math.max(0, Number(this.siblingCount) || 0);
        const min = Math.max(this.normalizedCurrentPage - siblingCount, 1);
        const max = Math.min(this.normalizedCurrentPage + siblingCount, this.normalizedPageCount);

        return Array.from({ length: max - min + 1 }, (_value, index) => min + index);
    }

    /** @returns {boolean} True when hidden pages exist on the left side. */
    get showLeftEllipsis() {
        return this.visiblePages[0] > 1;
    }

    /** @returns {boolean} True when hidden pages exist on the right side. */
    get showRightEllipsis() {
        return this.visiblePages.at(-1) < this.normalizedPageCount;
    }

    constructor() {
        super();

        /** @type {number} Current active page number. */
        this.currentPage = 1;
        /** @type {number} Total number of available pages. */
        this.pageCount = 1;
        /** @type {number} Number of sibling pages shown on each side of the current page. */
        this.siblingCount = 2;
        /** @type {string} Accessible label for the pagination navigation landmark. */
        this.ariaLabel = 'Pagination';
        /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
        this.firstPageLabel = 'İlk sayfaya git';
        /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
        this.lastPageLabel = 'Son sayfaya git';
        /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
        this.prevPageLabel = 'Önceki Sayfaya git: Sayfa {0}';
        /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
        this.nextPageLabel = 'Sonraki Sayfaya git: Sayfa {0}';
        /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
        this.pageLabel = 'Sayfaya git: Sayfa {0}';
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderEllipsis() {
        return html`<span aria-hidden="true">
            <slot name="ellipsis-icon">&hellip;</slot>
        </span>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderSecondItem() {
        const ariaDisabled = this.isFirstPage ? 'true' : 'false';
        const pageNo = this.normalizedCurrentPage - 1;
        const ariaLabel = stringFormat(this.prevPageLabel, pageNo);

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            title=${ariaLabel}
            aria-disabled=${ariaDisabled}
            ?disabled=${this.isFirstPage}
            @click=${e => this.requestPage(pageNo, e)}
        >
            <slot name="go-prev-icon">&lsaquo;</slot>
        </button>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderSecondLastItem() {
        const ariaDisabled = this.isLastPage ? 'true' : 'false';
        const pageNo = this.normalizedCurrentPage + 1;
        const ariaLabel = stringFormat(this.nextPageLabel, pageNo);

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            title=${ariaLabel}
            aria-disabled=${ariaDisabled}
            ?disabled=${this.isLastPage}
            @click=${e => this.requestPage(pageNo, e)}
        >
            <slot name="go-next-icon">&rsaquo;</slot>
        </button>`;
    }

    /**
     *
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderFirstItem() {
        const ariaDisabled = this.isFirstPage ? 'true' : 'false';
        const ariaLabel = stringFormat(this.firstPageLabel, 1);

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            title=${ariaLabel}
            aria-disabled=${ariaDisabled}
            ?disabled=${this.isFirstPage}
            @click=${e => this.requestPage(1, e)}
        >
            <slot name="go-first-icon">&laquo;</slot>
        </button>`;
    }

    /**
     *
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderLastItem() {
        const ariaDisabled = this.isLastPage ? 'true' : 'false';
        const ariaLabel = stringFormat(this.lastPageLabel, this.normalizedPageCount);

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            title=${ariaLabel}
            aria-disabled=${ariaDisabled}
            ?disabled=${this.isLastPage}
            @click=${e => this.requestPage(this.normalizedPageCount, e)}
        >
            <slot name="go-last-icon">&raquo;</slot>
        </button>`;
    }

    /**
     * Renders a page link button for the given page number with appropriate ARIA attributes.
     * Subclasses may override this method to provide custom link rendering (e.g. anchor tags) or additional content.
     * The method should ensure that the rendered link is accessible and indicates the active page state.
     *
     * Default implementation renders a button element with click handler to request page change:
     * ```
     * return html`<button
     *      type="button"
     *      aria-label=${ariaLabel}
     *      aria-current=${ariaCurrent}
     *      aria-disabled=${ariaDisabled}
     *      ?disabled=${isActive}
     *     ⠀@click=${e => this.requestPage(pageNo, e)}
     * >
     *      ${pageNo}
     * </button>`;
     * ```
     * @param {number} pageNo - The page number for which to render the link.
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderPageItem(pageNo) {
        const isActive = this.normalizedCurrentPage === pageNo;
        const ariaCurrent = isActive ? 'page' : nothing;
        const ariaDisabled = isActive ? 'true' : 'false';
        const ariaLabel = stringFormat(this.pageLabel, pageNo);

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            aria-current=${ariaCurrent}
            aria-disabled=${ariaDisabled}
            ?disabled=${isActive}
            @click=${e => this.requestPage(pageNo, e)}
        >
            ${pageNo}
        </button>`;
    }

    /**
     * Renders additional adornment content within the pagination controls, such as a page count display.
     * This method is called between the visible page links and the trailing controls.
     *
     * Default implementation returns `nothing`, rendering no additional content.
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderAdornment() {
        return nothing;
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        if (!this.showPagination) return html``;

        // prettier-ignore
        return html`<nav aria-label=${this.ariaLabel}>
            <ul>
                <li>${this.renderFirstItem()}</li>

                <li>${this.renderSecondItem()}</li>

                ${this.showLeftEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                ${this.visiblePages.map(pageNo => html`<li>${this.renderPageItem(pageNo)}</li>`)}
                ${this.renderAdornment()}

                ${this.showRightEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                <li>${this.renderSecondLastItem()}</li>

                <li>${this.renderLastItem()}</li>
            </ul>
        </nav>`;
    }

    /**
     * Handles page navigation requests and dispatches a `page-change-request` event for valid targets.
     * @param {number} pageNo
     * @param {MouseEvent} event
     */
    requestPage(pageNo, event) {
        event.preventDefault();
        if (pageNo < 1 || pageNo > this.normalizedPageCount || pageNo === this.normalizedCurrentPage) return;
        this.dispatchCustomEvent('page-change-request', event, { page: pageNo });
    }

    /**
     * Clamps the provided page number into the valid page range.
     * @param {number} page
     * @returns {number}
     */
    #clampPage(page) {
        const normalized = Number(page) || 1;
        return Math.min(Math.max(normalized, 1), this.normalizedPageCount);
    }
}
