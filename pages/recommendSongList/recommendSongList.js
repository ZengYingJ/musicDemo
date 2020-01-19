const App = getApp();
const Config = require("../../config/Index.js");
const Utils = require("../../utils/Index.js");
const { To } = Utils;
Page({
    behaviors: [Utils.Behavior],
	state: {
		pageNumber: 1,
		recommendSongListTotal: 0,
		currentSongListCount: 0,
	},
	data: {
		pageNavBarTop: App.globalData.pageNavBarTop,
		recommendSongList: [],
	},
	onLoad(){
		this.getRecommendSongList();
    },
    onShow(){
        this.isPlayingSong();
    },
	getRecommendSongList(pageNumber = 1){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getRecommendSongList}&page=${pageNumber}` }));

			if(error)return Utils.WeChat.showModal({ content: "加载推荐歌单失败" });

			let list = res.plist.list.info;
			list.forEach(item => {
				item.imgurl = item.imgurl.replace("{size}", 400);
				if(item.playcount > 10000){
					item.playcount = (item.playcount / 10000).toFixed(2) + "万";
				}
			})

			if(pageNumber === 1){
				list = list.slice(6);
				this.state.recommendSongListTotal = res.plist.list.total;
				this.state.currentSongListCount = list.length;
				this.setData({ recommendSongList: [list] });
			}else{
				this.state.currentSongListCount += list.length;
				this.setData({
					[`recommendSongList[${pageNumber - 1}]`]: list
				})
			}
			this.state.pageNumber = pageNumber;
			resolve();
		})
	},
	onReachBottom(){
		if(this.state.recommendSongListTotal > this.data.recommendSongList.length){
			this.getRecommendSongList(this.state.pageNumber + 1);
		}
	}
})