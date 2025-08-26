/**
 * Asynchronously generates and displays breadcrumbs based on the current URL.
 */
async function generateBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s && !s.endsWith('.html'));
    const pageFile = path.substring(path.lastIndexOf('/') + 1);

    const placeholder = document.querySelector('nav[aria-label="breadcrumb"] ol');
    if (!placeholder) return;

    placeholder.innerHTML = '<li><a href="/index.html">首页</a></li>';

    const dataMap = {};

    const loadData = async (dynastyId) => {
        if (!dataMap[dynastyId]) {
            const response = await fetch(`/data/${dynastyId}.json`);
            dataMap[dynastyId] = await response.json();
        }
        return dataMap[dynastyId];
    };

    if (segments.includes('dynasty')) {
        const dynastyId = segments[segments.indexOf('dynasty') + 1];
        const data = await loadData(dynastyId);
        placeholder.innerHTML += `<li> / <a href="/dynasty/${dynastyId}.html">${data.dynasty}</a></li>`;
    }
    
    if (segments.includes('poet')) {
        const poetId = segments[segments.indexOf('poet') + 1];
        const dynastyId = segments[segments.indexOf('poet') - 1]; 
        const data = await loadData(dynastyId);
        const poet = data.poets.find(p => p.id === poetId);
        if (poet) {
            placeholder.innerHTML += `<li> / <a href="/poet/${poetId}.html">${poet.name}</a></li>`;
        }
    }

    if (segments.includes('poem')) {
        const dynastyId = segments[segments.indexOf('poem') + 1];
        const poemId = pageFile.replace('.html', '');
        const data = await loadData(dynastyId);
        for (const poet of data.poets) {
            const work = poet.works.find(w => w.id === poemId);
            if (work) {
                if (!placeholder.innerText.includes(poet.name)) {
                    placeholder.innerHTML += `<li> / <a href="/poet/${poet.id}.html">${poet.name}</a></li>`;
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
    
    recentPoems.forEach(poem => {
        
        html += `<li><a href="/${poem.path}">${poem.title}</a></li>`;
    });
    html += '</ul>';
    
    placeholder.innerHTML = html;
}