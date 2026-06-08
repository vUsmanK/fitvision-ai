// ============ DATA ============
// picsum.photos works on file:// with no CORS or hotlink restrictions
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='350'%3E%3Crect fill='%23eef2ff' width='280' height='350'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' font-size='52' font-family='Arial'%3E%F0%9F%91%95%3C/text%3E%3Ctext x='50%25' y='63%25' text-anchor='middle' font-size='13' fill='%236366f1' font-family='Arial' font-weight='bold'%3EOutfit Preview%3C/text%3E%3C/svg%3E";

const outfits = [
    { id: 1, name: "Summer Casual",   price: "$49.99",  image: "outfits/summer casual.jpg",      category: "casual",  season: "summer", scores: { fit: 85, trend: 92, style: 88, occasion: 90 } },
    { id: 2, name: "Urban Street",    price: "$59.99",  image: "outfits/urban street.jpg",       category: "casual",  season: "spring", scores: { fit: 78, trend: 85, style: 82, occasion: 80 } },
    { id: 3, name: "Business Formal", price: "$99.99",  image: "outfits/business formal.webp",   category: "formal",  season: "spring", scores: { fit: 90, trend: 75, style: 88, occasion: 95 } },
    { id: 4, name: "Evening Gown",    price: "$149.99", image: "outfits/evening gown.jpg",       category: "formal",  season: "spring", scores: { fit: 95, trend: 88, style: 96, occasion: 98 } },
    { id: 5, name: "Sports Active",   price: "$69.99",  image: "outfits/sports outfit.webp",     category: "sports",  season: "summer", scores: { fit: 88, trend: 80, style: 82, occasion: 75 } },
    { id: 6, name: "Party Night",     price: "$89.99",  image: "outfits/party night.jpg",        category: "party",   season: "summer", scores: { fit: 86, trend: 94, style: 91, occasion: 96 } },
    { id: 7, name: "Casual Weekend",  price: "$54.99",  image: "outfits/casual weekend.jpg",     category: "casual",  season: "summer", scores: { fit: 80, trend: 78, style: 82, occasion: 85 } },
    { id: 8, name: "Elegant Dinner",  price: "$129.99", image: "outfits/elegant dinner.jpg",     category: "formal",  season: "winter", scores: { fit: 92, trend: 85, style: 93, occasion: 97 } },
];

const recommendations = [
    { name: "Casual Summer", price: "$49.99",  image: "outfits/summer casual.jpg",    badge: "Top Pick", score: 92, desc: "☀️ Beach outings & casual days" },
    { name: "Urban Style",   price: "$59.99",  image: "outfits/urban street.jpg",     badge: "Trending", score: 89, desc: "🏙️ City vibes & everyday wear" },
    { name: "Elegant Night", price: "$149.99", image: "outfits/evening gown.jpg",     badge: "Premium",  score: 95, desc: "✨ Special occasions & evenings" },
];

const mixItems = {
    tops: [
        { name: "Summer Casual",   img: "outfits/summer casual.jpg" },
        { name: "Casual Weekend",  img: "outfits/casual weekend.jpg" },
        { name: "Urban Street",    img: "outfits/urban street.jpg" },
        { name: "Business Formal", img: "outfits/business formal.webp" },
    ],
    bottoms: [
        { name: "Urban Street",    img: "outfits/urban street.jpg" },
        { name: "Sports Active",   img: "outfits/sports outfit.webp" },
        { name: "Casual Weekend",  img: "outfits/casual weekend.jpg" },
        { name: "Elegant Dinner",  img: "outfits/elegant dinner.jpg" },
    ],
    shoes: [
        { name: "Sports Active",   img: "outfits/sports outfit.webp" },
        { name: "Evening Gown",    img: "outfits/evening gown.jpg" },
        { name: "Business Formal", img: "outfits/business formal.webp" },
        { name: "Party Night",     img: "outfits/party night.jpg" },
    ],
    accessories: [
        { name: "Party Night",     img: "outfits/party night.jpg" },
        { name: "Evening Gown",    img: "outfits/evening gown.jpg" },
        { name: "Elegant Dinner",  img: "outfits/elegant dinner.jpg" },
        { name: "Summer Casual",   img: "outfits/summer casual.jpg" },
    ],
};

