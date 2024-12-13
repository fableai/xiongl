import { Input, Layout, List, Segmented, message, Button, Spin } from 'antd'
import styles from './style.module.less'

import useKnowledgeLibStore from './store'
import { ChangeEvent, Suspense, useEffect } from 'react'
import ArticleDetail from '../components/ArticleDetail'
import { IMAGES } from '../../../assets/images'
import { useLocation } from 'react-router-dom'
import Emitter from '../../../emitter'
import LoadMore from '../../../components/LoadMore'
import ArticleCard from '../components/ArticleCard'

const { Header, Content } = Layout

export default function KnowledgeLib() {
    const location = useLocation()
    const store = useKnowledgeLibStore()

    /**
     * 关键词更新
     */
    const onKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.setKeyWord(e.target.value)
    }

    /**
     * 普通搜索
     */
    const onNormalSearch = () => {
        store.search()
    }

    /**
     * AI搜索
     */
    const onAISearch = () => {
        store.searchByAI()
    }

    /**
     * 加载更多
     */
    const onLoadMore = () => {
        console.log('load more')
        store.loadMore()
    }

    /**
     * 标签切换
     * @param value 
     */
    const onTabChange = (value: string) => {
        store.setActiveTab(value)
    }

    useEffect(() => {
        const updater = async () => {
            await store.fetchLabels();
            message.success('页面有新内容，自动更新已完成');
        };

        Emitter.on('onArticleUpdate', updater);
        return () => Emitter.off('onArticleUpdate', updater);
    })

    useEffect(() => {
        store.reset()
        store.fetchLabels();
    }, [location])

    return (
        <Layout className={styles['knowledg-lib']}>
            <Header className={styles['knowledg-lib-header']}>
                <div className={styles['knowledg-lib-header-search']}>
                    <Input
                        value={store.keyWord}
                        size="large"
                        style={{
                            height: '60px',
                            fontSize: '24px',
                            padding: '12px 24px'
                        }}
                        placeholder="搜索关键词"
                        suffix={(
                            <div className={styles['knowledg-lib-header-search-suffix']}>
                                <img
                                    className={styles['knowledg-lib-header-ai-search']}
                                    src={IMAGES.AI_SEARCH}
                                    title={'AI搜索'}
                                    alt={"AI搜索"}
                                    onClick={!store.isLoading ? onAISearch : undefined}
                                />
                                <Button
                                    disabled={store.isLoading}
                                    className={styles['knowledg-lib-header-normal-search']}
                                    onClick={onNormalSearch}
                                >
                                    {'搜索'}
                                </Button>
                            </div>
                        )}
                        variant={'filled'}
                        // allowClear
                        onChange={onKeywordChange}
                    />
                </div>
            </Header>
            <Content className={styles['knowledg-lib-content']}>
                <div className={styles['knowledg-lib-content-tabs']}>
                    <Segmented
                        size='large'
                        value={store.activeTab}
                        style={{ marginBottom: 20 }}
                        onChange={onTabChange}
                        options={store.tabs}
                    />
                </div>
                

                <div className={styles['knowledg-lib-content-list']}>
                    <List
                        grid={{
                            gutter: [24, 8],
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 2,
                            xl: 3,
                            xxl: 4,
                        }}
                        dataSource={store.articles}
                        className={store.articles.length === 0 ? styles['empty'] : ''}
                        renderItem={(item) => (
                            <List.Item key={item.infoGuid}>
                                <ArticleCard item={item} />
                            </List.Item>
                        )}
                    />

                    {/* 加载更多 */}
                    {
                        store.totalPage > 1 &&
                        <LoadMore onNotify={onLoadMore} />
                    }
                    
                </div>
                <ArticleDetail />
            </Content>

            {
                store.isLoading &&
                <div className={styles['loading']}>
                    <Spin spinning={true} size='large' delay={500}>
                    </Spin>
                </div>
            }
        </Layout>
    )
}