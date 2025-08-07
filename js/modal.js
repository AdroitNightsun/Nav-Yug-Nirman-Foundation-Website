document.addEventListener('DOMContentLoaded', () => {
    let activeModal = null;

    function openModal(modal) {
        if (!modal) return;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        activeModal = modal;
        trapFocus(modal);
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        activeModal = null;
    }

    function createModal(options) {
        const { id, title, content, type = 'info', confirmText = 'Confirm', cancelText = 'Cancel' } = options;

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `modal ${type}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `${id}-title`);

        let modalContentHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="${id}-title">${title}</h2>
                    <span class="close-button" role="button" aria-label="Close">&times;</span>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
        `;

        if (type === 'confirmation') {
            modalContentHTML += `
                <div class="modal-footer">
                    <button class="btn btn-secondary cancel-btn">${cancelText}</button>
                    <button class="btn btn-primary confirm-btn">${confirmText}</button>
                </div>
            `;
        }

        modalContentHTML += `</div>`;
        modal.innerHTML = modalContentHTML;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-button');
        const cancelBtn = modal.querySelector('.cancel-btn');

        closeBtn.addEventListener('click', () => closeModal(modal));
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal(modal));
        }

        // Close modal on escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeModal === modal) {
                closeModal(modal);
            }
        });

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        return modal;
    }

    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });

        if (firstElement) {
            firstElement.focus();
        }
    }

    // Expose functions to global scope
    window.createModal = createModal;
    window.openModal = openModal;
    window.closeModal = closeModal;
});
