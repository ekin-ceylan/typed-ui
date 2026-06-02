import { checkTcNo, sanitizeHtml, stringFormat } from '../../../modules/utilities.js';

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

describe('utilities:sanitizeHtml', () => {
    it('removes blocked tags such as script and iframe', () => {
        const raw = '<div>safe</div><script>alert(1)</script><iframe src="https://x.example"></iframe>';

        expect(sanitizeHtml(raw)).toBe('<div>safe</div>');
    });

    it('removes inline event handler attributes', () => {
        const raw = '<button onclick="alert(1)" onmouseover="x()">Click</button>';

        expect(sanitizeHtml(raw)).toBe('<button>Click</button>');
    });

    it('removes style attribute', () => {
        const raw = '<p style="color:red;display:none">Text</p>';

        expect(sanitizeHtml(raw)).toBe('<p>Text</p>');
    });

    it('removes javascript protocol from href and src attributes', () => {
        const raw = '<a href="javascript:alert(1)">link</a><img src="javascript:alert(1)">';

        expect(sanitizeHtml(raw)).toBe('<a>link</a><img>');
    });

    it('removes data:text/html protocol from href and src attributes', () => {
        const raw = '<a href="data:text/html,<script>alert(1)</script>">x</a><img src="data:text/html;base64,AA==">';

        expect(sanitizeHtml(raw)).toBe('<a>x</a><img>');
    });

    it('preserves safe content and benign attributes', () => {
        const raw = '<a href="https://example.com" target="_blank" rel="noopener">safe</a>';

        expect(sanitizeHtml(raw)).toBe('<a href="https://example.com" target="_blank" rel="noopener">safe</a>');
    });

    it('treats dangerous protocols case-insensitively with surrounding spaces', () => {
        const raw = '<a href="  JaVaScRiPt:alert(1)  ">x</a><img src="  DATA:TEXT/HTML;base64,AA==  ">';

        expect(sanitizeHtml(raw)).toBe('<a>x</a><img>');
    });
});
