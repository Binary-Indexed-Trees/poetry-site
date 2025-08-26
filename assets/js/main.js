document.addEventListener("DOMContentLoaded", function() {
    console.log("main.js loaded");

    /**
     * Loads an HTML component and returns a Promise that resolves when it's done.
     * @param {string} url - The URL of the component starting from the root.
     * @param {string} elementId - The ID of the element to load the component into.
     * @returns {Promise<void>}
     */
    const loadComponent = (url, elementId) => {
        // **关键修改 1**: 返回 fetch 链，以便我们可以使用 .then()
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Component not found at ${url}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) element.innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading component ${url}:`, error);
                // 向上抛出错误，以便 Promise 链可以捕获它
                throw error;
            });
    };

    // 加载页眉和页脚 (这些可以并行加载，不影响面包屑)
    loadComponent('/components/header.html', 'header-placeholder');
    loadComponent('/components/footer.html', 'footer-placeholder');

    // **关键修改 2**: 只有在面包屑组件加载成功后，才调用 generateBreadcrumbs
    if (document.getElementById('breadcrumb-placeholder')) {
        loadComponent('/components/breadcrumb.html', 'breadcrumb-placeholder')
            .then(() => {
                // 这个回调函数会在 breadcrumb.html 被成功注入页面后执行
                console.log("Breadcrumb component loaded. Generating breadcrumbs now.");
                if (typeof generateBreadcrumbs === 'function') {
                    generateBreadcrumbs();
                }
            });
    }

    // “最近浏览”功能不受影响，可以照常执行
    if (typeof displayRecentPoems === 'function' && (window.location.pathname === '/index.html' || window.location.pathname === '/')) {
        displayRecentPoems();
    }
});