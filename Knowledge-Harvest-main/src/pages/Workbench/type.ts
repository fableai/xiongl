import { TimeLineData } from "./timelinetype"

export type Article = {
    userGuid: string,
    infoGuid: string,
    title: string,
    abstract: string,
    keyMindMd?: string,
    keyInfoPointMd?: string,
    hostDomain: string,
    url: string,
    labelWords: string,
    keyWords: string,
    readCount: number,
    labelWordList: string[],
    keyWordList: string[],
    content:string,
    
    timeLineList: TimeLineData[]

    createDate: string
    infoType: 0 | 1 | 2 | 3 // 0: 网页 1: 视频 2: pdf;3：速记
    videoSource: 'youtube' | ''
    isPublic: 0 | 1 // 0: 私有 1: 公开
    fromSource: 0 | 1 | 2 // 0: 当前知识库 1: 其他用户 2: 联网搜索
    fromUserName: string
    fromUserUrl: string
}