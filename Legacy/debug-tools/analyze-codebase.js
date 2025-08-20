#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const JS_DIR = path.join(__dirname, 'js');
const OUTPUT_FILE = 'codebase-inventory.md';

// Data collectors
const inventory = {
    globalFunctions: new Map(),      // functionName -> [{file, line}]
    windowAssignments: new Map(),    // propertyName -> [{file, line}]
    eventListeners: [],              // [{file, line, event, handler}]
    globalVariables: new Map(),      // varName -> [{file, line}]
    moduleExports: new Map(),        // moduleName -> {file, exports: []}
    duplicateFunctions: new Map(),   // functionName -> [files]
    dependencies: new Map(),         // file -> [dependencies]
    potentialConflicts: []
};

// Regex patterns
const patterns = {
    functionDeclaration: /^function\s+(\w+)\s*\(/gm,
    windowAssignment: /window\.(\w+)\s*=/gm,
    addEventListener: /addEventListener\s*\(\s*['"`](\w+)['"`]\s*,\s*(\w+|\(|function)/gm,
    globalVariable: /^(?:var|let|const)\s+(\w+)\s*=/gm,
    windowProperty: /window\.(\w+)\s*\{/gm,
    modulePattern: /window\.(\w+)\s*=\s*\{/gm
};

// Analyze a single JS file
function analyzeFile(filePath) {
    const relativePath = path.relative(__dirname, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find function declarations
    let match;
    while ((match = patterns.functionDeclaration.exec(content)) !== null) {
        const funcName = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        if (!inventory.globalFunctions.has(funcName)) {
            inventory.globalFunctions.set(funcName, []);
        }
        inventory.globalFunctions.get(funcName).push({
            file: relativePath,
            line: lineNum
        });
    }
    
    // Find window assignments
    patterns.windowAssignment.lastIndex = 0;
    while ((match = patterns.windowAssignment.exec(content)) !== null) {
        const propName = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        if (!inventory.windowAssignments.has(propName)) {
            inventory.windowAssignments.set(propName, []);
        }
        inventory.windowAssignments.get(propName).push({
            file: relativePath,
            line: lineNum
        });
    }
    
    // Find event listeners
    patterns.addEventListener.lastIndex = 0;
    while ((match = patterns.addEventListener.exec(content)) !== null) {
        const eventType = match[1];
        const handler = match[2];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        inventory.eventListeners.push({
            file: relativePath,
            line: lineNum,
            event: eventType,
            handler: handler
        });
    }
    
    // Find global variables
    patterns.globalVariable.lastIndex = 0;
    while ((match = patterns.globalVariable.exec(content)) !== null) {
        const varName = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        // Check if it's at the top level (not inside a function)
        const lineContent = lines[lineNum - 1];
        const indentation = lineContent.match(/^(\s*)/)[1];
        if (indentation.length === 0) {
            if (!inventory.globalVariables.has(varName)) {
                inventory.globalVariables.set(varName, []);
            }
            inventory.globalVariables.get(varName).push({
                file: relativePath,
                line: lineNum
            });
        }
    }
    
    // Find module patterns
    patterns.modulePattern.lastIndex = 0;
    while ((match = patterns.modulePattern.exec(content)) !== null) {
        const moduleName = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        if (!inventory.moduleExports.has(moduleName)) {
            inventory.moduleExports.set(moduleName, {
                file: relativePath,
                line: lineNum,
                exports: []
            });
        }
    }
}

// Find all JS files
function findJSFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
            files.push(...findJSFiles(fullPath));
        } else if (item.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Identify conflicts
function identifyConflicts() {
    // Find duplicate function names
    for (const [funcName, locations] of inventory.globalFunctions) {
        if (locations.length > 1) {
            inventory.duplicateFunctions.set(funcName, locations);
            inventory.potentialConflicts.push({
                type: 'DUPLICATE_FUNCTION',
                name: funcName,
                locations: locations
            });
        }
    }
    
    // Find window property conflicts
    for (const [propName, locations] of inventory.windowAssignments) {
        if (locations.length > 1) {
            inventory.potentialConflicts.push({
                type: 'MULTIPLE_WINDOW_ASSIGNMENTS',
                name: propName,
                locations: locations
            });
        }
    }
    
    // Find function names that match window properties
    for (const [funcName, funcLocations] of inventory.globalFunctions) {
        if (inventory.windowAssignments.has(funcName)) {
            inventory.potentialConflicts.push({
                type: 'FUNCTION_WINDOW_CONFLICT',
                name: funcName,
                functionLocations: funcLocations,
                windowLocations: inventory.windowAssignments.get(funcName)
            });
        }
    }
}

// Generate report
function generateReport() {
    let report = '# Codebase Inventory Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Summary
    report += '## Summary\n\n';
    report += `- Total JS files analyzed: ${findJSFiles(JS_DIR).length}\n`;
    report += `- Global functions found: ${inventory.globalFunctions.size}\n`;
    report += `- Window assignments: ${inventory.windowAssignments.size}\n`;
    report += `- Event listeners: ${inventory.eventListeners.length}\n`;
    report += `- Global variables: ${inventory.globalVariables.size}\n`;
    report += `- Potential conflicts: ${inventory.potentialConflicts.length}\n\n`;
    
    // Critical Issues
    if (inventory.potentialConflicts.length > 0) {
        report += '## 🚨 Critical Issues\n\n';
        
        for (const conflict of inventory.potentialConflicts) {
            report += `### ${conflict.type}: ${conflict.name}\n\n`;
            
            if (conflict.type === 'DUPLICATE_FUNCTION') {
                report += 'Found in:\n';
                for (const loc of conflict.locations) {
                    report += `- ${loc.file}:${loc.line}\n`;
                }
            } else if (conflict.type === 'FUNCTION_WINDOW_CONFLICT') {
                report += 'Function declarations:\n';
                for (const loc of conflict.functionLocations) {
                    report += `- ${loc.file}:${loc.line}\n`;
                }
                report += '\nWindow assignments:\n';
                for (const loc of conflict.windowLocations) {
                    report += `- ${loc.file}:${loc.line}\n`;
                }
            }
            report += '\n';
        }
    }
    
    // Duplicate Functions
    if (inventory.duplicateFunctions.size > 0) {
        report += '## Duplicate Functions\n\n';
        for (const [funcName, locations] of inventory.duplicateFunctions) {
            report += `### ${funcName}\n`;
            for (const loc of locations) {
                report += `- ${loc.file}:${loc.line}\n`;
            }
            report += '\n';
        }
    }
    
    // All Global Functions
    report += '## All Global Functions\n\n';
    const sortedFunctions = Array.from(inventory.globalFunctions.keys()).sort();
    for (const funcName of sortedFunctions) {
        const locations = inventory.globalFunctions.get(funcName);
        report += `### ${funcName}\n`;
        for (const loc of locations) {
            report += `- ${loc.file}:${loc.line}\n`;
        }
        report += '\n';
    }
    
    // Window Assignments
    report += '## Window Assignments\n\n';
    const sortedWindowProps = Array.from(inventory.windowAssignments.keys()).sort();
    for (const propName of sortedWindowProps) {
        const locations = inventory.windowAssignments.get(propName);
        report += `### window.${propName}\n`;
        for (const loc of locations) {
            report += `- ${loc.file}:${loc.line}\n`;
        }
        report += '\n';
    }
    
    // Event Listeners
    report += '## Event Listeners\n\n';
    const eventsByType = {};
    for (const listener of inventory.eventListeners) {
        if (!eventsByType[listener.event]) {
            eventsByType[listener.event] = [];
        }
        eventsByType[listener.event].push(listener);
    }
    
    for (const [eventType, listeners] of Object.entries(eventsByType)) {
        report += `### ${eventType} events (${listeners.length})\n`;
        for (const listener of listeners) {
            report += `- ${listener.file}:${listener.line} → ${listener.handler}\n`;
        }
        report += '\n';
    }
    
    return report;
}

// Main execution
console.log('Analyzing codebase...');
const jsFiles = findJSFiles(JS_DIR);
console.log(`Found ${jsFiles.length} JS files to analyze`);

for (const file of jsFiles) {
    console.log(`Analyzing ${path.relative(__dirname, file)}`);
    analyzeFile(file);
}

identifyConflicts();
const report = generateReport();

fs.writeFileSync(OUTPUT_FILE, report);
console.log(`\nInventory report generated: ${OUTPUT_FILE}`);
console.log(`Found ${inventory.potentialConflicts.length} potential conflicts!`);