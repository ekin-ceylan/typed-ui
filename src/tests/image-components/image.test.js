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

    it('renders fallback text when the image errors and fallbackText is provided', async () => {
        const host = await initImage({ src: '/broken.jpg', alt: 'Broken image', fallbackText: 'Image failed to load.' });

        host.querySelector('img')?.dispatchEvent(new Event('error'));
        await host.updateComplete;

        expect(host.querySelector('[data-role="image-fallback-text"]')?.textContent).toBe('Image failed to load.');
    });

    it('dispatches an error event even when fallback text is rendered', async () => {
        const host = await initImage({ src: '/broken.jpg', alt: 'Broken image', fallbackText: 'Image failed to load.' });
        const eventPromise = new Promise(resolve => host.addEventListener('error', resolve, { once: true }));

        host.querySelector('img')?.dispatchEvent(new Event('error'));

        const event = await eventPromise;

        expect(event.detail.originalEvent).toBeInstanceOf(Event);
    });

    it('dispatches an error event without rendering fallback text when fallbackText is missing', async () => {
        const host = await initImage({ src: '/broken.jpg', alt: 'Broken image' });
        const eventPromise = new Promise(resolve => host.addEventListener('error', resolve, { once: true }));

        host.querySelector('img')?.dispatchEvent(new Event('error'));
        await host.updateComplete;

        const event = await eventPromise;

        expect(event.detail.originalEvent).toBeInstanceOf(Event);
        expect(host.querySelector('[data-role="image-fallback-text"]')).toBeNull();
    });

    it('clears the error fallback when src changes', async () => {
        const host = await initImage({ src: '/broken.jpg', alt: 'Broken image', fallbackText: 'Image failed to load.' });

        host.querySelector('img')?.dispatchEvent(new Event('error'));
        await host.updateComplete;
        host.src = '/hero.jpg';
        await host.updateComplete;

        expect(host.querySelector('[data-role="image-fallback-text"]')).toBeNull();
        expect(host.querySelector('img')).not.toBeNull();
    });
});
