Y.AudioPlayer = Y.Base.create('audioPlayer', Y.View, [], {
	template: Y.Handlebars.compile('<div class="audioplayer">' +
		'<div class="audioplayer-panel">' +
			'<div class="audioplayer-panel-hd">' +
				'<a class="audioplayer-panel-hd-album">专辑</a>' +
				'<span class="audioplayer-panel-hd-switch">' +
					'<span class="audioplayer-panel-hd-switch-roller"></span>' +
				'</span>' +
				'<a class="audioplayer-panel-hd-lyric">歌词</a>' +
			'</div>' +
			'<div class="audioplayer-panel-bd"></div>' +
		'</div>' +
		'<div class="audioplayer-control">' +
			'<div class="audioplayer-control-main">' +
				'<div class="audioplayer-control-infos">{{#album}}' +
					'<a class="audioplayer-control-infos-avatar"><img src="{{{avatar}}}" width="80px" height="80px"/></a>' +
					'<h3>xxx</h3>' +
					'<p>yyy</p>' +
					'<p>{{{name}}}</p>' +
				'{{/album}}</div>' +
				'<div class="audioplayer-control-boardcast">' +
					'<div class="audioplayer-control-boardcast-content">' +
						'<div class="audioplayer-control-boardcast-row1">' +
							'<a class="audioplayer-control-boardcast-row1-prev"></a>' +
							'<a class="audioplayer-control-boardcast-row1-play"></a>' +
							'<a class="audioplayer-control-boardcast-row1-next"></a>' +
							'<div class="audioplayer-control-boardcast-row1-volume">' +
								'<div class="audioplayer-control-boardcast-row1-volume-inner" style="width:80px;"></div>' +
								'<span class="audioplayer-control-boardcast-row1-volume-roller" style="left:70px;"></span>' +
							'</div>' +
						'</div>' +
						'<div class="audioplayer-control-boardcast-row2">' +
							'<span class="audioplayer-control-boardcast-row2-time1">00:00</span>' +
							'<span class="audioplayer-control-boardcast-row2-time2">05:21</span>' +
							'<div class="audioplayer-control-boardcast-row2-process">' +
								'<div class="audioplayer-control-boardcast-row2-process-value" style=""></div>' +
							'</div>' +
						'</div>' +
						'<div class="audioplayer-control-boardcast-row3">' +
							'<a class="audioplayer-control-boardcast-row3-repeat">单曲重复</a>' +
							'<a class="audioplayer-control-boardcast-row3-stochastic">随机播放</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<a class="audioplayer-control-side">' +
				'<span class="audioplayer-control-side-arrow"></span>' +
				/*'<span class="audioplayer-control-arrow">' +
					'<span class="audioplayer-control-arrow-outside"></span>' +
					'<span class="audioplayer-control-arrow-inside"></span>' +
				'</span>' +*/
			'</a>' +
		'</div>' +
	'</div>' +
	'<audio id="audios-engine"><source /></audio>'),
	template_info: Y.Handlebars.compile('{{#album}}<a class="audioplayer-control-infos-avatar"><img src="{{{avatar}}}" width="80px" height="80px"/></a>{{/album}}' +
	'{{#audio}}<h3>{{{name}}}</h3>' +
	'<p>{{{author}}}</p>{{/audio}}' +
	'{{#album}}<p>{{{name}}}</p>{{/album}}'),

	events: {
		'.audioplayer-control-side': {
			click: 'toggleSideExpand'
		},
		'.audioplayer-control-infos-avatar': {
			click: 'togglePanelExpand'
		},
		'.audioplayer-panel-hd-album': {
			click: 'showAlbumList'
		},
		'.audioplayer-panel-hd-lyric': {
			click: 'showLyric'
		},
		'.audioplayer-control-boardcast-row3-repeat': {
			click: 'handleRepeat'
		},
		'.audioplayer-control-boardcast-row3-stochastic': {
			click: 'handleStochastic'
		},
		'.audioplayer-control-boardcast-row1-play': {
			click: 'playAudioEngine'
		},
		'.audioplayer-control-boardcast-row1-prev': {
			click: 'playPrevAudio'
		},
		'.audioplayer-control-boardcast-row1-next': {
			click: 'playNextAudio'
		},
		'.audioplayer-control-boardcast-row1-volume-roller': {
			mousedown: 'handleVolumeMouseDown'
		}
	},

	initializer: function () {
		var audioList = this.get('audioList'),
			self = this;

		window.onmouseup = function () {
			window.onmousemove = null;
		};

		this._volumeObj = {
			offsetMinLeft: -10,
			offsetMaxLeft: 90
		};
	},

	handleVolumeMouseDown: function (e) {
		var self = this,
			rollerNode = this.get('container').one('.audioplayer-control-boardcast-row1-volume-roller'),
			processBar = this.get('container').one('.audioplayer-control-boardcast-row1-volume-inner');

		Y.mix(this._volumeObj, {
			pageX: e.pageX,
			left: parseInt(rollerNode.getStyle('left')),
			rollerNode: rollerNode,
			processBar: processBar
		});

		window.onmousemove = function (e) {
			self.handleVolume(e);
		};
	},

	handleVolume: function (e) {
		var volumeObj = this._volumeObj,
			x = e.pageX - volumeObj.pageX,
			offsetLeft = volumeObj.left + x,
			offsetWidth = offsetLeft - volumeObj.offsetMinLeft;

		if(offsetLeft < volumeObj.offsetMinLeft || offsetLeft > volumeObj.offsetMaxLeft) {
			return false;
		}
		volumeObj.rollerNode.setStyle('left', offsetLeft);
		volumeObj.processBar.setStyle('width', offsetWidth);
		this.audiosEngine.volume = offsetWidth / (volumeObj.offsetMaxLeft - volumeObj.offsetMinLeft);
	},

	initVolume: function () {
		this.audiosEngine.volume = 0.8;
	},

	toggleSideExpand: function (e) {
		var cont = this.get('container'),
			audioplayerNode = cont.one('.audioplayer'),
			audioplayerPanelNode = cont.one('.audioplayer-panel');

		if(audioplayerNode.hasClass('audioplayer-hide')) {
			audioplayerPanelNode.removeClass('audioplayer-panel-hide');
		}
		audioplayerNode.toggleClass('audioplayer-hide');
	},

	togglePanelExpand: function () {
		var node = this.get('container').one('.audioplayer-panel');

		node.toggleClass('audioplayer-panel-hide');
	},

	playAudioEngine: function (e) {
		var audiosEngine = this.audiosEngine,
			audioList = this.get('audioList'),
			albumList = this.get('albumList'),
			node = e.currentTarget;

		if(node.hasClass('audioplayer-control-boardcast-row1-pause')) {
			audiosEngine.pause();
			this.toPlay('pause');
		} else {
			if(audiosEngine.src) {
				audiosEngine.play();
				this.toPlay('play');
			} else {
				//未加载专辑歌单
				if(audioList.get('album_id') === null) {
					//加载默认专辑的歌单
					var defaultAlubmIndex = albumList.get('default_alubmIndex'),
						albumId = albumList.item(defaultAlubmIndex).get('id');

					audioList.set('album_id', albumId).load(function (err) {
						if(!err) {
							albumList.getById(albumId).set('audio_collection', audioList.toJSON());
							albumList.set('active_album', albumList.getById(albumId));
							audioList.set('active_audioIndex', defaultAlubmIndex + '-0', {smooth: false});
						}
					});
				} else {
					//设置active_album 和 active_audioIndex
					var activeAlbum = albumList.getById(audioList.get('album_id'));
					albumList.set('active_album', activeAlbum);
					audioList.set('active_audioIndex', albumList.indexOf(activeAlbum) + '-0', {smooth: false});
				}
			}
		}

		node.toggleClass('audioplayer-control-boardcast-row1-pause');
	},

	playPrevAudio: function () {
		if(this.get('audioList').get('active_audioIndex') === null) {
			return false;
		}

		this.get('container').one('.audioplayer-control-boardcast-row1-play').addClass('audioplayer-control-boardcast-row1-pause');

		var audioList = this.get('audioList'),
			albumList = this.get('albumList'),
			playingAudioIndex = audioList.get('playing_audioIndex'),
			playingAudios = audioList.get('playing_audios'),
			audioCollection = albumList.get('active_album').get('audio_collection'),
			activeAudioIndex;
		
		//更新playing_audioIndex
		audioList.set('playing_audioIndex', (playingAudioIndex - 1 + playingAudios.length) % playingAudios.length);

		//更新active_audioIndex
		activeAudioId = playingAudios[audioList.get('playing_audioIndex')].id;
		for(var i = 0, len = audioCollection.length; i < len; i++) {
			if(audioCollection[i].id === activeAudioId) {
				activeAudioIndex = i;
				break;
			}
		}

		//更新active_audioIndex
		activeAudio = playingAudios[audioList.get('playing_audioIndex')];
		audioList.set('active_audioIndex', audioList.get('active_audioIndex').split('-')[0] + '-' + activeAudioIndex, {smooth: true});
	},

	playNextAudio: function () {
		if(this.get('audioList').get('active_audioIndex') === null) {
			return false;
		}

		this.get('container').one('.audioplayer-control-boardcast-row1-play').addClass('audioplayer-control-boardcast-row1-pause');

		var audioList = this.get('audioList'),
			albumList = this.get('albumList'),
			playingAudioIndex = audioList.get('playing_audioIndex'),
			playingAudios = audioList.get('playing_audios'),
			audioCollection = albumList.get('active_album').get('audio_collection'),
			activeAudioIndex;

		//更新playing_audioIndex
		audioList.set('playing_audioIndex', (playingAudioIndex + 1) % playingAudios.length);

		//更新active_audioIndex
		activeAudioId = playingAudios[audioList.get('playing_audioIndex')].id;
		for(var i = 0, len = audioCollection.length; i < len; i++) {
			if(audioCollection[i].id === activeAudioId) {
				activeAudioIndex = i;
				break;
			}
		}

		audioList.set('active_audioIndex', audioList.get('active_audioIndex').split('-')[0] + '-' + activeAudioIndex, {smooth: true});
	},

	toPlay: function (action) {
		var cont = this.get('container'),
			// barWidth = cont.one('.audioplayer-control-boardcast-row2-process').getAttribute('width'),
			barWidth = 230,
			node = cont.one('.audioplayer-control-boardcast-row2-process-value'),
			audioList = this.get('audioList'),
			activeAudioObj = audioList.get('playing_audios')[audioList.get('playing_audioIndex')],
			duration = activeAudioObj.duration,
			self = this;

		if(action === 'play') {
			if(this.timer) {
				clearInterval(this.timer);
			}
			this.timer = setInterval(function () {
				var currentTime = self.audiosEngine.currentTime,
					p = currentTime / duration;

				node.setAttribute('style', 'width: ' + p * barWidth + 'px;');
				cont.one('.audioplayer-control-boardcast-row2-time1').setHTML(formatTime(Math.round(currentTime)));
			}, 1000);
		} else if (action === 'pause') {
			clearInterval(this.timer);
		}
	},

	resetProcess: function () {
		var cont = this.get('container'),
			activeAudioObj = this.getActiveAudioObj();

		cont.one('.audioplayer-control-boardcast-row2-time1').setHTML('00:00');
		cont.one('.audioplayer-control-boardcast-row2-time2').setHTML(formatTime(activeAudioObj.duration));
		cont.one('.audioplayer-control-boardcast-row2-process-value').setAttribute('style', 'width: 0px;');
	},

	getActiveAudioObj: function () {
		var activeAlbum = this.get('albumList').get('active_album');

		if(activeAlbum === null) {return null;}

		var audioCollection = activeAlbum.get('audio_collection'),
			activeAudioIndex = +this.get('audioList').get('active_audioIndex').split('-')[1];

		return audioCollection[activeAudioIndex];
	},

	//创建播放歌单
	createCurrentAudioList: function () {
		var audioList = this.get('audioList'),
			activeAlbum = this.get('albumList').get('active_album'),
			audioCollection = activeAlbum.get('audio_collection'),
			activeAudioIndex = +audioList.get('active_audioIndex').split('-')[1],
			size = audioCollection.length, c = [];

		//初始化 playing_audioIndex
		audioList.set('playing_audioIndex', 0);

		Y.Array.each(audioCollection, function (item, index) {
			if(index < activeAudioIndex) {
				c[size - activeAudioIndex + index] = item;
			} else {
				c[index - activeAudioIndex] = item;
			}
		});

		//随机播放，将顺序打乱
		if(this.get('isStochastic')) {
			var firstAudio = c.shift();

			c = this.resortArray(c);
			c.unshift(firstAudio);
		}

		audioList.set('playing_audios', c);
	},

	loadAudio: function () {
		var audioList = this.get('audioList'),
			playingAudioIndex = audioList.get('playing_audioIndex'),
			playingAudios = audioList.get('playing_audios');

		this.audiosEngine.src = playingAudios[playingAudioIndex].src;
	},

	bindAudioEngine: function () {
		var audiosEngine = this.audiosEngine,
			albumList = this.get('albumList'),
			audioList = this.get('audioList'),
			self = this;

		audiosEngine.addEventListener('ended', function (e) {
			//不单曲重复的情况
			if(!self.get('isRepeatOne')) {
				var playingAudioIndex = audioList.get('playing_audioIndex'),
					playingAudios = audioList.get('playing_audios'),
					audioCollection = albumList.get('active_album').get('audio_collection'),
					activeAudioIndex;

				//更新playing_audioIndex
				audioList.set('playing_audioIndex', (playingAudioIndex + 1) % playingAudios.length);

				//更新active_audioIndex
				activeAudioId = playingAudios[audioList.get('playing_audioIndex')].id;
				for(var i = 0, len = audioCollection.length; i < len; i++) {
					if(audioCollection[i].id === activeAudioId) {
						activeAudioIndex = i;
						break;
					}
				}

				audioList.set('active_audioIndex', audioList.get('active_audioIndex').split('-')[0] + '-' + activeAudioIndex, {smooth: true});
			} else {
				self.audiosEngine.play();
			}
		}, false);

		audioList.after('active_audioIndexChange', function (e) {
			var activeAudioIndex = +e.newVal.split('-')[1],
				// activeAudio = audioList.item(+e.newVal.split('-')[1]),
				infosNode = self.get('container').one('.audioplayer-control-infos'),
				album = albumList.get('active_album'),
				o = {};

			//更新html
			o.audio = album.get('audio_collection')[activeAudioIndex];
			o.album = album.toJSON();
			self.resetProcess();
			infosNode.setHTML(self.template_info(o));

			//不是平滑过渡到下一曲
			if(!e.smooth) {
				//更新播放列表，播放选中歌曲
				self.createCurrentAudioList();
			}

			self.loadAudio()
			self.audiosEngine.play();
			self.toPlay('play');

			if(self.lyricView) {
				self.lyricView.set('lyric', o.audio.lyric);
			}
		});
	},

	resortArray: function (arr) {
		if(arr.length <= 1) {return arr;}

		var newArr = [];

		for(var i = 0, len = arr.length; i < len; i++) {
			var randNum = Math.floor(Math.random() * arr.length),
				randEle = arr.splice(randNum, 1)[0];

			newArr.push(randEle);
		}
		return newArr;
	},

	handleRepeat: function (e) {
		var node = e.currentTarget;

		if(node.hasClass('audioplayer-control-boardcast-row3-repeat-active')) {
			this.set('isRepeatOne', false);

			//取消单曲重复，此时回复顺序轮询播放
			if(this.get('audioList').get('active_audioIndex') !== null) {
				this.createCurrentAudioList();
			}
		} else {
			this.set('isRepeatOne', true);
			this.set('isStochastic', false);
			this.get('container').one('.audioplayer-control-boardcast-row3-stochastic').removeClass('audioplayer-control-boardcast-row3-stochastic-active');
		}

		node.toggleClass('audioplayer-control-boardcast-row3-repeat-active');
	},

	handleStochastic: function (e) {
		var node = e.currentTarget;

		if(node.hasClass('audioplayer-control-boardcast-row3-stochastic-active')) {
			this.set('isStochastic', false);
		} else {
			this.set('isStochastic', true);
			this.set('isRepeatOne', false);
			this.get('container').one('.audioplayer-control-boardcast-row3-repeat').removeClass('audioplayer-control-boardcast-row3-repeat-active');
		}

		node.toggleClass('audioplayer-control-boardcast-row3-stochastic-active');
		//重新创建歌单
		if(this.get('audioList').get('active_audioIndex') !== null) {
			this.createCurrentAudioList();
		}
	},

	showAlbumList: function () {
		var cont = this.get('container'),
			self = this, albumListView;

		if(this.albumListView) {
			albumListView = this.albumListView ;
		} else {
			albumListView = this.albumListView = new AlbumListView({albumList: this.get('albumList'), audioList: this.get('audioList')});
		}

		cont.one('.audioplayer-panel-hd-switch').removeClass('audioplayer-panel-hd-switch-right');

		cont.one('.audioplayer-panel-bd').setHTML(albumListView.render().get('container'));

		albumListView.on('audioRestartChange', function () {
			self.resetProcess();
		});
	},

	showLyric: function () {
		var cont = this.get('container'),
			activeAudioObj = this.getActiveAudioObj(),
			lyric = activeAudioObj ? activeAudioObj.lyric : null,
			lyricView;

		if(this.lyricView) {
			lyricView = this.lyricView;
		} else {
			lyricView = this.lyricView = new LyricView({lyric: lyric});
		}

		cont.one('.audioplayer-panel-hd-switch').addClass('audioplayer-panel-hd-switch-right');

		cont.one('.audioplayer-panel-bd').setHTML(lyricView.render().get('container'));
	},

	render: function () {
		var albumList = this.get('albumList'),
			album = albumList.item(albumList.get('default_alubmIndex')),
			cont = this.get('container'),
			data = {};

		data.album = album.toJSON();

		cont.setHTML(this.template(data));
		this.audiosEngine = document.getElementById('audios-engine');
		this.showAlbumList();
		this.bindAudioEngine();
		this.initVolume();
		return this;
	}
}, {
	ATTRS: {
		isRepeatOne: {value: false},			//是否为单曲重复
		isStochastic: {value: false},			//是否为随机播放
		audioList: {value: new Y.AudioList()}
	}
});

