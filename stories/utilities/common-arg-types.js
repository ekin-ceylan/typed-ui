export const textBoxArgTypes = {
    fieldId: {
        name: 'field-id',
        type: { name: 'string' },
        control: 'text',
        description: 'Input elementinin `id` özniteliğini belirler. Eğer belirtilmezse, otomatik olarak bir değer atanır.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    fieldName: {
        name: 'field-name',
        type: { name: 'string' },
        control: 'text',
        description: 'Input elementinin `name` özniteliğini belirler. Alanın, arka uçtaki ismi yazılmalıdır. Boş bırakılırsa, inputun değeri form ile gönderilmez.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'field-id' },
        },
    },
    label: {
        type: { name: 'string', required: true },
        control: 'text',
        description: 'Input etiketi',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
    value: {
        type: { name: 'string' },
        defaultValue: undefined,
        description: 'Plaka kutusunun tuttuğu değer.',
        control: 'text',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'null' },
            type: { summary: 'string' },
        },
    },
    required: {
        control: 'boolean',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    disabled: {
        control: 'boolean',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    placeholder: {
        type: { name: 'string' },
        control: 'text',
        description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '' },
        },
    },
};
