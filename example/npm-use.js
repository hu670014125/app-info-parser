const AppInfoParser = require('../lib/index')
const IpaParser = require('../src/ipa')
const ApkParser = require('../src/apk')
// 解析Android APK
const apkInfoParser = new AppInfoParser('/Users/huqs/Desktop/微信.apk')
apkInfoParser.parse().then(result => {
  let info = {
    package: result.package,
    versionCode: result.versionCode,
    versionName: result.versionName,
    minSdkVersion: result.usesSdk.minSdkVersion,
    targetSdkVersion: result.usesSdk.targetSdkVersion,
    name: result.application.label,
    icon: result.icon
  }
  console.log('info ----> ', info)
}).catch(e => {
  console.log('err ----> ', e)
})

// AppInfoParser parse ipa
let ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/微信_7.0.15.ipa')
// const ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/vl-ios-app.ipa')
// const ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/as.ipa')
// let ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/QQ_8.4.5.ipa')
//  ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/Info.ipa')
ipaInfoParser.parse().then(result => {
  console.log('info ----> ', result)
  // console.log('icon base64 ----> ', result.icon)
}).catch(e => {
  console.log('err ----> ', e)
})
//
// const zipEntries = new AdmZip('/Users/huqs/Desktop/微信_7.0.15.ipa').getEntries()
// zipEntries.forEach(function (zipEntry) {
//   if (zipEntry.entryName === 'Payload/WeChat.app/Info.plist') {
//     console.log('--------->entryName', zipEntry.entryName)
//     let plistInfo = parsePlist(zipEntry.getData().toString())
//     console.log(plistInfo)
//   }
// })
// parseBplist.parseFile('/Users/huqs/Desktop/Info.plist', res => {
//   console.log(res)
// })

// // IpaParser
// const ipaParser = new IpaParser('../packages/test.ipa')
// ipaParser.parse().then(result => {
//   console.log('info ----> ', result)
//   console.log('icon base64 ----> ', result.icon)
// }).catch(e => {
//   console.log('err ----> ', e)
// })
//
// // ApkParser
// const apkParser = new ApkParser('../packages/test.apk')
// apkParser.parse().then(result => {
//   console.log('info ----> ', result)
//   console.log('icon base64 ----> ', result.icon)
// }).catch(e => {
//   console.log('err ----> ', e)
// })
