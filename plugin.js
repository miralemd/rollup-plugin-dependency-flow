const flow = require('dependency-flow');

const path = require('path');

const cwd = process.cwd();

const normalizePath = (s) => {
  let p = s.split('!');
  p = p[p.length - 1];
  return p.replace(cwd, '');
};

module.exports = function plugin(build = {}, serve = false) {
  const buildOptions = build === true ? {} : build;
  const serveOptions = serve === true ? {} : serve;
  let s;
  return {
    name: 'dependency-flow',
    generateBundle(opts, bundle) {
      const links = [];
      const modules = {};
      let name;
      let dir;
      Object.keys(bundle).forEach((key) => {
        if (opts.dir) {
          dir = opts.dir;
        } else if (opts.file) {
          const p = path.parse(opts.file);
          dir = p.dir;
          name = `${p.name}-dependency-flow`;
        }
        Object.keys(bundle[key].modules).forEach((mkey) => {
          if (mkey[0] === '\u0000') {
            return;
          }
          const m = bundle[key].modules[mkey];
          if (!m.renderedLength) {
            return;
          }
          const mInfo = this.getModuleInfo(mkey);

          modules[normalizePath(mInfo.id)] = {
            size: m.renderedLength,
          };

          mInfo.importedIds.forEach((im) => {
            if (im[0] !== '\u0000') {
              links.push([
                normalizePath(mInfo.id),
                normalizePath(im),
              ]);
            }
          });
        });
      });
      const data = { modules, links };
      if (!s && serveOptions && process.env.ROLLUP_WATCH) {
        s = flow.serve(serveOptions);
      }
      if (s) {
        s.update(data);
      }
      if (buildOptions) {
        flow.build(data, {
          name,
          dir,
          ...buildOptions,
        });
      }
    },
  };
};
