import { ComboBox, html, nothing } from '../../../src';

export class CustomCombobox extends ComboBox {
    renderSearchInput() {
        return nothing;
    }
    renderListContent() {
        return html`${super.renderSearchInput()} ${super.renderListContent()}`;
    }

    constructor() {
        super();
        this.classList.add('combo-box');
    }
}
