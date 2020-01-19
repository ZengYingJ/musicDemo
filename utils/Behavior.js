// const AudioManager = wx.getBackgroundAudioManager();
const App = getApp();

module.exports = Behavior({
    data: {
        
    },
    methods: {
        isPlayingSong(){
            if(App.globalData.currentPlayStatus === 1){
                const controller = this.selectComponent("#AudioController");
                controller && controller.showModal();
            }
        }
    }
})