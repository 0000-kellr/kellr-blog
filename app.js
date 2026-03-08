// === KELLR BLOG APP ===
let currentLang = 'de';

function toggleLang() {
    currentLang = currentLang === 'de' ? 'en' : 'de';
    document.documentElement.setAttribute('data-lang', currentLang);
    document.querySelectorAll('.lang-flag').forEach(el => {
        el.innerHTML = currentLang === 'de' ? '&#127468;&#127463;' : '&#127465;&#127466;';
    });
    document.querySelectorAll('[data-de]').forEach(el => {
        // Use innerHTML to support HTML entities in attributes
        el.innerHTML = el.getAttribute('data-' + currentLang);
    });
    renderJournal();
    renderStats();
}

function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

function renderJournal() {
    const container = document.getElementById('journal-entries');
    container.innerHTML = JOURNAL.map(entry => {
        const title = entry.title[currentLang];
        const body = entry.body[currentLang];
        const statsLabels = {
            de: {
                features: 'Features',
                commits: 'Commits',
                issues: 'Issues erstellt',
                cost: 'KI-Kosten',
                time: 'Meine Zeit',
                messages: 'Nachrichten'
            },
            en: {
                features: 'Features',
                commits: 'Commits',
                issues: 'Issues Created',
                cost: 'AI Cost',
                time: 'My Time',
                messages: 'Messages'
            }
        };
        const labels = statsLabels[currentLang];
        const dayLabel = currentLang === 'de' ? 'Tag' : 'Day';
        return `
        <article class="journal-entry">
            <div class="journal-header">
                <span class="journal-day">${dayLabel} ${entry.day} &mdash; ${title}</span>
                <span class="journal-date">${entry.date}</span>
            </div>
            <div class="journal-body">${body}</div>
            <div class="journal-stats">
                <div class="journal-stat"><div class="journal-stat-val">${entry.stats.features}</div><div class="journal-stat-label">${labels.features}</div></div>
                <div class="journal-stat"><div class="journal-stat-val">${entry.stats.commits}</div><div class="journal-stat-label">${labels.commits}</div></div>
                <div class="journal-stat"><div class="journal-stat-val">${entry.stats.cost}</div><div class="journal-stat-label">${labels.cost}</div></div>
                <div class="journal-stat"><div class="journal-stat-val">${entry.stats.time}</div><div class="journal-stat-label">${labels.time}</div></div>
            </div>
            <div class="journal-tags">${entry.tags.map(t => `<span class="journal-tag">${t}</span>`).join('')}</div>
        </article>`;
    }).join('');
}

function renderStats() {
    const labels = {
        de: {
            totalDays: 'Tage',
            totalFeatures: 'Features',
            totalCommits: 'Commits',
            totalCost: 'KI-Kosten',
            totalTime: 'Meine Zeit',
            totalMessages: 'Nachrichten',
            totalIssues: 'Issues erstellt',
            failedBuilds: 'Builds fehlgeschlagen',
            securityFixes: 'Security Fixes'
        },
        en: {
            totalDays: 'Days',
            totalFeatures: 'Features',
            totalCommits: 'Commits',
            totalCost: 'AI Cost',
            totalTime: 'My Time',
            totalMessages: 'Messages',
            totalIssues: 'Issues Created',
            failedBuilds: 'Failed Builds',
            securityFixes: 'Security Fixes'
        }
    };
    const l = labels[currentLang];
    const container = document.getElementById('stats-grid');
    container.innerHTML = Object.entries(STATS).map(([key, val]) => `
        <div class="stat-card">
            <div class="stat-val">${val}</div>
            <div class="stat-label">${l[key] || key}</div>
        </div>
    `).join('');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderJournal();
    renderStats();
});

// Screenshot Slider (supports multiple sliders via suffix)
function slideScreenshots(dir, mode) {
    var suffix = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '';
    var track = document.getElementById('sliderTrack' + suffix);
    if (!track) return;
    track.scrollBy({ left: dir * 240, behavior: 'smooth' });
}

// Init slider dots for a given track/dots pair
function initSlider(trackId, dotsId) {
    var track = document.getElementById(trackId);
    var dotsContainer = document.getElementById(dotsId);
    if (!track || !dotsContainer) return;
    var images = track.querySelectorAll('.slider-screenshot');
    images.forEach(function(_, i) {
        var dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.onclick = function() {
            images[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        };
        dotsContainer.appendChild(dot);
    });
    track.addEventListener('scroll', function() {
        var center = track.scrollLeft + track.offsetWidth / 2;
        var closest = 0;
        var minDist = Infinity;
        images.forEach(function(img, i) {
            var dist = Math.abs(img.offsetLeft + img.offsetWidth / 2 - center);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        dotsContainer.querySelectorAll('.slider-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === closest);
        });
    });
}

// Init both sliders
(function() {
    initSlider('sliderTrackDark', 'sliderDotsDark');
    initSlider('sliderTrackLight', 'sliderDotsLight');
    // Legacy fallback
    initSlider('sliderTrack', 'sliderDots');
})();