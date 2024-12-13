import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "InfoKeyMind",
  // description: "一个AI知识库",
  description: "AI-Powered Knowledge Base",  
  head: [['link', { rel: 'icon', href: 'icon.png' }]],
  lang: 'en-US',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/public/icon.png',
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
      { text: 'Pricing', link: 'https://infokeymind.com/app/pricing' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright'
    }
  }
})