// ============ STATE ============
let selectedOutfit = null;
let cameraActive = false;
let mixSelections = { tops: null, bottoms: null, shoes: null, accessories: null };

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
    loadRecommendations();
    loadFullRecs();
    loadMixMatch();
    setupTabs();
    setupNavigation();
    setupCamera();
    setupModals();
    setupCustomize();
    setupActionButtons();
    setupSearch();
    setupBanner();
    setupMixAutoBtn();
});

// ============ SECTION NAVIGATION ============
function setupNavigation() {
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));
            btn.classList.add('active-nav');
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
            document.getElementById('section-' + btn.dataset.section).classList.add('active-section');
        });
    });
}

// ============ CATALOG ============
function loadCatalog(filter = {}) {
    const grid = document.getElementById('catalogGrid');
    let items = outfits;
    if (filter.category) items = items.filter(o => o.category === filter.category);
    if (filter.season) items = items.filter(o => o.season === filter.season);
    if (filter.search) items = items.filter(o => o.name.toLowerCase().includes(filter.search));

    grid.innerHTML = items.map(outfit => `
        <div class="clothing-card" data-id="${outfit.id}">
            <img src="${outfit.image}" alt="${outfit.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
            <div class="try-on-overlay"><i class="fas fa-camera"></i> Try On</div>
            <div class="clothing-info">
                <div class="clothing-name">${outfit.name}</div>
                <div class="clothing-price">${outfit.price}</div>
                <div class="clothing-tags">
                    <span class="ctag">${outfit.category}</span>
                    <span class="ctag">${outfit.season}</span>
                </div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.clothing-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const outfit = outfits.find(o => o.id === id);
            selectOutfit(outfit, card);
        });
    });
}

function selectOutfit(outfit, cardEl) {
    selectedOutfit = outfit;

    document.querySelectorAll('.clothing-card').forEach(c => c.classList.remove('selected-card'));
    if (cardEl) cardEl.classList.add('selected-card');

    const mirrorImg = document.getElementById('mirrorOutfitImg');
    const mirrorOverlay = document.getElementById('outfitOnMirror');
    const placeholder = document.getElementById('mirrorPlaceholder');
    mirrorImg.src = outfit.image;
    mirrorOverlay.style.display = 'flex';
    placeholder.style.display = 'none';

    const badge = document.getElementById('outfitBadge');
    document.getElementById('outfitBadgeName').textContent = outfit.name;
    badge.style.display = 'flex';

    animateScore('fitBar', 'fitScore', outfit.scores.fit);
    animateScore('trendBar', 'trendScore', outfit.scores.trend);
    animateScore('styleBar', 'styleScore', outfit.scores.style);
    animateScore('occasionBar', 'occasionScore', outfit.scores.occasion);

    const overall = Math.round((outfit.scores.fit + outfit.scores.trend + outfit.scores.style + outfit.scores.occasion) / 4);
    document.getElementById('overallBadge').textContent = overall;
    const verdicts = { 95: '🏆 Perfect Match!', 90: '⭐ Excellent Choice!', 85: '✨ Great Pick!', 80: '👍 Good Look!', 0: '💡 Keep Exploring' };
    const verdictKey = Object.keys(verdicts).reverse().find(k => overall >= k);
    document.getElementById('scoreVerdict').innerHTML = verdicts[verdictKey];

    document.getElementById('selectedItemInfo').innerHTML = `
        <div class="selected-outfit-row">
            <img src="${outfit.image}" alt="${outfit.name}" onerror="this.onerror=null;this.src='${FALLBACK}'">
            <div class="sel-info">
                <h4>${outfit.name}</h4>
                <p>${outfit.price}</p>
            </div>
        </div>
    `;

    document.getElementById('purchaseItemImg').src = outfit.image;
    document.getElementById('purchaseItemName').textContent = outfit.name;
    document.getElementById('purchaseItemPrice').textContent = outfit.price;
    document.getElementById('sharePreviewImg').src = outfit.image;
}

function animateScore(barId, labelId, value) {
    const bar = document.getElementById(barId);
    const label = document.getElementById(labelId);
    bar.style.width = '0%';
    setTimeout(() => {
        bar.style.width = value + '%';
        label.textContent = value + '%';
    }, 50);
}

// ============ RECOMMENDATIONS (tab) ============
function loadRecommendations() {
    const grid = document.getElementById('recommendationGrid');
    if (!grid) return;
    grid.innerHTML = recommendations.map(r => `
        <div class="comparison-item">
            <div class="item-badge">${r.badge}</div>
            <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
            <h4>${r.name}</h4>
            <div class="score-badge">Score: ${r.score}%</div>
            <p class="rec-text">${r.desc}</p>
            <button class="btn btn-small btn-primary rec-try-btn" data-name="${r.name}" data-img="${r.image}" data-price="${r.price}" style="margin:0 8px 12px;">
                <i class="fas fa-camera"></i> Try On
            </button>
        </div>
    `).join('');
    grid.querySelectorAll('.rec-try-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fakeOutfit = { name: btn.dataset.name, price: btn.dataset.price, image: btn.dataset.img, scores: { fit: 85, trend: 90, style: 88, occasion: 87 } };
            selectOutfit(fakeOutfit, null);
            switchTab('catalog');
        });
    });
}

// ============ FULL RECS (AI Stylist page) ============
function loadFullRecs() {
    const grid = document.getElementById('fullRecGrid');
    if (!grid) return;
    grid.innerHTML = outfits.map(o => `
        <div class="full-rec-card">
            <img src="${o.image}" alt="${o.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
            <div class="full-rec-info">
                <h4>${o.name}</h4>
                <div class="full-rec-price">${o.price}</div>
                <div class="full-rec-tags">
                    <span class="chip chip-blue">${o.category}</span>
                    <span class="chip chip-purple">Score: ${Math.round((o.scores.fit+o.scores.trend+o.scores.style)/3)}%</span>
                </div>
                <div class="full-rec-actions">
                    <button class="btn btn-small btn-primary w-full frec-try" data-id="${o.id}">
                        <i class="fas fa-camera"></i> Try On
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    grid.querySelectorAll('.frec-try').forEach(btn => {
        btn.addEventListener('click', () => {
            const outfit = outfits.find(o => o.id === parseInt(btn.dataset.id));
            selectOutfit(outfit, null);
            document.querySelector('.nav-btn[data-section="tryon"]').click();
        });
    });
}

// ============ MIX & MATCH ============
function loadMixMatch() {
    renderMixGrid('topsGrid', mixItems.tops, 'tops');
    renderMixGrid('bottomsGrid', mixItems.bottoms, 'bottoms');
    renderMixGrid('shoesGrid', mixItems.shoes, 'shoes');
    renderMixGrid('accessoriesGrid', mixItems.accessories, 'accessories');
}

function renderMixGrid(gridId, items, category) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map(item => `
        <div class="mix-item-card" data-name="${item.name}" data-img="${item.img}" data-cat="${category}">
            <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
            <p>${item.name}</p>
        </div>
    `).join('');
    grid.querySelectorAll('.mix-item-card').forEach(card => {
        card.addEventListener('click', () => {
            grid.querySelectorAll('.mix-item-card').forEach(c => c.classList.remove('selected-mix'));
            card.classList.add('selected-mix');
            mixSelections[category] = { name: card.dataset.name, img: card.dataset.img };
            updateMixResult();
        });
    });
}

