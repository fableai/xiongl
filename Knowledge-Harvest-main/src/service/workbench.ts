import { message } from "antd"
import api from "./request"

/**
 * AI搜索
 * @param params 
 * @returns 
 */
export const fetchAISearch = async (params: {
    userGuid: string,
    labelWord?: string,
    keyWord?: string
}): Promise<any> => {
    try {
        const response = await api.post('/Info/SearchInfoAI', {
            userGuid: params.userGuid,
            labelWord: params.labelWord ?? '',
            keyWord: params.keyWord ?? ''
        })

        return response
    } catch (error) {
        message.error('搜索知识库信息失败')

        return Promise.reject(error)
    }
}

/**
 * 获取知识库信息
 * @param params 
 * @returns 
 */
export const fetchAllInfo = async (params: {
    userGuid: string,
    labelWord: string,
    keyWord?: string,
    pageNumber: number,
    pageSize: number
}): Promise<any> => {
    try {
        const response = await api.post('/Info/GetAllInfo', {
            userGuid: params.userGuid,
            labelWord: params.labelWord,
            keyWord: params.keyWord ?? '',
            pageNumber: params.pageNumber,
            pageSize: params.pageSize
        })

        return response.data
    } catch (error) {
        message.error('获取知识库信息失败')

        return Promise.reject(error)
    }
}

/**
 * 获取文章详情
 * @param params 
 * @returns 
 */
