const Main = require("./Main.js");
module.exports = {
    // 推荐歌曲列表
    getRecommendSongList: `${Main.Host.mkugou}/plist/index&json=true`,

    // 最新歌曲列表
    getNewSongList: `${Main.Host.mkugou}/?json=true`,

    // 歌单排行榜列表
    getSongRankList: `${Main.Host.mkugou}/rank/list&json=true`,

    // 歌手类型列表
    getSingerTypeList: `${Main.Host.mkugou}/singer/class&json=true`,

    // 歌单的歌曲列表
    getSongListDetail: `${Main.Host.mkugou}/plist/list/`,

    // 歌单排行榜的歌曲列表
    getRankListDetail: `${Main.Host.mkugou}/rank/info/`,

    // 歌手列表
    getSingerList: `${Main.Host.mkugou}/singer/list/`,

    // 歌手歌曲列表
    getSingerDetail: `${Main.Host.mkugou}/singer/info/`,

    // 热门搜索列表
    getHotSearchList: `${Main.Host.mobilecdn}/api/v3/search/hot`,

    // 歌曲搜索
    getSongBySearch: `${Main.Host.mobilecdn}/api/v3/search/song`,
    
    // 歌曲信息
    getSongInfo: `${Main.Host.wkugou}/yy/index.php`,
}