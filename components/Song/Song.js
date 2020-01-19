// components/Song/Song.js
const Utils = require("../../utils/Index.js");

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		song: {
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
        // 播放歌曲
        async playSong(){
            const hash = this.data.song.hash;
            await Utils.AudioService.PlaySong(hash);
            
            const pages = getCurrentPages();
            const lastPage = pages[pages.length - 1];
            const controller = lastPage.selectComponent("#AudioController");
            if(controller && controller.showModal){
                controller.showModal();
            }
            // this.triggerEvent("play");
        },
        // 添加到我的收藏列表
        addToMyLike(){
            console.log(pages);
            Utils.WeChat.showModal({ content: "收藏功能尚未开放，敬请期待" });
        }
	}
})
