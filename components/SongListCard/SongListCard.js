// components/SongListCard/SongListCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		songList: {
			type: Object,
			value: null
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		navigateToSongListDetail(){
			console.log(this.data.songList);
			const { specialname, specialid } = this.data.songList;
			wx.navigateTo({
				url: `/pages/songListDetail/songListDetail?id=${specialid}&title=${specialname}`
			})
		}
	}
})
