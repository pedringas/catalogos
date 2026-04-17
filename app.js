// ---------------------------------------------------------
// CatalogPro v2.2 - Branded Themes (Mar-Plast)
// ---------------------------------------------------------

const { jsPDF } = window.jspdf;

const state = {
    tabs: { current: 'tab-carga' },
    theme: 'standard', // 'standard' or 'marplast'
    cover: { title: '', logoUrl: null },
    marPlastLogo: 'data:image/jpeg;base64,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',
    images: new Map(),
    csvData: [],
    matchedProducts: [],
    history: [],
    titleScale: 1.0,
    priceScale: 1.0,
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp']
};

// --- DOM References ---
const ui = {
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    themeOptions: document.querySelectorAll('input[name="catalogTheme"]'),
    coverTitle: document.getElementById('coverTitle'),
    logoInput: document.getElementById('logoInput'),
    logoPreview: document.getElementById('logoPreview'),
    logoDropZone: document.getElementById('logoDropZone'),
    downloadCsv: document.getElementById('downloadCsv'),
    downloadExcel: document.getElementById('downloadExcel'),
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
    loadingMsg: document.getElementById('loadingMsg'),
    titleScale: document.getElementById('titleScale'),
    titleScaleValue: document.getElementById('titleScaleValue'),
    priceScale: document.getElementById('priceScale'),
    priceScaleValue: document.getElementById('priceScaleValue'),
    clearCsvBtn: document.getElementById('clearCsvBtn'),
    clearImagesBtn: document.getElementById('clearImagesBtn'),
    validationSection: document.getElementById('validationSection'),
    validationReport: document.getElementById('validationReport')
};

// --- Initialization ---
initDragAndDrop();

// --- 1. Tab & Theme Management ---
ui.tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
function switchTab(tabId) {
    ui.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    ui.tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));
    state.tabs.current = tabId;
}

ui.themeOptions.forEach(opt => opt.addEventListener('change', (e) => state.theme = e.target.value));

ui.titleScale.addEventListener('input', (e) => {
    state.titleScale = parseFloat(e.target.value);
    ui.titleScaleValue.textContent = `${Math.round(state.titleScale * 100)}%`;
    document.documentElement.style.setProperty('--title-scale', state.titleScale);
});

ui.priceScale.addEventListener('input', (e) => {
    state.priceScale = parseFloat(e.target.value);
    ui.priceScaleValue.textContent = `${Math.round(state.priceScale * 100)}%`;
    document.documentElement.style.setProperty('--price-scale', state.priceScale);
});

function getFooterText() {
    const now = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

function truncateText(text, limit = 29) {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
}

// --- 2. Data Handlers ---

function initDragAndDrop() {
    setupZone(ui.logoDropZone, (files) => handleLogo(files[0]));
    ui.logoDropZone.addEventListener('click', () => ui.logoInput.click());
    ui.logoInput.addEventListener('change', (e) => handleLogo(e.target.files[0]));
    
    setupZone(ui.csvDropZone, (files) => handleCsv(files[0]));
    ui.csvDropZone.addEventListener('click', () => ui.csvInput.click());
    ui.csvInput.addEventListener('change', (e) => handleCsv(e.target.files[0]));
    
    setupZone(ui.imageDropZone, (files) => handleImages(files));
    ui.imageDropZone.addEventListener('click', () => ui.imageInput.click());
    ui.imageInput.addEventListener('change', (e) => handleImages(Array.from(e.target.files)));

    ui.clearCsvBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas borrar todos los datos de la planilla?')) {
            state.csvData = [];
            ui.csvStatus.textContent = 'Selecciona archivo CSV';
            ui.clearCsvBtn.style.display = 'none';
            checkReady();
        }
    });

    ui.clearImagesBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar toda la galería de imágenes?')) {
            state.images.forEach(img => URL.revokeObjectURL(img.url));
            state.images.clear();
            renderGallery();
            ui.clearImagesBtn.style.display = 'none';
            ui.validationSection.style.display = 'none';
            checkReady();
        }
    });
}

