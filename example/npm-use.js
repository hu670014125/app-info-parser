const AppInfoParser = require('../lib/index')
// const IpaParser = require('../src/ipa')
// const ApkParser = require('../src/apk')
// 解析Android APK
const apkInfoParser = new AppInfoParser('/Users/huqs/Desktop/微信.apk')
apkInfoParser.parse().then(result => {
  // console.log('info ----> ', result)
}).catch(e => {
  console.log('err ----> ', e)
})

// AppInfoParser parse ipa
// const ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/vl-ios-app.ipa')
const ipaInfoParser = new AppInfoParser('/Users/huqs/Desktop/微信_7.0.15.ipa')
ipaInfoParser.parse().then(result => {
  console.log('info ----> ', result)
  // console.log('icon base64 ----> ', result.icon)
}).catch(e => {
  console.log('err ----> ', e)
})

// 微信小程序解析
const miniProgramInfoParser = new AppInfoParser('/Users/huqs/Desktop/速登记微信小程序.zip')
miniProgramInfoParser.parse().then(result => {
  // console.log('info ----> ', result)
  // console.log('icon base64 ----> ', result.icon)
}).catch(e => {
  console.log('err ----> ', e)
})