function updateMixResult() {
    const selected = Object.entries(mixSelections).filter(([, v]) => v !== null);
    if (selected.length === 0) { document.getElementById('mixResult').style.display = 'none'; return; }
    document.getElementById('mixResult').style.display = 'block';
    document.getElementById('mixResultItems').innerHTML = selected.map(([cat, item]) =>
        `<div class="mix-res-chip"><img src="${item.img}" style="width:24px;height:24px;border-radius:4px;object-fit:cover;" onerror="this.onerror=null;this.style.background='#eef2ff'"> ${item.name}</div>`
    ).join('');
}

function setupMixAutoBtn() {
    const btn = document.getElementById('autoMix');
    if (!btn) return;
    btn.addEventListener('click', () => {
        ['tops', 'bottoms', 'shoes', 'accessories'].forEach(cat => {
            const items = mixItems[cat];
            const random = items[Math.floor(Math.random() * items.length)];
            mixSelections[cat] = { name: random.name, img: random.img };
            const grids = { tops: 'topsGrid', bottoms: 'bottomsGrid', shoes: 'shoesGrid', accessories: 'accessoriesGrid' };
            const grid = document.getElementById(grids[cat]);
            grid.querySelectorAll('.mix-item-card').forEach(c => c.classList.remove('selected-mix'));
            const target = grid.querySelector(`[data-name="${random.name}"]`);
            if (target) target.classList.add('selected-mix');
        });
        updateMixResult();
    });

    document.getElementById('tryMixedOutfit')?.addEventListener('click', () => {
        const first = Object.values(mixSelections).find(v => v !== null);
        if (first) {
            selectOutfit({ name: 'Mixed Look', price: '$—', image: first.img, scores: { fit: 84, trend: 88, style: 86, occasion: 82 } }, null);
        }
    });
}

