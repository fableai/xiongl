import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Tabs, Tag, Typography, Button, Timeline, Spin, Input, Flex, List, Avatar ,Switch,Space,Radio } from "antd";
import { BranchesOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import classNames from "classnames";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactMarkdown from "react-markdown";

import { fetchArticleDetail, fetchArticleGen, fetchArticleGenPro, fetchAddComment, fetchQueryInfoComments,fetchQueryInfoAllComments } from "@/service";
import { Article } from "../Workbench/type";
import { TimeLineData } from "../Workbench/timelinetype";
import { InfoComment } from "../Workbench/infoComment";
import MindMap from "../../components/MindMap";
import { ShortHand } from "../../components/ShortHand";
import styles from "./style.module.less";
import useGlobalStore from "@/store";
import { RouteNames } from '../../router';

enum TAB_KEY {
    Abstract = 'abstract',
    MindMap = 'MindMap',
    AllContent='allContent',
    ShortHand='shortHand',
    Comments='Comments',
}

const ShareArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [timeline, setTimeline] = useState<TimeLineData | null>(null);
  const [infoComment, setInfoComment] = useState<InfoComment[]>([]);
  const [activeTab, setActiveTab] = useState<TAB_KEY>(TAB_KEY.Abstract);
  const [copied, setCopied] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
      const fetchArticle = async () => {
          if (id) {
              setLoading(true);
              try {
                  const result = await fetchArticleDetail({ infoGuid: id });
                  setArticle(result);
                  setTimeline(result.timeLineList);
              } catch (error) {
                  console.error("Failed to fetch article:", error);
              } finally {
                  setLoading(false);
              }
          }
      };
      fetchArticle();
  }, [id]);

  const queryComments = async (infoGuid: string) => {
      const result = await fetchQueryInfoComments({ infoGuid });
      setInfoComment(result);
  };
  const queryAllComments = async (url: string) => {
    const result = await fetchQueryInfoAllComments({ url });
    setInfoComment(result);
  };

  const onTabChange = (activeKey: string) => {
      setActiveTab(activeKey as TAB_KEY);
      if (activeKey === TAB_KEY.Comments) {
          queryComments(id);
      }
  };

  const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const onClickGen = async () => {
      setLoading(true);
      try {
          await fetchArticleGen({ infoGuid: id });
          const result = await fetchArticleDetail({ infoGuid: id });
          setArticle(result);
      } finally {
          setLoading(false);
      }
  };

  const onClickGenPro = async () => {
      setLoading(true);
      try {
          await fetchArticleGenPro({ infoGuid: id });
          const result = await fetchArticleDetail({ infoGuid: id });
          setArticle(result);
      } finally {
          setLoading(false);
      }
  };

  const onClickPublish = async () => {
      setLoading(true);
      setIsPublished(true);
      try {
          const { userGuid,userInfo } = useGlobalStore.getState();
          console.log(userInfo?.nickName);
          if(!userInfo){
            let returnUrl = RouteNames.Workbench;
            navigate(returnUrl);
          }
          await fetchAddComment({
            infoGuid: id,
            commentsUserGuid:userGuid,
            commentsUserName:userInfo?.nickName || 'Original Poster' ,
            comments: commentValue
          });
          await queryComments(id);
      } 
      catch(ex){
        console.log(ex);
      }
      finally {
          setLoading(false);
          setIsPublished(false);
          setCommentValue('');
      }
  };

  const [radValue, setRadValue] = useState(0);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadValue(e.target.value);
    if(e.target.value==0){
        queryComments(id);
    }
    else{
        queryAllComments(article?.url);
    }
  };


  if (loading) {
      return <Spin size="large" />;
  }

  if (!article) {
      return <div>Article not found</div>;
  }

  const tems = [
      { key: TAB_KEY.Abstract, label: '摘要', icon: <ProfileOutlined /> },
      { key: TAB_KEY.MindMap, label: '脑图', icon: <BranchesOutlined /> },
  ];

  if (article.infoType === 1) {
      tems.push({ key: TAB_KEY.AllContent, label: '全文', icon: <ProfileOutlined /> });
  }
  if (article.infoType === 3) {
      tems.push({ key: TAB_KEY.ShortHand, label: '速记', icon: <ProfileOutlined /> });
  }
  tems.push({ key: TAB_KEY.Comments, label: '评论', icon: <ProfileOutlined /> });

  const { Title, Paragraph, Text } = Typography;
  const { TextArea } = Input;

  return (
      <div className={styles.shareArticlePage}>
          <Title level={2}><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></Title>
          
          <Tabs activeKey={activeTab} items={tems} onChange={onTabChange} />

          <div className={styles.content}>
              {activeTab === TAB_KEY.Abstract && (
                  <div className={styles.abstract}>
                      <Paragraph>{article.abstract}</Paragraph>
                      <div className={styles.keyInfo}>
                          <Title level={4}>{'关键点信息'}</Title>
                          <ReactMarkdown>{article.keyInfoPointMd}</ReactMarkdown>
                      </div>
                      <div className={styles.keywords}>
                          <Title level={4}>{'关键词'}</Title>
                          {article.keyWordList.map((keyword, index) => (
                              <Tag key={index}>#{keyword}</Tag>
                          ))}
                      </div>
                      <div className={styles.labels}>
                          <Title level={4}>{'标签'}</Title>
                          {article.labelWordList.map((label, index) => (
                              <Tag key={index}>{label}</Tag>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === TAB_KEY.MindMap && (
                  <MindMap markdown={article.keyMindMd} />
              )}

              {activeTab === TAB_KEY.AllContent && (
                  <div className={styles.allContent}>
                      <Timeline mode="left" items={timeline} />
                  </div>
              )}

              {activeTab === TAB_KEY.ShortHand && (
                  <ShortHand
                      richText={article.content}
                      initialTitle={article.title}
                      infoGuid={article.infoGuid}
                  />
              )}

              {activeTab === TAB_KEY.Comments && (
                  <div className={styles.comments}>
                    {/* 评论列表容器 */}   
                    <div className="comments-list-container">
                        <List
                            itemLayout="vertical"
                            dataSource={infoComment}
                            renderItem={(item) => (
                                <List.Item key={item.infoCommentsGuid}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} src={item.avatar} />}
                                        title={<Text strong>{item.commentsUserName}</Text>}
                                        description={item.createDate}
                                    />
                                    <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                                        {item.comments}
                                    </Paragraph>
                                </List.Item>
                            )}
                        />
                    </div>
                    {/* 评论框和按钮容器 */}
                    {/* 评论框 */}
                      <div 
                    //   className={styles.addComment}                        
                       className={classNames([
                        styles['article-detail-item'],
                        styles['article-detail-keyword'],
                        styles['fixed-comment-box'],
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

                          <TextArea
                              rows={4}
                              placeholder=""
                              onChange={(e) => setCommentValue(e.target.value)}
                              value={commentValue}
                              maxLength={200}
                              showCount
                          />
                          <Button
                              type="primary"
                              onClick={onClickPublish}
                              disabled={isPublished}
                              style={{ marginTop: '10px' }}
                          >{'发布'}
                          </Button>
                      </div>
                  </div>
              )}
          </div>

          {/* <div className={styles.actions}>
              <CopyToClipboard
                  text={`${article.title}\n\n${article.abstract}\n\n${article.keyInfoPointMd}`}
                  onCopy={handleCopy}
              >
                  <Button>{copied ? '已复制' : '复制全文'}</Button>
              </CopyToClipboard>
              <Button onClick={onClickGen}>生成摘要</Button>
              <Button onClick={onClickGenPro}>生成摘要-高级</Button>
          </div> */}
      </div>
  );
};

export default ShareArticlePage;