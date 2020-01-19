// components/SongRankCard/SongRankCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		song: {
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
		navigateToRankDetail(){
			const { rankid, rankname } = this.data.song;
			wx.navigateTo({
				url: `/pages/rankDetail/rankDetail?id=${rankid}&title=${rankname}`
			})
		}
	}
})
