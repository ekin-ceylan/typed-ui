import { BaseInput } from './base-input';

export class TextBox extends BaseInput {
    constructor() {
        super();
        this.type = 'text';
        this.pattern = '[a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎ ]+';
        this.inputmode = 'text';
    }
}

customElements.define('text-box', TextBox);
