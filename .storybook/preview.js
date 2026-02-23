/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
    parameters: {
        options: {
            storySort: {
                order: [['Başlangıç'], 'Kavramlar', 'Kılavuzlar', 'YZ Araçları', 'Bileşenler', 'Textbox', ['TextBox', 'PhoneBox', 'PlateBox', 'PasswordBox']],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },

        docs: {
            source: {
                transform: async source => {
                    const prettier = await import('prettier/standalone');
                    const prettierPluginHtml = await import('prettier/plugins/html');

                    return prettier.format(source, {
                        parser: 'html',
                        plugins: [prettierPluginHtml],
                        printWidth: 180,
                        htmlWhitespaceSensitivity: 'ignore',
                    });
                },
            },
        },
    },
};

export default preview;
