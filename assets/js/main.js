document.addEventListener("DOMContentLoaded", function() {
    console.log("main.js loaded");

    /**
     * Calculates the relative path to the project root for the "Recently Viewed" links.
     */
    const getBasePath = () => {
        const path = window.location.pathname;
        if (path.endsWith('/') || path.endsWith('/index.html')) {
            return './';
        }
        
        const segments = path.split('/').filter(Boolean);
        const repoNameIndex = segments.indexOf('poetry-site');
        const depth = (repoNameIndex !== -1) ? segments.length - repoNameIndex - 1 : segments.length - 1;

        return '../'.repeat(depth > 0 ? depth : 0) || './';
    };

    /**
     * Displays the list of recently viewed poems on the homepage.
     */
    function displayRecentPoems() {
        const placeholder = document.getElementById('recent-poems-placeholder');
        if (!placeholder) return;

        const recentPoems = getRecentPoems(); // from state.js
        if (recentPoems.length === 0) {
            placeholder.innerHTML = '<p>暂无浏览记录。</p>';
            return;
        }

        const basePath = getBasePath();
        let html = '<ul>';
        recentPoems.forEach(poem => {
            html += `<li><a href="${basePath}${poem.path}">${poem.title}</a></li>`;
        });
        html += '</ul>';
        
        placeholder.innerHTML = html;
    }

    // Only run displayRecentPoems on the homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        displayRecentPoems();
    }
});