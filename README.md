# Typed UI

Field/data-type specific, accessible, extensible Web Components library.

**Note:** "Typed" refers to field/data type (currency, number, plate, select, combobox...), not TypeScript.

## Getting Started

> Note: `typed-ui` is not published to npm yet. The commands below assume it is.

First, install the packages (for the default ESM build, `lit` is external):

```bash
npm install typed-ui lit
```

Then import the components you need and register them as custom elements:

```js
import { TextBox, PlateBox, SelectBox, CheckBox } from 'typed-ui';

customElements.define('text-box', TextBox);
customElements.define('plate-box', PlateBox);
customElements.define('select-box', SelectBox);
customElements.define('check-box', CheckBox);
```

Now you can use them in HTML:

```html
<text-box label="Name" required></text-box>
<plate-box label="Plate"></plate-box>
<select-box label="City"></select-box>
```

### Build variants (optional)

Typed UI ships 3 browser-ready builds in the dist folder:

- ESM (external Lit): [dist/typed-ui.js](dist/typed-ui.js) (default export at `typed-ui`)
- ESM (bundled Lit): [dist/typed-ui-with-lit.js](dist/typed-ui-with-lit.js) (export at `typed-ui/with-lit`)
- IIFE (global): [dist/typed-ui.iife.js](dist/typed-ui.iife.js) (export at `typed-ui/iife`, global `window.TypedUI`)

#### 1) ESM (recommended for bundlers) — `typed-ui`

This build treats `lit` as external (peer dependency). Use the install/import steps above.

If you want to use this build directly in the browser (without a bundler), you must provide an import map for `lit` (and `lit/*`).

```html
<!-- Must appear before any <script type="module"> that imports typed-ui -->
<script type="importmap">
    {
        "imports": {
            "lit": "https://unpkg.com/lit@3.3.0/index.js?module",
            "lit/": "https://unpkg.com/lit@3.3.0/"
        }
    }
</script>
```

Then you can import Typed UI from a CDN:

```html
<script type="module">
    import { TextBox, SelectBox } from 'https://unpkg.com/typed-ui/dist/typed-ui.js';

    customElements.define('text-box', TextBox);
    customElements.define('select-box', SelectBox);
</script>
```

If you’re serving the build from your own app (for example from `./dist`), a namespace import can be convenient:

```html
<script type="module">
    import * as TypedUI from './dist/typed-ui.js';

    customElements.define('text-box', TypedUI.TextBox);
    customElements.define('phone-box', TypedUI.PhoneBox);
    customElements.define('select-box', TypedUI.SelectBox);
</script>
```

#### 2) ESM (no import map needed) — `typed-ui-with-lit`

This build bundles `lit` inside, so you can use it directly in the browser without configuring an import map.

```js
import { TextBox, SelectBox } from 'typed-ui/with-lit';

customElements.define('text-box', TextBox);
customElements.define('select-box', SelectBox);
```

Or directly from a CDN:

```html
<script type="module">
    import { TextBox, SelectBox } from 'https://unpkg.com/typed-ui/dist/typed-ui-with-lit.js';

    customElements.define('text-box', TextBox);
    customElements.define('select-box', SelectBox);
</script>

<text-box label="Email"></text-box>
<select-box label="Country"></select-box>
```

#### 3) IIFE (global build) — `typed-ui/iife`

Use this when you prefer a classic script include and a global namespace.

```html
<script src="https://unpkg.com/typed-ui/dist/typed-ui.iife.js"></script>
<script>
    const { TextBox, SelectBox } = window.TypedUI;

    customElements.define('text-box', TextBox);
    customElements.define('select-box', SelectBox);
</script>

<text-box label="Phone"></text-box>
<select-box label="Role"></select-box>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## License

MIT
