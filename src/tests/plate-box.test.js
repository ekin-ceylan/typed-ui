import { describe, it, expect, beforeEach } from 'vitest';
import { typeSequence, backspace, paste } from './interaction-helper.js';

describe('PlateBox interaction', () => {
    let host, input;

    /* <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box> */

    beforeEach(async () => {
        document.body.innerHTML = '<plate-box minlength="7" required></plate-box>';
        host = document.querySelector('plate-box');
        await host.updateComplete;
        input = host.inputElement;
        input.focus();
    });

    it('formats while typing full plate', async () => {
        await typeSequence(input, '34ABC123');
        expect(input.value).toBe('34 ABC 123');
    });

    it('handles backspace', async () => {
        await typeSequence(input, '34ABC1');
        backspace(input);
        expect(input.value).toBe('34 ABC');
    });

    it('paste formats', () => {
        paste(input, '06BC4567');
        expect(input.value).toBe('06 BC 4567');
    });
});
