import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  codeHeightLimit: 300,
  url: 'http://www.rxlxr.com/',
  lang: 'zh-CN',
  title: 'rxlxr的博客',
  author: {
    name: 'rxlxr',
    avatar: 'http://www.rxlxr.com/images/user/avatar.png',
  },
  favicon: 'https://www.yunyoujun.cn/favicon.svg',
  subtitle:'任性来形容',
  description: '生活不易,阿荣卖艺',
  // bg_image: {
  //   enable: true,
  //   url: 'http://www.rxlxr.com/images/user/back4.png',
  //   dark: 'http://www.rxlxr.com/images/user/back3.png',
  // },
  social: [
// {
    //   name: 'RSS',
    //   link: '/atom.xml',
    //   icon: 'i-ri-rss-line',
    //   color: 'orange',
    // },
    {
      name: 'QQ',
      link: 'tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=2918423368&website=www.oicqzone.com',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/rxlxr11',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    // {
    //   name: '微博',
    //   link: 'https://weibo.com/jizhideyunyoujun',
    //   icon: 'i-ri-weibo-line',
    //   color: '#E6162D',
    // },
    // {
    //   name: '豆瓣',
    //   link: 'https://www.douban.com/people/yunyoujun/',
    //   icon: 'i-ri-douban-line',
    //   color: '#007722',
    // },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=433188664',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '知乎',
      link: 'https://www.zhihu.com/people/yao-jian-pan-da-gun',
      icon: 'i-ri-zhihu-line',
      color: '#0084FF',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/353516518',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    //{
    //   name: '微信公众号',
    //   link: 'https://cdn.yunyoujun.cn/img/about/white-qrcode-and-search.jpg',
    //   icon: 'i-ri-wechat-2-line',
    //   color: '#1AAD19',
    // },
    // {
    //   name: 'Twitter',
    //   link: 'https://twitter.com/YunYouJun',
    //   icon: 'i-ri-twitter-line',
    //   color: '#1da1f2',
    // },
    // {
    //   name: 'Telegram Channel',
    //   link: 'https://t.me/elpsycn',
    //   icon: 'i-ri-telegram-line',
    //   color: '#0088CC',
    // },
    // {
    //   name: 'E-Mail',
    //   link: 'mailto:me@yunyoujun.cn',
    //   icon: 'i-ri-mail-line',
    //   color: '#8E71C1',
    // },
    // {
    //   name: 'Travelling',
    //   link: 'https://www.travellings.cn/go.html',
    //   icon: 'i-ri-train-line',
    //   color: 'var(--va-c-text)',
    // },
  ],

  // 启用评论
  comment: {
    enable: true
  },

  search: {
    enable: false,
  },



  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: 'http://www.rxlxr.com/images/pay/alipay.png',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'http://www.rxlxr.com/images/pay/qq.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'http://www.rxlxr.com/images/pay/wechat.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
