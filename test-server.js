#!/usr/bin/env node

/**
 * Simple HTTP server for serving static UI files during Cypress testing
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import service API routes
const serviceApi = require('./src/api/service-api.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the UI directory
app.use('/src/ui/static', express.static(path.join(__dirname, 'src/ui/static')));

// API routes
app.use('/api', serviceApi);

// Serve root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/ui/static/index.html'));
});

// Handle all other routes by serving the appropriate HTML file
app.get('/:module', (req, res) => {
    const module = req.params.module;
    const filePath = path.join(__dirname, 'src/ui/static', `${module}.html`);
    
    // Check if file exists, otherwise serve index
    res.sendFile(filePath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'src/ui/static/index.html'));
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Titan Grove test server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'src/ui/static')}`);
    console.log(`🧪 Ready for Cypress testing!`);
});

module.exports = app;