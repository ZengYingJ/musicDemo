const App = getApp();
const Config = require("../../config/Index.js");
const Utils = require("../../utils/Index.js");
const { To } = Utils;
Page({
    behaviors: [Utils.Behavior],
	state: {
		searchTotal: 0,
		searchCount: 0,
		pageNumber: 1,
	},
	data: {
		keyword: "周杰伦",
		hotSearchList: [],
        songList: [],
        searchSuccess: false,
	},
	onLoad(){
		this.getHotSearchList();
    },
    onShow(){
        this.isPlayingSong();
    },
	// 获取热门搜索
	getHotSearchList(){
		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getHotSearchList}?format=json&plat=0&count=30` }))

			if(error){
				return Utils.WeChat.showModal({ content: "加载热门搜索失败" });
			}

			const list = res.data.info;
			this.setData({
				hotSearchList: list
			})
		})
    },
    
    // 搜索内容输入监听
    keywordInputHandle(event){
        this.setData({ keyword: event.detail.value });
    },

    // 搜索按钮点击监听
    searchButtonHandle(){
        this.searchSong();
    },

	// 获取搜索歌曲
	searchSong(pageNumber = 1){

		const keyword = this.data.keyword;
		if(keyword.replace(/(^s*)|(s*$)/g, "").length === 0)return Utils.WeChat.showModal({ content: "你还未输入搜索内容，请确认输入后重试" });

		return new Promise(async resolve => {
			const [error, res] = await To(Utils.Ajax({ url: `${Config.Api.getSongBySearch}?format=json&keyword=${keyword}&page=${pageNumber}&pagesize=20&showtype=1` }))

			if(error){
				return Utils.WeChat.showModal({ content: "加载搜索结果列表失败" });
			}

			const list = res.data.info;
			const total = res.data.total;

			if(pageNumber === 1){
				this.state.searchTotal = total;
				this.state.searchCount = list.length;
				this.setData({
                    songList: [list],
                    searchSuccess: true,                    
				})
			}else{
				this.state.searchCount += list.length;
				this.setData({
                    [`songList[${pageNumber}]`]: list,
                    searchSuccess: true,
				})
			}
			this.state.pageNumber = pageNumber;

			resolve();
		})
    },

    // 热门搜索点击监听
    hotSearchHandle(event){
        const keyword = event.currentTarget.dataset.keyword;

        if(keyword === this.data.keyword)return false;
        this.setData({ keyword }, this.searchSong);
    },

    onReachBottom(){
        if(this.state.searchCount < this.state.searchTotal){
            this.searchSong(this.state.pageNumber + 1);
        }
    }
})