// components/AudioController/AudioController.js
const App = getApp();
const Utils = require("../../utils/Index.js");
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
        modal: false,
        songInfo: null,
        playStatus: 1,      // 0:暂停中，1:播放中
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		showModal(){
			this.setData({
                modal: true,
                playStatus: 1,
                songInfo: App.globalData.currentSongInfo,
            });
		},
		hideModal(){
			this.setData({ modal: false });
        },
        
        // 切换播放状态
        switchPlayButton(){
            const playStatus = Math.abs(this.data.playStatus - 1);

            switch(playStatus){
                case 1:
                    App.globalData.audioManager.play();
                    break;
                case 0:
                    App.globalData.audioManager.pause();
                    break;
            }

            App.globalData.currentPlayStatus = playStatus;
            this.setData({ playStatus: playStatus });
        },

        // 播放下一首
        playNextSong(){
            Utils.WeChat.showModal({ content: "播放下一首的功能尚未开放，敬请期待" });
        }
	}
})
