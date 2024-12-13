import { useVerificationCodeCD } from "@/hooks";
import { Button, Form, Input, Modal, message } from "antd";
import { create } from 'zustand'
import styles from './style.module.less'
import { fetchModifyPassword } from "@/service";
import useGlobalStore from "@/store";

const DEFAULT_FORM_STATE = {
    email: '',
    code: '',
    password: ''
}


export type ChangePasswordStore = {
    open: boolean,
    setOpen: (open: boolean) => void,

    modifyPassword: (params: { email: string, code: string, password: string }) => Promise<any>,
}

/**
 * [状态] - 修改密码弹窗
 */
export const useChangePasswordStore = create<ChangePasswordStore>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),

    modifyPassword: async (params) => {
        const { userGuid } = useGlobalStore.getState()

        await fetchModifyPassword({
            userGuid,
            ...params
        })
    },
}))

/**
 * [组件] - 修改密码弹窗
 * @returns 
 */
export function ChangePasswordModal() {
    const { open, setOpen } = useChangePasswordStore();

    const onOk = () => {
        setOpen(false)
    }

    const onCancel = () => {
        setOpen(false)
    }

    return (
        <Modal
            open={open}
            width={500}
            title={"修改密码"}
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
        >
            <ChangePassword />
        </Modal>
    )
}

/**
 * [组件] - 修改密码
 * @returns 
 */
export function ChangePassword() {
    const [form] = Form.useForm()
    const { modifyPassword, setOpen } = useChangePasswordStore();

    /**
     * 验证码冷却倒计时
     */
    const { formattedRes, dispatchVerificationCode, setLeftTime } = useVerificationCodeCD()

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
     * 表单提交
     * @param values 
     */
    const onFinish = async (values: typeof DEFAULT_FORM_STATE) => {
        const { email, code, password } = values

        try {
            await modifyPassword({ email, code, password })

            message.success('密码已更新')
            // 重置表单
            form.resetFields()
            // 重置验证码冷却倒计时
            setLeftTime(0)
            // 关闭弹窗
            setOpen(false)
        } catch (error: any) {
            message.error(error.message)
        }
    }

    return (
        <Form
            form={form}
            labelCol={{ span: 6, flex: 'auto' }}
            wrapperCol={{ span: 18 }}
            labelAlign={"left"}
            className={styles['change-password-form']}
            initialValues={DEFAULT_FORM_STATE}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                label={"邮箱"}
                rules={[{ required: true, message: '请输入邮箱' }]}
            >
                <Input type="email" placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
                name="password"
                label={"新密码"}
                rules={[{ required: true, message: '请输入新密码' }]}
            >
                <Input.Password placeholder="请输入新密码" />
            </Form.Item>

            <Form.Item
                name="code"
                wrapperCol={{ offset: 6, span: 18 }}
                rules={[{ required: true, message: '请输入验证码' }]}
            >
                <Input
                    placeholder="请输入验证码"
                    addonAfter={
                        formattedRes.seconds === 0 ?
                        <div
                            className={styles['change-password-form-get-code']}
                            onClick={onGetCodeClick}
                        >
                            {'获取验证码'}
                        </div> :
                        <div className={styles['change-password-form-get-code-countdown']}>{'重新获取'}({formattedRes.seconds}s)</div>
                        
                    }
                />
            </Form.Item>

            <Form.Item
                className={styles['change-password-form-submit']}
                wrapperCol={{ offset: 8, span: 8 }}
            >
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {'确认'}
                </Button>
            </Form.Item>
        </Form>
    )
}
