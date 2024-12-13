import mitt from 'mitt';

const Emitter = mitt<{
    // 登录
    onLoginMessage: {
        userGuid: string,
        accessToken: string,
    }

    // 登出
    onLogoutMessage: void,

    // 文章更新
    onArticleUpdate: void
}>()

export default Emitter;