var AlbumListView = Y.Base.create('albumListView', Y.View, [], {
	template1: Y.Handlebars.compile('<ul class="audioplayer-panel-albumlist">{{#albumList}}' +
		'<li class="audioplayer-panel-album">' +  
			'<a class="audioplayer-panel-album-avatar" data-id="{{{id}}}">' +
				'<img src="{{{avatar}}}" width="120" height="120"/>' +
			'</a>' +
			'<p class="audioplayer-panel-album-name">{{{name}}}' +
				'<span class="audioplayer-panel-album-num">({{{audio_num}}})</span>' +
			'</p>' +
		'</li>' +
	'{{/albumList}}</ul>'),

	template2: Y.Handlebars.compile('<table class="audioplayer-panel-songlist">{{#songList}}' +
		'<tr class="audioplayer-panel-song{{#if selected}} audioplayer-panel-song-selected{{/if}}{{#if even}} audioplayer-panel-song-even{{/if}}" data-index={{{index}}}><td>{{{num}}}</td><td>{{{name}}}</td><td>{{{duration}}}</td><td>{{{author}}}</td><td>{{#with belong_album}}{{{name}}}{{/with}}</td></tr>' +
	'{{/songList}}</table>' +
	'<p><button class="button-normal-s audioplayer-panel-songlist-back">返回</button></p>'),

	events: {
		'.audioplayer-panel-album-avatar': {
			click: 'showAudios'
		},
		'.audioplayer-panel-song': {
			mouseover: 'addSongHover',
			mouseout: 'removeSongHover',
			click: 'changeAudio'
		},
		'.audioplayer-panel-songlist-back': {
			click: 'trunBackToAlbums'
		}
	},

	initializer: function () {
		var audioList = this.get('audioList'),
			self = this;
		
		audioList.after('active_audioIndexChange', function () {
			if(self.get('activeTemplate') === 2) {
				self.renderTemplate2();
			}
		});
	},

	addSongHover: function (e) {
		e.currentTarget.addClass('audioplayer-panel-song-hover');
	},

	removeSongHover: function (e) {
		e.currentTarget.removeClass('audioplayer-panel-song-hover');
	},

	changeAudio: function (e) {
		var dataIndex = e.currentTarget.getAttribute('data-index'),
			albumList = this.get('albumList'),
			audioList = this.get('audioList');

		albumList.set('active_album', albumList.getById(audioList.get('album_id')));
		Y.one('.audioplayer-control-boardcast-row1-play').addClass('audioplayer-control-boardcast-row1-pause');

		if(audioList.get('active_audioIndex') === dataIndex) {
			document.getElementById('audios-engine').currentTime = 0;
			this.set('audioRestart', !this.get('audioRestart'));
		} else {
			audioList.set('active_audioIndex', dataIndex);
			this.renderTemplate2();
		}
	},

	showAudios: function (e) {
		var albumId = +e.currentTarget.getAttribute('data-id'),
			albumList = this.get('albumList'),
			audioList = this.get('audioList'),
			self = this;

		audioList.setAttrs({album_id: albumId}).load(function (err, res) {
			if(!err) {
				albumList.getById(albumId).set('audio_collection', audioList.toJSON());
				self.renderTemplate2();
			}
		});
	},

	trunBackToAlbums: function () {
		this.renderTemplate1();
	},

	renderTemplate1: function () {
		var cont = this.get('container'),
			albumList = this.get('albumList'),
			data = {};

		data.albumList = albumList.toJSON();

		cont.setHTML(this.template1(data));
		this.set('activeTemplate', 1);
	},

	renderTemplate2: function () {
		var cont = this.get('container'),
			audioList = this.get('audioList'),
			albumList = this.get('albumList'),
			activeAudioIndex = audioList.get('active_audioIndex'),
			activeAlbum = albumList.getById(audioList.get('album_id')),
			activeAlbumIndex = albumList.indexOf(activeAlbum),
			data = {};

		data.songList = Y.Array.map(audioList.toJSON(), function (item, index) {
			item.index = activeAlbumIndex + '-' + index;
			item.num = index + 1;
			item.even = index % 2 === 0;
			item.duration = formatTime(item.duration);
			if(activeAudioIndex !== null) {
				var arr = activeAudioIndex.split('-');
				if(+arr[0] === activeAlbumIndex && +arr[1] === index) {
					item.selected = true;
				}
			}
			return item;
		});

		cont.setHTML(this.template2(data));
		this.set('activeTemplate', 2);
	},

	render: function () {
		this.renderTemplate1();
		return this;
	}
}, {
	ATTRS: {
		activeTemplate: {value: null},
		audioRestart: {value: false}
	}
});

