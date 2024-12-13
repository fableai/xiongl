import * as signalR from "@microsoft/signalr";
import { baseURL } from "./request";
import { message } from "antd";
import Emitter from "../emitter";

/**
 * 建立消息通道
 * @param userGuid 
 */
export const createMessageChannel = async (userGuid: string) => {
    const url = baseURL + "/infoHub";

    const options = {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    }

    const connection = (
        new signalR.HubConnectionBuilder()
            .withUrl(url, options)
            .build()
    );

    //接收信息返回消息（1、收藏接口 ；2、查询接口）
    connection.on("ReceiveInfoCardMsg", (targetUserGuid, data, from) => {
        console.log('ReceiveInfoCardMsg', targetUserGuid, data, from)
        if (targetUserGuid !== userGuid) {
            return;
        }

        Emitter.emit('onArticleUpdate')
    });
    
    //建立连接后，会马上返回客户端此处，证明回路正常
    connection.on("SendUserInfo", (connid) => {
        console.log('SendUserInfo:' + connid)
    });

    try {
        await connection.start()
        
        await connection.invoke("SendUserInfo", userGuid)

    } catch (error: any) {
        message.error(error.message);
    }

    return connection;
}