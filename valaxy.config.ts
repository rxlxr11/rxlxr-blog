import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonLightGallery } from 'valaxy-addon-lightgallery'
import { addonWaline } from 'valaxy-addon-waline'


// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '任性来形容',
      cloud: {
        enable: true,
      },
    },

    pages: [
      // {
      //   name: '我的小伙伴们',
      //   url: '/links/',
      //   icon: 'i-ri-genderless-line',
      //   color: 'dodgerblue',
      // },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2023-7-27,
      beian: {
        enable: true,
        icp: '苏ICP备2023023927号',
      },
    },
  },

  unocss: { safelist },

  // 启用评论
  comment: {
    enable: true
  },

  addons: [
    addonLightGallery(),
    addonWaline({
      serverURL: 'https://waline233-six.vercel.app/',
    }),
  ],


  markdown: {
    // default material-theme-palenight
    theme: {
      // light: 'material-theme-lighter',
      // dark: 'material-theme-darker',
      // // light: 'material-theme-lighter',
      light: 'github-light',
      // // dark: 'material-theme-darker',
      dark: 'github-dark',
    },
    blocks: {
      tip: {
        icon: 'i-carbon-thumbs-up',
        text: 'ヒント',
        langs: {
          'zh-CN': '提示',
        },
      },
      warning: {
        icon: 'i-carbon-warning-alt',
        text: '注意',
      },
      danger: {
        icon: 'i-carbon-warning',
        text: '警告',
      },
      info: {
        text: 'información',
      },
    },
  },
})
