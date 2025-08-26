/**
 * A robust breadcrumb generator that correctly handles all page levels.
 */
async function generateBreadcrumbs() {
    const placeholder = document.querySelector('nav[aria-label="breadcrumb"] ol');
    if (!placeholder) return;

    // Start with the home breadcrumb
    placeholder.innerHTML = '<li><a href="/index.html">首页</a></li>';

    // --- Data Loading ---
    // We need all data to figure out a poet's dynasty from just their ID.
    const dataCache = {};
    const loadData = async (dynastyId) => {
        if (!dataCache[dynastyId]) {
            try {
                const response = await fetch(`/data/${dynastyId}.json`);
                if (!response.ok) throw new Error(`Data file not found for ${dynastyId}`);
                dataCache[dynastyId] = await response.json();
            } catch (error) {
                console.error(error);
                dataCache[dynastyId] = null; // Mark as failed to avoid retries
            }
        }
        return dataCache[dynastyId];
    };

    // Load both datasets
    const tangData = await loadData('tang');
    const songData = await loadData('song');
    const allDynasties = [tangData, songData].filter(Boolean); // Filter out nulls if a file fails to load

    // --- URL Parsing ---
    const path = window.location.pathname; // e.g., /poet/li-bai.html
    const parts = path.split('/').filter(Boolean); // e.g., ['poet', 'li-bai.html']
    if (parts.length === 0) return; // Homepage, do nothing more

    const pageType = parts[0];
    const pageId = parts[parts.length - 1].replace('.html', '');

    // --- Breadcrumb Building Logic ---

    // Case 1: Dynasty Page (e.g., /dynasty/tang.html)
    if (pageType === 'dynasty') {
        const dynasty = allDynasties.find(d => d.id === pageId);
        if (dynasty) {
            placeholder.innerHTML += `<li> / ${dynasty.dynasty}</li>`;
        }
    }

    // Case 2: Poet Page (e.g., /poet/li-bai.html)
    else if (pageType === 'poet') {
        let poet, dynasty;
        // Find which dynasty the poet belongs to
        for (const d of allDynasties) {
            const foundPoet = d.poets.find(p => p.id === pageId);
            if (foundPoet) {
                poet = foundPoet;
                dynasty = d;
                break;
            }
        }
        if (poet && dynasty) {
            placeholder.innerHTML += `<li> / <a href="/dynasty/${dynasty.id}.html">${dynasty.dynasty}</a></li>`;
            placeholder.innerHTML += `<li> / ${poet.name}</li>`;
        }
    }

    // Case 3: Poem Page (e.g., /poem/tang/jing-ye-si.html)
    else if (pageType === 'poem') {
        const dynastyId = parts[1];
        const poemId = pageId;
        
        const dynasty = allDynasties.find(d => d.id === dynastyId);
        if (dynasty) {
            let poet, work;
            for (const p of dynasty.poets) {
                const foundWork = p.works.find(w => w.id === poemId);
                if (foundWork) {
                    poet = p;
                    work = foundWork;
                    break;
                }
            }
            
            if (poet && work) {
                placeholder.innerHTML += `<li> / <a href="/dynasty/${dynasty.id}.html">${dynasty.dynasty}</a></li>`;
                placeholder.innerHTML += `<li> / <a href="/poet/${poet.id}.html">${poet.name}</a></li>`;
                placeholder.innerHTML += `<li> / ${work.title}</li>`;
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
        // Use root-relative path
        html += `<li><a href="/${poem.path}">${poem.title}</a></li>`;
    });
    html += '</ul>';
    
    placeholder.innerHTML = html;
}