export function initSidebar() {
    window.toggleSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});