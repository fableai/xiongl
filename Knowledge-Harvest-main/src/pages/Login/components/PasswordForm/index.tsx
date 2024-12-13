import { Button, Checkbox, Form, Input, message } from "antd";
import styles from './style.module.less'
import useLoginStore, { LoginType } from "../../store";
import { LoginSuccessCallback } from "../../type";

type Props = {
    onLoginSuccess: LoginSuccessCallback
}

const DEFAULT_FORM_STATE = {
    email: '',
    password: '',
    remember: false
}

export default function PasswordForm(props: Props) {
    const [form] = Form.useForm()

    const { login } = useLoginStore(
        ({ login }) => ({ login })
    )

    /**
     * 账号密码登录
     * @param values 
     */
    const onFinish = async (values: typeof DEFAULT_FORM_STATE) => {
        const { email, password } = values

        try {
            const result = await login(LoginType.Password, { email, password })

            props.onLoginSuccess?.(LoginType.Password, result.userInfo)
        } catch (error: any) {
            message.error(error.message)
        }
    }

    return (
        <div className={styles['password-form']}>
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
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Form.Item>
                    <div className={styles['password-form-tips']}>{'新用户？请使用验证码登录/注册'}</div>
                </Form.Item>

                <Form.Item className={styles['password-form-submit']}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {'登录/注册'}
                    </Button>
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className={styles['password-form-agree-protocol']}
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