import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const HEX_RE = /#[0-9a-fA-F]{3,6}\b/;
const ARBITRARY_COLOR_RE = /(?:bg|text|border|fill|stroke|from|to|via)-\[#[0-9a-fA-F]{3,6}\]/;

function reportHex(context, node, value) {
  if (typeof value !== 'string') return;
  if (ARBITRARY_COLOR_RE.test(value)) {
    context.report({ node, message: 'Tailwind arbitrary color value. Use a design system class instead (e.g. btn-primary, card, text-accent).' });
  }
  if (HEX_RE.test(value) && !value.includes('var(--')) {
    context.report({ node, message: 'Hardcoded hex color. Use a CSS variable (var(--color-*)) or design system class instead.' });
  }
}

const localPlugin = {
  rules: {
    'no-hardcoded-colors': {
      meta: { type: 'suggestion', schema: [] },
      create(context) {
        return {
          JSXAttribute(node) {
            const attrName = node.name?.name;
            if (attrName !== 'className' && attrName !== 'style') return;

            const val = node.value;
            if (!val) return;

            // className="static string"
            if (val.type === 'Literal') {
              reportHex(context, val, val.value);
              return;
            }

            if (val.type !== 'JSXExpressionContainer') return;
            const expr = val.expression;

            // className={`template`}
            if (expr.type === 'TemplateLiteral') {
              expr.quasis.forEach(q => reportHex(context, q, q.value.raw));
            }

            // style={{ color: "#fff", ... }}
            if (expr.type === 'ObjectExpression') {
              expr.properties.forEach(prop => {
                if (prop.value?.type === 'Literal') {
                  reportHex(context, prop.value, prop.value.value);
                }
                if (prop.value?.type === 'TemplateLiteral') {
                  prop.value.quasis.forEach(q => reportHex(context, q, q.value.raw));
                }
              });
            }
          },
        };
      },
    },
  },
};

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      local: localPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'local/no-hardcoded-colors': 'error',
    },
  },
]
