import { Pagination } from '../../../utilities/register.js';
import './pagination.css';

export default {
    title: 'Bileşenler/Table/Pagination',
    argTypes: {
        currentPage: {
            name: 'current-page',
            description: 'Aktif sayfa numarası.',
            control: 'number',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '1' },
                type: { summary: 'number' },
            },
        },
        pageCount: {
            name: 'page-count',
            type: { name: 'number' },
            description: 'Toplam sayfa sayısı.',
            control: 'number',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '1' },
            },
        },
        siblingCount: {
            name: 'sibling-count',
            description: 'Aktif sayfanın yanındaki sayfa sayısı. \n\n Type: `number` Default: `2`',
            control: 'number',
            table: {
                category: 'Attributes',
            },
        },
        ariaLabel: {
            name: 'aria-label',
            description: 'Sayfalama bileşeni için ARIA etiketi.',
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'Pagination' },
            },
        },
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
