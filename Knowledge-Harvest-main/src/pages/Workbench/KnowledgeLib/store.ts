import { create } from 'zustand'
import { fetchAISearch, fetchAddReadCount, fetchAllInfo, fetchCopyArticle, fetchDeleteArticle, fetchLabels, fetchSetArticlePublic } from '@/service'
import useGlobalStore from '@/store'
import { Article } from '../type'
import { debounce } from 'radash'

type KnowledgeLibStore = {
    pageSize: number,
    pageNumber: number,
    totalPage: number,
    isLoading: boolean,

    activeTab: string,
    setActiveTab: (tab: string) => void,

    keyWord: string,
    setKeyWord: (keyWord: string) => void,
    search: () => void,

    tabs: { label: string, value: string}[]
    fetchLabels: () => Promise<{ label: string, value: string}[]>

    articles: Article[]
    // 获取所有信息
    fetchArticles: (reset?: boolean) => Promise<any>;
    // 获取所有信息
    debounceFetchArticles: () => void;
    // 加载更多
    loadMore: () => void;
    // AI搜索
    searchByAI: () => Promise<any>;
    // [前端缓存] - 更新文章信息
    updateArticles: (articles: Article[]) => void;
    // 更新阅读数
    fetchAddReadCount: (infoGuids: string[]) => Promise<any>;

    // 更新文章公开状态
    updateArticlePublic: (infoGuid: string, isPublic: 0 | 1) => Promise<any>;
    // 复制文章
    copyArticle: (infoGuid: string) => Promise<any>;
    // 删除文章
    deleteArticle: (infoGuids: string[]) => Promise<any>;

    reset: () => void;
}

const useKnowledgeLibStore = create<KnowledgeLibStore>((set, get) => ({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 1,
    isLoading: false,

    tabs: [],
    /**
     * 获取所有标签
     * @returns 
     */
    async fetchLabels() {
        const store = get()

        let { activeTab } = store
        const { userGuid } = useGlobalStore.getState()

        // 获取所有标签
        const labels = await fetchLabels({ userGuid })

        const tabs = labels.map((item: string, index) => ({
            label: item,
            value: item,
            icon: index
        }))

        if (!activeTab || labels.includes(activeTab)) {
            activeTab = labels[0]
        }

        set(() => ({ tabs }))

        store.setActiveTab(activeTab)

        return tabs
    },

    // 搜索关键字
    keyWord: '',
    setKeyWord(keyWord: string) {
        set(() => ({ keyWord }))
    },
    search: () => {
        const store = get()

        // 重置页码
        set(() => ({ pageNumber: 1 }))

        store.debounceFetchArticles()
    },

    // 当前激活的标签
    activeTab: '',
    setActiveTab(tab) {
        const store = get()

        set(() => ({ activeTab: tab }))

        store.search()
    },

    // 知识库文章列表
    articles: [],
    /**
     * 获取所有信息
     * @param params 
     * @returns 
     */
    async fetchArticles(reset = true) {
        const { activeTab, keyWord, pageSize, pageNumber, articles } = get()
        const { userGuid } = useGlobalStore.getState()

        set(() => ({ isLoading: true }))

        const { data, count = pageSize } = await fetchAllInfo({
            userGuid,
            labelWord: activeTab,
            keyWord,
            pageSize,
            pageNumber,
        }).finally(() => {
            set(() => ({ isLoading: false }))
        })

        const totalPage = Math.ceil(count / pageSize)
        const nextArticles = reset ? data : [...articles, ...data]

        set(() => ({ articles: nextArticles, totalPage }))

        return articles
    },
    debounceFetchArticles: debounce({ delay: 300 }, () => get().fetchArticles()),

    /**
     * 加载更多
     * @returns 
     */
    loadMore: () => {
        const { totalPage, pageNumber, fetchArticles } = get()

        if (pageNumber >= totalPage) {
            return
        }

        set(() => ({ pageNumber: pageNumber + 1 }))

        fetchArticles(false)
    },

    /**
     * AI搜索
     * @returns 
     */
    searchByAI: async () => {
        const { keyWord } = get()
        const { userGuid } = useGlobalStore.getState()

        set(() => ({ isLoading: true }))

        const { data: articles } = await fetchAISearch({
            userGuid,
            keyWord
        }).finally(() => {
            set(() => ({ isLoading: false }))
        })

        // AI搜索重置分页
        set(() => ({ articles, totalPage: 1, pageNumber: 1 }))

        return articles
    },

    /**
     * [前端缓存] - 更新文章信息
     * @param article 
     */
    updateArticles: (newArticles: Article[]) => {
        set((state) => {
            let { articles } = state;

            const map = newArticles.reduce((map, article) => {
                map[article.infoGuid] = article
                return map
            }, {} as Record<string, Article>)

            articles = articles.map((article) => {
                if (!map[article.infoGuid]) {
                    return article
                }

                return {
                    ...article,
                    ...map[article.infoGuid]
                }
            })

            return {
                articles
            }
        })
    },
    /**
     * 更新阅读数
     * @param infoGuids 
     * @returns 
     */
    async fetchAddReadCount(infoGuids: string[]) {
        const store = get()
        const { userGuid } = useGlobalStore.getState()

        const response = await fetchAddReadCount({
            userGuid,
            infoGuids
        })

        store.updateArticles(response)

        return response
    },

    updateArticlePublic: async (infoGuid: string, isPublic) => {
        const store = get()

        const response = await fetchSetArticlePublic({
            infoGuid,
            isPublic
        })

        console.log('updateArticlePublic', response)

        return response
    },

    copyArticle: async (infoGuid: string) => {
        const { userGuid } = useGlobalStore.getState()

        const response = await fetchCopyArticle({
            infoGuid,
            userGuid
        })

        console.log('copyArticle', response)

        return response
    },

    /**
     * 删除文章
     * @param infoGuid 
     */
    deleteArticle: async (infoGuids: string[]) => {
        const store = get()
        const result = await fetchDeleteArticle({ infoGuids })

        store.fetchArticles()

        return result
    },

    reset: () => {
        set(() => ({
            keyWord: '',
            activeTab: '',
            tabs: [],
            articles: [],
            pageNumber: 1,
            totalPage: 1
        }))
    }
}))

export default useKnowledgeLibStore