# rollup-plugin-deps

This is a rollup plugin that can help you visualize the dependencies between files.


## Examples

**VueJS**

![](./assets/vue.png)

## Install

```sh
npm install rollup-plugin-dependency-flow
```

## Usage

```js
const deps = require('rollup-plugin-dependency-flow');

// rollup config
module.exports = {
  plugins: [
    deps()
  ]
};
```

## API

### deps(build, serve)

The plugin entry point. The plugin can generate a static htlm file of the dependency flow, or run a web server in watch mode which updates live on filesave.

- build `object | false` - Creates a static `html` file. Default: `{}`
  - dir `string` - Directory location.
  - name `string` - Name of the file.
- serve `object | false` - Starts a web server (can only be run in watch mode). Default: `false`
  - port `number` - Port to run the web server on.
  - wsPort `number` - Websocket port used to pass data between node process and web server.
  - Returns

The web server usually runs on `localhost:3001` if the ports are available, check the console output for `Serving dependency flow at: <adress>` to see where the server is running.

#### Examples

```js
// Run web server only
deps(false, {
  port: 8085, // run web server on port 8085
  wsPort: 5055 // run websocket on 5055
});

// Create static file only
deps();
```
