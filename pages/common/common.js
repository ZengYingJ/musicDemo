//获取单曲音频信息
function playSong(e,_this){
  var hash;
  if (e.currentTarget) {
    hash = e.currentTarget.dataset.info.hash;     //获取对应歌曲的   hash
  }else{
    hash = e.hash;
  }
  wx.request({
    url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + hash,
    method: "GET",
    header: { "contentType": "json" },
    success: function (res) {
      let playInfo = res.data.data      //获取音频信息
      playInfo.audio_name = playInfo.audio_name.split('-');
      wx.setStorage({
        key: "songInfo",
        data: playInfo
      })
      playBackgroundAudio(playInfo,_this);        //调用播放背景音乐的方法
    }
  })
};

//开始播放背景音乐的方法
function playBackgroundAudio(data, _this){
  wx.playBackgroundAudio({
    dataUrl: data.play_url
  })
  _this.setData({
    data: {
      playSong: true,
      playSongInfo: data,
      playSongClass: false
    }
  })
};

// 暂停播放音乐
function pauseAudio(_this, audio){
  _this.data.data.playSongClass = !_this.data.data.playSongClass   //改变类名来改变样式
  _this.setData({
    data:_this.data.data
  })
  if(audio.paused) {     //false 表示正在播放，true 表示暂停或停止
    audio.play();
  } else {
    audio.pause();
  }
};

// 将当前所在歌曲列表存进全局变量中
function setGlobalData(songList,app){
  app.globalData.songList = songList;
};

//播放一下首
function nextAudio(_this, app){
  let hash = _this.data.data.playSongInfo.hash;     //获取当前正在播放的音频Hash
  let arr = [];      //获取播放列表
  for (let i = 0, length = app.globalData.songList.length; i < length; i++) {
    arr[i] = app.globalData.songList[i].hash;   //获取播放列表对应的Hash列表
  }
  let index = arr.indexOf(hash);      //ID在列表对应的索引值
  index = ++index > arr.length - 1 ? 0 : index;       //获取下一首的索引值
  hash = arr[index];       //获取下一首的HASH
  _this.playSong({ hash: hash });

  //播放的样式改变
  _this.data.data.playSongClass = false;
  _this.setData({
    data:_this.data.data
  })
};

//收藏歌曲到个人中心
function addMyList(e){
  let info = e.currentTarget.dataset.info;        //获取该歌曲信息对象
  wx.getStorage({
    key: 'mySongList',
    success: function (res) {        //我的列表不为空时
      if (res.data.indexOf(info.hash) < 0) {       //我的列表中没有这首歌
        res.data.push(info.hash)        //收藏进我的歌单里
        wx.setStorage({
          key: 'mySongList',
          data: res.data
        })
      }
    },
    fail: function (err) {     //我的列表为空
      wx.setStorage({
        key: 'mySongList',
        data: [info.hash]
      })
    },
    complete(res) {
      var songname;
      if(info.filename){
        songname = info.filename.split(' - ')[1];
      }else{
        songname = info.audio_name[1];
      }
      wx.showModal({
        title: 'My音乐',
        content: '歌曲《' + songname + '》成功添加到我的列表'
      })
    }
  })
};

//初始化（监听进入页面时的播放状态）
function onShow(_this){
  wx.getBackgroundAudioPlayerState({
    success(res) {
      if (res.status == 1 || res.status == 0) {      //后台音乐播放状态处于播放或暂停中
        var arr = res.status == 1;
        wx.getStorage({
          key: "songInfo",
          success(res) {
            _this.setData({
              data: {
                playSongInfo: res.data,
                playSongClass: !arr,
                playSong: true
              }
            })
          }
        })
      }
    }
  })
};

//跳转到当前播放列表
function goListening(_this, app){
    let songList = app.globalData.songList;
    let playSongInfo = _this.data.data.playSongInfo;
    wx.setStorage({
      key: 'listeningArr',
      data: [songList, playSongInfo]
    })
    wx.getBackgroundAudioPlayerState({
      success(res) {
        wx.navigateTo({
          url: '/pages/listening/listening?position=' + res.currentPosition
        })
      }
    })
}

//监听音乐停止
function onBackgroundAudioStop(_this, app, audio){
  wx.onBackgroundAudioStop(function () {
    audio.onEnded(function () {       //监听背景音乐在正常状态下停止播放       
      if (app.globalData.playModel.type == 2) {        //处于单曲循环状态下的自然停止音乐
        let url = _this.data.data.playSongInfo.mp3Url;
        wx.playBackgroundAudio({
          dataUrl: url
        })
      } else {
        _this.nextAudio();         //播放下一首
      }
    })
  })
}

module.exports = {
  onBackgroundAudioStop: onBackgroundAudioStop,   //监听背景音乐自然停止
  goListening: goListening,                       //跳转到正在收听页面
  onShow: onShow,                                 //页面初始化（监听进入页面时的播放状态）
  addMyList: addMyList,                           //添加到个人歌曲收藏
  nextAudio: nextAudio,                           //播放下一首
  setGlobalData: setGlobalData,                   //将当前播放列表设置为全局变量
  pauseAudio: pauseAudio,                         //暂停播放
  playSong: playSong,                             //获取单曲音频信息
  playBackgroundAudio: playBackgroundAudio        //开始播放
}