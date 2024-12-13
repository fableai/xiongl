import { create } from 'zustand'
import { fetchLogin, fetchLoginWithGoogle } from '@/service'
import useGlobalStore from '@/store'

export enum LoginType {
    Google = 'Google',
    Password = 'Password',
    VerificationCode = 'VerificationCode'
}

type LoginParams = {
    [LoginType.Google]: {
        accessToken: string
    },
    [LoginType.Password]: {
        email: string
        password: string
    },
    [LoginType.VerificationCode]: {
        email: string
        code: string
    }
}

type Login = <T extends keyof LoginParams>(type: T, params: LoginParams[T]) => Promise<any>

type LoginStore = {
    loginType: LoginType
    setLoginType: (type: LoginType) => void

    login: Login
}

const useLoginStore = create<LoginStore>((set) => ({
    /**
     * 登录方式
     */
    loginType: LoginType.VerificationCode,
    setLoginType: (loginType) => set(() => ({ loginType })),

    /**
     * 登录
     * @param type 
     * @param params 
     */
    login: async <T extends LoginType>(type: T, params: LoginParams[T]) => {
        if (!Object.keys(LoginType).includes(type)) {
            return Promise.reject()
        }

        const globalStore = useGlobalStore.getState()

        let response;
        switch (type) {
            case LoginType.Google:
                response = await fetchLoginWithGoogle({
                    accessToken: (params as LoginParams[LoginType.Google]).accessToken
                })
                break;
            case LoginType.Password:
                response = await fetchLogin({
                    type: '',
                    ...params as LoginParams[LoginType.Password]
                })
                break;
            case LoginType.VerificationCode:
                response = await fetchLogin({
                    type: 'email',
                    email: (params as LoginParams[LoginType.VerificationCode]).email,
                    password: (params as LoginParams[LoginType.VerificationCode]).code
                })
                break;
            default:
                break;
        }

        if (!response) {
            return Promise.reject()
        }
        
        const { access_token, userInfo } = response

        localStorage.setItem('accessToken', access_token)
        localStorage.setItem('userGuid', userInfo.userGuid)

        globalStore.setUser({
            userGuid: userInfo.userGuid,
        })

        await globalStore.setLanguage()

        return response
    },
}))

export default useLoginStore