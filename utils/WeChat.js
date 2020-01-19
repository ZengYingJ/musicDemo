const Config = require("../config/Index.js");
module.exports = {
    showModal(options){
        return new Promise(resolve => {
            wx.showModal({
                title: options.title || Config.Main.MiniAppTitle,
                content: options.content,
                showCancel: options.showCancel || false,
                success(res){
                    resolve(res);
                }
            })
        })
    }
}