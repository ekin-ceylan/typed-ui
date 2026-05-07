import { createAttrType } from '../../utilities/common-arg-types.js';
import { Image } from '../../utilities/register.js';
// import '../../assets/styles/modal-dialog.css';

export default {
    component: 'basic-image',
    title: 'Bileşenler/Görsel Bileşenleri/Image',
    argTypes: {
        src: createAttrType('Image source URL', 'string', '""', true),
        srcset: createAttrType('Image source URL', 'string'),
        sizes: createAttrType('Image sizes attribute', 'string'),
        decorative: createAttrType('Indicates if the image is decorative', 'boolean', false),
        alt: createAttrType('Alternative text for the image', 'string'),
        width: createAttrType('Width of the image', 'string'),
        height: createAttrType('Height of the image', 'string'),
        loading: createAttrType('Image loading attribute', 'lazy|eager', 'lazy'),
        decoding: createAttrType('Image decoding attribute', 'async|sync', 'async'),
        fetchpriority: createAttrType('Image fetch priority attribute', 'high|low|auto'),
    },
};

export const Default = {
    render: args => Image(args),
    args: {
        src: 'https://picsum.photos/200/300',
        alt: 'Placeholder image',
        width: '300',
        height: '200',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Image(args),
    args: {
        src: 'https://picsum.photos/200/300',
        alt: 'Placeholder image',
        width: '300',
        height: '200',
    },
    tags: ['!dev'],
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
