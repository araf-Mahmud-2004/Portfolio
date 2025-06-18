#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build process...\n');

// Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  execSync('rm -rf dist', { stdio: 'inherit' });
} catch (error) {
  // Directory might not exist, continue
}

// Build the project
console.log('📦 Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Analyze bundle size
console.log('\n📊 Analyzing bundle size...');
const distPath = path.join(process.cwd(), 'dist');
const assetsPath = path.join(distPath, 'assets');

if (fs.existsSync(assetsPath)) {
  const files = fs.readdirSync(assetsPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));
  
  console.log('\n📁 Bundle Analysis:');
  console.log('==================');
  
  let totalSize = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    let type = 'Unknown';
    if (file.includes('vendor')) type = 'Vendor';
    else if (file.includes('motion')) type = 'Motion';
    else if (file.includes('router')) type = 'Router';
    else if (file.includes('supabase')) type = 'Supabase';
    else if (file.includes('icons')) type = 'Icons';
    else if (file.includes('index')) type = 'Main';
    
    console.log(`📄 ${type.padEnd(8)} | ${sizeKB.padStart(8)} KB | ${file}`);
  });
  
  cssFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    console.log(`🎨 CSS      | ${sizeKB.padStart(8)} KB | ${file}`);
  });
  
  console.log('==================');
  console.log(`📊 Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  if (totalSize > 500 * 1024) {
    console.log('⚠️  Bundle size is large (>500KB). Consider further code splitting.');
  } else if (totalSize > 300 * 1024) {
    console.log('⚡ Bundle size is moderate (>300KB). Good job on optimization!');
  } else {
    console.log('✅ Excellent bundle size (<300KB). Great optimization!');
  }
}

// Check for common performance issues
console.log('\n🔍 Performance Checklist:');
console.log('========================');

// Check if source maps are disabled in production
const indexHtml = path.join(distPath, 'index.html');
if (fs.existsSync(indexHtml)) {
  const content = fs.readFileSync(indexHtml, 'utf8');
  if (!content.includes('.map')) {
    console.log('✅ Source maps disabled in production');
  } else {
    console.log('⚠️  Source maps found in production build');
  }
}

// Check for console.log removal
const mainJsFile = jsFiles.find(file => file.includes('index'));
if (mainJsFile) {
  const mainJsPath = path.join(assetsPath, mainJsFile);
  const content = fs.readFileSync(mainJsPath, 'utf8');
  if (!content.includes('console.log')) {
    console.log('✅ Console statements removed');
  } else {
    console.log('⚠️  Console statements found in production');
  }
}

console.log('✅ Build process completed successfully!');
console.log('\n🚀 Your optimized portfolio is ready in the dist/ folder');
console.log('📝 Run "npm run preview" to test the production build locally');