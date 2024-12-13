import { Button, Checkbox, Form, Input, message } from "antd";
import { UseGoogleLoginOptionsImplicitFlow, useGoogleLogin } from '@react-oauth/google'
import { useVerificationCodeCD } from '@/hooks'

import styles from './style.module.less'
import useLoginStore, { LoginType } from "../../store";
import { LoginSuccessCallback } from "../../type";


type Props = {
    onLoginSuccess: LoginSuccessCallback
}

const DEFAULT_FORM_STATE = {
    email: '',
    code: '',
    remember: false
}

/**
 * 验证码登录表单
 * @returns 
 */
export default function VerificationCodeForm(props: Props) {
    const [form] = Form.useForm()

    /**
     * 验证码冷却倒计时
     */
    const { formattedRes, dispatchVerificationCode } = useVerificationCodeCD()

    const { login } = useLoginStore(({ login }) => ({ login }))

    /**
     * google登录成功
     * @param tokenResponse 
     */
    const onSuccessGoogle: UseGoogleLoginOptionsImplicitFlow['onSuccess'] = async (tokenResponse) => {
        try {
            const result = await login(LoginType.Google, { accessToken: tokenResponse.access_token })

            props.onLoginSuccess?.(LoginType.Google, result.userInfo)
        } catch (error: any) {
            message.error(error.message)   
        }
    }

    /**
     * google登录失败
     * @param errorResponse 
     */
    const onFailureGoogle: UseGoogleLoginOptionsImplicitFlow['onError'] = (errorResponse) => {
        console.log('errorResponse', errorResponse)
    }

    const googleLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        onSuccess: onSuccessGoogle,
        onError: onFailureGoogle,
    })

    const onGoogleLoginClick = async () => {
        await form.validateFields(['remember'])
        
        googleLogin()
    }

    /**
     * 获取验证码点击事件
     * @returns 
     */
    const onGetCodeClick = async () => {
        await form.validateFields(['email'])

        const email = form.getFieldValue('email')

        dispatchVerificationCode(email)
    }

    /**
     * 邮箱验证码登录
     * @param values 
     */
    const onFinish = async (values: typeof DEFAULT_FORM_STATE) => {
        const { email, code } = values

        try {
            const result = await login(LoginType.VerificationCode, { email, code })

            props.onLoginSuccess?.(LoginType.VerificationCode, result.userInfo)
        } catch (error: any) {
            message.error(error.message)
        }
    }

    return (
        <div className={styles['verification-code-form']}>
            <Form
                form={form}
                initialValues={DEFAULT_FORM_STATE}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱' }]}
                >
                    <Input type="email" placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item
                    name="code"
                    rules={[{ required: true, message: '请输入验证码' }]}
                >
                    <Input
                        placeholder="请输入验证码"
                        addonAfter={
                            formattedRes.seconds === 0 ?
                            <div
                                className={styles['verification-code-form-get-code']}
                                onClick={onGetCodeClick}
                            >
                                {'获取验证码'}
                            </div> :
                            <div className={styles['verification-code-form-get-code-countdown']}>{'重新获取'}({formattedRes.seconds}s)</div>
                            
                        }
                    />
                </Form.Item>

                <Form.Item className={styles['verification-code-form-submit']}>
                    <Button
                        // type="primary"
                        className={styles['verification-code-form-google-login']}
                        style={{ width: '100%' }}
                        onClick={onGoogleLoginClick}
                    >
                        {'使用Google账号登录'}
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%' }}
                    >
                        {'登录/注册'}
                    </Button>
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className={styles['verification-code-form-agree-protocol']}
                    rules={[{
                        validator(rule, value, callback) {
                            if (value) {
                                return Promise.resolve()
                            }
                            return Promise.reject('请勾选同意用户协议和隐私条款')
                        }
                    }]}
                >
                    <Checkbox>{'我已阅读且同意用户协议和隐私条款'}</Checkbox>
                </Form.Item>
            </Form>
        </div>
    )
}