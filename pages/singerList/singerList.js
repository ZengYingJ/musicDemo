const App = getApp();
const Utils = require("../../utils/Index.js");
const Config = require("../../config/Index.js");
const { To } = Utils;

Page({
    behaviors: [Utils.Behavior],
	state: {
		singerListTotal: 0,
		singerListCount: 0,
		pageNumber: 1,
	},
	data: {
		navTopBarTitle: "",
		singerList: [],
		singerTypeId: -1,
	},
	onLoad(options){
		this.setData({
			navTopBarTitle: options.title,
			singerTypeId: options.id,
		}, this.getSingerList)
    },
    onShow(){
        this.isPlayingSong();
    },
	// 获取类型歌手列表
	getSingerList(pageNumber = 1){
		const id = this.data.singerTypeId;
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getSingerList}${id}?json=true&page=${pageNumber}` }));

			if(error){
				return Utils.WeChat.showModal({ content: "加载歌手列表失败" });
			}

			const list = res.singers.list.info;
			list.forEach(item => {
				item.imgurl = item.imgurl.replace("{size}", 400);
			})

			if(pageNumber === 1){
				this.state.singerListTotal = res.singers.list.total;
				this.state.singerListCount = list.length;
				this.setData({
					singerList: [list]
				})
			}else{
				this.state.singerListCount += list.length;
				this.setData({
					[`singerList[${pageNumber - 1}]`]: list
				})
			}

			this.state.pageNumber = pageNumber;
			resolve();
		})
	},
	onReachBottom(){
		if(this.state.singerListCount < this.state.singerListTotal){
			this.getSingerList(this.state.pageNumber + 1);
		}
	}
})