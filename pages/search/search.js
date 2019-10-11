// pages/search/search.js
const app = getApp();
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var commonJs = require('../common/common.js');

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
    hotSearchList: [],
    listTotal: [],
    page: 0,
    searchResult: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commonJs.onBackgroundAudioStop(this, app, audio)
    this.hotSearchRequest();       //调用请求热门搜索的方法
  },

  //请求热门搜素的方法
  hotSearchRequest() {
    wx.showLoading({
      title: 'Loading'
    })

    const that = this;
    wx.request({
      url: "http://mobilecdn.kugou.com/api/v3/search/hot?format=json&plat=0&count=30",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        that.setData({
          hotSearchList: res.data.data.info
        })
        wx.hideLoading();
      }
    })
  },

  // 搜索歌曲
  goSearch() {
    const that = this;
    let str = this.data.inputValue;
    if (str.replace(/(^s*)|(s*$)/g, "").length ==0) { return; }      //在不输入关键词或者输入空关键词的时候不继续执行
    let page = this.data.page > 0 ? this.data.page + 1 : 1;
    wx.showLoading({
      title: '加载中'
    })

    wx.request({
      url: "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=" + str + "&page=" + page + "&pagesize=10&showtype=1",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        setTimeout(function () {
          let songList = that.data.songList.concat(res.data.data.info);
          if (songList[0] == "") return;
          that.setData({
            page: page,
            searchResult: true,
            listTotal: res.data.data.total,
            songList: songList
          })
          wx.hideLoading();
        }, 500)
      }
    })

  },

  //输入框失去焦点时候的触发事件
  changeValue(e) {
    let value = e.detail.value;
    this.data.page = 0;
    this.data.songList = [];
    this.setData({
      inputValue: value
    })
  },

  // 点击热门搜索文字搜索的方法
  searchThis(e) {
    let value = e.currentTarget.dataset.value;
    this.setData({
      inputValue: value
    })
    this.goSearch()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    commonJs.onShow(this);
  },

  // 获取单曲音频信息
  playSong(e) {
    if (e.currentTarget) {
      commonJs.setGlobalData(this.data.songList, app);  //将当前歌曲所在列表存进全局变量中
    }
    commonJs.playSong(e, this);
  },

  // 暂停播放背景音乐
  pauseAudio() {
    commonJs.pauseAudio(this, audio)
  },

  // 收藏歌曲到个人中心
  addMyList(e) {
    commonJs.addMyList(e);
  },

  // 播放下一首
  nextAudio() {
    commonJs.nextAudio(this, app)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.goSearch()
  },

  //跳转到当前播放列表
  goListening() {
    commonJs.goListening(this, app)
  }
})