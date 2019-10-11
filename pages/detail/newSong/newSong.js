// pages/detail/newSong/newSong.js
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
    imgUrls: [],
    newSongList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)
    this.newSongRequest();
  },

  // 请求获取最新音乐歌单
  newSongRequest() {
    wx.showLoading({
      title: 'Loading'
    })
    const that = this;
    wx.request({
      url: "http://m.kugou.com/?json=true",
      method: "GET",
      header: {
        "contentType": "json"
      },
      success: function (res) {
        let imgArr = res.data.banner;       //获取最新音乐Banner图片的数组对象
        for (let i = 0; i < imgArr.length; i++) {
          imgArr[i] = imgArr[i].imgurl        //只获取其中的图片地址
        }
        that.setData({
          imgUrls: imgArr,
          newSongList: res.data.data
        })
        wx.hideLoading();
      }
    })
  },

  //播放歌曲的方法
  playSong(e) {
    if (e.currentTarget) {
      commonJs.setGlobalData(this.data.newSongList, app);  //将当前歌曲所在列表存进全局变量中
    }
    commonJs.playSong(e, this);
  },

  //暂停播放音乐
  pauseAudio() {
    commonJs.pauseAudio(this, audio);
  },

  // 播放下一首
  nextAudio(){
    commonJs.nextAudio(this, app)
  },

  // 收藏歌曲到个人中心
  addMyList(e){
    commonJs.addMyList(e)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    commonJs.onShow(this);
  },

  //跳转到当前播放列表
  goListening(){
    commonJs.goListening(this, app)
  }
})