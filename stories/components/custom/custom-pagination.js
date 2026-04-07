import { html, Pagination } from '../../../src';

export class CustomPagination1 extends Pagination {
    renderFirstPageLink() {
        const isActive = this.normalizedCurrentPage === 1;
        const ariaDisabled = isActive ? 'true' : 'false';
        const ariaLabel = `Go to page 1`;

        return html`<button type="button" aria-label=${ariaLabel} aria-disabled=${ariaDisabled} ?disabled=${isActive} @click=${e => this.requestPage(1, e)}>&lt;&lt;</button>`;
    }

    renderLastPageLink() {
        const isActive = this.normalizedCurrentPage === this.normalizedPageCount;
        const ariaDisabled = isActive ? 'true' : 'false';
        const ariaLabel = `Go to page ${this.normalizedPageCount}`;

        return html`<button type="button" aria-label=${ariaLabel} aria-disabled=${ariaDisabled} ?disabled=${isActive} @click=${e => this.requestPage(this.normalizedPageCount, e)}>
            &gt;&gt;
        </button>`;
    }

    renderLeadingControls() {
        return html`<li>${this.renderFirstPageLink()}</li>
            <li>${this.renderPrevPageLink()}</li>`;
    }

    renderTrailingControls() {
        return html`<li>${this.renderNextPageLink()}</li>
            <li>${this.renderLastPageLink()}</li>`;
    }

    get showLeftEllipsis() {
        return false;
    }

    get showRightEllipsis() {
        return false;
    }

    get visiblePages() {
        const siblingCount = Math.max(0, Number(this.siblingCount) || 0);
        const length = 2 * siblingCount + 1;
        const min = Math.max(Math.min(this.normalizedCurrentPage - siblingCount, this.normalizedPageCount - length + 1), 1);

        return Array.from({ length }, (_value, index) => min + index);
    }
}

export class CustomPagination2 extends CustomPagination1 {
    get visiblePages() {
        return [];
    }

    renderAdornment() {
        return html`<li>
            <span><span>(${this.normalizedCurrentPage}</span> of <span>${this.normalizedPageCount})</span></span>
        </li>`;
    }
}

export class CustomPagination3 extends CustomPagination1 {
    renderAdornment() {
        return html`<li class="mobile-only">
            <span><span>(${this.normalizedCurrentPage}</span> of <span>${this.normalizedPageCount})</span></span>
        </li>`;
    }
}
