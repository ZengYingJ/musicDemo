// components/SingerCard/SingerCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		singer: {
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
		navigateToSingerDetail(){
			const { singername, singerid } = this.data.singer;
			wx.navigateTo({
				url: `/pages/singerDetail/singerDetail?title=${singername}&id=${singerid}`
			})
		}
	}
})
