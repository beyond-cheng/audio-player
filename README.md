<h2>启动</h2>
<p>项目后台驱动用的是 nodejs + expressjs, 所以本地运行起来很简单</p>
<pre lang="shell">
	<code>
		$ npm i
		$ node app
	</code>
</pre>
<h2>前端环境</h2>
<p>YUI3作为前端js框架，js源文件在文件夹public/combo/src中，遵循前端的模块化开发的规则，一个模块对应一个js文件。并使用了shifter工具，压缩拼合后的js代码在文件夹public/combo/build中。 </p>
<p>模板采用handlebars，理由是YUI3内部支持handlebars解析，而且相对Jade更符合html风格，语法清晰易懂。 </p>
<p>前端的文件目录基本遵从Expressjs框架的原始目录，views存放html模版，public存放公共资源和js、css文件，models存放数据文件。</p>
<h2>后端环境</h2>
<p>后端使用nodejs + Expressjs框架，没有使用数据库，数据以文件形式存储（存在models文件中）。</p>
<p>实现的主要功能有：处理各种请求，权限控制，js文件combo，渲染前端模板等。</p>
<p>登陆信息存储在内存中，目前只支持单用户登陆，且登陆信息保存时间为10分钟，过期需重新登陆。</p>
<h2>音乐播放器</h2>
<p>页面主要功能是一个音乐播放器，用的是html5的audio标签，所以不支持旧版IE哦（第一次加载会比较慢，需要耐心等待）。实现了专辑选择、歌曲选择、上一曲、下一曲、随机播放、单曲循环、歌词滚动显示等功能。</p>