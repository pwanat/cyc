# CYC - CLI Yield Component

### Simple, customizable utility for adding new React components to your project.

This project is a CLI tool that allows you to quickly scaffold new components. All of the necessary boilerplate will be generated automatically.

A fork of https://github.com/joshwcomeau/new-component

<br />

## Features

- Simple CLI interface for adding React components.
- Uses [Prettier](https://github.com/prettier/prettier) to stylistically match the existing project.
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output!

<br />

## Quickstart

Install via NPM:

```bash
# Using Yarn:
$ yarn global add git@github.com:pwanat/cyc

# or, using NPM
$ npm i -g git@github.com:pwanat/cyc
```

`cd` into your project's directory, and try creating a new component:

```bash
$ cyc MyNewComponent
```

Your project will now have a new directory at `src/components/my-new-component`. This directory has two files:


```tsx
// `my-new-component/my-new-component.tsx`
import Styles from './my-new-component.module.scss';

export const MyNewComponent = () => {
  return (
    <div>

    </div>
  );
}
```

```module.scss 
// `my-new-componentmy-new-component.module.scss`
@import '@/styles/variables'
```

These files will be formatted according to your Prettier configuration.

<br />

## API Reference

### Directory

Controls the desired directory for the created component. Defaults to `src/components`

**Usage:**

Command line: `--dir <value>` or `-d <value>`
eg. `cyc -d src/containers/NewComponent

JSON config: `{ "dir": <value> }`
<br />

## Known Issues

If you try to use this package with the Next.js App Router, you’ll run into an error:

```md
**Syntax error:** the name `default` is exported multiple times
```

This issue is described in depth in [my blog post about this package](https://joshwcomeau.com/react/file-structure/#issues-with-the-app-router). To solve this problem, you’ll need to fork this library and remove [the wildcard export](https://github.com/joshwcomeau/new-component/blob/main/src/index.js#L67).

## Development

To get started with development:

- Fork and clone the Git repo
- `cd` into the directory and install dependencies (`yarn install` or `npm install`)
- Set up a symlink by running `npm link`, while in the `new-component` directory. This will ensure that the `new-component` command uses this locally-cloned project, rather than the global NPM installation.
- Spin up a test React project.
- In that test project, use the `new-component` command to create components and test that your changes are working.
