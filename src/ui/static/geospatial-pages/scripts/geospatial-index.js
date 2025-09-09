/**
 * Geospatial Index Page JavaScript
 * Main functionality for the geospatial pages index
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Geospatial Management Index loaded');
    
    // Initialize index page features
    initializeIndexPage();
});

function initializeIndexPage() {
    console.log('Initializing Geospatial Management Index...');
    
    // Setup category card interactions
    setupCategoryCards();
    
    // Setup launch GIS platform button
    setupLaunchButton();
    
    // Setup page statistics
    updatePageStatistics();
}

function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const category = this.dataset.category;
            console.log(`Hovering over ${category} category`);
        });
    });
}

function setupLaunchButton() {
    const launchBtn = document.querySelector('.geospatial-btn-primary');
    if (launchBtn) {
        launchBtn.addEventListener('click', function() {
            window.geospatialPages.showNotification('Launching GIS Platform...', 'info');
            console.log('GIS Platform launch initiated');
        });
    }
}

function updatePageStatistics() {
    console.log('Updating geospatial page statistics...');
    
    // Calculate total pages
    const totalPages = 47;
    console.log(`Total geospatial pages: ${totalPages}`);
    
    // Update implementation status
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.style.opacity = '1';
    });
}