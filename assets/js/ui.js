/**
 * Asynchronously generates and displays breadcrumbs based on the current URL.
 */
async function generateBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s && !s.endsWith('.html'));
    const pageFile = path.substring(path.lastIndexOf('/') + 1);

    const placeholder = document.querySelector('nav[aria-label="breadcrumb"] ol');
    if (!placeholder) return;

    // Start with the home breadcrumb
    placeholder.innerHTML = '<li><a href="/poetry-site/index.html">首页</a></li>';

    // Data lookup map
    const dataMap = {};

    const loadData = async (dynastyId) => {
        if (!dataMap[dynastyId]) {
            const basePath = getBasePath(); // Assuming getBasePath is globally available from main.js
            const response = await fetch(`${basePath}data/${dynastyId}.json`);
            dataMap[dynastyId] = await response.json();
        }
        return dataMap[dynastyId];
    };

    let currentPath = '/poetry-site/';
    if (segments.includes('dynasty')) {
        const dynastyId = segments[segments.indexOf('dynasty') + 1];
        const data = await loadData(dynastyId);
        currentPath += `dynasty/${dynastyId}.html`;
        placeholder.innerHTML += `<li> / <a href="${currentPath}">${data.dynasty}</a></li>`;
    }
    
    if (segments.includes('poet')) {
        const poetId = segments[segments.indexOf('poet') + 1];
        // Guess dynasty from previous segment, a bit fragile but works for this structure
        const dynastyId = segments[segments.indexOf('poet') - 1]; 
        const data = await loadData(dynastyId);
        const poet = data.poets.find(p => p.id === poetId);
        if (poet) {
            currentPath = `/poetry-site/poet/${poetId}.html`;
            placeholder.innerHTML += `<li> / <a href="${currentPath}">${poet.name}</a></li>`;
        }
    }

    if (segments.includes('poem')) {
        const dynastyId = segments[segments.indexOf('poem') + 1];
        const poemId = pageFile.replace('.html', '');
        const data = await loadData(dynastyId);
        for (const poet of data.poets) {
            const work = poet.works.find(w => w.id === poemId);
            if (work) {
                // Add poet breadcrumb if not already there
                if (!placeholder.innerText.includes(poet.name)) {
                    placeholder.innerHTML += `<li> / <a href="/poetry-site/poet/${poet.id}.html">${poet.name}</a></li>`;
                }
                placeholder.innerHTML += `<li> / ${work.title}</li>`;
                break;
            }
        }
    }
}

/**
 * Displays the list of recently viewed poems on the homepage.
 */
function displayRecentPoems() {
    const placeholder = document.getElementById('recent-poems-placeholder');
    if (!placeholder) return;

    const recentPoems = getRecentPoems();
    if (recentPoems.length === 0) {
        placeholder.innerHTML = '<p>暂无浏览记录。</p>';
        return;
    }

    let html = '<ul>';
    const basePath = getBasePath ? getBasePath() : './'; // Ensure basePath exists
    recentPoems.forEach(poem => {
        // 使用 basePath 来确保链接在首页总是正确的
        html += `<li><a href="${basePath}${poem.path}">${poem.title}</a></li>`;
    });
    html += '</ul>';
    
    placeholder.innerHTML = html;
}