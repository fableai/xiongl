import React from 'react';
import ChatBot, { Settings } from 'react-chatbotify';
import { theme } from 'antd';
import './style.module.less';

export const ChatBotComponent: React.FC = () => {
  const { token } = theme.useToken();

  const settings: Settings = {
    general: {
      embedded: false,
      primaryColor: token.colorPrimary,
      secondaryColor: token.colorBgContainer,
    },
    botBubble: {
      dangerouslySetInnerHtml: true, // Enable markdown rendering
    },
    chatWindow: {
      defaultOpen: false,
      showScrollbar: true,
    },
    chatButton: {
      // Using default icon
    },
    header: {
      title: '客服助手',
    },
  };

  React.useEffect(() => {
    // Apply dark theme class to body when theme changes
    const isDark = token.colorBgBase === '#141414';
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [token.colorBgBase]);

  return <ChatBot settings={settings} />;
};
