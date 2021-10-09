# React Redux Starter

## Some external guides

* https://survivejs.com/
* https://github.com/yakkomajuri/react-from-scratch

## Initial setup

```
$ node --version
v14.16.1

$ vi .gitignore
$ cat .gitginore

node_modules

$ vi package.json
$ cat package.json
{}

$ npm install react react-dom react-redux
$ npm install -D \
    typescript \
    @types/react-dom \
    webpack \
    webpack-cli \
    webpack-dev-server \
    mini-css-extract-plugin \
    css-loader

$ npx webpack init

? Which of the following JS solutions do you want to use? Typescript
? Do you want to use webpack-dev-server? Yes
? Do you want to simplify the creation of HTML files for your bundle? Yes
? Which of the following CSS solutions do you want to use? CSS
? Will you be using PostCSS in your project? No
? Do you want to extract CSS for every file? No
? Do you like to install prettier to format generated configuration? Yes
? Overwrite package.json? overwrite
? Overwrite README.md? do not overwrite
```

Now edit `package.json` to restore your project name and version.

You may also remove the `@webpack-cli/generators` as we won't be needing it anymore.

```shell
npm uninstall @webpack-cli/generators
```

## CSS Config

Configure webpack

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//...
new MiniCssExtractPlugin()
//...
use: [MiniCssExtractPlugin.loader, 'css-loader']
```

## Linting

Install dependencies

```
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-webpack-plugin
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
      "quotes": ["error", "single", {"avoidEscape": true}],
      "semi": ["error", "always"]
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
"lint": "eslint src --ext .ts,.tsx"
```

## Setting up Jest and React Testing

Add dependencies

```
npm install -D \
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
1. Write the jest test at `src/components/__tests__/Joke.test.tsx`, it will be detected by jest automatically.
1. Create your `src/components/Joke.tsx` to match your specification.

## Writing your first network access

1. `neworking/Http` contains the base of the HTTP layer:
   * `sendRequest` returns a `Result.Async.Pipeline<Response, Http.Failure>`
   * `sendRequestForJson` takes an additional json `Decoder<T>`
     and returns a `Result.Async.Pipeline<T, Http.Failure>` aliased as `HttpResult<T>`
1. `networking/JokeApi` is an example of integration with an actual API endpoint.
1. The `Joke` component now integrates with the API via a dispatch that goes to the `interactions` middleware.

## Loading environment specific configuration

The `ApiConfig` reads values from the environment that we create on window in `env.js`.
`env.js` is a separate entry in the webpack config. This lets us re-use the generated `app.js`
when promoting to higher environments and only change `env.js` for those environments. 
