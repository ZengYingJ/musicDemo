// pages/detail/recommend/detail/detail.js
const app = getApp();
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var commonJs = require('../../../common/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放控件数据
    data: {
      playSong: false,  //是否显示控件
      playSongInfo: {},  //正在播放音频信息
      playSongClass: ["iconfont icon-icon-play", "iconfont icon-zanting"] //当前播放状态对应的类名数组
    },
    songList: [],
    infoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: options.title
    })

    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)

    // 请求详细歌单
    this.recomendDetailRequest(options.id);
  },

  //详细歌单请求
  recomendDetailRequest(id) {
    const that = this;
    wx.showLoading({
      title: 'Loading'
    })
    wx.request({
      url: "http://m.kugou.com/plist/list/" + id + "?json=true",
      method: "GET",
      header: { "contentType": "json" },
      success: function (res) {
        let songList = res.data.list.list.info;      //歌单歌曲列表
        let infoList = res.data.info.list       //歌单信息列表    
        infoList.imgurl = infoList.imgurl.split('{size}').join('400');
        that.setData({
          songList: songList,
          infoList: infoList
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    commonJs.onShow(this)
  },

  // 播放歌曲
  playSong(e){
    if (e.currentTarget) {
      commonJs.setGlobalData(this.data.songList, app);  //将当前歌曲所在列表存进全局变量中
    }
    commonJs.playSong(e, this)
  },

  // 暂停播放
  pauseAudio(){
    commonJs.pauseAudio(this, audio)
  },

  // 播放下一首
  nextAudio(){
    commonJs.nextAudio(this, app)
  },

  // 收藏歌曲到个人中心
  addMyList(e){
    commonJs.addMyList(e);
  },

  //跳转到当前播放列表
  goListening(){
    commonJs.goListening(this, app)
  }
})