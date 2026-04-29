import Image from '../../components/image/image.js';

defineElement('typed-image', Image);

async function initImage(props = {}) {
    const host = document.createElement('typed-image');
    Object.assign(host, props);
    document.body.appendChild(host);
    await host.updateComplete;
    return host;
}

describe('Image', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('warns when alt is missing and image is not decorative', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await initImage({ src: '/hero.jpg' });

        expect(warnSpy).toHaveBeenCalledWith(
            "typed-image: 'alt' attribute is missing. Provide descriptive text, or set 'decorative' to indicate the image is intentionally presentation-only."
        );
    });

    it('does not warn about alt when alt is provided', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await initImage({ src: '/hero.jpg', alt: 'Hero image' });

        expect(warnSpy).not.toHaveBeenCalledWith(
            "typed-image: 'alt' attribute is missing. Provide descriptive text, or set 'decorative' to indicate the image is intentionally presentation-only."
        );
    });

    it('does not warn about alt when image is decorative', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await initImage({ src: '/hero.jpg', decorative: true });

        expect(warnSpy).not.toHaveBeenCalledWith(
            "typed-image: 'alt' attribute is missing. Provide descriptive text, or set 'decorative' to indicate the image is intentionally presentation-only."
        );
    });

    it('renders empty alt text when the image is decorative', async () => {
        const host = await initImage({ src: '/hero.jpg', alt: 'Hero image', decorative: true });

        expect(host.querySelector('img')?.getAttribute('alt')).toBe('');
    });
});
