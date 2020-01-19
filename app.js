//app.js
const systemInfo = wx.getSystemInfoSync();
App({
  	onLaunch: function () {

  	},
  	globalData: {
		statusBarHeight: systemInfo.statusBarHeight,
        pageNavBarTop: systemInfo.statusBarHeight + 46,
        audioManager: wx.getBackgroundAudioManager(),
        currentSongInfo: null,      // 当前播放歌曲信息
        currentPlayStatus: 0,       // 当前播放状态
  	}
})