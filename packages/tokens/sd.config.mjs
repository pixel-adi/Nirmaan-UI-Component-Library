import StyleDictionary from 'style-dictionary';
import { readFileSync, readdirSync, existsSync } from 'fs';

// ═══════════════════════════════════════════════════
// Nirman Design System — Token Build Pipeline
// Style Dictionary v4 configuration
// ═══════════════════════════════════════════════════

// ── Helper: filter tokens by filepath ──
const isFromFile = (substring) => (token) => token.filePath.includes(substring);

// ── BASE BUILD: Primitives + Light (default) ──
// NOTE: gradients.json is excluded — it's structured for the Figma plugin (Paint Styles),
// not for Style Dictionary. SD requires $value on every token with $type.
const baseBuild = new StyleDictionary({
  log: { verbosity: 'verbose', warnings: 'warn' },
  source: ['primitives/color.json', 'primitives/foundations.json', 'semantic/light.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'nir',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: isFromFile('primitives'),
          options: { selector: ':root', outputReferences: true }
        },
        {
          destination: 'light.css',
          format: 'css/variables',
          filter: isFromFile('semantic'),
          options: { selector: ':root, [data-theme="light"]', outputReferences: true }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{
        destination: 'tokens.mjs',
        format: 'javascript/es6'
      }]
    },
    scss: {
      transformGroup: 'scss',
      prefix: 'nir',
      buildPath: 'build/scss/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/class.swift',
        className: 'Tokens',
        filter: (token) => token.$type !== 'shadow' && token.$type !== 'cubicBezier' && typeof token.$value === 'string' && !token.$value.includes('env(')
      }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{
        destination: 'colors.xml',
        format: 'android/colors',
        filter: (token) => token.$type === 'color' && typeof token.$value === 'string' && !token.$value.includes('env(')
      }, {
        destination: 'dimens.xml',
        format: 'android/dimens',
        filter: (token) => token.$type === 'dimension' && typeof token.$value === 'string' && !token.$value.includes('env(')
      }]
    },
    compose: {
      transformGroup: 'compose',
      buildPath: 'build/compose/',
      files: [{
        destination: 'Tokens.kt',
        format: 'compose/object',
        className: 'Tokens',
        filter: (token) => token.$type !== 'shadow' && token.$type !== 'cubicBezier' && typeof token.$value === 'string' && !token.$value.includes('env(')
      }]
    }
  }
});

// ── DARK MODE BUILD ──
const darkBuild = new StyleDictionary({
  log: { warnings: 'warn' },
  source: ['primitives/color.json', 'primitives/foundations.json', 'semantic/dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'nir',
      buildPath: 'build/css/',
      files: [{
        destination: 'dark.css',
        format: 'css/variables',
        filter: isFromFile('semantic'),
        options: { selector: '[data-theme="dark"]', outputReferences: true }
      }]
    }
  }
});

// ── HIGH-CONTRAST BUILD ──
const hcBuild = new StyleDictionary({
  log: { warnings: 'warn' },
  source: ['primitives/color.json', 'primitives/foundations.json', 'semantic/high-contrast.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'nir',
      buildPath: 'build/css/',
      files: [{
        destination: 'high-contrast.css',
        format: 'css/variables',
        filter: isFromFile('semantic'),
        options: { selector: '[data-theme="high-contrast"]', outputReferences: true }
      }]
    }
  }
});

// ── Run all builds ──
console.log('🏗️  Building Nirman tokens...');
console.log('');

try {
  await baseBuild.buildAllPlatforms();
  console.log('  ✓ Primitives + Light mode (CSS, JS, SCSS, iOS, Android, Compose)');

  await darkBuild.buildAllPlatforms();
  console.log('  ✓ Dark mode (CSS)');

  await hcBuild.buildAllPlatforms();
  console.log('  ✓ High-contrast mode (CSS)');

  // ── THEME BUILDS (if themes/ directory exists) ──
  if (existsSync('themes')) {
    const themeFiles = readdirSync('themes').filter(f => f.endsWith('.json') && !f.includes('architecture'));
    for (const file of themeFiles) {
      const name = file.replace('.json', '');
      const themeData = JSON.parse(readFileSync(`themes/${file}`, 'utf-8'));
      const selector = `[data-brand="${themeData.meta?.code?.toLowerCase() || name}"]`;

      const themeBuild = new StyleDictionary({
        log: { warnings: 'warn' },
        source: ['primitives/color.json', 'primitives/foundations.json', 'semantic/light.json', `themes/${file}`],
        platforms: {
          css: {
            transformGroup: 'css',
            prefix: 'nir',
            buildPath: 'build/css/themes/',
            files: [{
              destination: `${name}.css`,
              format: 'css/variables',
              filter: isFromFile('themes'),
              options: { selector, outputReferences: true }
            }]
          }
        }
      });

      await themeBuild.buildAllPlatforms();
      console.log(`  ✓ Theme: ${name} (CSS → ${selector})`);
    }
  }

  console.log('');
  console.log('✅ All token platforms built successfully');
} catch (err) {
  console.error('❌ Token build failed:', err);
  process.exit(1);
}
