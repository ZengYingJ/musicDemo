const App = getApp();
const Config = require("../../config/Index.js");
const Utils = require("../../utils/Index.js");
const { To } = Utils;
Page({
    behaviors: [Utils.Behavior],
	data: {
		songList: [],
		songListInfo: null,
		navTopBarTitle: "",
	},
	onLoad(options){
		this.setData({ navTopBarTitle: options.title });
		this.getSongListDetail(options.id);
    },
    onShow(){
        this.isPlayingSong();
    },
	// 歌单详情
	getSongListDetail(id){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getSongListDetail}${id}?json=true` }));

			if(error){
				return Utils.WeChat.showModal({ message: "加载歌单列表详情失败" })
			}

			let list = res.list.list.info;
			let info = res.info.list;
			info.imgurl = info.imgurl.replace("{size}", 400);

			this.setData({
				songList: list,
				songListInfo: info,
			})
		})
	}
})