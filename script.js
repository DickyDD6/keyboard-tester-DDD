// Keyboard Tester JavaScript
// Track statistics
let totalKeysPressed = 0;
let lastKeyPressed = '-';
let testedKeys = new Set();

// DOM Elements
const totalKeysEl = document.getElementById('totalKeys');
const lastKeyEl = document.getElementById('lastKey');
const resetBtn = document.getElementById('resetBtn');
const infoKeyEl = document.getElementById('infoKey');
const infoCodeEl = document.getElementById('infoCode');
const infoLocationEl = document.getElementById('infoLocation');

// Layout Elements
const layoutButtons = document.querySelectorAll('.layout-btn');
const layoutDesc = document.getElementById('layoutDesc');
const keyboardContainer = document.querySelector('.keyboard-container');


// Key mapping for special cases
const keyMap = {
    ' ': 'Space',
    'Control': 'ControlLeft',
    'Alt': 'AltLeft',
    'Shift': 'ShiftLeft',
    'Meta': 'MetaLeft',
};

// Find key element by key value
function findKeyElement(key, code) {
    // Helper function to escape special characters for CSS selectors
    function escapeSelector(str) {
        // Escape special characters: \ " ' and other CSS special chars
        return str.replace(/[\\"']/g, '\\$&');
    }

    // Try to find by code first (more accurate)
    let keyElement = document.querySelector(`[data-key="${escapeSelector(code)}"]`);

    // If not found, try by key
    if (!keyElement) {
        keyElement = document.querySelector(`[data-key="${escapeSelector(key)}"]`);
    }

    // Special handling for letter keys (case-insensitive)
    if (!keyElement && key.length === 1) {
        keyElement = document.querySelector(`[data-key="${escapeSelector(key.toLowerCase())}"]`);
    }

    // Handle space key
    if (!keyElement && key === ' ') {
        keyElement = document.querySelector(`[data-key=" "]`);
    }

    return keyElement;
}

// Handle key press (keydown)
function handleKeyDown(event) {
    event.preventDefault();

    const key = event.key;
    const code = event.code;
    const location = getKeyLocation(event.location);

    // Update statistics
    totalKeysPressed++;
    lastKeyPressed = key === ' ' ? 'Space' : (key.length > 1 ? key : key.toUpperCase());
    testedKeys.add(code);

    // Update UI
    updateStats();
    updateInfo(key, code, location);

    // Find and highlight the key
    const keyElement = findKeyElement(key, code);
    if (keyElement) {
        keyElement.classList.add('active');
        keyElement.classList.add('tested');
    }
}

// Handle key release (keyup)
function handleKeyUp(event) {
    const key = event.key;
    const code = event.code;

    // Remove active state
    const keyElement = findKeyElement(key, code);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
}

// Update statistics display
function updateStats() {
    totalKeysEl.textContent = totalKeysPressed;
    lastKeyEl.textContent = lastKeyPressed;
}

// Update info panel
function updateInfo(key, code, location) {
    infoKeyEl.textContent = key === ' ' ? 'Space' : key;
    infoCodeEl.textContent = code;
    infoLocationEl.textContent = location;
}

// Get key location description
function getKeyLocation(loc) {
    switch (loc) {
        case 0: return 'Standard';
        case 1: return 'Left';
        case 2: return 'Right';
        case 3: return 'Numpad';
        default: return 'Unknown';
    }
}

// Reset all statistics and states
function resetTester() {
    totalKeysPressed = 0;
    lastKeyPressed = '-';
    testedKeys.clear();

    // Reset UI
    updateStats();
    infoKeyEl.textContent = '-';
    infoCodeEl.textContent = '-';
    infoLocationEl.textContent = '-';

    // Remove all tested states
    document.querySelectorAll('.key.tested').forEach(key => {
        key.classList.remove('tested');
    });

    // Remove all active states
    document.querySelectorAll('.key.active').forEach(key => {
        key.classList.remove('active');
    });
}

// Prevent default behavior for certain keys
function preventDefaults(event) {
    // Prevent F5 refresh
    if (event.key === 'F5') {
        event.preventDefault();
    }

    // Prevent Ctrl+R refresh
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
    }

    // Prevent backspace navigation
    if (event.key === 'Backspace') {
        event.preventDefault();
    }

    // Prevent tab navigation
    if (event.key === 'Tab') {
        event.preventDefault();
    }
}

// Visual click effect for mouse clicks on keys
function handleKeyClick(event) {
    if (event.target.classList.contains('key')) {
        const keyEl = event.target;
        keyEl.classList.add('active');

        setTimeout(() => {
            keyEl.classList.remove('active');
        }, 150);
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    preventDefaults(e);
    handleKeyDown(e);
});

document.addEventListener('keyup', handleKeyUp);

resetBtn.addEventListener('click', resetTester);

// Add click listeners to all keys for visual feedback
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', handleKeyClick);
});

