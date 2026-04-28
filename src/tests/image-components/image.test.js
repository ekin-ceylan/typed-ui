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

    it('warns when width and height are missing because it can increase CLS', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await initImage({ src: '/hero.jpg', alt: 'Hero image' });

        expect(warnSpy).toHaveBeenCalledWith("typed-image: 'width' attribute is missing. Provide image dimensions to reduce layout shift (CLS).");
        expect(warnSpy).toHaveBeenCalledWith("typed-image: 'height' attribute is missing. Provide image dimensions to reduce layout shift (CLS).");
    });

    it('does not warn about CLS when both width and height are provided', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await initImage({ src: '/hero.jpg', alt: 'Hero image', width: 640, height: 360 });

        expect(warnSpy).not.toHaveBeenCalledWith("typed-image: 'width' attribute is missing. Provide image dimensions to reduce layout shift (CLS).");
        expect(warnSpy).not.toHaveBeenCalledWith("typed-image: 'height' attribute is missing. Provide image dimensions to reduce layout shift (CLS).");
    });

    it('renders empty alt text when the image is decorative', async () => {
        const host = await initImage({ src: '/hero.jpg', alt: 'Hero image', decorative: true });

        expect(host.querySelector('img')?.getAttribute('alt')).toBe('');
    });
});
