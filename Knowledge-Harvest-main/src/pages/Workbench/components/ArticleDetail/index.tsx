import { Drawer, Tabs, Tag,Typography,Button,Timeline,Spin,Input,Flex ,List, Rate, Avatar   ,Switch,Space,Radio   } from "antd";
import { create } from 'zustand'
import classNames from "classnames";
import { BranchesOutlined, ProfileOutlined,UserOutlined
    ,CopyOutlined,ShareAltOutlined,FileTextOutlined,SolutionOutlined  } from "@ant-design/icons";

import useGlobalStore from "@/store";
import { fetchArticleDetail,fetchArticleTimeLine,fetchArticleGen,fetchArticleGenPro,fetchAddComment,fetchQueryInfoComments,fetchQueryInfoAllComments } from "@/service";

import { Article } from "../../type";
import { TimeLineData } from "../../timelinetype";
import { InfoComment } from "../../infoComment";
import MindMap from "../../../../components/MindMap";
import styles from "./style.module.less";
import ReactMarkdown from "react-markdown";

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

import ReactDOM from 'react-dom';
import React,{ useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ShortHand } from "../../../../components/ShortHand";
import ModifyTagsModal from "../../../../components/ModifyTagsModal";

// export type InfoComment = {
//     infoCommentsGuid: string,
//     infoGuid: string,
//     commentsUserGuid: string,
//     commentsUserName: string,
//     comments?: string,
//     createDate: string,
//     avatar:string
// }
/*
 export type InfoComment = {
    infoCommentsGuid: string,
    infoGuid: string,
    commentsUserGuid: string,
    commentsUserName: string,
    comments?: string,
    createDate: string
}
*/

export enum TAB_KEY {
    Abstract = 'abstract',
    MindMap = 'MindMap',
    AllContent='allContent',
    ShortHand='shortHand',
    Comments='Comments',
}

export type ArticleDetailStore = {
    open: boolean,
    setOpen: (open: boolean, defaultActiveTab?: TAB_KEY) => void,

    activeTab: TAB_KEY,
    setActiveTab: (activeTab: TAB_KEY) => void,

    show: (id: string, defaultActiveTab?: TAB_KEY) => void,

    article: Article | null,

    timeline:TimeLineData| null,

    infoComment: InfoComment[],
    fetchComments: (infoGuid: string) => void,    
    fetcAllhComments: (url: string) => void,  
}

/**
 * 文章详情 store
 */
export const useArticleDetailStore = create<ArticleDetailStore>((set) => ({
    open: false,
    setOpen: (open, defaultActiveTab = TAB_KEY.Abstract) => set({ open, activeTab: defaultActiveTab }),

    activeTab: TAB_KEY.Abstract,
    setActiveTab: (activeTab) => set({ activeTab }),

    article: null,
    timeline:null,
    infoComment:[],
    fetchComments: async (infoGuid) => {
        const result = await fetchQueryInfoComments({ infoGuid });
        set({ infoComment: result });
    },    
    fetcAllhComments: async (url) => {
        const result = await fetchQueryInfoAllComments({ url });
        set({ infoComment: result });
    },        
    show: async (id, defaultActiveTab = TAB_KEY.Abstract) => {
        const { userGuid } = useGlobalStore.getState()

        const result = await fetchArticleDetail({
            userGuid,
            infoGuid: id,
        })
        const resultTimeLine = result.timeLineList;        
        // console.log(resultTimeLine);
        // const resultTimeLine = await fetchArticleTimeLine({
        //     userGuid,
        //     infoGuid: id,
        // })

        set({ open: true, article: result,timeline:resultTimeLine, activeTab: defaultActiveTab })
    },

    
}))

/**
 * 文章详情组件
 * @returns 
 */