// Keyboard Layout Configurations
const layoutConfigs = {
    '40': {
        name: '40%',
        description: '40% - Ultra compact tanpa number row, hanya huruf dan modifier'
    },
    '50': {
        name: '50%',
        description: '50% - Compact dengan number row, QWERTY, Tab, Backspace, dan arrow keys'
    },
    '60': {
        name: '60%',
        description: '60% - Compact keyboard tanpa F-keys, navigation, dan arrow keys'
    },
    '65': {
        name: '65%',
        description: '65% - Compact dengan arrow keys untuk navigasi'
    },
    '70': {
        name: '70%',
        description: '70% - Keyboard compact dengan arrow keys dan beberapa tombol navigasi'
    },
    '75': {
        name: '75%',
        description: '75% - Memiliki F-keys dan arrow keys, tanpa navigation cluster'
    },
    '80': {
        name: '80%',
        description: '80% - Hampir lengkap dengan F-keys, arrow, dan navigasi terbatas'
    },
    'tkl': {
        name: 'TKL (Tenkeyless)',
        description: 'TKL - Keyboard lengkap tanpa numpad, sempurna untuk gaming'
    },
    'fullsize': {
        name: 'Full Size',
        description: 'Full Size - Keyboard lengkap dengan semua tombol'
    }
};

// Current layout
let currentLayout = 'fullsize';

// Handle layout switching
function switchLayout(layout) {
    // Remove all layout classes
    keyboardContainer.classList.remove(
        'layout-40', 'layout-50', 'layout-60', 'layout-65', 'layout-70',
        'layout-75', 'layout-80', 'layout-tkl', 'layout-fullsize'
    );

    // Add new layout class
    keyboardContainer.classList.add(`layout-${layout}`);

    // Update active button
    layoutButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.layout === layout) {
            btn.classList.add('active');
        }
    });

    // Update description
    if (layoutConfigs[layout]) {
        layoutDesc.textContent = layoutConfigs[layout].description;
    }

    // Save preference
    currentLayout = layout;
    localStorage.setItem('keyboardLayout', layout);

    // Reset tester when layout changes
    resetTester();
}

// Add event listeners to layout buttons
layoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const layout = btn.dataset.layout;
        switchLayout(layout);
    });
});

// Load saved layout preference
function loadLayoutPreference() {
    const savedLayout = localStorage.getItem('keyboardLayout');
    if (savedLayout && layoutConfigs[savedLayout]) {
        switchLayout(savedLayout);
    }
}

// Initialize layout on page load
loadLayoutPreference();

// Welcome message
console.log('🎹 Keyboard Tester loaded!');
console.log('Press any key to test your keyboard.');

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Additional feature: Show total unique keys tested
function getTestedKeysCount() {
    return testedKeys.size;
}

// Update stats to show unique keys (optional enhancement)
setInterval(() => {
    const uniqueKeysCount = getTestedKeysCount();
    if (uniqueKeysCount > 0) {
        // Could add this to the UI if desired
        console.log(`Unique keys tested: ${uniqueKeysCount}`);
    }
}, 5000);

