import { Image, Button, Modal } from 'antd'
import styles from './style.module.less'
import useGlobalStore from '@/store'
import { AppstoreOutlined, DesktopOutlined, EditOutlined, LinkOutlined, LogoutOutlined, SettingOutlined,RadarChartOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'
import { RouteNames } from '../../router'
import { ChangePasswordModal, useChangePasswordStore } from '../ChangePassword'
import { ChangeUserSetModal, useChangeUserSetStore } from '../UserSet'
import { ChangeUserPromptSetModal,useChangeUserPromptSetStore } from '../UserPrompt'

import { IMAGES } from '@/assets'

const MEUNS = [
    {
        key: 'userSettings',
        icon: <SettingOutlined />,
        label: '账户设置',
    },
    {
        key: 'userPromptSettings',
        icon: <SettingOutlined />,
        label: '提示词设置',
    },
    {
        key: 'changePassword',
        icon: <EditOutlined />,
        label: '修改密码'
    },
    {
        key: 'toExtensionPage',
        icon: <AppstoreOutlined />,
        label: '浏览器插件',
    },
    {
        key: 'toLandingPage',
        icon: <LinkOutlined />,
        label: '前往官网',
    },
    // {
    //     key: 'openMind',
    //     icon: <RadarChartOutlined />,
    //     label: '打开脑图',
    // },
    {
        key: 'exit',
        icon: <LogoutOutlined />,
        className: styles['red'],
        label: '退出登录',
    }
]

// UserBox 组件修改
interface UserBoxProps {
    onClose: () => void;
}

export default function UserBox({ onClose }: UserBoxProps) {
    const navigate = useNavigate();

    const store = useGlobalStore(({ userInfo, logout }) => ({ userInfo, logout }))
    const changePasswordStore = useChangePasswordStore(({ setOpen }) => ({ setOpen }));
    const changeUserSetStore = useChangeUserSetStore(({ setOpen }) => ({ setOpen }));
    const changeUserPromptSetStore = useChangeUserPromptSetStore(({ setOpen }) => ({ setOpen }));


    const [modal, contextHolder] = Modal.useModal();

    if (!store.userInfo) {
        return null
    }

    const { email, nickName, avatar, userTypeTxt } = store.userInfo

    /**
     * 跳转到定价页面
     */
    const onToPricing = () => {
        navigate(RouteNames.Pricing)
    }

    /**
     * 菜单点击
     * @param key 
     * @returns 
     */
    const onMenuClick = (key: string) => {
        // 点击菜单项后关闭 Popover
        onClose();
        
        if (key === 'exit') {
            modal.confirm({
                title: '提示',
                content: '确定要退出登录吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    store.logout()

                    navigate(RouteNames.Login)
                },
            })
            return
        }

        if (key === 'changePassword') {
            changePasswordStore.setOpen(true)
            return;
        }

        if(key === 'userSettings'){
            changeUserSetStore.setOpen(true);
            return;
        }

        if(key === 'userPromptSettings'){
            changeUserPromptSetStore.setOpen(true);
            return;
        }

        if (key === 'toExtensionPage') {
            window.open('https://nqbtn3eidx4.feishu.cn/docx/Gb7zdOTAXoMTDXx8bi1c3gaOnKc')
            return
        }

        if (key === 'toLandingPage') {
            window.open('https://infokeymind.com/')
        }
        var userGuid = store.userInfo.userGuid;
        if (key === 'openMind') {
            //AWS路由到根目录访问
            window.open('/mind.html?userGuid='+userGuid);
        }
     }

    return (
        <div className={styles['user-box']}>
            <div className={styles['user-profile']}>
                <div className={styles['user-profile-left']}>
                    <Image width='48px' src={avatar ?? IMAGES.DEAULT_CIRCLEUSER} className={styles['user-profile-avatar']} preview={false} />
                </div>

                <div className={styles['user-profile-right']}>
                    <div className={styles['user-profile-name-wrap']}>
                        <div className={styles['user-profile-name']}>{nickName}</div>
                        <div className={styles['user-profile-version']}>{userTypeTxt}</div>
                    </div>

                    <div className={styles['user-profile-email']}>{email}</div>
                </div>
            </div>

            <Button
                type='primary'
                style={{ width: '100%' }}
                onClick={onToPricing}
            >{'升级到PRO'}</Button>

            <div className={styles['user-operate']}>{
                MEUNS.map(({ key, icon, label }) => (
                    <div key={key} className={styles['user-operate-item']} onClick={() => onMenuClick(key)}>
                        <div className={styles['user-operate-item-icon']}>{icon}</div>
                        
                        <div className={styles['user-operate-item-label']}>{label}</div>
                    </div>
                ))
            }</div>

            {/* modal hooks element */}
            {contextHolder}
            {/* 修改密码弹窗 */}
            <ChangePasswordModal />
            {/* 设置 */}
            <ChangeUserSetModal />
            {/* 提示词设置 */}
            <ChangeUserPromptSetModal />
            
        </div>
    )
}