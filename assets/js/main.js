document.addEventListener("DOMContentLoaded", function() {
    console.log("main.js loaded");

    // This function must be defined here to be accessible by ui.js
    window.getBasePath = () => {
        const path = window.location.pathname;
        const depth = path.split('/').length - 3; // Adjusted for /poetry-site/ structure
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    };

    const basePath = getBasePath();

    const loadComponent = (url, elementId) => {
        fetch(basePath + url)
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

    // Load common components
    loadComponent('components/header.html', 'header-placeholder');
    loadComponent('components/footer.html', 'footer-placeholder');
    
    // Generate breadcrumbs on all pages
    generateBreadcrumbs();

    // Display recent poems only on the homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/poetry-site/')) {
        displayRecentPoems();
    }
});