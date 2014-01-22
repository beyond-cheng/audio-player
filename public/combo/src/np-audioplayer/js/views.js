Y.AudioPlayer = Y.Base.create('audioPlayer', Y.View, [], {
	template: '<div class="audioplayer">' +
		'<div class="audioplayer-panel">' +
			'<div class="audioplayer-panel-hd">' +
				'<span>专辑</span>' +
				'<a class="audioplayer-panel-hd-switch"></a>' +
				'<span>歌词</span>' +
			'</div>' +
			'<div class="audioplayer-panel-bd"></div>' +
		'</div>' +
		'<div class="audioplayer-control">' +
			'<div class="audioplayer-control-main">' +
				'<div class="audioplayer-control-infos">' +
					'<a class="audioplayer-control-infos-avatar"><img src="" width="80px" height="80px"/></a>' +
					'<h3>情人 (原唱：Beyond)</h3>' +
					'<p>张学友</p>' +
					'<p>活出生命LIVE演唱会</p>' +
				'</div>' +
				'<div class="audioplayer-control-boardcast">' +
					'<div class="audioplayer-control-boardcast-content">' +
						'<div class="audioplayer-control-boardcast-row1">' +
							'<a class="audioplayer-control-boardcast-row1-prev"></a>' +
							'<a class="audioplayer-control-boardcast-row1-play"></a>' +
							'<a class="audioplayer-control-boardcast-row1-next"></a>' +
							'<span class="audioplayer-control-boardcast-row1-volume"></span>' +
						'</div>' +
						'<div class="audioplayer-control-boardcast-row2">' +
							'<span class="audioplayer-control-boardcast-row2-time1">00:00</span>' +
							'<span class="audioplayer-control-boardcast-row2-time2">05:21</span>' +
							'<div class="audioplayer-control-boardcast-row2-process"></div>' +
						'</div>' +
						'<div class="audioplayer-control-boardcast-row3">' +
							'<a class="audioplayer-control-boardcast-row3-repeat">单曲重复</a>' +
							'<a class="audioplayer-control-boardcast-row3-random">随机播放</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<a class="audioplayer-control-side">' +
				'<span class="audioplayer-control-arrow">' +
					'<span class="audioplayer-control-arrow-outside"></span>' +
					'<span class="audioplayer-control-arrow-inside"></span>' +
				'</span>' +
			'</a>' +
		'</div>' +
	'</div>',

	render: function () {
		var cont = this.get('container');

		cont.setHTML(this.template);
		return this;
	}
});