export default function ArticleDetail() {
    //修改标签begin
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTags, setCurrentTags] = useState(['Tag1', 'Tag2']); // Replace with actual current tags
    const availableTags = ['Tag1', 'Tag2', 'Tag3', 'Tag4']; // Replace with actual available tags
    const handleUpdateTags = (updatedTags) => {
        setCurrentTags(updatedTags);
        // Add logic to save updated tags to the backend or state management
    };
    const titleModifyTag="修改标签";
    //修改标签end


    const { open, activeTab, setOpen, setActiveTab, article,timeline,infoComment } = useArticleDetailStore()

    const tems=[
        {
            key: TAB_KEY.Abstract,
            label: '摘要',
            icon: <ProfileOutlined />,
        },
        {
            key: TAB_KEY.MindMap,
            label: '脑图',
            icon: <BranchesOutlined />,
        },
        // {
        //     key: TAB_KEY.AllContent,
        //     label: '全文',
        //     icon: <ProfileOutlined />,
        // }
    ];
    if(article?.infoType==1){
        tems.push(        {
            key: TAB_KEY.AllContent,
            label: '全文',
            icon: <ProfileOutlined />
        });
    }
    if(article?.infoType==3){
        tems.push(        {
            key: TAB_KEY.ShortHand,
            label: '速记',//ShortHand
            icon: <ProfileOutlined />
        });
    }

    tems.push({
        key: TAB_KEY.Comments,
        label: '评论',
        icon: <ProfileOutlined />
    });

    const txtCopyAll="复制全文";
    const txtGenInfo="生成摘要";
    const txtGenInfoPro="生成摘要-高级";

    const txtTitle="标题";
    const txtAbstract="摘要";
    const txtKeyInfoPointMd="关键点信息";
    const content_titleAbstractKeyInfo = txtTitle + '\r\n' + article?.title + '\r\n'+ '\r\n'
    + txtAbstract + '\r\n' + article?.abstract + '\r\n'+ '\r\n'
    + txtKeyInfoPointMd + '\r\n' + article?.keyInfoPointMd + '\r\n';      

    const onClose = () => {
        setOpen(false)
    }

    const onTabChange = (activeKey: string) => {
        setActiveTab(activeKey as TAB_KEY);
        if(activeKey == TAB_KEY.Comments){
            querycomments(article?.infoGuid || '');
        }
    }
    //加载评论
    const querycomments = (infoGuid: string) => {
        useArticleDetailStore.getState().fetchComments(infoGuid);
    };

    const [copied, setCopied] = useState(false);
    // 假设 article.content 是你想要复制的文本内容
    const handleCopy = () => {
        setCopied(true);
        // 可以在这里添加一些逻辑，比如延迟隐藏复制成功的提示
        setTimeout(() => {
        setCopied(false);
        }, 2000);
    };

    const [loading, setLoading] = useState(false);

    const onClickGen = async (infoGuid:string) => {
        setLoading(true);
        try {
            const { userGuid } = useGlobalStore.getState();
            const result = await fetchArticleGen({
                userGuid,
                infoGuid: infoGuid,
            });
            await useArticleDetailStore.getState().show(infoGuid, TAB_KEY.Abstract);
        } finally {
            setLoading(false);
        }
    }

    const onClickGenPro = async (infoGuid:string) => {
        setLoading(true);
        try {
            const { userGuid } = useGlobalStore.getState();
            const result = await fetchArticleGenPro({
                userGuid,
                infoGuid: infoGuid,
            });
            await useArticleDetailStore.getState().show(infoGuid, TAB_KEY.Abstract);
        } finally {
            setLoading(false);
        }
    }

    const txtShare="分享";
    const share_url = window.location.origin + '/app/share/'+article?.infoGuid;
    const [copiedShare, setCopiedShare] = useState(false);
    // 假设 article.content 是你想要复制的文本内容
    const onClickShare = () => {
        setCopiedShare(true);
        // 可以在这里添加一些逻辑，比如延迟隐藏复制成功的提示
        setTimeout(() => {
            setCopiedShare(false);
            }, 2000);
    }
    

    const ArticleDetailContent = article && (
        <div className={styles['article-detail']}>
            <div className={styles['article-container-headbtn']}>
                <div className={styles['headbtnmargin']} style={{textAlign:'left'}}>
                    {copied && <span style={{color: 'green'}}> Copied.</span>} 
                    <CopyToClipboard text={content_titleAbstractKeyInfo}
                        onCopy={() => {handleCopy()}}>
                        <Button icon={<CopyOutlined />}>
                            {txtCopyAll}
                        </Button>
                        {/* <button>Copy to clipboard with button</button> */}
                    </CopyToClipboard>
                </div>  
                <div className={styles['headbtnmargin']}>
                    <Button icon={<FileTextOutlined />} onClick={()=>onClickGen(article.infoGuid)}>{txtGenInfo}</Button> 
                </div>
                <div className={styles['headbtnmargin']}>
                    <Button icon={<SolutionOutlined />} onClick={()=>onClickGenPro(article.infoGuid)}>{txtGenInfoPro}</Button> 
                </div>
                <div className={styles['headbtnmargin']}>
                    
                    <CopyToClipboard text={share_url}
                        onCopy={() => {onClickShare()}}>
                        <Button icon={<ShareAltOutlined />}>
                            {txtShare}
                        </Button>
                    </CopyToClipboard>
                    {copiedShare && <span style={{color: 'green'}}>Link Copied.</span>} 
                </div> 

                <div>
                    {/* 修改标签 */}
                    <Button onClick={() => setIsModalVisible(true)}>{titleModifyTag}</Button>
                    <ModifyTagsModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        currentTags={currentTags}
                        availableTags={availableTags}
                        onUpdateTags={handleUpdateTags}
                    />
                    {/* 修改标签 */}
                </div>

            </div>
            {/* 标题 */}
            <div
                title={article.title}
                className={classNames([
                    styles['article-detail-title'],
                    styles['article-detail-item']
                ])}
            >
                <div className={classNames([
                    styles['article-detail-title-label'],
                    styles['label']
                ])}>{'标题'}</div>
                <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                
            </div>

            {/* 摘要 */}
            <div
                className={classNames([
                    styles['article-detail-item'],
                    styles['article-detail-abstract']
                ])}
            >
                <div className={classNames([
                    styles['article-detail-abstract-label'],
                    styles['label']
                ])}>{'摘要'}</div>
                
                <div
                    title={article.abstract}
                    className={styles['article-detail-abstract-content']}
                >
                    {article.abstract}
                </div>
            </div>

            <div
                className={classNames([
                    styles['article-detail-item'],
                    styles['article-detail-key-info']
                ])}
            >   
                <div
                    className={classNames([
                        styles['article-detail-key-info-label'],
                        styles['label']
                    ])}
                >
                    {'关键点信息'}
                </div>

                <ReactMarkdown>{article.keyInfoPointMd}</ReactMarkdown>
            </div>

            {/* 关键词 */}
            <div
                className={classNames([
                    styles['article-detail-item'],
                    styles['article-detail-keyword']
                ])}
            >
                <div
                    className={classNames([
                        styles['article-detail-keyword-label'],
                        styles['label']
                    ])}
                >
                    {'关键词'}:
                </div>

                <div className={styles['article-detail-keyword-tags']}>{
                    article.keyWordList.map((keyword, index) => (
                        <div key={index} className={styles['article-detail-keyword-tag']}>#{keyword}</div>
                    ))
                }</div>
            </div>
            
            {/* 标签 */}
            <div
                className={classNames([
                    styles['article-detail-item'],
                    styles['article-detail-labels']
                ])}
            >
                <div
                    className={classNames([
                        styles['article-detail-labels-label'],
                        styles['label']
                    ])}
                >
                    {'标签'}
                </div>
                
                <div className={styles['article-detail-labels-tags']}>{
                    article.labelWordList.map((label, index) => (
                        <Tag key={index}>{label}</Tag>
                    ))
                }</div>
            </div>
        </div>
    );
    const mode = "left";
    // const { Paragraph, Text,Title } = Typography;
    const {Title} = Typography;

    const AllContent = article && (
        <div className={styles['article-detail']}>  
            <div>   
                {/* Markdown格式 */}
                {/* <ReactMarkdown>{article.content}</ReactMarkdown> */}
                {/* 富文本格式 */}
                {/* <ReactQuill theme="snow" value={article.content}  /> */}
                {/* html显示 */}
                {/* <Typography 
                        dangerouslySetInnerHTML={{
                        __html: article.content.replace(/\r\n/g, '<br/>')
                        }}
                    /> */}
                
                <div style={{textAlign:'right'}}>
                    {copied && <span style={{color: 'green'}}> Copied.</span>} 
                    <CopyToClipboard text={article.content}
                        onCopy={() => {handleCopy()}}>
                        <Button type="dashed">{txtCopyAll}</Button> 
                        {/* <button>Copy to clipboard with button</button> */}
                    </CopyToClipboard>
                </div>                

                <Title>{article.title}</Title>

                <div className={styles['article-container']}>

                    <div style={{textAlign:'left',paddingLeft:'0px'}}>
                        {/* <Typography 
                                dangerouslySetInnerHTML={{
                                __html: article.content.replace(/\r\n/g, '<br/>')
                                }}
                            /> */}
                            <Timeline marginXS
                                mode={mode}
                                items={timeline}
                            />
                    </div>
                </div>
            </div>

        </div>
    );

    const { TextArea } = Input;
    const btnPublish="发布";
    // 创建一个状态变量来存储TextArea的值
    const [commentValue, setCommentValue] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    // 处理TextArea变化的函数
    const commentsOnChange = (e) => {
        // e.target.value是TextArea当前的值
        const commentData = e.target.value;
        setCommentValue(commentData);
    };

    const onClickPublish = async (infoGuid:string) => {
        setLoading(true);
        setIsPublished(true); // 设置提交状态为true
        
        try {
            const { userGuid,userInfo } = useGlobalStore.getState();
            console.log(userInfo?.nickName);
            const result = await fetchAddComment({
                infoGuid: infoGuid,
                commentsUserGuid:userGuid,
                commentsUserName:userInfo?.nickName || 'Original Poster' ,   //"Op" 或 "Original Poster" - 在网络论坛中，指原始发帖人。
                comments:commentValue
            });   
            if(result){
                querycomments(infoGuid);
            }
        } finally {
            setLoading(false);
            setIsPublished(false); // 设置提交状态为false
            setCommentValue('');    //清空评论框
        }
    }
    
    const { Text, Paragraph } = Typography;

    const [radValue, setRadValue] = useState(0);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setRadValue(e.target.value);
        if(e.target.value==0){
            querycomments(article?.infoGuid);
        }
        else{
            queryAllcomments(article?.url);
        }
    };

    //加载网页所有评论
    const queryAllcomments = (url: string) => {
        useArticleDetailStore.getState().fetcAllhComments(url);
    };   

    const ArticleComments = article && (
        // style={{ position: 'relative' }}
        <div className={styles['article-detail']} >
        {/* 评论列表容器 */}   
        <div className="comments-list-container">
            <List
                itemLayout="vertical"
                dataSource={infoComment}
                renderItem={(item) => (
                <List.Item
                    key={item.infoCommentsGuid}           
                >
                    <List.Item.Meta
                    //头像
                    avatar={<Avatar icon={<UserOutlined />} src={item.avatar} />}
                    title={
                        <React.Fragment>
                        {/* 作者 */}
                        <Text strong>{item.commentsUserName}</Text>
                        {/* 星标 */}
                        {/* <Rate disabled defaultValue={item.rating} style={{ marginLeft: 8 }} /> */}
                        </React.Fragment>
                    }
                    //日期
                    description={item.createDate}
                    />
                <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                    {/* 内容 */}
                    {item.comments}
                    </Paragraph>            
                </List.Item>
                )}                
            /> 
        </div>
         
            {/* 评论框和按钮容器 */}
            {/* 评论框 */}
            <div 
                className={classNames([
                    styles['article-detail-item'],
                    styles['article-detail-keyword'],
                    styles['fixed-comment-box'],        // 应用固定评论框样式                    
                ])}
                style={{ marginBottom:'0px' }}                
            >
                <Space direction="vertical">
                    {/* <Switch checkedChildren="All Comments" unCheckedChildren="My Comments" defaultChecked
                                        style={{ width: '150px' }} 
                                    />     */}
                    <Radio.Group 
                        onChange={onChange} 
                        value={radValue}
                    >
                    <Radio value={0}>My Comments</Radio>
                    <Radio value={1}>All Comments</Radio>
                    </Radio.Group>                                    
                </Space>  
                                
                 <TextArea rows={4} placeholder="maxLength is 150"
                 showCount
                 onChange={commentsOnChange}
                 maxLength={200} 
                 value={commentValue} // 将TextArea的值绑定到状态
                 readOnly={isPublished} // 如果已经提交过，设置为只读
                />
                                              
                 <Flex gap="middle" wrap>                    
                    <Button type="primary" 
                        autoInsertSpace={false} 
                        onClick={()=>onClickPublish(article.infoGuid)}
                        disabled={isPublished} // 如果已经提交过，禁用按钮
                        style={{ marginTop: '10px', marginBottom: '10px' }} // 添加10px的上下间距
                    >
                    {btnPublish}
                    </Button>
                </Flex>
            </div>            
        </div>
    );    
    // width抽屉打开宽度
    return (
       
        <Drawer
            className={styles['article-detail-drawer']}
            // 卡片宽度
            width={800}         
            open={open}
            styles={{
                header: {
                    display: 'none'
                }
            }}
            destroyOnClose
            onClose={onClose}
        >
            <Tabs
                activeKey={activeTab}
                centered
                items={tems}
                onChange={onTabChange}
            />
           
            <div className={styles['article-detail-content']}>            
                <Spin spinning={loading} tip="生成中..." >            
                    <div
                        className={classNames([
                            styles['article-detail-content-item'],
                            activeTab !== TAB_KEY.Abstract && styles['hidden'],
                        ])}
                    >{ArticleDetailContent}</div>
                </Spin>   
                <div
                    className={classNames([
                        styles['article-detail-content-item'],
                        activeTab !== TAB_KEY.MindMap && styles['hidden'],
                    ])}
                >
                    <MindMap
                        markdown={article?.keyMindMd ?? ''}
                    />
                </div>
                <div
                    className={classNames([
                        styles['article-detail-content-item'],
                        activeTab !== TAB_KEY.AllContent && styles['hidden'],
                    ])}>{AllContent}
                </div>   
                <div
                    className={classNames([
                        styles['article-detail-content-item'],
                        activeTab !== TAB_KEY.ShortHand && styles['hidden'],
                    ])}
                >
                    <ShortHand
                        richText={article?.content??''}                        
                        // richText="<p>20241002	</p><br><p>qwe</p>"
                        initialTitle={article?.title}
                        infoGuid={article?.infoGuid}
                    />
                </div>   
                <div
                    className={classNames([
                        styles['article-detail-content-item'],
                        activeTab !== TAB_KEY.Comments && styles['hidden'],
                    ])}>{ArticleComments}
                </div>     
            </div>
        </Drawer>
      
    )
}