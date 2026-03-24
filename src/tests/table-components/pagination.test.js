import Pagination from '../../components/table/pagination.js';

defineElement('typed-pagination', Pagination);

async function initPagination(props = {}) {
    const host = document.createElement('typed-pagination');
    Object.assign(host, props);
    document.body.appendChild(host);
    await host.updateComplete;
    return host;
}

describe('Pagination', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('does not render pagination markup when only one page exists', async () => {
        const host = await initPagination({ currentPage: 1, pageCount: 1 });

        expect(host.querySelector('.pagination')).toBeNull();
    });

    it('renders visible pages and ellipsis around the current page', async () => {
        const host = await initPagination({ currentPage: 10, pageCount: 20 });
        const pageLinks = Array.from(host.querySelectorAll('li button'));
        const numericLabels = pageLinks.map(link => link.textContent.trim()).filter(label => /^\d+$/.test(label));
        const ellipsisNodes = host.querySelectorAll('li > span[aria-hidden="true"]');

        expect(numericLabels).toEqual(['1', '7', '8', '9', '10', '11', '12', '13', '20']);
        expect(ellipsisNodes.length).toBe(2);
    });

    it('respects siblingCount when calculating visible pages', async () => {
        const host = await initPagination({ currentPage: 10, pageCount: 20, siblingCount: 1 });
        const pageLinks = Array.from(host.querySelectorAll('li button'));
        const numericLabels = pageLinks.map(link => link.textContent.trim()).filter(label => /^\d+$/.test(label));

        expect(numericLabels).toEqual(['1', '9', '10', '11', '20']);
    });

    it('dispatches page-click when the first page button is clicked', async () => {
        const host = await initPagination({ currentPage: 2, pageCount: 5 });

        const eventPromise = new Promise(resolve => {
            host.addEventListener('page-click', resolve, { once: true });
        });

        const firstLink = host.querySelector('li button[aria-label="Go to page 1"]');
        firstLink.click();

        const event = await eventPromise;

        expect(event.detail.page).toBe(1);
        expect(event.detail.originalEvent).toBeInstanceOf(Event);
    });

    it('does not dispatch page-click for the active page', async () => {
        const host = await initPagination({ currentPage: 3, pageCount: 5 });
        const onPageClick = vi.fn();

        host.addEventListener('page-click', onPageClick);

        const activeLink = host.querySelector('button[aria-current="page"]');
        activeLink.click();

        expect(onPageClick).not.toHaveBeenCalled();
        expect(activeLink.getAttribute('aria-current')).toBe('page');
    });
});
