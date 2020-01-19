const Main = require("./Main.js");
module.exports = {
    getRecommendSongList: `${Main.Host.mkugou}/plist/index&json=true`,
    getNewSongList: `${Main.Host.mkugou}/?json=true`,
    getSongRankList: `${Main.Host.mkugou}/rank/list&json=true`,
    getSingerTypeList: `${Main.Host.mkugou}/singer/class&json=true`,
    getSongListDetail: `${Main.Host.mkugou}/plist/list/`,
    getRankListDetail: `${Main.Host.mkugou}/rank/info/`,
    getSingerList: `${Main.Host.mkugou}/singer/list/`,
    getSingerDetail: `${Main.Host.mkugou}/singer/info/`,

    getHotSearchList: `${Main.Host.mobilecdn}/api/v3/search/hot`,
    getSongBySearch: `${Main.Host.mobilecdn}/api/v3/search/song`,
    
    getSongInfo: `${Main.Host.wkugou}/yy/index.php`,
}