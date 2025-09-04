帮我生成一个去水印下载的网站，需求如下：
1. 暂时不需登录注册，只加一个固定的密码验证，密码 123456
2. 我们需要一个交互界面，可以粘贴分享链接，用户粘贴的链接如下 “抖音链接:4.66 EHI:/ 11/14 E@u.Fh 地表最强壮汉海钓深海巨物 # 海钓 # 海钓船钓 # 钓鱼  https://v.douyin.com/mumWz79W78A/ 复制此链接，打开Dou音搜索，直接观看视频！”，需要通过正则提取出http 或者https链接
3. 有一个开始解析按钮，用户点击开始解析就可以根据api返回的数据,展示解析的标题、视频地址、封面地址，并预览封面
4. 可以下载视频和封面
5. 这是api地址:https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk?ak=e1b3b4dc46004f0ea1166bc14ca21965&link= https://v.douyin.com/mumWz79W78A/
6. content中的cover是封面字段，url是视频或者图片链接，你需要通过前𧍒的方式下载
7. 这是api返回的数据结构：
  {
   "accessToken": "",
   "code": "10000",
   "msg": "成功!",
   "content": {
   "author": "",
   "avatar": "",
   "cover": "https://p3-sign.douyinpic.com/tos-cn-i-0813/o8gPwIjEgAaiAgBGCyCyxlx2oIlAxv8iAAILX~tplv-dy-resize-walign-adapt-aq:540:q75.jpeg?lk3s=138a59ce&x-expires=1758178800&x-signature=rZiBx96XE%2BFJXtw3BN9i1rmYVqA%3D&from=327834062&s=PackSourceEnum_AWEME_DETAIL&se=false&sc=cover&biz_tag=aweme_video&l=20250904150027F312C394EC6B37AC0C8D",
   "coverList": [],
   "headUrl": "",
   "imageList": [],
   "likeNum": 0,
   "msg": "",
   "originText": "https://v.douyin.com/mumWz79W78A/",
   "shortUrl": "https://v.douyin.com/mumWz79W78A/",
   "shuiYinPlatform": null,
   "success": true,
   "title": "地表最强壮汉海钓深海巨物 #海钓 #海钓船钓 #钓鱼",
   "type": "VIDEO",
   "url": "https://v11-default.365yg.com/d4e6db3165b9b13880d33d94c3106ca2/68b9480f/video/tos/cn/tos-cn-ve-15/o4ARxF0mbsfADmQI9fHBZQA7gCE8AmBEKou7Ix/?a=2011&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&cv=1&br=2417&bt=2417&cs=0&ds=3&ft=aT_7TQQqUYqfJEZPo0OW_QYaUqiXgH0iRVJE4eC7MCPD-Ipz&mime_type=video_mp4&qs=0&rc=NmRlN2dmMzQ5ZjQ2OGdkOUBpamRpa3c5cnNzNTMzNGkzM0BgLzIxMGNjXjExNmJeNi0vYSNsNXNzMmRrYWxhLS1kLS9zcw%3D%3D&btag=80000e00030000&dy_q=1756969227&feature_id=fea919893f650a8c49286568590446ef&l=202509041500272649B4CEB2434DB0B5BC",
   "videoList": []
   },
   "timestamp": 1756969227756
  }