import { checkTcNo, stringFormat } from '../../../modules/utilities.js';

describe('utilities:stringFormat', () => {
    it('replaces indexed placeholders and trims values', () => {
        const result = stringFormat('Hello, {0}! Role: {1}', '  Ekin  ', '  Admin ');

        expect(result).toBe('Hello, Ekin! Role: Admin');
    });

    it('replaces null or undefined placeholders with empty string', () => {
        const result = stringFormat('A:{0}|B:{1}|C:{2}', 'x', null, undefined);

        expect(result).toBe('A:x|B:|C:');
    });
});

describe('utilities:checkTcNo', () => {
    it('returns false when value starts with 0', () => {
        expect(checkTcNo('01234567890')).toBe(false);
    });

    it('returns false when value is not 11 digits', () => {
        expect(checkTcNo('12345')).toBe(false);
    });

    it('returns false when checksum does not match', () => {
        expect(checkTcNo('10000000145')).toBe(false);
    });
});
