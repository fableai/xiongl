import { create } from 'zustand'
import { Theme } from '../theme'
import { createMessageChannel, fetchGetSetParams, fetchQrCode, fetchSetLang, fetchUserById } from '@/service'
import Emitter from '../emitter'
import useWorkbenchStore from '../pages/Workbench/store'
import { Languages, i18n } from 'i18n'
import { Stripe, loadStripe } from '@stripe/stripe-js'
import useChatStore from './chat'

type UserType = {
    name: string,
    nickName: string,
    email: string,
    userGuid: string
    avatar: string,
    userType: 0 |1 | 2
    userTypeTxt: string,
    promptAbstract:string,
    promptKeyInfo:string
}

type GlobalStore = {
    init: () => Promise<void>,

    theme: Theme,
    setTheme: (theme: Theme) => void, // 设置主题

    messageChannel: signalR.HubConnection | null
    createMessageChannel: () => Promise<void>, // 创建消息通道

    userGuid: string
    userInfo: UserType | null, // 用户信息
    setUser: (user: Pick<UserType, 'userGuid'>) => Promise<void>, // 设置用户信息

    setLanguage: (language?: Languages) => Promise<void>, // 设置语言\

    systemConfig: {
        googleClientId: string
        stripePubKey: string
    }
    fetchSystemConfig: () => Promise<void> // 获取系统配置

    stripePromise: Promise<Stripe | null>
    loadStripe: () => Promise<void> // 加载stripe

    dispatchVerificationCode: (params: { email: string }) => Promise<any> // 获取验证码

    logout: () => void, // 退出登录
}

/**
 * 全局状态
 */
const useGlobalStore = create<GlobalStore>((set, get) => ({
    init: async () => {
        const { fetchSystemConfig, loadStripe } = get()

        fetchSystemConfig()
        loadStripe()
    },

    theme: Theme.LIGHT,
    setTheme: (theme) => set({ theme }),

    messageChannel: null,
    createMessageChannel: async () => {
        const { userGuid, messageChannel } = get()

        if (messageChannel) {

        }

        // 建立消息通道
        createMessageChannel(userGuid).then((messageChannel) => {
            set({ messageChannel })
        })
    },

    userGuid: '',
    userInfo: null,
    setUser: async (user) => {
        const { userGuid } = user

        set({ userGuid })

        const result = await fetchUserById(user)

        set({ userInfo: result })

        Emitter.emit('onLoginMessage', {
            accessToken: localStorage.getItem('accessToken')!,
            userGuid,
        })

        get().createMessageChannel()

        return result
    },

    setLanguage: async (language: Languages = i18n.getLanguage()) => {
        const { userGuid } = get()

        i18n.setLanguage(language)

        if (userGuid) {
            return await fetchSetLang({
                userGuid,
                lang: language === 'zh_CN' ? 0 : 1
            })
        }
    },

    systemConfig: {
        // googleClientId: '222670888542-6dajb24ch1svbn31314u8mp2elflfvhq.apps.googleusercontent.com',
        googleClientId: '222670888542-e65o52bfiusr0n0d3egus5etfstgv249.apps.googleusercontent.com',
        // stripePubKey: 'pk_test_51PUgkdE1Q2U4w67Q5iH9lhv7cMLNHcO4LHvwpnrtFQefi5EDKjN3AO92xWilwTAPzaUe2EeRLD8WJDv25x6f1mLR00qBPQmkwI'
        stripePubKey: 'pk_live_51PUgkdE1Q2U4w67QOcKLVJe1kaZc7N1rSFZbYgRGvXEhSzVsAQYVIvmW6PrqYXryMK2Y9J1qdcmA6ccK7nmlRTCJ00gQ9AzCsl'

    },
    fetchSystemConfig: async () => {
        const result = await fetchGetSetParams()

        set({ systemConfig: result })
    },

    stripePromise: Promise.resolve(null),
    loadStripe: async () => {
        const { systemConfig } = get()
        const { stripePubKey } = systemConfig

        console.log("test:stripePubKey:" + stripePubKey);

        const stripePromise = loadStripe(stripePubKey);

        set({ stripePromise })
    },

    logout: async () => {
        Emitter.emit('onLogoutMessage');

        localStorage.removeItem('accessToken');
        localStorage.removeItem('userGuid');

        // 重置工作台状态
        useWorkbenchStore.getState().reset()
    },

    // 派发验证码
    dispatchVerificationCode: async (params: { email: string }) => {
        const result = await fetchQrCode(params)

        return result
    }
}))

export default useGlobalStore
export { useChatStore }
