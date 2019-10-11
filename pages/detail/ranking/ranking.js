// pages/detail/ranking/ranking.js
const app = getApp();
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var commonJs = require('../../common/common.js');

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
    page: 1,
    songList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)

    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      rankid: options.rankid
    })
    this.rankListRequest(options.rankid);
  },

  //请求歌单列表的方法
  rankListRequest(rankid) {

    wx.showLoading({
      title: 'Loading'
    })

    const that = this;
    let page = this.data.page;
    wx.request({
      url: "http://m.kugou.com/rank/info/?rankid=" + rankid + "&page=" + page + "&json=true",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        let infoList = res.data.info;       //获取歌单列表信息
        infoList.banner7url = infoList.banner7url.split('{size}/').join('');
        let songList = that.data.songList.concat(res.data.songs.list)      //拼接歌曲数据
        let total = res.data.songs.total;
        that.setData({
          page: ++page,        //页码加一
          total: total,
          infoList: infoList,
          songList: songList
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },

  //播放歌曲的方法
  playSong(e) {
    if (e.currentTarget) {
      commonJs.setGlobalData(this.data.songList, app);  //将当前歌曲所在列表存进全局变量中
    }
    commonJs.playSong(e, this);
  },

  //暂停播放音乐
  pauseAudio() {
    commonJs.pauseAudio(this, audio);
  },

  // 播放下一首
  nextAudio() {
    commonJs.nextAudio(this, app)
  },

  // 收藏歌曲到个人中心
  addMyList(e) {
    commonJs.addMyList(e)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    commonJs.onShow(this);
  },

  //跳转到当前播放列表
  goListening() {
    commonJs.goListening(this, app)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.total <= this.data.songList.length)return;
    this.rankListRequest(this.data.rankid)
  }
})