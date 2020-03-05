// ==UserScript==
// @name              电信宽带提速助手
// @namespace         https://github.com/syhyz1990/speedup
// @version           1.0.0
// @icon              https://www.baiduyun.wiki/speedup.png
// @description       【电信宽带提速助手】是一款基于电信宽带的免费提速脚本，可将低于200M的家庭宽带提速至200M。
// @author            syhyz1990
// @license           MIT
// @supportURL        https://github.com/syhyz1990/speedup
// @updateURL         https://www.baiduyun.wiki/speedup.user.js
// @downloadURL       https://www.baiduyun.wiki/speedup.user.js
// @match             *://*.baiduyun.wiki/*
// @match             *://*.baidusu.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@9
// @connect           ebit.cn
// @run-at            document-idle
// @grant             GM_xmlhttpRequest
// @grant             unsafeWindow
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// ==/UserScript==
'use strict'

;(function () {
  localStorage.setItem('speedupPlugin_loaded', 'true')

  const version = '1.0.0'
  const id = 2017030000 + (Date.parse(new Date()) / 1000).toString()
  const copyright = 'Powerd By <a style="margin-left: 5px;" href="https://www.baiduyun.wiki/install-speedup" target="_blank">电信宽带提速助手</a>'
  const s1 = 'YUhSMGNITTZMeTlwYzNCbFpXUXVaV0pwZEM1amJpOTRlV1poWTJVdmVIbHpjR1ZsWkVGamRHbDJhWFI1TDJselZITXVhbWgwYld3PQ=='
  const s2 = 'YUhSMGNEb3ZMMmx6Y0dWbFpDNWxZbWwwTG1OdUwzaDVabUZqWlM5NGVYTndaV1ZrUVdOMGFYWnBkSGt2YzNCbFpXUjFjQzVxYUhSdGJBPT0='

  let clog = (c1, c2, c3) => {
    c1 = c1 ? c1 : ''
    c2 = c2 ? c2 : ''
    c3 = c3 ? c3 : ''
    console.group('[电信宽带提速助手]')
    console.log(c1, c2, c3)
    console.groupEnd()
  }

  let main = {
    getDialInfo() {
      GM_xmlhttpRequest({
        method: "GET",
        cookie: `xymac=2020XYFREE; useridFREE=${id}; phone=${id}`,
        responseType: 'json',
        anonymous: true,
        url: atob(atob(s1)),
        onload: (res) => {
          let info = res.response
          clog('宽带信息', info)
          if (info.state === 0) {
            GM_setValue('dialAcct', info.dialAcct)
            Swal.fire({
              icon: 'success',
              title: '提示',
              html: `<div style="margin-bottom: 15px;">${info.message}</div>提速宽带：${info.dialAcct} | 当前带宽：${info.basicRateDown}M`,
              footer: copyright,
              confirmButtonText: '立即提速'
            }).then((result) => {
              if (result.value) {
                GM_openInTab('https://www.baiduyun.wiki/install-speedup', {active: true})
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: '提示',
              html: JSON.stringify(info),
            })
          }
        }
      })
    },
    handleSpeedUp() {
      GM_xmlhttpRequest({
        method: "GET",
        cookie: `xymac=2020XYFREE; useridFREE=${id}; phone=${id}; dialacct=${GM_getValue('dialAcct')};`,
        responseType: 'json',
        anonymous: true,
        url: atob(atob(s2)),
        onload: (res) => {
          let info = res.response
          clog('提速结果', info)
          localStorage.setItem('speedupPlugin_history', main.getDate())
          if (info.state === 1) {
            Swal.fire({
              icon: 'success',
              title: '恭喜您',
              html: `${info.message}`,
              footer: copyright,
              confirmButtonText: '我要测速'
            }).then((result) => {
              if (result.value) {
                GM_openInTab('http://www.speedtest.cn/?from=www.baiduyun.wiki', {active: true})
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: '提示',
              html: JSON.stringify(info),
            })
          }
        }
      })
    },
    getDate() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    createMenu() {
      GM_registerMenuCommand('跳转到提速页面', function () {
        GM_openInTab('http://www.baiduyun.wiki/speedup', {active: true})
      })
    }
  }

  $(function () {
    main.createMenu()
    $('body').on('click', '#SpeedUpButton', function () {
      main.getDialInfo()
    })
  })
})()
