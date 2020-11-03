
const Zip = require('./zip')
const ConfigName = new RegExp('project.config.json$', 'i')

class MiniProgram extends Zip {
  constructor (file) {
    super(file)
    if (!(this instanceof MiniProgram)) {
      return new MiniProgram(file)
    }
  }

  parse () {
    return new Promise((resolve, reject) => {
      this.getEntries([ConfigName]).then(buffers => {
        if (!buffers[ConfigName]) {
          throw new Error('project.config.json can\'t be found.')
        }
        try {
          let info = JSON.parse(buffers[ConfigName].toString())
          info['projectInfo'] = {
            packageName: info.appid,
            versionCode: info.customInfo.versionCode,
            versionName: info.customInfo.versionName,
            minSdkVersion: info.libVersion,
            targetSdkVersion: info.libVersion,
            appName: info.description,
            icon: info.customInfo.icon,
            type: 'MiniProgram'
          }
          resolve(info)
        } catch (e) {
          reject(e)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }
}
module.exports = MiniProgram