var LyricView = Y.Base.create('lyricView', Y.View, [], {
	template: '<div class="audioplayer-panel-lyric"></div>',

	initializer: function () {
		var self = this;

		this.after('lyricChange', function () {
			self.render();
		});
		this.audiosEngine = document.getElementById('audios-engine');
	},

	initScrollLyric: function () {
		var self = this,
			pNode = this.get('container').one('.audioplayer-panel-lyric'),
			nodes = pNode.all('p');

		if(this.timer) {
			clearInterval(this.timer);
		}

		this.timer = setInterval(function () {
			var currentTime = self.audiosEngine.currentTime;

			nodes.removeClass('audioplayer-panel-lyric-item-selected');

			for(var i = 0, len = nodes.size(); i < len; i++) {
				if(currentTime < +nodes.item(i).getAttribute('data-time')) {
					if(i === 0) {
						nodes.item(i).addClass('audioplayer-panel-lyric-item-selected');
					} else {
						nodes.item(i - 1).addClass('audioplayer-panel-lyric-item-selected');
						if(nodes.item(i - 1).get('offsetTop') > 240) {
							pNode.set('scrollTop', nodes.item(i - 1).get('offsetTop') - 240);
						}
						
					}
					break;
				}
			}
		}, 1000);
	},

	render: function () {
		var cont = this.get('container'),
			lyric = this.get('lyric'),
			html = '';

		if(lyric === null) {
			html = '<p class="audioplayer-panel-lyric-nonlyric">请先播放歌曲！</p>';
		} else {
			html = lyric.replace(/\[(.*?)\]([^\[]*)/g, function(all, a, b) {
				var arr = a.split(':'),
					seconds = (+arr[0]) * 60 + (+arr[1]);

				return '<p class="audioplayer-panel-lyric-item" data-time="' + seconds + '">' + b + '</p>';
			});
		}

		cont.setHTML(this.template);
		cont.one('.audioplayer-panel-lyric').setHTML(html);
		this.initScrollLyric();
		return this;
	}
}, {
	ATTRS: {
		lyric: {value: null}
	}
});