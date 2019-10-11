// pages/detail/singer/list/list.js
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
    page: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)

    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      classId: options.classid
    })
    this.listDetailRequest(options.classid);
  },


  listDetailRequest(id) {
    wx.showLoading({
      title: 'Loading'
    })
    const that = this;
    let page = this.data.page + 1;
    wx.request({
      url: "http://m.kugou.com/singer/list/" + id + "?json=true&page=" + page,
      // url: "http://m.kugou.com/singer/list/88?json=true",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        let list = res.data.singers.list.info;
        for (let i = 0; i < list.length; i++) {
          list[i].imgurl = list[i].imgurl.split('{size}').join('400');
        }
        list = that.data.list.concat(list)
        that.setData({
          title: res.data.classname,
          list: list,
          page: page,
          total: res.data.singers.list.total
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.list.length >= this.data.total)return;
    this.listDetailRequest(this.data.classId)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    commonJs.onShow(this);
  },

  //播放歌曲的方法
  playSong(e) {
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

  //跳转到当前播放列表
  goListening() {
    commonJs.goListening(this, app)
  },

  goSingerDetail(e) {
    var title = e.currentTarget.dataset.info.singername;
    var id = e.currentTarget.dataset.info.singerid;

    wx.navigateTo({
      url: '/pages/detail/singer/detail/detail?singerid=' + id + '&title=' + title
    })
  }
})