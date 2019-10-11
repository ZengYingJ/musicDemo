// pages/myList/myList.js
const audio = wx.getBackgroundAudioManager();       //获取全局唯一的背景音频管理器
var app = getApp();
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
        userInfo: null,  //用户信息
        mySongList: [],
        myRandomSongList: [],
        songListNumber: 0,
        clean: false  //当前是否处于编辑模式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        wx.showLoading({
            title: 'Loading'
        })

        wx.getUserInfo({        //获取用户个人信息
            success(res) {
                that.setData({
                    userInfo: res.userInfo
                })
                if (that.data.total == that.data.mySongList.length && that.data.userInfo) {
                    wx.hideLoading();
                }
            }
        })

        commonJs.onBackgroundAudioStop(this, app, audio);

        wx.getStorage({
            key: 'mySongList',
            success: function (res) {
                for (let i = 0; i < res.data.length; i++) {
                    that.mySongListRequest(res.data[i], i)
                }
                that.setData({
                    total: res.data.length
                })
            },
            fail() {
                that.setData({
                    total: 0
                })
                wx.hideLoading();
            }
        });
    },

    //获取已收藏的歌曲
    mySongListRequest(hash, index) {
        const that = this;
        wx.request({
            url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + hash,
            method: "GET",
            header: { "contentType": "json" },
            success(res) {
                that.data.mySongList.push(res.data.data);
                that.setData({
                    mySongList: that.data.mySongList,
                    myRandomSongList: that.data.mySongList,
                    songListNumber: that.data.mySongList.length
                })
            },
            complete() {
                if (that.data.total == that.data.mySongList.length && that.data.userInfo) {
                    wx.hideLoading();
                }
            }
        })
    },

    // 获取单曲音频信息
    playSong(e) {
        if (e.currentTarget) {
            this.data.myRandomSongList.sort(function (x, y) {
                return Math.random() - 0.5;
            })
            var songList = this.data.playModelNumber === 1 ? this.data.myRandomSongList : this.data.mySongList
            commonJs.setGlobalData(songList, app);  //将当前歌曲所在列表存进全局变量中
        }
        commonJs.playSong(e, this);
    },

    // 暂停播放背景音乐
    pauseAudio() {
        commonJs.pauseAudio(this, audio)
    },

    //播放一下首
    nextAudio() {
        commonJs.nextAudio(this, app);
    },

    // 编辑模式的方法
    cleanModel() {
        this.setData({
            clean: !this.data.clean
        })
    },

    //改变音乐播放模式的方法
    playModel() {
        const that = this;

        let itemList = app.globalData.playModel.typeList;
        let playModelClass = app.globalData.playModel.classList;
        wx.showActionSheet({
            itemList: itemList,
            success(res) {  //tapIndex ==>  0, 1, 2
                var tapIndex = res.tapIndex;
                that.data.myRandomSongList.sort(function (x, y) {
                    return Math.random() - 0.5;
                })
                var songList = tapIndex === 1 ? that.data.myRandomSongList : that.data.mySongList;
                commonJs.setGlobalData(songList, app);

                app.globalData.playModel.type = tapIndex;
                that.setData({
                    playModel: itemList[tapIndex],
                    playModelClass: playModelClass[tapIndex],
                    playModelNumber: tapIndex
                })
            }
        })
    },

    //将歌单中的歌曲删除的方法
    removeSong(e) {
        let myHash = e.currentTarget.dataset.hash;      //获取当前的HASH
        let arrHash = [];
        for (let i = 0; i < this.data.mySongList.length; i++) {
            arrHash[i] = this.data.mySongList[i].hash       //获取歌曲列表的所有HASH的数组
        }
        let index = arrHash.indexOf(myHash);        //当前HASH的索引值
        this.data.mySongList.splice(index, 1);       //对应歌曲从歌曲列表中删除
        arrHash.splice(index, 1);
        wx.showToast({
            title: '删除成功'
        })

        this.setData({
            mySongList: this.data.mySongList,        //重新渲染页面
            songListNumber: this.data.mySongList.length,
            total: this.data.mySongList.length
        })
        wx.setStorage({         //对本地缓存进行重新赋值
            key: 'mySongList',
            data: arrHash
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var type = app.globalData.playModel.type;
        this.setData({
            playModel: app.globalData.playModel.typeList[type],
            playModelClass: app.globalData.playModel.classList[type],
            playModelNumber: type,       //播放模式的状态码 0代表循环播放，1代表随机播放，2代表单曲循环
        })
        commonJs.onShow(this);
    },

    //跳转到当前播放列表
    goListening(e) {
        commonJs.goListening(this, app)
    }

})