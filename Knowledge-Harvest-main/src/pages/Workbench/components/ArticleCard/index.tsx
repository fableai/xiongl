import { Button, Card, Modal, Tag, Tooltip, message, Image } from "antd";
import { ArrowUpOutlined, CopyOutlined, DeleteFilled, EyeInvisibleOutlined, EyeOutlined, GlobalOutlined, ReadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Article } from '../../type'
import { TAB_KEY, useArticleDetailStore } from "../ArticleDetail";
import { IMAGES } from "../../../../assets/images";
import useKnowledgeLibStore from "../../KnowledgeLib/store";
import styles from './style.module.less'


const FROM_SOURCE_ICON_MAP = {
    0: null,
    1: {
        icon: <UserOutlined />,
        desc: '其他用户'
    },
    2: {
        icon: <SearchOutlined />,
        desc: '联网搜索'
    },
}

export default function ArticleCard(props: {
    item: Article,
}) {
    const { item } = props

    const store = useKnowledgeLibStore()
    const articleDetailStore = useArticleDetailStore(({ show }) => ({ show }))

    const [modal, contextHolder] = Modal.useModal();
    
    /**
     * 标签项点击
     * @param label 
     */
    const onLabelWordClick = (label: string) => {
        store.setActiveTab(label)
    }

    /**
     * 点击摘要
     * @param item 
     */
    const onArticleAbstractClick = (item: Article) => {
        if(item.infoType===3){
            articleDetailStore.show(item.infoGuid, TAB_KEY.ShortHand);
        }
        else{
            articleDetailStore.show(item.infoGuid, TAB_KEY.Abstract);
        }
    }

    /**
     * 点击文章图片
     * @param item 
     */
    const onArticleIconClick = (item: Article) => {
        if(item.infoType===3){
            articleDetailStore.show(item.infoGuid, TAB_KEY.ShortHand);
        }
        else{
            articleDetailStore.show(item.infoGuid, TAB_KEY.MindMap);
        }
    }

    /**
     * 点击详情
     * @param item 
     */
    const onArticleDetailClick = (item: Article) => {
        if(item.infoType===3){
            articleDetailStore.show(item.infoGuid, TAB_KEY.ShortHand);
        }
        else{
            articleDetailStore.show(item.infoGuid, TAB_KEY.Abstract);
        }
    }

    /**
     * 关键词点击
     * @param keyWord 
     */
    const onKeyWordClick = (keyWord: string) => {
        store.setKeyWord(keyWord)
        store.search()
    }

    /**
     * 关键词点击
     * @param keyWord 
     */
    const onOpenShare = (fromUserUrl: string) => {
       if(item.fromUserUrl){
            //"/sharePage?uid=80e68c1e-0d66-4b91-a6fb-020dc4d6cb3c"
            var userGuid = item.fromUserUrl.substr(15);
            window.open('/mind.html?userGuid='+userGuid);
            return
       }
        //onOpenShare(item.fromUserUrl)
    }    
    
    /**
     * 点击网址
     * @param item 
     */
    const onHostDomainClick = (item: Article) => {
        window.open(item.url)

        store.fetchAddReadCount([item.infoGuid])
    }

    /**
     * 切换公开状态
     * @param item 
     */
    const toggleArticlePublic = async (item: Article) => {
        const nextStatus = item.isPublic === 1 ? 0 : 1;

        try {
            await store.updateArticlePublic(item.infoGuid, nextStatus)

            store.updateArticles([{
                ...item,
                isPublic: nextStatus
            }])
        } catch (error) {
            message.error(String(error))
        }
        
    }

    /**
     * 复制文章
     * @param item 
     */
    const onCopyArticleClick = async (item: Article) => {
        try {
            await store.copyArticle(item.infoGuid)

            message.success('复制成功')
        } catch (error) {
            message.error(String(error))
        }
        
    }

    /**
     * 删除事件
     * @param item
     */
    const onDeleteArticleClick = (item: Article) => {

        modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                store.deleteArticle([item.infoGuid])
            },
        })
    }

    return (
        <Card
            title={
                <div className={styles['knowledg-lib-article-header']}>
                    {/* 标签 */}
                    <div className={styles['knowledg-lib-article-header-label']}>{
                        item.labelWordList.filter(Boolean).map((label, index) => (
                            <Tag key={index} onClick={() => onLabelWordClick(label)}>{label}</Tag>
                        ))
                    }</div>

                    {
                        FROM_SOURCE_ICON_MAP[item.fromSource] &&
                        <div className={styles['knowledg-lib-article-header-source']} onClick={() => onOpenShare(item.fromUserUrl)}>
                            <div className={styles['knowledg-lib-article-header-source-icon']}>
                                {FROM_SOURCE_ICON_MAP[item.fromSource]?.icon}
                            </div>
                            <div className={styles['knowledg-lib-article-header-source-desc']}>
                                From:{FROM_SOURCE_ICON_MAP[item.fromSource]?.desc}
                            </div>
                        </div>
                    }
                    
                </div>
            }
            actions={[
                <div className={styles['knowledg-lib-article-action']}>
                    <div>
                        <Tag
                            icon={
                                item.infoType === 1 &&
                                item.videoSource === 'youtube' ?
                                    <img className='anticon' src={IMAGES.YOUTUBE_ICON} /> :
                                    item.infoType === 2 ? 
                                        <img className='anticon' src={IMAGES.PDF_ICON} /> :
                                        <GlobalOutlined />
                            }
                            onClick={() => onHostDomainClick(item)}
                        >
                            {item.hostDomain}
                        </Tag>
                    </div>

                    <div className={styles['knowledg-lib-article-action-op']}>
                        {
                            // 当前用户
                            item.fromSource === 0 && (
                                // 公开状态
                                item.isPublic ?
                                <Tooltip title={'公开'}>
                                    <EyeOutlined onClick={() => toggleArticlePublic(item)} />
                                </Tooltip> :
                                <Tooltip title={'私有'}>
                                    <EyeInvisibleOutlined onClick={() => toggleArticlePublic(item)} />
                                </Tooltip>
                                
                            )
                        }

                        {
                            // 非当前用户
                            item.fromSource !== 0 &&
                            <Tooltip title={'复制'}>
                                <CopyOutlined onClick={() => onCopyArticleClick(item)} />
                            </Tooltip>
                        }
                        
                        <Tooltip title={'删除'}>
                            <DeleteFilled
                                onClick={() => onDeleteArticleClick(item)}
                            />
                        </Tooltip>
                    </div>
                    
                </div>
            ]}
            hoverable
        >
            <div className={styles['knowledg-lib-article-content']}>
                {/* 标题 */}
                <div
                    title={item.title}
                    className={styles['knowledg-lib-article-title']}
                >
                    {item.title}
                </div>

                <div
                    className={styles['knowledg-lib-article-info']}
                >
                    <div className={styles['knowledg-lib-article-info-date']}>{item.createDate}</div>
                    <div>
                        <ReadOutlined style={{ marginRight: 2 }} />
                        {item.readCount}
                    </div>
                </div>

                <div className={styles['knowledg-lib-article-main']}>
                    {/* 摘要 */}
                    <div
                        title={item.abstract}
                        className={item.infoType === 1 ?styles['knowledg-lib-article-abstract-video']:styles['knowledg-lib-article-abstract']}
                        onClick={() => onArticleAbstractClick(item)}
                    >
                        {item.abstract}
                    </div>
                    {/* 图片 */}
                    <div
                        className={styles['knowledg-lib-article-img']}
                        onClick={() => onArticleIconClick(item)}
                    >
                        <Image
                            preview={false}
                            src={item.infoType === 1 ? IMAGES.DEFAULT_VIDEO_ICON : IMAGES.DEAULT_AVATAR}
                        />
                    </div>
                </div>

                <Button
                    className={styles['knowledg-lib-article-detail-btn']}
                    onClick={() => onArticleDetailClick(item)}
                >
                    {'详情'}
                    <ArrowUpOutlined style={{
                        transform: 'rotate(45deg)',
                    }} />
                </Button>   

                {/* 关键词 */}
                <div className={styles['knowledg-lib-article-keyword']}>{
                    item.keyWordList.filter(Boolean).map((keyWord, index) => (
                        <Tag
                            key={index}
                            onClick={() => onKeyWordClick(keyWord)}
                        >
                            #{keyWord}
                        </Tag>
                    ))
                }</div>

                {contextHolder}
            </div>
        </Card>                 
    )
}