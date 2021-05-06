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

$ yarn add react react-dom react-redux @types/react-dom
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
   ],
   "rules": {
      "quotes": [
         "error",
         "single",
         {
            "avoidEscape": true
         }
      ],
      "semi": [
         "error",
         "always"
      ]
   }
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

## Setting up Jest and React Testing

Add dependencies

```
yarn add -D \
    jest \
    @types/jest \
    babel-jest \
    @babel/core \
    @babel/preset-env \
    @babel/preset-typescript \
    @babel/plugin-syntax-jsx \
    @babel/preset-react \
    @testing-library/react
```

Configure test run task in `package.json`

```
    "test": "jest"
```

Create `babel.config.json`

```json
{
   "presets": [
      [
         "@babel/preset-env",
         {
            "targets": {
               "node": "current"
            }
         }
      ],
      "@babel/typescript",
      "@babel/preset-react"
   ],
   "plugins": [
      "@babel/plugin-syntax-jsx"
   ]
}
```

## Writing your first component

1. Convert your `index.ts` to `index.tsx`
1. Render your component at the root, e.g.
   ```
   ReactDOM.render(
       <Joke text="Chuck Norris once won a game of connect four in 3 moves." />,
       document.getElementById('root')
   )
   ```
1. Write the jest test at `src/components/__tests__/joke.spec.tsx`, it will be detected by jest automatically.
1. Create your `src/components/joke.tsx` to match your specification.

## Writing your first network access

TODO
