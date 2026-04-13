// ---------------------------------------------------------
// CatalogPro v2.1 - Enhanced Drag & Drop + Image Scaling
// ---------------------------------------------------------

const { jsPDF } = window.jspdf;

const state = {
    tabs: { current: 'tab-carga' },
    cover: { title: '', logoUrl: null },
    images: new Map(), // name -> { file, url }
    csvData: [],
    matchedProducts: [],
    history: [],
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp']
};

// --- DOM References ---
const ui = {
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    coverTitle: document.getElementById('coverTitle'),
    logoInput: document.getElementById('logoInput'),
    logoPreview: document.getElementById('logoPreview'),
    logoDropZone: document.getElementById('logoDropZone'),
    downloadModel: document.getElementById('downloadModel'),
    csvInput: document.getElementById('csvInput'),
    csvDropZone: document.getElementById('csvDropZone'),
    csvStatus: document.getElementById('csvStatus'),
    imageInput: document.getElementById('imageInput'),
    imageDropZone: document.getElementById('imageDropZone'),
    imageGallery: document.getElementById('imageGallery'),
    imageCount: document.getElementById('imageCount'),
    generateBtn: document.getElementById('generateBtn'),
    previewSection: document.querySelector('.preview-section'),
    catalogContainer: document.getElementById('catalogContainer'),
    exportBuffer: document.getElementById('exportBuffer'),
    exportPdfBtn: document.getElementById('exportPdfBtn'),
    totalPages: document.getElementById('totalPages'),
    historyList: document.getElementById('historyList'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingMsg: document.getElementById('loadingMsg')
};

// --- Initialization ---
initDragAndDrop();

// --- 1. Tab Management ---
ui.tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
function switchTab(tabId) {
    ui.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    ui.tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));
    state.tabs.current = tabId;
}

// --- 2. Data Handlers ---

function initDragAndDrop() {
    // Logo Zone
    setupZone(ui.logoDropZone, (files) => handleLogo(files[0]));
    ui.logoDropZone.addEventListener('click', () => ui.logoInput.click());
    ui.logoInput.addEventListener('change', (e) => handleLogo(e.target.files[0]));

    // CSV Zone
    setupZone(ui.csvDropZone, (files) => handleCsv(files[0]));
    ui.csvDropZone.addEventListener('click', () => ui.csvInput.click());
    ui.csvInput.addEventListener('change', (e) => handleCsv(e.target.files[0]));

    // Images Zone
    setupZone(ui.imageDropZone, (files) => handleImages(files));
    ui.imageDropZone.addEventListener('click', () => ui.imageInput.click());
    ui.imageInput.addEventListener('change', (e) => handleImages(Array.from(e.target.files)));
}

function setupZone(zone, callback) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        zone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    zone.addEventListener('dragover', () => zone.style.borderColor = 'var(--primary)');
    zone.addEventListener('dragleave', () => zone.style.borderColor = '');
    zone.addEventListener('drop', (e) => {
        zone.style.borderColor = '';
        const files = Array.from(e.dataTransfer.files);
        callback(files);
    });
}

function handleLogo(file) {
    if (file && file.type.startsWith('image/')) {
        if (state.cover.logoUrl) URL.revokeObjectURL(state.cover.logoUrl);
        state.cover.logoUrl = URL.createObjectURL(file);
        ui.logoPreview.innerHTML = `<img src="${state.cover.logoUrl}">`;
    }
}

function handleCsv(file) {
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (res) => {
                state.csvData = res.data;
                ui.csvStatus.textContent = `✅ ${file.name} (${res.data.length} ítems)`;
                checkReady();
            }
        });
    }
}

function handleImages(files) {
    files.forEach(file => {
        if (state.supportedFormats.includes(file.type)) {
            const name = file.name.split('.').slice(0, -1).join('.').toLowerCase();
            if (state.images.has(name)) URL.revokeObjectURL(state.images.get(name).url);
            state.images.set(name, { file, url: URL.createObjectURL(file) });
        }
    });
    renderGallery();
    checkReady();
}

// --- 3. UI Helpers ---

function renderGallery() {
    ui.imageGallery.innerHTML = Array.from(state.images).map(([name, img]) => `
        <div class="thumb-item">
            <img src="${img.url}">
            <button class="remove-btn" onclick="removeImage('${name}')">✕</button>
        </div>
    `).join('');
    ui.imageCount.textContent = `${state.images.size} archivos`;
}

window.removeImage = (name) => {
    URL.revokeObjectURL(state.images.get(name).url);
    state.images.delete(name);
    renderGallery();
    checkReady();
};

