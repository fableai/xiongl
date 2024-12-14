import { message } from 'antd';
import api from './request';

export interface ChatMessage {
    role: 'user' | 'assistant';
    msg: string;
    index: number;
}

export interface ChatResponse {
    chatid: string;
    message: ChatMessage[];
}

/**
 * Send chat message and get AI response
 * @param params.userGuid User identifier
 * @param params.chatid Chat session identifier (optional for first message)
 * @param params.message Array of chat messages
 */
export const fetchChatSendMessage = async (params: {
    userGuid: string;
    chatid?: string;
    message: ChatMessage[];
}): Promise<ChatResponse> => {
    try {
        const response = await api.post('/Chat/SendMessage', {
            userGuid: params.userGuid,
            chatid: params.chatid,
            message: params.message
        });
        return response;
    } catch (error: any) {
        message.error(error.message || '发送消息失败');
        throw error;
    }
};

/**
 * Load chat history for a user
 * @param params.userGuid User identifier
 */
export const fetchChatHistory = async (params: {
    userGuid: string;
}): Promise<ChatResponse> => {
    try {
        const response = await api.post('/Chat/GetHistory', {
            userGuid: params.userGuid
        });
        return response;
    } catch (error: any) {
        message.error(error.message || '加载聊天记录失败');
        throw error;
    }
};