function setupZone(zone, callback) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        zone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
    });
    zone.addEventListener('dragover', () => zone.style.borderColor = 'var(--primary)');
    zone.addEventListener('dragleave', () => zone.style.borderColor = '');
    zone.addEventListener('drop', (e) => {
        zone.style.borderColor = '';
        callback(Array.from(e.dataTransfer.files));
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
    if (!file) return;
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            state.csvData = XLSX.utils.sheet_to_json(firstSheet);
            ui.csvStatus.textContent = `✅ ${file.name} (${state.csvData.length} ítems)`;
            ui.clearCsvBtn.style.display = 'inline-block';
            validateData();
            checkReady();
        };
        reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        Papa.parse(file, {
            header: true, skipEmptyLines: true,
            complete: (res) => {
                state.csvData = res.data;
                ui.csvStatus.textContent = `✅ ${file.name} (${res.data.length} ítems)`;
                ui.clearCsvBtn.style.display = 'inline-block';
                validateData();
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
    ui.clearImagesBtn.style.display = state.images.size > 0 ? 'inline-block' : 'none';
    validateData();
    checkReady();
}

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
    ui.clearImagesBtn.style.display = state.images.size > 0 ? 'inline-block' : 'none';
    validateData();
    checkReady();
};

function checkReady() {
    ui.generateBtn.disabled = !(state.images.size > 0 && state.csvData.length > 0);
}

// --- 3. Rendering ---

ui.coverTitle.addEventListener('input', (e) => state.cover.title = e.target.value);

ui.downloadCsv.addEventListener('click', () => {
    const csvContent = "Codigo,Titulo,Precio,UE\nPROD-001,Juguete Camión,4500,12\nPROD-002,Set de Bazar,8200,6";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "plantilla.csv"; link.click();
});

ui.downloadExcel.addEventListener('click', () => {
    const data = [
        { Codigo: "PROD-001", Titulo: "Juguete Camión", Precio: 4500, UE: 12 },
        { Codigo: "PROD-002", Titulo: "Set de Bazar", Precio: 8200, UE: 6 }
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");
    XLSX.writeFile(workbook, "plantilla.xlsx");
});

ui.generateBtn.addEventListener('click', () => {
    const missingPhotos = state.csvData.filter(row => {
        const code = (row.Codigo || row.codigo || row.Articulo || Object.values(row)[0] || "").toString().toLowerCase().trim();
        return !state.images.has(code);
    });

    if (missingPhotos.length > 0) {
        if (!confirm(`Hay ${missingPhotos.length} productos sin imagen que NO aparecerán en el catálogo. ¿Deseas continuar?`)) {
            return;
        }
    }

    ui.loadingMsg.textContent = "Preparando catálogo...";
    ui.loadingOverlay.style.display = 'flex';
    setTimeout(() => {
        processMatchedProducts();
        renderCatalog(ui.catalogContainer, false);
        ui.loadingOverlay.style.display = 'none';
        switchTab('tab-preview');
    }, 600);
});

function validateData() {
    if (state.csvData.length === 0 && state.images.size === 0) {
        ui.validationSection.style.display = 'none';
        return;
    }

    const csvCodes = new Set();
    state.csvData.forEach(row => {
        const code = (row.Codigo || row.codigo || row.Articulo || Object.values(row)[0] || "").toString().toLowerCase().trim();
        if (code) csvCodes.add(code);
    });

    const imageNames = new Set(Array.from(state.images.keys()));
    
    const missingImages = Array.from(csvCodes).filter(code => !imageNames.has(code));
    const unusedImages = Array.from(imageNames).filter(img => !csvCodes.has(img));

    if (missingImages.length === 0 && unusedImages.length === 0) {
        ui.validationSection.style.display = 'none';
        return;
    }

    ui.validationSection.style.display = 'block';
    ui.validationReport.innerHTML = `
        ${missingImages.length > 0 ? `
            <div class="validation-group warning">
                <h3>⚠️ Productos sin imagen (${missingImages.length})</h3>
                <p class="validation-msg">Estos productos no aparecerán en el catálogo final.</p>
                <div class="badge-list">
                    ${missingImages.map(c => `<span class="code-badge">${c.toUpperCase()}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        ${unusedImages.length > 0 ? `
            <div class="validation-group info">
                <h3>ℹ️ Imágenes sin datos (${unusedImages.length})</h3>
                <p class="validation-msg">Estas imágenes no tienen una fila correspondiente en el Excel.</p>
                <div class="badge-list">
                    ${unusedImages.map(c => `<span class="code-badge">${c}</span>`).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

function processMatchedProducts() {
    state.matchedProducts = [];
    state.csvData.forEach(row => {
        const code = (row.Codigo || row.codigo || row.Articulo || Object.values(row)[0] || "").toString().toLowerCase().trim();
        const title = row.Titulo || row.titulo || row.Nombre || Object.values(row)[1] || 'Producto';
        
        const price = row.Precio || row.precio || row.Valor || Object.values(row)[2] || '-';

        const ue = row.UE || row.ue || row['Unidades de Embalaje'] || row.Embalaje || null;
        const img = state.images.get(code);
        if (img) {
            state.matchedProducts.push({ code, title, price, ue, imageUrl: img.url });
        }
    });
}

function renderCatalog(container, isExport) {
    container.innerHTML = '';
    const isMarPlast = state.theme === 'marplast';
    const themeClass = isMarPlast ? 'theme-marplast' : '';
    
    // 1. Cover
    const cover = document.createElement('div');
    cover.className = `catalog-page cover-page ${themeClass} ${isExport ? 'export-mode' : ''}`;
    
    // Use official Mar-Plast logo if theme is selected and no manual logo uploaded
    const logoSrc = (isMarPlast && !state.cover.logoUrl) ? state.marPlastLogo : state.cover.logoUrl;
    
    cover.innerHTML = `
        <h1 class="cover-title">${state.cover.title || (isMarPlast ? 'MAR-PLAST' : 'Catálogo')}</h1>
        ${logoSrc ? `<img src="${logoSrc}" class="cover-logo">` : '<div style="height:100px"></div>'}
        <div class="page-footer">${getFooterText()}</div>
    `;
    container.appendChild(cover);

    // 2. Pages
    const itemsPerPage = 6;
    for (let i = 0; i < Math.ceil(state.matchedProducts.length / itemsPerPage); i++) {
        const page = document.createElement('div');
        page.className = `catalog-page ${themeClass} ${isExport ? 'export-mode' : ''}`;
        const grid = document.createElement('div');
        grid.className = 'product-grid';
        
        state.matchedProducts.slice(i * itemsPerPage, (i + 1) * itemsPerPage).forEach(prod => {
            grid.innerHTML += `
                <div class="product-item">
                    <div class="product-image-container">
                        <img src="${prod.imageUrl}">
                    </div>
                    <div class="product-info">
                        <span class="product-code">Cód. ${prod.code.toUpperCase()}</span>
                        <h4 class="product-title" title="${prod.title}">${truncateText(prod.title, 29)}</h4>
                        ${prod.ue ? `<div class="product-ue">UE: ${prod.ue}</div>` : ''}
                        <div class="product-price">$${prod.price} <span style="font-size: 0.7em; font-weight: 600;">+IVA</span></div>
                    </div>
                </div>
            `;
        });
        page.appendChild(grid);
        page.innerHTML += `<div class="page-footer">${getFooterText()}</div>`;
        container.appendChild(page);
    }
    ui.totalPages.textContent = container.children.length;
}

// --- 4. Export ---

ui.exportPdfBtn.addEventListener('click', async () => {
    ui.loadingMsg.textContent = "Generando PDF corporativo...";
    ui.loadingOverlay.style.display = 'flex';
    
    // Forzar variables CSS en el buffer de exportación
    ui.exportBuffer.style.setProperty('--title-scale', state.titleScale);
    ui.exportBuffer.style.setProperty('--price-scale', state.priceScale);
    
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
        const name = `Catalogo_MarPlast_${Date.now()}.pdf`;
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        doc.save(name);
        addToHistory(name, pdfUrl);
    } catch (err) { alert("Error al exportar."); }
    finally { ui.loadingOverlay.style.display = 'none'; ui.exportBuffer.innerHTML = ''; }
});

function waitImages(element) {
    return Promise.all(Array.from(element.querySelectorAll('img')).map(img => img.complete ? Promise.resolve() : new Promise(res => img.onload = img.onerror = res)));
}

function addToHistory(name, url) {
    state.history.unshift({ 
        id: Date.now(),
        name, 
        url,
        date: new Date().toLocaleString(), 
        title: state.cover.title || 'Catálogo' 
    });
    
    ui.historyList.innerHTML = state.history.map(h => `
        <div class="history-item">
            <div class="history-info">
                <h4>${h.name}</h4>
                <p>${h.title} • ${h.date}</p>
            </div>
            <div class="history-actions">
                <button class="btn-small btn-small-secondary" onclick="viewPdf('${h.url}')">Ver</button>
                <button class="btn-small btn-small-primary" onclick="downloadFromHistory('${h.url}', '${h.name}')">Descargar</button>
            </div>
        </div>
    `).join('');
}

window.viewPdf = (url) => {
    window.open(url, '_blank');
};

window.downloadFromHistory = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
};

