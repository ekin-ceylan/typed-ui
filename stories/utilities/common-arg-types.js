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
        description: 'Inputun tuttuğu değer.',
        control: 'text',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'null' },
            type: { summary: 'string' },
        },
    },
    required: {
        control: 'boolean',
        description: 'Inputun doldurulmasının zorunlu olup olmadığını belirler ve `valueMissing` durumunu etkiler. Açıksa, label metninin sonuna otomatik olarak `*` eklenir.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 'false' },
            type: { summary: 'boolean' },
        },
    },
    disabled: {
        control: 'boolean',
        description: 'Inputun devre dışı olup olmadığını belirler. Devre dışıysa, input etkileşime kapatılır ve form ile gönderilmez.',
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

export const codeBoxArgTypes = {
    ...textBoxArgTypes,
    placeholder: {
        type: { name: 'string' },
        control: 'text',
        description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
        table: {
            category: 'Attributes',
            defaultValue: { summary: '_' },
        },
    },
    digits: {
        type: { name: 'number' },
        defaultValue: 1,
        description: "Inputun kaç haneli olduğunu belirler. `1`'den küçük veya geçersiz bir değer verilirse, `1` olarak atanır.",
        control: 'number',
        table: {
            category: 'Attributes',
            defaultValue: { summary: 1 },
            type: { summary: 'number' },
        },
    },
};
