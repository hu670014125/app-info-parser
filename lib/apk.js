const Zip = require('./zip')
const { mapInfoResource, findApkIconPath, getBase64FromBuffer } = require('./utils')
const ManifestName = /^androidmanifest\.xml$/
const ResourceName = /^resources\.arsc$/

const ManifestXmlParser = require('./xml-parser/manifest')
const ResourceFinder = require('./resource-finder')

class ApkParser extends Zip {
  /**
   * parser for parsing .apk file
   * @param {String | File | Blob} file // file's path in Node, instance of File or Blob in Browser
   */
  constructor (file) {
    super(file)
    if (!(this instanceof ApkParser)) {
      return new ApkParser(file)
    }
  }
  parse () {
    return new Promise((resolve, reject) => {
      this.getEntries([ManifestName, ResourceName]).then(buffers => {
        if (!buffers[ManifestName]) {
          throw new Error('AndroidManifest.xml can\'t be found.')
        }
        // 开始解析AndroidManifest.xml
        let apkInfo = this._parseManifest(buffers[ManifestName])
        if (!buffers[ResourceName]) {
          // 如果安装包内没有resources.arsc直接返回，此时不能解析icon和label
          resolve(apkInfo)
        } else {
          // 开始解析resources.arsc
          let resourceMap = this._parseResourceMap(buffers[ResourceName])
          // 解析完成后更新apkInfo
          apkInfo = mapInfoResource(apkInfo, resourceMap)
          // find icon path and parse icon
          const iconPath = findApkIconPath(apkInfo)

          let appName = ''
          if (typeof apkInfo.application.label === 'object' && apkInfo.application.label instanceof Array) {
            apkInfo.application.label.forEach(res => {
              // 优先选择中文名称，如果没有中文名称默认取第一个
              let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
              if (patrn.exec(res)) {
                appName = res
              }
              if (appName.length === 0) {
                appName = apkInfo.application.label[0]
              }
            })
          } else {
            appName = apkInfo.application.label
          }
          apkInfo['projectInfo'] = {
            packageName: apkInfo.package,
            versionCode: apkInfo.versionCode,
            versionName: apkInfo.versionName,
            minSdkVersion: apkInfo.usesSdk.minSdkVersion,
            targetSdkVersion: apkInfo.usesSdk.targetSdkVersion,
            appName: appName,
            icon: '',
            type: 'Android'
          }
          if (iconPath) {
            this.getEntry(iconPath).then(iconBuffer => {
              apkInfo.icon = getBase64FromBuffer(iconBuffer)
              apkInfo.projectInfo.icon = apkInfo.icon
              resolve(apkInfo)
            }).catch(e => {
              reject(e)
            })
          } else {
            apkInfo.icon = null
            resolve(apkInfo)
          }
        }
      }).catch(e => {
        reject(e)
      })
    })
  }
  /**
   * Parse manifest
   * @param {Buffer} buffer // manifest file's buffer
   */
  _parseManifest (buffer) {
    try {
      const parser = new ManifestXmlParser(buffer, {
        ignore: [
          'application.activity',
          'application.service',
          'application.receiver',
          'application.provider',
          'permission-group'
        ]
      })
      return parser.parse()
    } catch (e) {
      throw new Error('Parse AndroidManifest.xml error: ', e)
    }
  }
  /**
   * Parse resourceMap
   * @param {Buffer} buffer // resourceMap file's buffer
   */
  _parseResourceMap (buffer) {
    try {
      return new ResourceFinder().processResourceTable(buffer)
    } catch (e) {
      throw new Error('Parser resources.arsc error: ' + e)
    }
  }
}

module.exports = ApkParser
