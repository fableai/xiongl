import React, { useEffect } from 'react';
import ChatBot, { Settings, useMessages, Flow, Params } from 'react-chatbotify';
import { theme } from 'antd';
import { useChatStore } from '../../store';
import useGlobalStore from '../../store';
import { fetchChatHistory, fetchChatSendMessage } from '../../service/chat';
import './style.module.less';

export const ChatBotComponent: React.FC = () => {
  const { token } = theme.useToken();
  const { chatId, setChatId } = useChatStore();
  const { userGuid } = useGlobalStore();
  const messages = useMessages();

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory({ userGuid });
        if (history.chatid) {
          setChatId(history.chatid);
          history.message.forEach((msg) => {
            messages.injectMessage(msg.msg, msg.role);
          });
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    if (userGuid) {
      loadHistory();
    }
  }, [userGuid]);

  // Define chat flow
  const flow: Flow = {
    start: {
      message: '请输入您的问题',
      function: async (params: Params) => {
        if (!params.userInput) return;

        const messageIndex = Date.now();
        await params.injectMessage(params.userInput, 'user');
        const thinkingId = await params.injectMessage('思考中...', 'assistant');

        try {
          const response = await fetchChatSendMessage({
            userGuid,
            chatid: chatId || undefined,
            message: [{
              role: 'user',
              msg: params.userInput,
              index: messageIndex,
            }]
          });

          if (thinkingId) {
            await params.removeMessage(thinkingId);
          }

          if (response.chatid) {
            setChatId(response.chatid);
            const assistantMessage = response.message.find(msg => msg.role === 'assistant');
            if (assistantMessage) {
              await params.injectMessage(assistantMessage.msg, 'assistant');
            }
          }
          return 'end';  // Add path to end state
        } catch (error) {
          console.error('Failed to send message:', error);
          if (thinkingId) {
            await params.removeMessage(thinkingId);
          }
          await params.injectMessage('发送消息失败，请重试', 'assistant');
          return 'end';  // Add path to end state even on error
        }
      }
    },
    end: {
      message: '感谢您的使用！如需继续对话，请刷新页面。',
      chatDisabled: true
    }
  };

  const settings: Settings = {
    general: {
      embedded: false,
      primaryColor: token.colorPrimary,
      secondaryColor: token.colorBgContainer,
    },
    botBubble: {
      dangerouslySetInnerHtml: true,
      position: 'left'  // Add position for bot messages
    },
    userBubble: {
      position: 'right'  // Add position for user messages
    },
    chatWindow: {
      defaultOpen: false,
      showScrollbar: true,
    },
    header: {
      title: '客服助手',
    },
  };

  // Apply dark theme class to body when theme changes
  useEffect(() => {
    const isDark = token.colorBgBase === '#141414';
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [token.colorBgBase]);

  return (
    <ChatBot
      settings={settings}
      flow={flow}
    />
  );
};
