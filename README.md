站点介绍：

前端环境： YUI3作为前端js框架，js源文件在文件夹public/combo/src中，遵循前端的模块化开发的规则，一个模块对应一个js文件，使用了shifter压缩工具，压缩拼合后的js代码在文件夹public/combo/build中。 前端模板采用handlebars模板，理由是YUI3内部支持handlebars解析，而且相对Jade更符合html风格，语法清晰易懂。 前端的文件目录基本遵从Expressjs框架的原始目录，views存放html模版，public存放公共资源和js、css文件，models存放数据文件。

后端环境： 后端使用nodejs + Expressjs框架，没有使用数据库，数据以文件形式存储（存在models文件中）。主要功能有：处理各种请求，权限控制，js文件combo，渲染前端模板等。登陆信息存储在内存中，目前只支持单用户登陆，且登陆信息保存时间为10分钟，过期需重新登陆。

音乐播放器介绍： 播放器引擎用的是html5的audio标签，所以不支持旧版IE哦。实现了专辑选择、歌曲选择、上一曲、下一曲、随机播放、单曲循环、歌词显示等功能。

代码托管：https://github.com/beyond-cheng/newproject