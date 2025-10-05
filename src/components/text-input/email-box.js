import { BaseInput } from './base-input';

export class EmailBox extends BaseInput {
    constructor() {
        super();
        this.type = 'email';
        this.inputmode = 'email';
        this.placeholder = '____@____.___';
    }
}

customElements.define('email-box', EmailBox);
