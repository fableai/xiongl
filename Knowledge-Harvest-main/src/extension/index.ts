import Emitter from "../emitter";

Emitter.on('onLogoutMessage', () => {
    // 发送注销消息给扩展程序
    window.postMessage({
        source: 'knowledge-harvest',
        action: 'onLogoutMessage'
    }, '*')
})

Emitter.on('onLoginMessage', (data) => {
    // 发送登录消息给扩展程序
    window.postMessage({
        source: 'knowledge-harvest',
        action: 'onLoginMessage',
        data: data
    }, '*')
})