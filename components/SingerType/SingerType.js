// components/SingerType/SingerType.js
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
		navigateToSingerList(){
			const { classid, classname } = this.data.song;

			wx.navigateTo({
				url: `/pages/singerList/singerList?id=${classid}&title=${classname}`
			})
		}
	}
})
