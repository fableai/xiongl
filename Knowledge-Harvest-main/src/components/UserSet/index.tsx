import { Button, Form, Input, Modal, message } from "antd";
import { create } from 'zustand'
import styles from './style.module.less'
import { fetchEditUserInfo} from "@/service";
import useGlobalStore from "@/store";

import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space,Select } from 'antd';
import React,{ useState } from 'react';
import { Languages, i18n } from 'i18n'

const DEFAULT_FORM_STATE = {
    nickName: '',
    lang: 0,
    promptAbstract:'',
    promptKeyInfo:''
}
const { Option } = Select;

export type ChangeUserSetStore = {
    open: boolean,
    setOpen: (open: boolean) => void,    
    editUserInfo: (params: { nickName: string, lang: number,promptAbstract:string,promptKeyInfo:string }) => Promise<any>,
}

/**
 * [状态] - 修改设置
 */
export const useChangeUserSetStore = create<ChangeUserSetStore>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),

    editUserInfo: async (params) => {
        const { userGuid } = useGlobalStore.getState()

        await fetchEditUserInfo({
            userGuid,
            ...params
        })
    },
}))


// const items: MenuProps['items'] = [
//     {
//       key: '0',
//       label: 'English',
//       icon: <SmileOutlined />
//     },
//     {
//       key: '1',
//       label: 'Chinese',
//       icon: <SmileOutlined />
//     }
//   ];


/**
 * [组件] - 设置弹窗
 * @returns 
 */
export function ChangeUserSetModal() {
    const { open, setOpen } = useChangeUserSetStore();

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
            title={"用户设置"}
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
        >
            <UserSet />
        </Modal>
    )
}

/**
 * [组件] - 用户设置
 * @returns 
 */
export function UserSet() {
    const [form] = Form.useForm()
    const { editUserInfo, setOpen } = useChangeUserSetStore();
    const { TextArea } = Input;
    // const [selectedLang, setSelectedLang] = React.useState<string>(DEFAULT_FORM_STATE.lang.toString());
    // const onLangChange = (key: string) => {
    //     // setSelectedLang(key);
    //     debugger;
    //     form.setFieldsValue({ lang: parseInt(key) });
    // };
    // const triggerChange = (changedValue: { number?: number; currency?: Currency }) => {
    //     onChange?.({ number, currency, ...value, ...changedValue });
    //   };
    // const [currency, setCurrency] = useState<Currency>('rmb');
    // const onCurrencyChange = (newCurrency: Currency) => {
    //     if (!('currency' in value)) {
    //       setCurrency(newCurrency);
    //     }
    //     triggerChange({ currency: newCurrency });
    //   };
debugger;
    // useGlobalStore.getState
    const userInfo = useGlobalStore.getState().userInfo;
    
    form.setFieldsValue({ nickName:userInfo?.nickName });

    const curLange = i18n.getLanguage() === 'zh_CN' ? '0' : '1';    
    form.setFieldsValue({ lang:curLange });

    const [selectedValue, setSelectedValue] = useState('0');

    // form.setFieldsValue({ promptAbstract:userInfo?.promptAbstract});
    // form.setFieldsValue({ promptAbstract:userInfo?.promptKeyInfo});
  

      // 处理下拉选项变化的函数
    //   const handleSelectChange = (value) => {
    //     setSelectedValue(value);
    //   };
      const handleSelectChange = (value) => {
        setSelectedValue(value);
        form.setFieldsValue({ lang: value }); // 更新表单字段的值
      };      

    //   const handleFormSubmit = (values) => {
    //     console.log('Selected Value:', selectedValue);
    //     console.log('Form Values:', values);
    //   };      

    const globalStore = useGlobalStore((state) => ({
        setLanguage: state.setLanguage
    }))

    /**
     * 表单提交
     * @param values 
     */
    const onFinish = async (values: typeof DEFAULT_FORM_STATE) => {
        const { nickName, lang,promptAbstract,promptKeyInfo } = values

        try {
            await editUserInfo({ nickName, lang ,promptAbstract,promptKeyInfo})

            message.success('设置已更新')
            // 重置表单
            form.resetFields()
            
            //多语言设置
            const curLange = lang === "0" ? 'zh_CN' : 'en_US';    
            globalStore.setLanguage(curLange);

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
                name="nickName"
                label={"昵称"}
                rules={[{ required: true, message: '请输入昵称' }]}
            >
                <Input type="text" placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item
                name="lang"
                label={"语言"}
                rules={[{ required: true, message: '请选择语言' }]}
            >
                {/* <Input.Password placeholder="请输入新密码" /> */}

                {/* <Dropdown 
                menu={{ items,
                    selectable: true,
                    defaultSelectedKeys: ['0']                   
                 }}
                 onOpenChange={onLangChange} 
                 >
                    <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        Language
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown> */}

                <Select
                placeholder="Select a option"
                value={selectedValue}
                onChange={handleSelectChange}
                icon={<DownOutlined />}
                >
                <Option value="1">English</Option>
                <Option value="2">Français</Option>
                <Option value="0">Chinese</Option>
                {/* 更多的选项 */}
                </Select>
            </Form.Item>

            {/* <Form.Item
                name="promptAbstract"
                label={"摘要提示词"}
                //,promptAbstract,promptKeyInfo
                rules={[{ required: false, message: '请输入提示词，清空默认使用系统提示词' }]}  
            >
                <TextArea rows={4} type="text" placeholder="请输入摘要提示词" />
            </Form.Item>
            <Form.Item
                name="promptKeyInfo"
                label={"关键信息提示词"}
                rules={[{ required: true, message: '请输入提示词，清空默认使用系统提示词' }]}
            >
                <TextArea rows={4} type="text" placeholder="请输入关键信息提示词" />
            </Form.Item> */}

            <Form.Item
                className={styles['change-userset-form-submit']}
                wrapperCol={{ offset: 8, span: 8 }}
            >
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {'确认'}
                </Button>
            </Form.Item>
        </Form>
    )
}
