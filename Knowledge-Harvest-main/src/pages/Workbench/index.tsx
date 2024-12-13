import { Layout, Menu, Popover, Image,Button } from 'antd';
import { startTransition, useEffect,useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ProductOutlined, FlagOutlined ,FileAddOutlined} from '@ant-design/icons';
import styles from './style.module.less';
import useWorkbenchStore from './store';
import { RouteNames } from '../../router';
import UserBox from '../../components/UserBox';
import useGlobalStore from '@/store';
import { IMAGES } from '@/assets';

import { ShortHandModal, useShortHandStore } from '../../components/ShortHand'


const { Sider, Content } = Layout

export default function Workbench() {
    const location = useLocation();
    const navigate = useNavigate();
    const store = useWorkbenchStore()
    const globalStore = useGlobalStore(({ userInfo }) => ({ userInfo }))

    const shortHandStore = useShortHandStore(({ setOpen }) => ({ setOpen }));

    useEffect(() => {
        const { pathname } = location

        if (pathname === RouteNames.Workbench || !Object.values(RouteNames).includes(pathname as RouteNames)) {
            // 跳转到知识库
            navigate(RouteNames.KnowledgeLib)
        }

        store.setSelectedMenu(pathname)
    }, [location.pathname])

    /**
     * 菜单切换
     * @param item 
     */
    const onMenuChange = (item: { key: string }) => {
        startTransition(() => {
            // 跳转路由
            navigate(item.key)
        });
    }

    const handleMenuClic_shorthand = () => {
        console.log('菜单项被点击');
        // 这里可以执行你想要的操作
        shortHandStore.setOpen(true)
        return;
      };
    
    const [popoverOpen, setPopoverOpen] = useState(false);
    return (
        <Layout className={styles['workbench']}>
            <Sider defaultCollapsed collapsedWidth={64}>
                <div className={styles["workbench-logo"]}>
                    <Popover
                        overlayClassName={styles['workbench-popover']}
                        placement="rightTop"
                        // content={<UserBox />}
                        content={<UserBox onClose={() => setPopoverOpen(false)} />}
                        open={popoverOpen}
                        onOpenChange={setPopoverOpen}

                    >
                        <Image
                            width='48px'
                            src={globalStore.userInfo?.avatar ?? IMAGES.DEAULT_CIRCLEUSER}
                            className={styles['workbench-profile-avatar']}
                            preview={false}
                        />
                    </Popover>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[store.selectedMenu]}
                    items={[
                        {
                            key: RouteNames.KnowledgeLib,
                            icon: <ProductOutlined />,
                            label: '知识库',
                        },
                        {
                            key: RouteNames.LabelManage,
                            icon: <FlagOutlined />,
                            label: '标签管理',
                        },
                        {
                            key: RouteNames.LabelSet,
                            icon: <FlagOutlined />,
                            label: '标签设置',
                        }
                    ]}
                    onSelect={onMenuChange}
                />


                <Menu  style={{ position: 'absolute',  width:'100%',bottom: 0 }} 
                    mode="inline"
                    selectable={false} // 禁用选中效果
                    onClick={handleMenuClic_shorthand}
                    items={[
                        {
                            key: "shorthand",
                            icon: <FileAddOutlined />,
                            label: 'Shorthand',
                        }
                    ]}                            
                    />             
            </Sider>
            <Content>
                <Outlet />
            </Content>

            {/* shorthand */}
            <ShortHandModal/>            
        </Layout>
    )
}