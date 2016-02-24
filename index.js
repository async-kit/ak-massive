'use strict';
const  _ = require('highland')
    , _get = require('lodash.get')
    , _set = require('lodash.set');

module.exports = (massiveInstance) => {

  function streamedMassiveMethodFactory(massiveInstance, massiveMethod) {
    return function() {
      const wrapper = _();

      let args = Array.prototype.slice.call(arguments);
      args.push(
          {stream: true},
          (err, dataStream) =>{
            if (err) {
              wrapper.push(err);
            }
            dataStream.pipe(wrapper);
          }
      );

      massiveMethod.apply(massiveInstance, args);
      return wrapper;
    }
  }

  function generatePathName(querySpec) {
    let fullPath = querySpec.filePath.slice(db.scriptsDir.length);
    if (fullPath.startsWith('/')) {
      fullPath = fullPath.slice(1);
    }
    fullPath = fullPath.slice(0, -'.sql'.length);
    fullPath = fullPath.split('/').join('.');
    return fullPath;
  }
  function processScripts(massiveObj) {
    let scripts = {};

    _(massiveObj.queryFiles).each((qf) => {
      let fullPath = generatePathName(qf);
      let targetMethod = _get(massiveObj, fullPath);
      _set(scripts, fullPath, streamedMassiveMethodFactory(massiveObj, targetMethod))
    });

    return scripts;
  }

  const db = massiveInstance;

  return {
    scripts: processScripts(db)
  };
};
