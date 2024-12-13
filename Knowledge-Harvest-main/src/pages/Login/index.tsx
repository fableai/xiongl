import { Layout, Tabs, Tooltip, message } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google'
import Banner from './components/Banner';
import styles from './style.module.less';
import VerificationCodeForm from './components/VerificationCodeForm';
import PasswordForm from './components/PasswordForm';
import useLoginStore, { LoginType } from './store';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../router';
import { LoginSuccessCallback } from './type';
import { i18n } from 'i18n';
import useGlobalStore from '@/store';
import { IMAGES } from '@/assets';

const LOGIN_TYPE_OPTIONS = [
    {
        key: LoginType.VerificationCode,
        label: '验证码登录'
    },
    {
        key: LoginType.Password,
        label: '密码登录'
    }
]

const LOGIN_TYPE_FORM_COMPONENTS = {
    [LoginType.Google]: VerificationCodeForm,
    [LoginType.Password]: PasswordForm,
    [LoginType.VerificationCode]: VerificationCodeForm
}

export default function Login() {
    const navigate = useNavigate();

    const { loginType, setLoginType } = useLoginStore(
        ({ loginType, setLoginType }) => ({
            loginType, setLoginType
        })
    )

    const globalStore = useGlobalStore((state) => ({
        setLanguage: state.setLanguage,
        systemConfig: state.systemConfig
    }))

    const FormComponent = LOGIN_TYPE_FORM_COMPONENTS[loginType]

    /**
     * 切换登录方式
     * @param activeKey 
     */
    const onLoginTypeChange = (activeKey: string) => {
        setLoginType(activeKey as LoginType)
    }

    /**
     * 登录成功 - 跳转到知识库
     */
    const onLoginSuccess: LoginSuccessCallback = (_type: LoginType, { nickName }) => {
        const [_, query] = window.location.search.split('?')

        let returnUrl = RouteNames.Workbench
        if (query) {
            const params = new URLSearchParams(query)
            const _returnUrl = params.get('return_url') as RouteNames

            Object.values(RouteNames).includes(_returnUrl) && (returnUrl = _returnUrl)
        }

        navigate(returnUrl)

        requestAnimationFrame(() => {
            message.success(`欢迎回来！${nickName}`)
        })
    }

    /**
     * 切换语言
     */
    const onToggleLanguage = () => {
        const lang = i18n.getLanguage() === 'zh_CN' ? 'en_US' : 'zh_CN'
        globalStore.setLanguage(lang)

        location.reload()
    }

    return (
        <GoogleOAuthProvider clientId={globalStore.systemConfig.googleClientId}>
            <Layout className={styles['login']}>
                {/* banner */}
                <Layout.Content className={styles['login-banner']}>
                    <Banner></Banner>
                </Layout.Content>

                {/* 登录面板 */}
                <Layout.Sider className={styles['login-box']} width={480}>
                    <div className={styles['login-box-operate']}>
                        <Tooltip
                            title={i18n.getLanguage() === 'zh_CN' ? '中文 / English' : 'English / 中文'}
                        >
                            <img
                                width={20}
                                src={i18n.getLanguage() === 'zh_CN' ? IMAGES.ZH_SVG : IMAGES.EN_SVG}
                                onClick={onToggleLanguage} />
                        </Tooltip>
                        
                    </div>

                    <div className={styles['login-box-title']}>
                        <span className={styles['login-box-title-icon']}></span>
                        <span className={styles['login-box-title-text']}>InfoKeyMind</span>
                    </div>

                    {/* 登录方式 */}
                    <div className={styles['login-box-options']}>
                        <Tabs activeKey={loginType} items={LOGIN_TYPE_OPTIONS} onChange={onLoginTypeChange} />
                    </div>

                    {/* 表单 */}
                    <div className='login-box-form'>
                        <FormComponent onLoginSuccess={onLoginSuccess} />
                    </div>
                </Layout.Sider>
            </Layout>
        </GoogleOAuthProvider>
    )
}