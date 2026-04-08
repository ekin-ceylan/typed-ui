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

    /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
    prevPageLabel = 'Önceki Sayfaya git: Sayfa';
    /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
    nextPageLabel = 'Sonraki Sayfaya git: Sayfa';
    /** @type {string} Accessible labels for pagination controls. These can be customized to provide better context in different languages or use cases. */
    pageLabel = 'Sayfaya git: Sayfa';

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
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderEllipsis() {
        return html`<span aria-hidden="true"> ... </span>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderPrevPageLink() {
        const isFirstPage = this.normalizedCurrentPage === 1;
        const ariaDisabled = isFirstPage ? 'true' : 'false';
        const pageNo = this.normalizedCurrentPage - 1;
        const ariaLabel = `${this.prevPageLabel} ${pageNo}`;

        return html`<button type="button" aria-label=${ariaLabel} aria-disabled=${ariaDisabled} ?disabled=${isFirstPage} @click=${e => this.requestPage(pageNo, e)}>&lt;</button>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderNextPageLink() {
        const pageCount = this.normalizedPageCount;
        const isLastPage = this.normalizedCurrentPage === pageCount;
        const ariaDisabled = isLastPage ? 'true' : 'false';
        const pageNo = this.normalizedCurrentPage + 1;
        const ariaLabel = `${this.nextPageLabel} ${pageNo}`;

        return html`<button type="button" aria-label=${ariaLabel} aria-disabled=${ariaDisabled} ?disabled=${isLastPage} @click=${e => this.requestPage(pageNo, e)}>&gt;</button>`;
    }

    /**
     * Renders the link for the first page. By default, this calls `renderPageLink(1)` to render a standard page link for page 1.
     * Subclasses can override this method to provide a custom rendering for the first page link (e.g. using a double left arrow icon).
     *
     * Default implementation:
     * ```
     * return this.renderPageLink(1);
     * ```
     * @return {import('lit').TemplateResult | typeof nothing}
     */
    renderFirstPageLink() {
        return this.renderPageLink(1);
    }

    /**
     * Renders the link for the last page. By default, this calls `renderPageLink(this.normalizedPageCount)` to render a standard page link for the last page.
     * Subclasses can override this method to provide a custom rendering for the last page link (e.g. using a double right arrow icon).
     *
     * Default implementation:
     * ```
     * return this.renderPageLink(this.normalizedPageCount);
     * ```
     * @return {import('lit').TemplateResult | typeof nothing}
     */
    renderLastPageLink() {
        return this.renderPageLink(this.normalizedPageCount);
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
    renderPageLink(pageNo) {
        const isActive = this.normalizedCurrentPage === pageNo;
        const ariaCurrent = isActive ? 'page' : nothing;
        const ariaDisabled = isActive ? 'true' : 'false';
        const ariaLabel = `${this.pageLabel} ${pageNo}`;

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
     * Renders the leading controls for the pagination component, typically including the previous page and first page links.
     *
     * Default implementation:
     * ```
     * return html`
     *      <li>${this.renderPrevPageLink()}</li>
     *      <li>${this.renderFirstPageLink()}</li>`;
     * ```
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderLeadingControls() {
        return html`<li>${this.renderPrevPageLink()}</li>
            <li>${this.renderFirstPageLink()}</li>`;
    }

    /**
     * Renders the trailing controls for the pagination component, typically including the next page and last page links.
     *
     * Default implementation:
     * ```
     * return html`
     *      <li>${this.renderNextPageLink()}</li>
     *      <li>${this.renderLastPageLink()}</li>`;
     * ```
     * @returns {import('lit').TemplateResult | typeof nothing}
     */
    renderTrailingControls() {
        return html`<li>${this.renderLastPageLink()}</li>
            <li>${this.renderNextPageLink()}</li>`;
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
                ${this.renderLeadingControls()}

                ${this.showLeftEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                ${this.visiblePages.map(pageNo => html`<li>${this.renderPageLink(pageNo)}</li>`)}
                ${this.renderAdornment()}

                ${this.showRightEllipsis ? html`<li>${this.renderEllipsis()}</li>` : nothing}

                ${this.renderTrailingControls()}
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
