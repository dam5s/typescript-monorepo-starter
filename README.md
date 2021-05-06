# React Redux Starter

## Some external guides

* https://survivejs.com/
* https://github.com/yakkomajuri/react-from-scratch

## Initial setup

```
$ node --version
v14.16.1

$ npm install -g yarn

$ yarn --version
1.22.10

$ vi .gitignore
$ cat .gitginore

node_modules

$ vi package.json
$ cat package.json
{
  "name": "react-redux-starter",
  "version": "0.1.0",
  "private": true
}

$ yarn add react react-dom react-redux
$ yarn add -D \
    typescript \
    webpack \
    webpack-cli \
    webpack-dev-server \
    mini-css-extract-plugin \
    css-loader

$ npx webpack init

? Which of the following JS solutions do you want to use? Typescript
? Do you want to use webpack-dev-server? Yes
? Do you want to simplify the creation of HTML files for your bundle? Yes
? Which of the following CSS solutions do you want to use? SASS
? Will you be using CSS styles along with SASS in your project? No
? Will you be using PostCSS in your project? No
? Do you want to extract CSS for every file? No
? Do you like to install prettier to format generated configuration? Yes
? Overwrite package.json? overwrite
? Overwrite README.md? do not overwrite
```

Now edit `package.json` to restore your project name and version.

## CSS Config

Configure webpack

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//...
new MiniCssExtractPlugin()
//...
use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
```

## Linting

Install dependencies

```
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-webpack-plugin
```

Create `.eslintrc` file

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

Configure webpack

```js
const EslintWebpackPlugin = require('eslint-webpack-plugin');
//...
new EslintWebpackPlugin({
    context: 'src',
    extensions: ['ts', 'tsx'],
    failOnError: true,
    failOnWarning: true,
})
//...
```

Add manual command for running the linter in `package.json`

```
"lint:ts": "eslint src --ext .ts,.tsx"
```
