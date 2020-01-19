// components/NavTopBar/NavTopBar.js
const App = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		canBack: {
			type: Boolean,
			value: false,
		},
		title: {
			type: String,
			value: "",
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusBarHeight: App.globalData.statusBarHeight
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		navigateBack(){
			wx.navigateBack()
		}
	}
})
