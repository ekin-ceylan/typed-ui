import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import ModalDialog from '../../components/modal-dialog.js';

// Define custom element if not already defined
if (!customElements.get('modal-dialog')) {
    customElements.define('modal-dialog', ModalDialog);
}

describe('ModalDialog Component', () => {
    let modal;
    let container;
    const showModalSpy = vi.fn();
    const closeSpy = vi.fn();

    beforeEach(async () => {
        // Mock dialog methods (browser mode'da native <dialog> var ama spy için mock edelim)
        HTMLDialogElement.prototype.showModal = showModalSpy;
        HTMLDialogElement.prototype.close = closeSpy;

        // Use fake timers for animation/timeout control
        vi.useFakeTimers();

        // Create container and modal
        container = document.createElement('div');
        document.body.appendChild(container);

        modal = document.createElement('modal-dialog');
        container.appendChild(modal);
        await modal.updateComplete;

        // Clear spies
        showModalSpy.mockClear();
        closeSpy.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
        container.remove();
    });

    describe('Initialization', () => {
        it('should initialize with correct default properties', () => {
            expect(modal.open).toBe(false);
        });

        it('should render correct structure', async () => {
            const dialog = modal.querySelector('dialog');
            const isOpen = dialog.hasAttribute('open');
            const closeButton = modal.querySelector("[data-role='close']");

            expect(dialog).not.toBeNull();
            expect(isOpen).toBe(false); // dialog should not be open initially

            expect(closeButton).not.toBeNull();
        });

        it('should have slot for content', async () => {
            const slot = modal.querySelector('slot');
            expect(slot).toBeNull();
        });
    });

    describe('Show/Hide API', () => {
        it('should show modal when show() is called', () => {
            modal.show();
            expect(modal.open).toBe(true);
        });

        it('should hide modal when hide() is called', () => {
            modal.open = true;
            modal.hide();
            expect(modal.open).toBe(false);
        });

        it('should toggle open property correctly', () => {
            expect(modal.open).toBe(false);

            modal.show();
            expect(modal.open).toBe(true);

            modal.hide();
            expect(modal.open).toBe(false);
        });
    });

    describe('Dialog Interaction', () => {
        it('should call showModal when opening', async () => {
            modal.show();
            await modal.updateComplete;
            expect(showModalSpy).toHaveBeenCalled();
        });

        it('should add active class after timeout when showing', async () => {
            const dialog = modal.querySelector('dialog');
            modal.show();
            await modal.updateComplete;

            // Initially no active attribute
            expect(dialog.dataset.active).toBeUndefined();

            // Fast-forward time past animation delay
            vi.advanceTimersByTime(20);

            expect(dialog.dataset.active).not.toBeUndefined();
        });

        it('should remove active class immediately when hiding', async () => {
            const dialog = modal.querySelector('dialog');

            // First show the modal
            modal.show();
            await modal.updateComplete;
            expect(dialog.dataset.active).toBeUndefined();

            vi.advanceTimersByTime(20);
            expect(dialog.dataset.active).not.toBeUndefined();

            // Then hide it
            modal.hide();
            await modal.updateComplete;
            expect(dialog.dataset.active).toBeUndefined();
        });

        it('should call close after timeout when hiding', async () => {
            modal.show();
            modal.hide();

            // Close should not be called immediately
            expect(closeSpy).not.toHaveBeenCalled();

            // Fast-forward to after hide timeout (300ms)
            vi.advanceTimersByTime(300);

            expect(closeSpy).toHaveBeenCalled();
        });
    });

    describe('Close Button', () => {
        it('should hide modal when close button is clicked', async () => {
            modal.show();
            await modal.updateComplete;
            expect(modal.open).toBe(true);

            const closeButton = modal.querySelector("[data-role='close']");
            closeButton.click();

            expect(modal.open).toBe(false);
        });

        it('should have correct accessibility attributes', async () => {
            const closeButton = modal.querySelector("[data-role='close']");

            expect(closeButton.getAttribute('aria-label')).toBe('Close');
            expect(closeButton.getAttribute('type')).toBe('button');
        });
    });

    describe('Content Slotting', () => {
        it('should handle slot replacement correctly', async () => {
            // Create modal with content
            const modalWithContent = document.createElement('modal-dialog');
            const contentDiv = document.createElement('div');
            contentDiv.textContent = 'Test Content';
            modalWithContent.appendChild(contentDiv);

            container.appendChild(modalWithContent);
            await modalWithContent.updateComplete;

            // Check if content is present in Light DOM
            const dialog = modalWithContent.querySelector('dialog');
            expect(dialog.textContent).toContain('Test Content');

            modalWithContent.remove();
        });

        it('should work with multiple content elements', async () => {
            const modalWithContent = document.createElement('modal-dialog');

            const title = document.createElement('h2');
            title.textContent = 'Error Title';
            const message = document.createElement('p');
            message.textContent = 'Error Message';

            modalWithContent.appendChild(title);
            modalWithContent.appendChild(message);

            container.appendChild(modalWithContent);
            await modalWithContent.updateComplete;

            const dialog = modalWithContent.querySelector('dialog');
            expect(dialog.textContent).toContain('Error Title');
            expect(dialog.textContent).toContain('Error Message');

            modalWithContent.remove();
        });
    });

    describe('Timeout Management', () => {
        it('should clear existing timeout when showing multiple times', async () => {
            const dialog = modal.querySelector('dialog');

            modal.show();
            modal.show(); // Call show again before timeout
            await modal.updateComplete;

            // Only one timeout should be active
            vi.advanceTimersByTime(20);

            // Should still add active class
            expect(dialog.dataset.active).not.toBeUndefined();
        });

        it('should clear existing timeout when hiding multiple times', async () => {
            modal.show();
            modal.hide();
            modal.hide(); // Call hide again before timeout
            await modal.updateComplete;

            // Should still work correctly
            vi.advanceTimersByTime(300);
            expect(closeSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Edge Cases', () => {
        it('should handle show/hide when not yet in DOM', () => {
            const newModal = document.createElement('modal-dialog');
            // Don't append to DOM

            expect(() => {
                newModal.show();
                newModal.hide();
            }).not.toThrow();
        });

        it('should handle rapid show/hide sequences', async () => {
            // Rapid sequence
            modal.show();
            await modal.updateComplete;

            modal.hide();
            modal.show();
            await modal.updateComplete;

            modal.hide();

            expect(() => {
                vi.advanceTimersByTime(500);
            }).not.toThrow();
        });

        it('should maintain state consistency during rapid operations', async () => {
            modal.show();
            await modal.updateComplete;
            expect(modal.open).toBe(true);

            modal.hide();
            expect(modal.open).toBe(false);

            modal.show();
            await modal.updateComplete;
            expect(modal.open).toBe(true);
        });
    });
});
