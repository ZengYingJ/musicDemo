const App = getApp();
const Config = require("../../config/Index.js");
const Utils = require("../../utils/Index.js");
const { To } = Utils;
Page({
    behaviors: [Utils.Behavior],
	data: {
		pageNavBarTop: App.globalData.pageNavBarTop,
		tabbar: 0,
		tabBarList: ["推荐歌曲", "歌曲排行", "歌手分类"],
		recommendSongList: [],
		newSongList: [],
		songRankList: [],
		singerTypeList: [],
	},
	async onLoad(){
		await this.getRecommendSongList();
		await this.getNewSongList();
    },
    onShow(){
        this.isPlayingSong();
    },

	// 切换导航栏
	switchTabBar(event){
		const tab = event.currentTarget.dataset.tab;
		if(tab !== this.data.tabbar){
			switch(tab){
				case 0:
					if(this.data.recommendSongList.length && this.data.newSongList.length === 0){
						this.getRecommendSongList();
						this.getNewSongList();
					}
					break;
				case 1:
					if(this.data.songRankList.length === 0){
						this.getSongRankList();
					}
					break;
				case 2:
					if(this.data.singerTypeList.length === 0){
						this.getSingerTypeList();
					}
					break;
			}
			this.setData({ tabbar: tab });
		}
	},

	// 获取推荐歌单
	getRecommendSongList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: Config.Api.getRecommendSongList }));

			if(error)return Utils.WeChat.showModal({ content: "加载推荐歌单失败" });

			const list = res.plist.list.info.slice(0, 6);
			list.forEach(item => {
				item.imgurl = item.imgurl.replace("{size}", 400);
				if(item.playcount > 10000){
					item.playcount = (item.playcount / 10000).toFixed(2) + "万";
				}
			})

			this.setData({
				recommendSongList: list
			}, resolve)
		})
	},

	// 获取最新音乐
	getNewSongList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: Config.Api.getNewSongList }));

			if(error)return Utils.WeChat.showModal({ content: "加载最新音乐失败" });

			const list = res.data.slice(0, 4);
			this.setData({
				newSongList: list
			}, resolve);
		})
	},

	// 获取歌曲排行榜
	getSongRankList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: Config.Api.getSongRankList }));

			if(error)return Utils.WeChat.showModal({ content: "加载歌曲排行榜失败" });

			const list = res.rank.list;
			list.forEach(item => {
				item.imgurl = item.imgurl.replace("{size}/", "");
			})

			this.setData({
				songRankList: list
			}, resolve)
		})
	},

	// 获取歌手类型列表
	getSingerTypeList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: Config.Api.getSingerTypeList }));

			if(error)return Utils.WeChat.showModal({ content: "加载歌手类型列表失败" });
			
			const list = res.list;
			this.setData({
				singerTypeList: list
			}, resolve);
		})
    },
    
    // 播放音乐
    async playSong(){
        this.selectComponent("#AudioController").showModal();
    },

	// 前往更多推荐歌单 页面
	navigateToRecommendSongList(){
		wx.navigateTo({
			url: "/pages/recommendSongList/recommendSongList"
		})
	},
	// 前往最新音乐歌曲 页面
	navigateToNewSongList(){
		wx.navigateTo({
			url: "/pages/newSongList/newSongList"
		})
    },
    // 前往歌曲搜索 页面
    navigateToSongSearch(){
        wx.navigateTo({
            url: "/pages/songSearch/songSearch"
        })
    }
})