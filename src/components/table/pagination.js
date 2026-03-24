import { html, nothing } from 'lit';
import LightComponentBase from '../../core/light-component-base.js';

/**
 * Light DOM pagination component for page-based navigation.
 * Provides overridable render hooks for pagination links and ellipsis content.
 * @summary Pagination component with sibling-based visible page calculation.
 * @extends LightComponentBase
 */
export default class Pagination extends LightComponentBase {
    static get properties() {
        return {
            currentPage: { type: Number, attribute: 'current-page' },
            pageCount: { type: Number, attribute: 'page-count' },
            siblingCount: { type: Number, attribute: 'sibling-count' },
            ariaLabel: { type: String, attribute: 'aria-label' },
        };
    }

    constructor() {
        super();

        /** @type {number} Current active page number. */
        this.currentPage = 1;

        /** @type {number} Total number of available pages. */
        this.pageCount = 1;

        /** @type {number} Number of sibling pages shown on each side of the current page. */
        this.siblingCount = 3;

        /** @type {string} Accessible label for the pagination navigation landmark. */
        this.ariaLabel = 'Pagination';
    }

    /** @returns {number} Total page count normalized to a minimum value of 1. */
    get normalizedPageCount() {
        return Math.max(1, Number(this.pageCount) || 1);
    }

    /** @returns {number} Current page clamped into the valid page range. */
    get normalizedCurrentPage() {
        return this.#clampPage(this.currentPage);
    }

    /** @returns {boolean} True when pagination should be rendered. */
    get showPagination() {
        return this.normalizedPageCount > 1;
    }

    /** @returns {number[]} Visible page numbers around the current page. */
    get visiblePages() {
        const siblingCount = Math.max(0, Number(this.siblingCount) || 0);
        const min = Math.max(this.normalizedCurrentPage - siblingCount, 2);
        const max = Math.min(this.normalizedCurrentPage + siblingCount, this.normalizedPageCount - 1);

        return Array.from({ length: max - min + 1 }, (_value, index) => min + index);
    }

    /** @returns {boolean} True when hidden pages exist on the left side. */
    get showLeftEllipsis() {
        return this.visiblePages[0] > 2;
    }

    /** @returns {boolean} True when hidden pages exist on the right side. */
    get showRightEllipsis() {
        return this.visiblePages.at(-1) < this.normalizedPageCount - 1;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderEllipsis() {
        return html`<span aria-hidden="true"> ... </span>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderPrevPageLink() {
        const isFirstPage = this.normalizedCurrentPage === 1;
        const ariaDisabled = isFirstPage ? 'true' : 'false';

        return html`<button
            type="button"
            aria-label="Go to previous page"
            aria-disabled=${ariaDisabled}
            ?disabled=${isFirstPage}
            @click=${e => this.onPageClick(this.normalizedCurrentPage - 1, e)}
        >
            &lt;
        </button>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderNextPageLink() {
        const pageCount = this.normalizedPageCount;
        const isLastPage = this.normalizedCurrentPage === pageCount;
        const ariaDisabled = isLastPage ? 'true' : 'false';

        return html`<button
            type="button"
            aria-label="Go to next page"
            aria-disabled=${ariaDisabled}
            ?disabled=${isLastPage}
            @click=${e => this.onPageClick(this.normalizedCurrentPage + 1, e)}
        >
            &gt;
        </button>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderPageLink(pageNo) {
        const isActive = this.normalizedCurrentPage === pageNo;
        const ariaCurrent = isActive ? 'page' : nothing;
        const ariaDisabled = isActive ? 'true' : 'false';
        const ariaLabel = `Go to page ${pageNo}`;

        return html`<button
            type="button"
            aria-label=${ariaLabel}
            aria-current=${ariaCurrent}
            aria-disabled=${ariaDisabled}
            ?disabled=${isActive}
            @click=${e => this.onPageClick(pageNo, e)}
        >
            ${pageNo}
        </button>`;
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        if (!this.showPagination) return html``;

        return html`<nav aria-label=${this.ariaLabel}>
            <ul class="pagination">
                <li>${this.renderPrevPageLink()}</li>

                <li>${this.renderPageLink(1)}</li>

                ${this.showLeftEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                <!-- Visible page links will be rendered here -->
                ${this.visiblePages.map(pageNo => html`<li>${this.renderPageLink(pageNo)}</li> `)}
                <!-- Visible page links will be rendered here -->

                ${this.showRightEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                <li>${this.renderPageLink(this.normalizedPageCount)}</li>

                <li>${this.renderNextPageLink()}</li>
            </ul>
        </nav>`;
    }

    /**
     * Handles page navigation requests and dispatches a page-click event for valid targets.
     * @param {number} pageNo
     * @param {MouseEvent} event
     * @returns {void}
     */
    onPageClick(pageNo, event) {
        event.preventDefault();

        if (pageNo < 1 || pageNo > this.normalizedPageCount || pageNo === this.normalizedCurrentPage) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent('page-click', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                    page: pageNo,
                    originalEvent: event,
                    synthetic: false,
                },
            })
        );
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
