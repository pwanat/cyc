#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { program } = require('commander');

const {
  getConfig,
  buildPrettifier,
  createParentDirectoryIfNecessary,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
  kebabize,
  capitalize,
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    config.dir
  )
  .parse(process.argv);

const [componentName] = program.args;

const options = program.opts();

const fileExtension = 'tsx';

// Find the path to the selected template file.
const templatePath = `./templates/ts.js`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${options.dir}/${kebabize(componentName)}`;
const filePath = `${componentDir}/${kebabize(componentName)}.${fileExtension}`;
const stylesPath = `${componentDir}/${kebabize(componentName)}.module.scss`;

// Our index template is super straightforward, so we'll just inline it for now.
const stylesTemplate = `@import '@/styles/variables';`;

logIntro({
  name: componentName,
  dir: componentDir,
  lang: options.lang,
});

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: cyc <name>`
  );
  process.exit(0);
}

// Check to see if the parent directory exists.
// Create it if not
createParentDirectoryIfNecessary(options.dir);

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(
    `Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
  );
  process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(templatePath))
  .then((template) => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, capitalize(componentName))
  )
  .then((template) =>
    // Replace our style placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_KEBAB_NAME/g, kebabize(componentName))
  )
  .then((template) =>
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePath, template)
  )
  .then((template) => {
    logItemCompletion('Component built and saved to disk.');
    return template;
  })
  .then((template) =>
    // We also need the `component_kebab_name.module.scss` file, which allows easy importing.
    writeFilePromise(stylesPath, stylesTemplate)
  )
  .then((template) => {
    logItemCompletion('Styles file built and saved to disk.');
    return template;
  })
  .then((template) => {
    logConclusion();
  })
  .catch((err) => {
    console.error(err);
  });
