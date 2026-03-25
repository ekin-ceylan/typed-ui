import { createAttrType } from '../../../utilities/common-arg-types.js';
import { Pagination } from '../../../utilities/register.js';
import './pagination.css';

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
