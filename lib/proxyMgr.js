'use strict'

const { exec } = require('child_process');

function setProxyState(enabled) {
  const flag = enabled ? "on" : "off"
  exec("networksetup -setwebproxystate Wi-Fi " + flag);
  exec("networksetup -setsecurewebproxystate Wi-Fi " + flag);
}

module.exports = { setProxyState, getProxyState };
