const Ajax = require("./Ajax.js");
const To = require("./To.js");
const WeChat = require("./WeChat.js");
const Config = require("../config/Index.js");
const App = getApp();
const audioManager = App.globalData.audioManager;

module.exports = {
    PlaySong(hash){
        return new Promise(async resolve => {
            const [error, res] = await To(Ajax({ url: `${Config.Api.getSongInfo}?r=play/getdata&hash=${hash}` }));

            if(error){
                return WeChat.showModal({ content: "加载歌曲信息失败" });
            }

            const songInfo = res.data;

            if(App.globalData.currentSongInfo && songInfo.hash === App.globalData.currentSongInfo.hash)return false;

            App.globalData.currentSongInfo = songInfo;
            App.globalData.currentPlayStatus = 1;
            
            [
                audioManager.src,
                audioManager.title,
                audioManager.singer,
                audioManager.coverImgUrl,
            ] = [
                songInfo.play_url,
                songInfo.song_name,
                songInfo.author_name,
                songInfo.img,
            ]

            resolve();
        })
    }
}