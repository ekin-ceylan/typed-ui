import { createAttrType, createEventType } from '../../../utilities/common-arg-types.js';
import { Pagination } from '../../../utilities/register.js';
import '../../../assets/styles/pagination.css';
import '../../../assets/styles/custom.css';
import { defineComponent } from '../../../../dist/typed-ui.js';
import { CustomPagination1, CustomPagination2, CustomPagination3 } from '../../custom/custom-pagination.js';

export default {
    title: 'Bileşenler/Table/Pagination',
    argTypes: {
        currentPage: createAttrType('Aktif sayfa numarası.', 'number', '1', false, 'current-page'),
        pageCount: createAttrType('Toplam sayfa sayısı.', 'number', '1', false, 'page-count'),
        siblingCount: createAttrType('Aktif sayfanın yanındaki sayfa sayısı.', 'number', '2', false, 'sibling-count'),
        ariaLabel: createAttrType('Sayfalama bileşeni için ARIA etiketi.', 'string', 'Pagination', false, 'aria-label'),
    },
};

export const Default = {
    render: args => Pagination(args),
    args: {
        currentPage: 5,
        pageCount: 20,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const Initial = {
    render: args => {
        const page = Pagination(args);

        page.addEventListener('page-change-request', event => {
            const { page: requestedPage } = event.detail;
            event.target.currentPage = requestedPage;
        });

        return page;
    },
    args: {
        currentPage: 5,
        pageCount: 20,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
    tags: ['!dev'],
};

export const PlaygroundStory = {
    render: args => Pagination(args),
    tags: ['!dev'],
    args: {
        currentPage: 5,
        pageCount: 20,
        ariaLabel: 'Sayfalama',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        pageChangeRequest: createEventType('page-change-request', 'Kullanıcı sayfa değişikliği talep ettiğinde tetiklenir.', 'page: Number'),
    },
};

export const CustomPagination_1 = {
    render: args => {
        const page = Pagination(args);

        page.addEventListener('page-change-request', event => {
            const { page: newPage } = event.detail;
            const siblingCount = newPage > 16 || newPage < 5 ? Math.max(newPage - 16, 5 - newPage) : 1;
            const target = event.target;
            target.currentPage = newPage;
            target.siblingCount = siblingCount;
        });

        return page;
    },
    args: {
        currentPage: 5,
        pageCount: 20,
        siblingCount: 1,
    },
    tags: ['!dev'],
};

export const CustomPagination_2 = {
    render: _args => {
        defineComponent('custom-page-1', CustomPagination1);
        const page = new CustomPagination1();
        initPagination(page, ['pagination']);

        return page;
    },
    args: {
        currentPage: 5,
        pageCount: 20,
        siblingCount: 1,
    },
    tags: ['!dev'],
};

export const CustomPagination_3 = {
    render: _args => {
        defineComponent('custom-page-2', CustomPagination2);
        const page = new CustomPagination2();
        initPagination(page, ['pagination', 'custom-page-2']);

        return page;
    },
    args: {
        currentPage: 5,
        pageCount: 20,
        siblingCount: 1,
    },
    tags: ['!dev'],
};

export const CustomPagination_4 = {
    render: _args => {
        defineComponent('custom-page-3', CustomPagination3);
        const page = new CustomPagination3();
        initPagination(page, ['pagination']);

        return page;
    },
    args: {
        currentPage: 5,
        pageCount: 20,
        siblingCount: 1,
    },
    tags: ['!dev'],
};

function initPagination(page, classList = [], currentPage = 10, pageCount = 20, siblingCount = 2) {
    page.setAttribute('sibling-count', siblingCount);
    page.setAttribute('page-count', pageCount);
    page.setAttribute('current-page', currentPage);
    page.classList.add(...classList);

    page.addEventListener('page-change-request', event => {
        const { page: newPage } = event.detail;
        event.target.currentPage = newPage;
    });
}