export const fetchArticleDetail = async (params: {
    infoGuid: string
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GetInfoId`,{
            infoGuid:params.infoGuid
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 获取视频时间轴
 * @param params 
 * @returns 
 */
export const fetchArticleTimeLine = async (params: {
    infoGuid: string
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GetTimeLineInfo`,{
            infoGuid:params.infoGuid
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 重新生成摘要
 * @param params 
 * @returns 
 */
export const fetchArticleGen = async (params: {
    infoGuid: string
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GenInfo_V2`,{
            infoGuid:params.infoGuid
        })

        return response.data
    } catch (error) {
        debugger;        
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}

/**
 * 重新生成摘要Pro
 * @param params 
 * @returns 
 */
export const fetchArticleGenPro = async (params: {
    infoGuid: string
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GenInfo_V2_Pro`,{
            infoGuid:params.infoGuid
        })

        return response.data
    } catch (error) {
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }

        return Promise.reject(error)
    }
}

/**
 * 获取标签信息
 * @param params 
 * @returns 
 */
export const fetchLabels = async (params: {
    userGuid: string
}): Promise<string[]> => {
    try {
        const response = await api.post('/Info/GetLabels', params)

        return response.data
    } catch (error) {
        message.error('获取标签信息失败')

        return Promise.reject(error)
    }
}

/**
 * 更新阅读数
 * @param params 
 * @returns 
 */
export const fetchAddReadCount = async (params: {
    userGuid: string,
    infoGuids: string[]
}): Promise<any> => {
    try {
        const response = await api.post('/Info/SetReadCount', {
            infoGuids: params.infoGuids,
        })

        return response.data
    } catch (error) {
        message.error('更新阅读数失败')

        return Promise.reject(error)
    }
}

/**
 * 设置公开
 * @param params 
 * @returns 
 */
export const fetchSetArticlePublic = async (params: {
    infoGuid: string,
    isPublic: 0 | 1
}) => {
    try {
        const response = await api.post('/Info/SetPublic',params)

        return response.data
    } catch (error) {
        message.error('设置失败')

        return Promise.reject(error)
    }
}

/**
 * 复制
 * @param params 
 * @returns 
 */
export const fetchCopyArticle = async (params: {
    infoGuid: string,
    userGuid: string
}) => {
    try {
        const response = await api.post('/Info/CopyInfo',params)

        return response.data
    } catch (error) {
        message.error('复制失败')

        return Promise.reject(error)
    }
}

/**
 * 删除文章
 * @param params 
 * @returns 
 */
export const fetchDeleteArticle = async (params: {
    infoGuids: string[]
}) => {
    try {
        const response = await api.post('/Info/DelInfos',params)

        return response.data
    } catch (error) {
        message.error('删除失败')

        return Promise.reject(error)
    }
}

/**
 * 保存速记
 * @param params 
 * @returns 
 */
export const fetchSaveShortHand = async (params: { userGuid: string, infoGuid: string, title: string, content: string }) => {
    const response = await api.post("/Info/SaveShortHand", {
        userGuid: params.userGuid,
        infoGuid: params.infoGuid,
        title: params.title,
        content: params.content
    })

    return response.data
}

/**
 * 生成脑图 ECharts
 * @param params 
 * @returns 
 */
export const fetchAllLabelMind = async (params: {    
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GetLabelMindData`,{
            userGuid:params.userGuid
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 生成脑图-markdown-标题-标签-关键词
 * @param params 
 * @returns 
 */
export const fetchGetLabelMindMarkDownData1  = async (params: {    
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GetLabelMindMarkDownData1`,{
            userGuid:params.userGuid
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 生成脑图-markdown-标签合并-关键词合并-标题
 * @param params 
 * @returns 
 */
export const fetchGetLabelMindMarkDownData2  = async (params: {    
    userGuid: string
}) => {
    try {
        const response = await api.post(`/Info/GetLabelMindMarkDownData2`,{
            userGuid:params.userGuid
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 新增评论
 * @param params 
 * @returns 
 */
export const fetchAddComment = async (params: {
    infoGuid: string,
    commentsUserGuid: string,
    commentsUserName: string,
    comments: string
}) => {
    try {
        const response = await api.post(`/Info/AddComment`,{
            infoGuid:params.infoGuid,
            commentsUserGuid: params.commentsUserGuid,
            commentsUserName: params.commentsUserName,
            comments: params.comments
        })

        return response.data
    } catch (error) {          
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}

/**
 * 查询评论
 * @param params 
 * @returns 
 */
export const fetchQueryInfoComments = async (params: {
    infoGuid: string 
}) : Promise<any> =>{
    try {
        const response = await api.post(`/Info/QueryInfoComments`,{
            infoGuid:params.infoGuid       
        })

        return response.data
    } catch (error) {          
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}

/**
 * 查询评论-所有
 * @param params 
 * @returns 
 */
export const fetchQueryInfoAllComments = async (params: {
    url: string 
}) : Promise<any> =>{
    try {
        const response = await api.post(`/Info/QueryInfoAllComments`,{
            url:params.url       
        })

        return response.data
    } catch (error) {          
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}

//标签设置
/**
 * 所有标签设置
 * @param params 
 * @returns 
 */
export const fetchGetUserAllLabel = async (params: {
    userGuid: string 
}) : Promise<any> =>{
    try {
        const response = await api.post(`/InfoLabelSet/GetUserAllLabel`,{
            userGuid:params.userGuid       
        })

        return response.data
    } catch (error) {          
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}

/**
 * 标签设置-新增标签
 * @param params 
 * @returns 
 */
export const fetchAddLabelSet  = async (params: { userGuid: string
    , infoLabelSetGuid: string
    , labelWord: string
    , labelRemark: string 
    , isUser: boolean }) => {
    try {
        const response = await api.post(`/InfoLabelSet/AddLabelSet`,{
            userGuid:params.userGuid,
            infoLabelSetGuid:params.infoLabelSetGuid,
            labelWord:params.labelWord,
            labelRemark:params.labelRemark,
            isUser:params.isUser
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 标签设置-编辑标签
 * @param params 
 * @returns 
 */
export const fetchUpdateLabelSet  = async (params: { userGuid: string
    , infoLabelSetGuid: string
    , labelWord: string
    , labelRemark: string 
    , isUser: boolean }) => {
    try {
        const response = await api.post(`/InfoLabelSet/UpdateLabelSet`,{
            userGuid:params.userGuid,
            infoLabelSetGuid:params.infoLabelSetGuid,
            labelWord:params.labelWord,
            labelRemark:params.labelRemark,
            isUser:params.isUser
        })

        return response.data
    } catch (error) {
        message.error('获取文章详情失败')

        return Promise.reject(error)
    }
}

/**
 * 删除标签设置
 * @param params 
 * @returns 
 */
export const fetchDelLabelSet = async (params: {
    infoLabelSetGuid: string 
}) : Promise<any> =>{
    try {
        const response = await api.post(`/InfoLabelSet/DelLabelSet`,{
            infoLabelSetGuid:params.infoLabelSetGuid       
        })

        return response.data
    } catch (error) {          
        if(error.message!=null){
            message.error(error.message)
        }
        else{
            message.error('获取文章详情失败')
        }
        return Promise.reject(error)
    }
}
