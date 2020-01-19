module.exports = options => {
    return new Promise((resolve, reject) => {
        if(!options.url){
            reject({ message: "url is required" });
        }

        wx.showLoading({ title: "加载中..." });
        wx.request({
            url: options.url,
            data: options.data || {},
            method: options.method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "contentType": "json",
                "Cookie": "kg_mid=123456789",
            },
            success(res){
                resolve(res.data);
            },
            fail(err){
                reject(err);
            },
            complete(){
                wx.hideLoading();
            }
        })
    })
}