export function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const mainContent = document.querySelector('.main-content');

    if (!toggleButton || !mainContent || !sidebar) {
        console.error('Fallo al encontrar elementos:', { toggleButton, mainContent, sidebar });
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('shifted');
        overlay.classList.toggle('visible');
    }

    toggleButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('collapsed') === false) {
            toggleSidebar();
        }
    });
}
