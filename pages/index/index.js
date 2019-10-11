// pages/index/index.js
const app = getApp();
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var commonJs = require('../common/common.js');      

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 播放控件数据
    data:{
      playSong: false,  //是否显示控件
      playSongInfo:{},  //正在播放音频信息
      playSongClass: false //当前播放状态对应的类名数组
    },
    recommendList:[], //歌曲推荐列表
    newSongList:[], //最新歌曲列表
    rankList:[],  //歌曲排行列表
    pageStatus1: false,    //歌曲排行的请求状态
    pageStatus2: false,    //歌手分类的请求状态
    pageState: 0           //当前所在分页（默认推荐歌曲页）

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //监听音乐停止
    commonJs.onBackgroundAudioStop(this, app, audio)

    this.recommendRequest();      //调用获取推荐歌单的方法
    this.NewSongRequest();        //调用获取最新音乐的方法
  },
  //请求获取推荐歌单
  recommendRequest() {
    const that = this;
    // 加载中
    wx.showLoading({
      title: 'Loading'
    })
    // 请求
    wx.request({
      url: "http://m.kugou.com/plist/index&json=true",
      header: {
        "contentType": "json"
      },
      method: "GET",
      success: function (res) {
        //截取前6个歌单
        let songlist = res.data.plist.list.info.slice(0, 6);
        //歌单对象里图片需要进行字符串处理
        for (let i = 0; i < songlist.length; i++) {
          songlist[i].imgurl = songlist[i].imgurl.split('{size}').join('400');
          if(songlist[i].playcount > 10000){
            songlist[i].playcount = Math.round(songlist[i].playcount / 100)/100 + '万';
          }
        }
        //将结果返回到data
        that.setData({
          recommendList: songlist
        })
      },
      complete(){
        if (that.data.newSongList.length > 0) {
          wx.hideLoading();
        }
      }
    })
  },

  //请求获取最新音乐
  NewSongRequest() {
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
        let songlist = res.data.data.slice(0, 4);
        that.setData({
          newSongList: songlist
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: '网络连接失败，请检查是否成功连接网络',
        })
      },
      complete(){
        if(that.data.recommendList.length > 0){
          wx.hideLoading();
        }
      }
    })
  },

  //请求获取歌曲排行列表
  rankRequest() {
    wx.showLoading({
      title: 'Loading'
    })
    const that = this;
    wx.request({
      url: "http://m.kugou.com/rank/list&json=true",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        let arr = res.data.rank.list;
        for (let i = 0; i < arr.length; i++) {
          arr[i].imgurl = arr[i].imgurl.split('{size}/');
          arr[i].imgurl = arr[i].imgurl.join('');
        }
        that.setData({
          rankList: res.data.rank.list,
          pageStatus1: true,
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: '网络连接失败，请检查是否成功连接网络',
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  // 请求获取歌手分类列表
  singerListRequest() {
    wx.showLoading({
      title: 'Loading'
    })
    const that = this;
    wx.request({
      url: "http://m.kugou.com/singer/class&json=true",
      method: "GET",
      header: { "contentType": "json" },
      success(res) {
        that.setData({
          singerList: res.data.list,
          pageStatus2: true,
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '温馨提示',
          content: '网络连接失败，请检查是否成功连接网络',
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  // 改变头部选项卡
  changePage(event){
    var index = event.currentTarget.dataset.index;
    switch(index){
      case 1:
        if (!this.data.pageStatus1){
          this.rankRequest();
        }
      break;
      case 2:
        if (!this.data.pageStatus2) {
          this.singerListRequest();
        }
      break;
    }
    this.setData({
      pageState:index
    })
  },

  // 获取单曲音频信息
  playSong(e){
    if(e.currentTarget){
      commonJs.setGlobalData(this.data.newSongList, app);  //将当前歌曲所在列表存进全局变量中
    }
    commonJs.playSong(e,this);
  },

  // 暂停播放背景音乐
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    commonJs.onShow(this);
  },

  //跳转到当前播放列表
  goListening(e) {
    commonJs.goListening(this, app)
  },

  goRecommendDetail(e) {
    var title = e.currentTarget.dataset.info.specialname;
    var id = e.currentTarget.dataset.info.specialid;

    wx.navigateTo({
      url: '/pages/detail/recommend/detail/detail?id=' + id + '&title=' + title
    })
  },

  goRankingDetail(e){
    var title = e.currentTarget.dataset.info.rankname;
    var id = e.currentTarget.dataset.info.rankid;
    
    wx.navigateTo({
      url: '/pages/detail/ranking/ranking?rankid=' + id + '&title=' + title
    })
  },

  goSingerDetail(e){
    var id = e.currentTarget.dataset.info.classid;
    var title = e.currentTarget.dataset.info.classname;

    wx.navigateTo({
      url: '/pages/detail/singer/list/list?classid=' + id + '&title=' + title
    })
  }
})