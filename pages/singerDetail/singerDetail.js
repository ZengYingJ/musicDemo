const App = getApp();
const Utils = require("../../utils/Index.js");
const Config = require("../../config/Index.js");
const { To } = Utils;

Page({
    behaviors: [Utils.Behavior],
	state: {
		pageNumber: 1,
		songTotal: 0,
		songCount: 0,
	},
	data: {
		songList: [],
		singerInfo: null,
		singerIntroEllipsis: true,
	},
	onLoad(options){
		this.setData({
			navTopBarTitle: options.title,
			singerId: options.id,
		}, this.getSingerDetail)
    },
    onShow(){
        this.isPlayingSong();
    },
	// 获取歌手个人信息
	getSingerDetail(pageNumber = 1){
		const singerId = this.data.singerId;
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({
				url: `${Config.Api.getSingerDetail}${singerId}&json=true&page=${pageNumber}`,
			}))

			if(error){
				return Utils.WeChat.showModal({ content: "加载歌手个人信息失败" });
			}

			const singerInfo = res.info;
			const list = res.songs.list;
			const total = res.songs.total;
			singerInfo.imgurl = singerInfo.imgurl.replace("{size}", 400);

			if(pageNumber === 1){
				this.state.songTotal = total;
				this.state.songCount = list.length;
				this.setData({
					songList: [list],
					singerInfo: singerInfo
				})
			}else{
				this.state.songCount += list.length;
				this.setData({
					[`songList[${pageNumber - 1}]`]: list
				})
			}

			this.state.pageNumber = pageNumber;
			resolve();
		})
	},

	switchSingerIntro(){
		this.setData({
			singerIntroEllipsis: !this.data.singerIntroEllipsis
		})
	},

	onReachBottom(){
		if(this.state.songCount < this.state.songTotal){
			this.getSingerDetail(this.state.pageNumber + 1);
		}
	}
})