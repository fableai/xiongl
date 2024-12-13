import { Button, Form, Input, Modal, message } from "antd";
import { create } from 'zustand'
import styles from './style.module.less'
import { fetchGetUserPrompt, fetchSetUserPrompt} from "@/service";
import useGlobalStore from "@/store";

import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space,Select } from 'antd';
import React,{ useState } from 'react';
import { Languages, i18n } from 'i18n'

const DEFAULT_FORM_STATE = {
    promptAbstract:'',
    promptKeyInfo:''
}
const { Option } = Select;

export type ChangeUserPromptSetStore = {
    open: boolean,
    setOpen: (open: boolean) => void,    
    promptAbstract:'',
    promptKeyInfo:'',
    setUserPrompt: (params: { promptAbstract:string,promptKeyInfo:string }) => Promise<any>,
    getUserPrompt: (params: { userGuid:string }) => Promise<any>,
}

/**
 * [状态] - 修改设置
 */
export const useChangeUserPromptSetStore = create<ChangeUserPromptSetStore>((set) => ({
    open: false,
    // setOpen: (open) => set({ open }),
    setOpen: (open) => {
        if (!open) {
            // 关闭时清理状态
            set({ promptAbstract: '', promptKeyInfo: '' });
        }
        set({ open });
    },
    //promptAbstract,promptKeyInfo
    promptAbstract:'',
    promptKeyInfo:'',

    setUserPrompt: async (params) => {
        const { userGuid } = useGlobalStore.getState()

        await fetchSetUserPrompt({
            userGuid,
            ...params
        })
    },
    getUserPrompt: async (params) => {
        // const { userGuid } = useGlobalStore.getState()
      
        try {
            console.log('Fetching user prompt...');
            const result = await fetchGetUserPrompt({
                userGuid: params.userGuid
            });
            console.log('Fetch result:', result);

            // // 直接从 result 中获取值
            // const { promptAbstract, promptKeyInfo } = result;
            // 设置新的状态
            set({ 
                promptAbstract: result.promptAbstract || '',
                promptKeyInfo: result.promptKeyInfo || ''
            });

            return result;
        } catch (error) {
            console.error('Error fetching user prompt:', error);
            throw error;
        }

        // set({ promptAbstract: result.promptAbstract });
        // set({ promptKeyInfo: result.promptKeyInfo });
    }
}))


/**
 * [组件] - 设置弹窗
 * @returns 
 */
export function ChangeUserPromptSetModal() {
    //这是因为 Modal 组件的打开/关闭只是改变了 open 状态，而没有重新初始化组件。我们需要在每次打开 Modal 时都重新请求数据。
    const { open, setOpen,getUserPrompt} = useChangeUserPromptSetStore();
    const { userGuid } = useGlobalStore.getState();

    // 每次 open 变为 true 时都重新请求数据
    React.useEffect(() => {
        if (open) {
            console.log('Modal opened, fetching data...');
            getUserPrompt({ userGuid });
        }
    }, [open]); // 依赖于 open 状态

    const onOk = () => {
        setOpen(false)
    }

    const onCancel = () => {
        setOpen(false)
    }

    return (
        <Modal
            open={open}
            width={800}
            title={"提示词设置"}
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
            destroyOnClose={true} // 确保Modal关闭时销毁内容
        >
            <UserPromptSet key={open ? 'open' : 'closed'} />
        </Modal>
    )
}

/**
 * [组件] - 提示词设置
 * @returns 
 */
export function UserPromptSet() {
    const [form] = Form.useForm()
    const { setUserPrompt, setOpen,promptAbstract,promptKeyInfo } = useChangeUserPromptSetStore();
    const { TextArea } = Input;


    // 这段代码的作用是在组件首次渲染（挂载）时重置表单的所有字段到初始状态。
    // 在你的代码中，这个重置操作可能是多余的，因为：
    // 1. 你已经有了 `destroyOnClose={true}` 在 Modal 组件上
    // 2. 你还有另一个 useEffect 在监听 promptAbstract 和 promptKeyInfo 的变化并更新表单
    // 你可以考虑移除这个首次挂载时的重置操作，因为表单的值已经由后面的 useEffect 来控制了。

    // 1. `useEffect` 是 React 的一个 Hook，用于处理组件的副作用操作。
    // 2. 空数组 `[]` 作为依赖项意味着这个效果只会在组件首次渲染时执行一次，而不会在后续更新时重复执行。
    // 3. `form.resetFields()` 是 antd Form 的一个方法，它会：
    // - 清除所有表单项的值
    // - 清除校验状态
    // - 将表单恢复到初始状态（使用 initialValues 中设置的值）
    // React.useEffect(() => {
    //     form.resetFields();
    // }, []);// 空数组作为依赖项

    // 监听store中的值变化并更新表单
    React.useEffect(() => {
        // console.log('Store values changed:', { promptAbstract, promptKeyInfo });
        // 重置表单并设置新值
        form.resetFields();
        form.setFieldsValue({
            promptAbstract: promptAbstract || '',
            promptKeyInfo: promptKeyInfo || ''
        });
    }, [promptAbstract, promptKeyInfo]);

    /**
     * 表单提交
     * @param values 
     */
    const onFinish = async (values: typeof DEFAULT_FORM_STATE) => {
        const { promptAbstract,promptKeyInfo } = values

        try {
            await setUserPrompt({promptAbstract,promptKeyInfo})

            message.success('设置已更新')
            // // 重置表单
            // form.resetFields()
            
            // 关闭弹窗
            setOpen(false)

            //刷新页面
            location.reload()

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
            className={styles['change-userset-form']}
            initialValues={DEFAULT_FORM_STATE}
            // initialValues={{ ...DEFAULT_FORM_STATE, lang: parseInt(selectedLang) }}
            onFinish={onFinish}
        >

            <Form.Item
                name="promptAbstract"
                label={"摘要提示词"}
                rules={[{ required: false, message: '请输入提示词，清空默认使用系统提示词' }]}  
            >
                <TextArea rows={6} type="text" placeholder="请输入摘要提示词" />
            </Form.Item>
            <Form.Item
                name="promptKeyInfo"
                label={"关键信息提示词"}
                rules={[{ required: true, message: '请输入提示词，清空默认使用系统提示词' }]}
            >
                <TextArea rows={10} type="text" placeholder="请输入关键信息提示词" />
            </Form.Item>

            <Form.Item
                className={styles['change-userset-form-submit']}
                wrapperCol={{ offset: 8, span: 8 }}
            >
            

                <Space style={{ width: '100%', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Confirm
                    </Button>
                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