function checkReady() {
    ui.generateBtn.disabled = !(state.images.size > 0 && state.csvData.length > 0);
}

// --- 4. Catalog Generation ---

ui.coverTitle.addEventListener('input', (e) => state.cover.title = e.target.value);

ui.downloadModel.addEventListener('click', () => {
    const csvContent = "Codigo,Titulo,Precio\nPROD-001,Mochila Urbana,4500\nPROD-002,Termo Acero 1L,8200";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "plantilla.csv"; link.click();
});

ui.generateBtn.addEventListener('click', () => {
    ui.loadingMsg.textContent = "Preparando...";
    ui.loadingOverlay.style.display = 'flex';
    setTimeout(() => {
        processMatchedProducts();
        renderCatalog(ui.catalogContainer, false);
        ui.loadingOverlay.style.display = 'none';
        switchTab('tab-preview');
    }, 500);
});

function processMatchedProducts() {
    state.matchedProducts = [];
    state.csvData.forEach(row => {
        const code = (row.Codigo || row.codigo || row.Articulo || Object.values(row)[0] || "").toString().toLowerCase().trim();
        const title = row.Titulo || row.titulo || row.Nombre || Object.values(row)[1] || 'Producto';
        const price = row.Precio || row.precio || row.Valor || Object.values(row)[2] || '-';
        const img = state.images.get(code);
        if (img) state.matchedProducts.push({ code, title, price, imageUrl: img.url });
    });
}

function renderCatalog(container, isExport) {
    container.innerHTML = '';
    
    // 1. Cover
    const cover = document.createElement('div');
    cover.className = `catalog-page cover-page ${isExport ? 'export-mode' : ''}`;
    cover.innerHTML = `
        ${state.cover.logoUrl ? `<img src="${state.cover.logoUrl}" class="cover-logo">` : '<div style="height:100px"></div>'}
        <h1 class="cover-title">${state.cover.title || 'Catálogo'}</h1>
        <div class="cover-footer">Generado con CatalogPro</div>
    `;
    container.appendChild(cover);

    // 2. Pages
    const itemsPerPage = 6;
    for (let i = 0; i < Math.ceil(state.matchedProducts.length / itemsPerPage); i++) {
        const page = document.createElement('div');
        page.className = `catalog-page ${isExport ? 'export-mode' : ''}`;
        const grid = document.createElement('div');
        grid.className = 'product-grid';
        
        state.matchedProducts.slice(i * itemsPerPage, (i + 1) * itemsPerPage).forEach(prod => {
            grid.innerHTML += `
                <div class="product-item">
                    <div class="product-image-container">
                        <img src="${prod.imageUrl}">
                    </div>
                    <div class="product-info">
                        <h4 class="product-title">${prod.title}</h4>
                        <span class="product-code">Cód. ${prod.code.toUpperCase()}</span>
                        <div class="product-price">$${prod.price}</div>
                    </div>
                </div>
            `;
        });
        page.appendChild(grid);
        container.appendChild(page);
    }
    ui.totalPages.textContent = container.children.length;
}

// --- 5. Export Logic ---

ui.exportPdfBtn.addEventListener('click', async () => {
    ui.loadingMsg.textContent = "Generando PDF...";
    ui.loadingOverlay.style.display = 'flex';
    renderCatalog(ui.exportBuffer, true);
    
    try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pages = ui.exportBuffer.querySelectorAll('.catalog-page');
        
        for (let i = 0; i < pages.length; i++) {
            await waitImages(pages[i]);
            const canvas = await html2canvas(pages[i], {
                scale: 2, useCORS: true, logging: false,
                width: 794, height: 1123
            });
            if (i > 0) doc.addPage();
            doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
        }
        
        const name = `Catalogo_${Date.now()}.pdf`;
        doc.save(name);
        addToHistory(name);
    } catch (err) {
        alert("Error al exportar.");
    } finally {
        ui.loadingOverlay.style.display = 'none';
        ui.exportBuffer.innerHTML = '';
    }
});

function waitImages(element) {
    const imgs = Array.from(element.querySelectorAll('img'));
    return Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => img.onload = img.onerror = res)));
}

function addToHistory(name) {
    state.history.unshift({ name, date: new Date().toLocaleString(), title: state.cover.title || 'Catálogo' });
    ui.historyList.innerHTML = state.history.map(h => `
        <div class="history-item">
            <div class="history-info"><h4>${h.name}</h4><p>${h.title} • ${h.date}</p></div>
            <div class="history-badge">✓ Descargado</div>
        </div>
    `).join('');
}
