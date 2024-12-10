//格式化时间
function formatDate(date, onlyShowDate = false) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    if (onlyShowDate) {
        return `${year}-${month}-${day}`;
    } else {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

}

//复制到剪贴板
function copyToClip(content) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

//下载文件
function convertRes2Blob(response) {
    // 提取文件名
    console.log(response.headers)
    const filename = response.headers['content-disposition'].match(
        /fileName=(.*)/
    )[1]
    console.log(filename)
    // 将二进制流转为blob
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    console.log(blob)
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // 兼容IE,window.navigator.msSaveBlob：以本地方式保存文件
        window.navigator.msSaveBlob(blob, decodeURI(filename))
    } else {
        // 创建新的URL并指向File对象或者Blob对象的地址
        const blobURL = window.URL.createObjectURL(blob)
        // 创建a标签,用于跳转至下载链接
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', decodeURI(filename))
        // 兼容：某些浏览器不支持HTML5的download属性
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
        }
        // 挂载a标签
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        // 释放blob URL地址
        window.URL.revokeObjectURL(blobURL)
    }
}

//日期比较大小
function maxDate(date1, date2) {
    if (date1 > date2) {
        return date1;
    }
    else {
        return date2;
    }
}

export { formatDate, convertRes2Blob, copyToClip, maxDate};