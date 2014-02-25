var L = Y.Lang;

Y.AlbumList = Y.Base.create('albumList', Y.ModelList, [Y.NPModel.Sync], {
	apis: {
		read: '/api/albums'
	},
	model: Y.Album
}, {
	ATTRS: {
		active_album: {value: null},				//当前播放专辑
		default_alubmIndex: {value: 0}				//默认播放专辑索引
	}
});

Y.AudioList = Y.Base.create('audioList', Y.ModelList, [Y.NPModel.Sync], {
	apis: {
		read: '/api/albums/{id}'
	},
	buildURL: function (action) {
		return L.sub(this.apis[action], {
			id: this.get('album_id')
		});
	},
	model: Y.Audio
}, {
	ATTRS: {
		album_id: {value: null},
		playing_audios: {value: []},			//马上要播放的歌单列表
		playing_audioIndex: {value: 0},			//马上要播放的歌曲在playing_audios中的索引
		active_audioIndex: {value: null}		//当前播放歌曲在audioList中的索引
	}
});

function formatTime(value) {
	var x, y, html = '';

	if(value > 60) {
		x = Math.floor(value / 60);
		if(x >= 10) {
			html += x;
		} else {
			html += '0' + x;
		}
		html += ':';
		y = value % 60;
		if(y >= 10) {
			html += y;
		} else {
			html += '0' + y;
		}
	} else if(value >= 10) {
		html += '00:' + value;
	} else {
		html += '00:0' + value;
	}

	return html;
}