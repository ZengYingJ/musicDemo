const App = getApp();
const Utils = require("../../utils/Index.js");
const Config = require("../../config/Index.js");
const { To } = Utils;

Page({
    behaviors: [Utils.Behavior],
	state: {
		pageNumber: 1,
		rankListTotal: 0,
		rankListCount: 0,
	},
	data: {
		navTopBarTitle: "",
		rankList: [],
		rankListInfo: null,
		rankId: -1,
	},
	onLoad(options){
		this.setData({
			rankId: options.id,
			navTopBarTitle: options.title,
		}, this.getRankListDetail)
    },
    onShow(){
        this.isPlayingSong();
    },
	// 获取歌单排行榜详情
	getRankListDetail(pageNumber = 1){
		const rankId = this.data.rankId;
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getRankListDetail}?rankid=${rankId}$page=${pageNumber}&json=true` }));

			if(error){
				return Utils.WeChat.showModal({ message: "加载歌单排行榜详情失败" });
			}

			const info = res.info;
			const list = res.songs.list;
			const total = res.songs.total;

			info.banner7url = info.banner7url.replace("{size}/", "");
			if(pageNumber === 1){
				this.state.rankListTotal = total;
				this.state.rankListCount = list.length;
				this.setData({
					rankList: [list],
					rankListInfo: info,
				})
			}else{
				this.state.rankListCount += list.length;
				this.setData({
					[`rankList[${pageNumber - 1}]`]: list
				})
			}
			this.state.pageNumber = pageNumber;
			resolve();
		})
	},

	onReachBottom(){
		if(this.state.rankListTotal > this.state.rankListCount){
			this.getRankListDetail(this.state.pageNumber + 1);
		}
	}
})