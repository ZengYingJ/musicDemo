// Promise封装（就是不想写try catch）
module.exports = (promise) => {
    return promise.then(data => [null, data]).catch(err => [err]);
}