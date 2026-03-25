import { paginationArgTypes } from '../../../utilities/common-arg-types.js';
import { Pagination } from '../../../utilities/register.js';
import './pagination.css';

export default {
    title: 'Bileşenler/Table/Pagination',
    argTypes: paginationArgTypes,
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