// ============ TABS ============
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
    });
}

function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const btn = btnEl || document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
    const pane = document.getElementById(tabId);
    if (pane) pane.classList.add('active');
}

// ============ CAMERA ============
function setupCamera() {
    const toggleBtn = document.getElementById('toggleCamera');
    const uploadBtn = document.getElementById('uploadPhoto');
    const photoInput = document.getElementById('photoInput');
    const captureBtn = document.getElementById('captureSnapshot');
    const cameraFeed = document.getElementById('cameraFeed');

    toggleBtn.addEventListener('click', async () => {
        if (!cameraActive) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                cameraFeed.srcObject = stream;
                cameraFeed.style.display = 'block';
                cameraFeed.play();
                cameraActive = true;
                toggleBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Camera';
                toggleBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
                captureBtn.style.display = 'inline-flex';
                document.getElementById('mirrorPlaceholder').style.display = 'none';
                startBodyDetection();
                document.getElementById('aiStatus').innerHTML = '<span class="ai-dot"></span> Detecting Body...';
            } catch {
                showToast('Camera access denied. Please upload a photo instead.', 'error');
            }
        } else {
            const stream = cameraFeed.srcObject;
            if (stream) stream.getTracks().forEach(t => t.stop());
            cameraFeed.style.display = 'none';
            cameraActive = false;
            toggleBtn.innerHTML = '<i class="fas fa-camera"></i> Start Camera';
            toggleBtn.style.background = '';
            captureBtn.style.display = 'none';
            stopBodyDetection();
            document.getElementById('aiStatus').innerHTML = '<span class="ai-dot"></span> AI Ready';
        }
    });

    uploadBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const container = document.getElementById('cameraContainer');
            container.style.backgroundImage = `url(${ev.target.result})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            document.getElementById('mirrorPlaceholder').style.display = 'none';
            startBodyDetection();
            document.getElementById('aiStatus').innerHTML = '<span class="ai-dot"></span> Analyzing...';
            setTimeout(() => {
                document.getElementById('aiStatus').innerHTML = '<span class="ai-dot"></span> Body Detected ✓';
                stopBodyDetection();
            }, 3000);
        };
        reader.readAsDataURL(file);
    });

    captureBtn.addEventListener('click', () => showToast('Look saved to your gallery!', 'success'));
}

let bodyDetectionTimeout = null;

function startBodyDetection() {
    const overlay = document.getElementById('bodyDetectionOverlay');
    overlay.style.display = 'block';
    bodyDetectionTimeout = setTimeout(() => {
        stopBodyDetection();
        document.getElementById('aiStatus').innerHTML = '<span class="ai-dot"></span> Body Detected ✓';
    }, 4000);
}

function stopBodyDetection() {
    if (bodyDetectionTimeout) clearTimeout(bodyDetectionTimeout);
    document.getElementById('bodyDetectionOverlay').style.display = 'none';
}

// ============ CUSTOMIZE ============
function setupCustomize() {
    document.querySelectorAll('.color-swatch').forEach(s => {
        s.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('selected'));
            s.classList.add('selected');
        });
    });
    document.querySelectorAll('.pattern-card').forEach(c => {
        c.addEventListener('click', () => {
            document.querySelectorAll('.pattern-card').forEach(x => x.classList.remove('active-pattern'));
            c.classList.add('active-pattern');
        });
    });
    document.querySelectorAll('.emb-chip').forEach(c => {
        c.addEventListener('click', () => {
            document.querySelectorAll('.emb-chip').forEach(x => x.classList.remove('active-emb'));
            c.classList.add('active-emb');
        });
    });
    document.getElementById('applyCustomization')?.addEventListener('click', () => {
        showToast('✅ Customizations applied to your mirror preview!', 'success');
    });
}

// ============ MODALS ============
function setupModals() {
    const modals = {
        shareModal: 'closeShare',
        purchaseModal: 'closePurchase',
        compareModal: 'closeCompare',
        bundleModal: 'closeBundle',
    };
    Object.entries(modals).forEach(([modalId, closerId]) => {
        const modal = document.getElementById(modalId);
        document.getElementById(closerId)?.addEventListener('click', () => closeModal(modalId));
        modal?.addEventListener('click', e => { if (e.target === modal) closeModal(modalId); });
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            Object.keys(modals).forEach(id => closeModal(id));
        }
    });

    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.textContent.trim();
            if (platform === 'Copy Link') {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
            } else {
                showToast(`Opening ${platform}...`, 'info');
            }
            closeModal('shareModal');
        });
    });

    document.getElementById('completePurchase')?.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.purchase-form .form-input');
        const allFilled = [...inputs].slice(0, 3).every(i => i.value.trim());
        if (!allFilled) { showToast('Please fill in all required fields', 'error'); return; }
        closeModal('purchaseModal');
        showToast('🎉 Order placed! Confirmation sent to your email.', 'success');
    });

    document.getElementById('analyzeStyle')?.addEventListener('click', () => {
        showToast('🧠 AI is analyzing your style preferences...', 'info');
    });

    document.getElementById('refreshRecs')?.addEventListener('click', () => {
        showToast('🔄 Refreshing recommendations...', 'info');
    });

    document.getElementById('getAiSuggestions')?.addEventListener('click', () => {
        document.querySelector('.nav-btn[data-section="recommendations"]').click();
        showToast('✨ Generating personalized suggestions for you!', 'success');
    });

    document.querySelectorAll('.mfg-feature-card .btn, .ws-btn').forEach(btn => {
        btn.addEventListener('click', () => showToast('This feature is available in the full platform.', 'info'));
    });

    document.querySelectorAll('.history-item .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.history-item');
            const img = item?.querySelector('img');
            const name = item?.querySelector('strong')?.textContent;
            if (img && name) {
                selectOutfit({ name, price: '$—', image: img.src, scores: { fit: 88, trend: 85, style: 87, occasion: 86 } }, null);
                document.querySelector('.nav-btn[data-section="tryon"]').click();
            }
        });
    });

    document.querySelectorAll('.profile-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => showToast('Profile saved successfully!', 'success'));
    });

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => tag.classList.toggle('active-tag'));
    });

    document.querySelectorAll('.model-card').forEach(c => {
        c.addEventListener('click', () => {
            document.querySelectorAll('.model-card').forEach(x => x.classList.remove('active-model'));
            c.classList.add('active-model');
        });
    });
}

function openModal(id) {
    const el = document.getElementById(id);
    el.style.display = 'flex';
    el.classList.add('open');
}
function closeModal(id) {
    const el = document.getElementById(id);
    el.style.display = 'none';
    el.classList.remove('open');
}

// ============ ACTION BUTTONS ============
function setupActionButtons() {
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        if (!selectedOutfit) { showToast('Select an outfit first!', 'error'); return; }
        openModal('shareModal');
    });
    document.getElementById('buyBtn')?.addEventListener('click', () => {
        if (!selectedOutfit) { showToast('Select an outfit first!', 'error'); return; }
        openModal('purchaseModal');
    });
    document.getElementById('compareBtn')?.addEventListener('click', () => openModal('compareModal'));
    document.getElementById('viewBundle')?.addEventListener('click', () => openModal('bundleModal'));
}

// ============ SEARCH & FILTER ============
function setupSearch() {
    document.getElementById('searchInput')?.addEventListener('input', e => {
        const cat = document.getElementById('categoryFilter')?.value || '';
        const season = document.getElementById('seasonFilter')?.value || '';
        loadCatalog({ search: e.target.value.toLowerCase(), category: cat, season });
    });
    document.getElementById('categoryFilter')?.addEventListener('change', e => {
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const season = document.getElementById('seasonFilter')?.value || '';
        loadCatalog({ category: e.target.value, season, search });
    });
    document.getElementById('seasonFilter')?.addEventListener('change', e => {
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const cat = document.getElementById('categoryFilter')?.value || '';
        loadCatalog({ season: e.target.value, category: cat, search });
    });
}

// ============ BANNER ============
function setupBanner() {
    document.getElementById('closeBanner')?.addEventListener('click', () => {
        document.getElementById('infoBanner').style.display = 'none';
    });
}

// ============ TOAST ============
let toastTimeout;
function showToast(message, type = 'info') {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMsg';
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:13px 20px;border-radius:10px;font-size:13px;font-weight:600;color:white;max-width:340px;box-shadow:0 8px 24px rgba(0,0,0,0.2);transition:all 0.3s ease;transform:translateY(80px);opacity:0;';
        document.body.appendChild(toast);
    }
    const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' };
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.transform = 'translateY(80px)';
        toast.style.opacity = '0';
    }, 3000);
}

console.log('%c🎉 FitVision AI Ready!', 'color:#6366f1;font-size:16px;font-weight:bold;');
