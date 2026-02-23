import { checkTcNo } from '../../modules/utilities';
import CodeBox from './code-box';

/** @extends CodeBox */
export default class TcBox extends CodeBox {
    constructor() {
        super();

        this.digits = 11;
    }

    willUpdate(changed) {
        if (changed.has('digits') && this.digits !== 11) {
            this.digits = 11; // Zorunlu 11 rakam
        }

        super.willUpdate(changed);
    }

    validate(value) {
        const validationMessage = super.validate(value);

        if (validationMessage) {
            return validationMessage;
        }

        if (value && !checkTcNo(value)) {
            return this.patternValidationMessage || 'Geçersiz TC Kimlik Numarası';
        }
    }
}
