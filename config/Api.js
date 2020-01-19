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

    // 歌单的歌曲列表   /plist/list/歌单id?json=true
    getSongListDetail: `${Main.Host.mkugou}/plist/list/`,

    // 歌单排行榜的歌曲列表     /rank/info/?rankid=排行榜id&page=页码&json=true
    getRankListDetail: `${Main.Host.mkugou}/rank/info/`,

    // 歌手列表     singer/list/歌手类型id?json=true&page=页码
    getSingerList: `${Main.Host.mkugou}/singer/list/`,

    // 歌手歌曲列表     singer/info/歌手id&json=true&page=页码
    getSingerDetail: `${Main.Host.mkugou}/singer/info/`,

    // 热门搜索列表     search/hot?format=json&plat=0&count=总数
    getHotSearchList: `${Main.Host.mobilecdn}/api/v3/search/hot`,

    // 歌曲搜索     search/song?format=json&keyword=关键词&page=页码&pagesize=一页的数量&showtype=1
    getSongBySearch: `${Main.Host.mobilecdn}/api/v3/search/song`,
    
    // 歌曲信息     index.php?r=play/getdata&hash=歌曲hash
    getSongInfo: `${Main.Host.wkugou}/yy/index.php`,
}