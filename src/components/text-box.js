import { BaseInput } from './base-input';

export class TextBox extends BaseInput {
    constructor() {
        super();
        this.type = 'text';
        this.inputmode = 'text';
        this.pattern = '[a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎ ]+';
    }
}

customElements.define('text-box', TextBox);
