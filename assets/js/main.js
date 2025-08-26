document.addEventListener("DOMContentLoaded", function() {
    console.log("main.js loaded");
    /**
     * Loads an HTML component into a specified element using root-relative paths.
     * @param {string} url - The URL of the component starting from the root (e.g., '/components/header.html').
     * @param {string} elementId - The ID of the element to load the component into.
     */
    const loadComponent = (url, elementId) => {
        // 直接使用传入的根相对路径进行 fetch
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Component not found at ${url}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) element.innerHTML = data;
            })
            .catch(error => console.error(`Error loading component ${url}:`, error));
    };

    // Load common components using root-relative paths
    loadComponent('/components/header.html', 'header-placeholder');
    loadComponent('/components/footer.html', 'footer-placeholder');
    
    // 如果存在面包屑占位符，则加载它
    if (document.getElementById('breadcrumb-placeholder')) {
        loadComponent('/components/breadcrumb.html', 'breadcrumb-placeholder');
    }

    // 动态调用 ui.js 中的函数 (确保 ui.js 已加载)
    if (typeof generateBreadcrumbs === 'function') {
        generateBreadcrumbs();
    }

    if (typeof displayRecentPoems === 'function' && (window.location.pathname === '/index.html' || window.location.pathname === '/')) {
        displayRecentPoems();
    }
});