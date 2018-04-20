#! /usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const theo = require('theo');
const colorIndex = require('../tokens/palette');
const colorTokens = require('../tokens/palette/aliases.json');
const groupedTokens = require('../tokens/withoutPalette.json');

const MINERAL_TOKENS_DIR = path.join(__dirname, '../tokens');
const MINERAL_TOKENS_COLORS_DIR = path.join(__dirname, '../tokens/palette');
const SRC_DIR = path.join(__dirname, '../src');

if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR);
}

const keysFromIndex = (index, replacedString) =>
  index.map((key) => key.replace('./', '').replace(replacedString, ''));

const formatInput = ({ input, valueTemplate }) => {
  return input
    .get('props')
    .map((prop) => {
      let result = [];
      if (prop.has('comment')) {
        result.push(`// ${prop.get('comment')}`);
      }
      const k = prop.get('name');
      const v = prop.get('value');
      result.push(valueTemplate(k, v));
      return result;
    })
    .flatten(1)
    .toArray()
    .join('\n');
};

const tokenGroups = keysFromIndex(groupedTokens.imports, '/index.json');

theo.registerFormat('colorExport.js', (input) =>
  [
    'export default {',
    formatInput({
      input,
      valueTemplate: (k, v) => {
        k = `_${k.split('_')[1]}`;
        return `  ${k}: ${v},`;
      }
    }),
    '};'
  ].join('\n')
);

theo.registerFormat('defaultExport.js', (input) =>
  [
    'export default {',
    formatInput({ input, valueTemplate: (k, v) => `  ${k}: ${v},` }),
    '};'
  ].join('\n')
);

theo.registerFormat('groupedNamedExports.js', (input) =>
  tokenGroups
    .map((group) => {
      const filteredInput = input.merge({
        props: input.get('props').filter((prop) => {
          if (group === 'generic') {
            return tokenGroups.indexOf(prop.get('category')) === -1;
          } else {
            return prop.get('category') === group;
          }
        })
      });
      return [
        `export const ${group} = {`,
        formatInput({
          input: filteredInput,
          valueTemplate: (k, v) => `  ${k}: ${v},`
        }),
        '};'
      ].join('\n');
    })
    .join('\n')
);

// TODO: Remove?
// theo.registerFormat('namedExports.js', (input) =>
//   formatInput({ input, valueTemplate: (k, v) => `export const ${k} = ${v};` })
// );

theo.registerFormat('mnrl-scss', (input) =>
  formatInput({
    input,
    valueTemplate: (k, v) => {
      k = k.replace('_', '-');
      return `$mnrl-${k}: ${v};`;
    }
  })
);

theo.registerFormat('singleDefaultExport.js', (input) =>
  formatInput({ input, valueTemplate: (k, v) => `export default ${v};` })
);

theo.registerValueTransform(
  'addQuotes',
  (prop) => typeof prop.get('value') === 'string',
  (prop) => `'${prop.get('value')}'`
);

// Necessary because theo will wrap quotes around an aliased value
theo.registerValueTransform(
  'fontWeight',
  (prop) => prop.get('name').indexOf('fontWeight') !== -1,
  (prop) =>
    parseInt(
      prop
        .get('value')
        .replace("'", '')
        .replace("'", '')
    )
);

theo.registerTransform('js', ['addQuotes', 'fontWeight']);

// For debugging
// theo
//   .convert({
//     transform: {
//       type: 'web',
//       file: path.join(MINERAL_TOKENS_DIR, 'index.json')
//     },
//     format: {
//       type: 'raw.json'
//     }
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => console.log(`Error: ${error}`));

const configurations = [
  {
    // Tokens
    transform: {
      file: path.join(MINERAL_TOKENS_DIR, 'withoutPalette.json'),
      type: 'js'
    },
    format: { type: 'defaultExport.js' },
    fileName: 'tokens.js'
  },
  {
    // Grouped tokens
    transform: {
      file: path.join(MINERAL_TOKENS_DIR, 'withoutPalette.json'),
      type: 'js'
    },
    format: { type: 'groupedNamedExports.js' },
    fileName: 'groupedTokens.js'
  },
  {
    // Just the color palette
    transform: {
      file: path.join(MINERAL_TOKENS_COLORS_DIR, 'index.json'),
      type: 'js'
    },
    format: { type: 'defaultExport.js' },
    fileName: 'palette.js'
  },
  {
    // Tokens, including palette, in Sass
    transform: {
      file: path.join(MINERAL_TOKENS_DIR, 'index.json')
    },
    format: { type: 'mnrl-scss' },
    fileName: 'index.scss'
  }
];

// Each color
const colors = keysFromIndex(colorTokens.imports, '.json')
  .concat(['brand'])
  .sort();

colors.forEach((color) => {
  const data = {
    ...colorIndex,
    props: colorIndex.props.filter((prop) => prop.name.indexOf(color) !== -1)
  };
  configurations.push({
    transform: {
      data: JSON.stringify(data),
      file: path.join(MINERAL_TOKENS_COLORS_DIR, `${color}.json`),
      type: 'js'
    },
    format: {
      type:
        ['black', 'white'].indexOf(color) !== -1
          ? 'singleDefaultExport.js'
          : 'colorExport.js'
    },
    fileName: `${color}.js`
  });
});

configurations.forEach(({ transform, format, fileName }) => {
  theo
    .convert({ transform, format })
    .then((result) => {
      fs.writeFile(path.join(SRC_DIR, fileName), result);
    })
    .catch((error) => console.log(`Error: ${error}`));
});
