const App = getApp();
const Config = require("../../config/Index.js");
const Utils = require("../../utils/Index.js");
const { To } = Utils;
Page({
    behaviors: [Utils.Behavior],
	data: {
		newSongList: [],
		bannerList: [],
	},
	onLoad(){
		this.getNewSongList();
    },
    onShow(){
        this.isPlayingSong();
    },
	// 获取最新音乐列表
	getNewSongList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getNewSongList}` }));

			if(error){
				return Utils.WeChat.showModal({ message: "加载最新音乐列表失败" });
			}

			const { data, banner } = res;
			this.setData({
				newSongList: data,
				bannerList: banner
			}, resolve);
		})
	}
})