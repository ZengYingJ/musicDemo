// pages/listening/listening.js
const audio = wx.getBackgroundAudioManager();
const commonJs = require('../common/common.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // playModelNumber: 0,
        // playModelClass: "icon-liebiaoxunhuan",
        bottom: -500,
        number: 0,
        pauseClass: ["icon-icon-play", "icon-zanting"],
        nowMin: "00:00",
        nowSec: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        //请求获取本地缓存信息
        wx.getStorage({
            key: 'listeningArr',
            success: function (res) {
                that.setData({
                    mySongList: res.data[0],       //歌曲列表
                    myRandomSongList: res.data[0],
                    playSongInfo: res.data[1],        //当前播放音乐的信息
                    currentPosition: options.position
                })
                that.songRequest(that.data.playSongInfo.hash);
            }
        });

        //监听音乐停止
        wx.onBackgroundAudioStop(function () {
            audio.onEnded(function () {
                if (that.data.playModelNumber == 2) {        //处于单曲循环状态下的自然停止音乐
                    let url = that.data.playSongInfo.play_url;
                    wx.playBackgroundAudio({
                        dataUrl: url
                    })
                } else {
                    that.nextAudio();         //播放下一首
                }
            })
        })
    },

    //请求获取歌曲信息
    songRequest(hash) {
        const that = this;
        wx.request({
            url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + hash,
            method: "GET",
            header: { "contentType": "json" },
            success(res) {
                res.data.data.audio_name = res.data.data.audio_name.split('-')
                wx.setStorage({
                    key: "songInfo",
                    data: res.data.data
                })
                //正则匹配歌词信息进行处理
                let lyrics = res.data.data.lyrics;
                that.parseLyrics(lyrics);

                that.playBackgroundAudio(res.data.data.play_url);
                let time = that.getAudioTime(res.data.data.timelength);    //将歌曲时间的毫秒值转换成分钟的形式  
                that.setData({
                    playSongInfo: res.data.data,
                    endTime: time
                })
            }
        })
    },

    //转化时间格式的方法
    getAudioTime(timelength) {
        var timelength = timelength / 1000;
        var min = parseInt(timelength / 60);      //分钟
        var sec = parseInt(timelength % 60);             //秒钟
        sec = sec < 10 ? '0' + sec : sec;
        var time = "0" + min + ":" + sec;
        if (isNaN(sec)) { time = "00:00" };     //播放结束时
        return time;
    },

    //滑动进度条触发事件
    sliderChange(e) {
        let position = e.detail.value;      //当前进度条  
        wx.seekBackgroundAudio({
            position: position                  //设置当前音乐播放进度
        })
    },

    //播放音乐的方法
    playBackgroundAudio(url) {
        const that = this;
        let currentPosition = that.data.currentPosition || 0;
        audio.startTime = currentPosition;      //设置开始时间
        audio.src = url;

        this.setData({
            currentPosition: 0
        })
    },

    //正则匹配歌词的方法
    parseLyrics(lyrics) {
        lyrics = lyrics.split('\n');
        var lrcObj = {};
        var lrcArr = [];
        var lrcText = [];
        for (var i = 0; i < lyrics.length; i++) {
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if (!timeRegExpArr) continue;
            var clause = lyric.replace(timeReg, '');
            for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = clause;
                if (lrcArr.indexOf(time) < 0) { lrcArr.push(time); lrcText.push(clause) }
            }
        }
        this.setData({
            lrcObj: lrcObj,       //歌词对象
            lrcArr: lrcArr,           //歌词对应的时间数组
            lrcText: lrcText
        })
    },

    //暂停播放背景音乐的方法
    pauseAudio() {
        const that = this;
        this.data.pauseClass.unshift(this.data.pauseClass.pop());
        this.setData({
            pauseClass: this.data.pauseClass
        })
        if (audio.paused) { audio.play() } else { audio.pause() };
    },

    /**
     * 生命周期函数--监听页面渲染完成
     */
    onShow: function () {
        var type = app.globalData.playModel.type;
        this.setData({
            playModelNumber: type,
            playModelClass: app.globalData.playModel.classList[type]
        })

        const that = this;
        audio.onTimeUpdate(function () {      //监听背景音频播放进度更新
            wx.getBackgroundAudioPlayerState({      //获取后台音乐播放状态
                success(res) {

                    if(!that.data.rectHeight){
                        wx.createSelectorQuery().select('.lyricText').boundingClientRect(function (rect) {
                            that.setData({
                                rectHeight: -rect.height
                            })
                        }).exec()
                    }
                    

                    try {
                        let lrcObj = that.data.lrcObj;
                        let lrcArr = that.data.lrcArr || [];
                        let time = that.getAudioTime(res.currentPosition * 1000);
                        let nowSec = res.currentPosition;   //当前播放进度

                        if (lrcObj[nowSec]) {
                            var index = lrcArr.indexOf(nowSec);
                            that.data.number = index;
                        }else{
                            for(let i=0; i<lrcArr.length; i++){
                                if(nowSec > lrcArr[i] && nowSec < lrcArr[i + 1]){
                                    that.data.number = i;
                                } else if (nowSec > lrcArr[i] && !lrcArr[i + 1]){
                                    that.data.number = i;
                                }
                            }
                        }

                        that.setData({
                            nowSec: nowSec,            //更新播放进度条和时间
                            nowMin: time,
                            number: that.data.number
                        })

                    } catch (err) {
                        console.log("错误信息：" + err)
                    }
                }
            })
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

    // 切换到下一首或上一首
    nextAudio(event) {
        var flag = event ? event.currentTarget.dataset.flag : true;

        const that = this;
        let hash = this.data.playSongInfo.hash;     //获取当前正在播放的音频Hash
        let arr = [];      //获取播放列表
        for (let i = 0, length = app.globalData.songList.length; i < length; i++) {
            arr[i] = app.globalData.songList[i].hash;   //获取播放列表对应的Hash列表
        }
        let index = arr.indexOf(hash);      //hash在列表对应的索引值
        index = flag ? (++index > arr.length - 1 ? 0 : index) : (--index < 0 ? arr.length - 1 : index); //获取下一首的索引值
        // audio.seek(0);
        this.songRequest(arr[index]);   //请求下一首歌曲的资源
    },

    //展开播放列表的方法
    showSongsList() {
        this.setData({
            bottom: 0
        })
    },

    //在播放列表选择播放歌曲
    chooseAudio(e) {
        let songInfo = e.currentTarget.dataset.info;
        audio.seek(0);
        this.songRequest(songInfo.hash);
        this.setData({
            bottom: -500
        })
    },

    //隐藏播放列表
    hiddenAudioList() {
        this.setData({
            bottom: -500
        })
    }
})