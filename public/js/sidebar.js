export function initSidebar() {
    console.log('Inicializando sidebar...');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    console.log('Sidebar:', sidebar);
    console.log('Toggle Button:', toggleButton);
    console.log('Main Content:', mainContent);
    console.log('Overlay:', overlay);

    if (!toggleButton || !mainContent || !sidebar) {
        console.error('Fallo al encontrar elementos:', { toggleButton, mainContent, sidebar });
        return;
    }

    window.toggleSidebar = function() {
        console.log('ToggleSidebar ejecutado');
        sidebar.classList.toggle('collapsed');
        overlay.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    };

    // Cerrar al hacer clic fuera
    overlay.addEventListener('click', () => {
        console.log('Click detectado fuera de la sidebar');
        sidebar.classList.remove('collapsed');
        overlay.classList.remove('active');
        mainContent.classList.remove('shifted');
    });

    // Cerrar con tecla Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('collapsed')) {
            console.log('Tecla Esc presionada');
            sidebar.classList.remove('collapsed');
            overlay.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
    });

    // Estado inicial: oculta
    sidebar.classList.remove('collapsed');
    overlay.classList.remove('active');
    mainContent.classList.remove('shifted');
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});

export function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}
