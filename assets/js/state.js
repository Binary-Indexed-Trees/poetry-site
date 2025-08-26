const RECENT_POEMS_KEY = 'recentPoems';
const MAX_RECENT_POEMS = 5;

/**
 * Saves a recently viewed poem to localStorage, ensuring no duplicates.
 * If the poem already exists, it is moved to the top of the list.
 * @param {object} poem - The poem object, e.g., { title: '静夜思', path: 'poem/tang/jing-ye-si.html' }
 */
function saveRecentPoem(poem) {
    if (!poem || !poem.path || !poem.title) return;

    // 1. Get the current list of recent poems.
    let recentPoems = getRecentPoems();
    
    // 2. **THE FIX**: Filter out any existing entry for the same poem.
    // This removes duplicates by creating a new array without the item we're about to add.
    recentPoems = recentPoems.filter(p => p.path !== poem.path);
    
    // 3. Add the new poem to the beginning of the list.
    recentPoems.unshift(poem);
    
    // 4. Keep the list size within the limit.
    if (recentPoems.length > MAX_RECENT_POEMS) {
        recentPoems = recentPoems.slice(0, MAX_RECENT_POEMS);
    }
    
    // 5. Save the updated, de-duplicated list back to localStorage.
    localStorage.setItem(RECENT_POEMS_KEY, JSON.stringify(recentPoems));
}

/**
 * Retrieves the list of recently viewed poems from localStorage.
 * @returns {Array<object>} - An array of poem objects.
 */
function getRecentPoems() {
    const stored = localStorage.getItem(RECENT_POEMS_KEY);
    return stored ? JSON.parse(stored) : [];
}