// pages/detail/recommend/list/list.js
const app = getApp();
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var commonJs = require('../../../common/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      playSong: false,  //是否显示控件
      playSongInfo: {},  //正在播放音频信息
      playSongClass: ["iconfont icon-icon-play", "iconfont icon-zanting"] //当前播放状态对应的类名数组
    },
    recommendList: [],
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.recommendRequest();      //调用获取推荐歌单的方法
    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)
  },

  //请求获取推荐歌单
  recommendRequest() {
    wx.showLoading({
      title: 'Loading'
    })
    const that = this;
    var page = this.data.page + 1;
    wx.request({
      url: "http://m.kugou.com/plist/index&json=true&page=" + page,
      header: {
        "contentType": "json"
      },
      method: "GET",
      success: function (res) {
        let songlist = page == 1 ? res.data.plist.list.info.slice(6, -2) : res.data.plist.list.info;
        //歌单对象里图片需要进行字符串处理
        for (let i = 0; i < songlist.length; i++) {
          songlist[i].imgurl = songlist[i].imgurl.split('{size}/').join('');
          if (songlist[i].playcount > 10000) {
            if(songlist[i].playcount > 100000000){
              songlist[i].playcount = (songlist[i].playcount / 100000000).toFixed(2) + '亿';
              continue;
            }
            songlist[i].playcount = (songlist[i].playcount / 10000).toFixed(2) + '万';
          }
        }
        songlist = that.data.recommendList.concat(songlist);
        //将结果返回到data
        that.setData({
          total: res.data.plist.list.total,
          recommendList: songlist,
          page: page
        })
      },
      fail: function (err) {
        console.log(err)
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
    commonJs.onShow(this);
  },

  //播放歌曲的方法
  playSong(e){
    commonJs.playSong(e, this);
  },

  //暂停播放音乐
  pauseAudio(){
    commonJs.pauseAudio(this, audio)
  },

  // 播放下一首
  nextAudio() {
    commonJs.nextAudio(this, app)
  },

  //跳转到当前播放列表
  goListening(e) {
    commonJs.goListening(this, app)
  },

  goRecommendDetail(e){
    var title = e.currentTarget.dataset.info.specialname;
    var id = e.currentTarget.dataset.info.specialid;

    wx.navigateTo({
      url: '/pages/detail/recommend/detail/detail?id=' + id + '&title=' + title
    })
  },

  // 页面触底事件
  onReachBottom(){
    this.recommendRequest();
  } 
})