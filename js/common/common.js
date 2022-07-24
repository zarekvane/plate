const ROOT_URL = "http://restaurant.latt1ce.xyz";
const BASE_URL = "http://restaurant.latt1ce.xyz/api/v1";

function gSetToken(token) {
    localStorage.setItem("platemgr-token", token);
}

function gGetToken() {
    let token = localStorage.getItem("platemgr-token");
    return token ? token != null : "";
}

function base64Encode(binary) {
    return btoa(decodeURI(encodeURIComponent(binary)));
}

function gAjax(params = {}) {
    let {
        data = null,
        url,
        method = "GET",
        type = "application/json",
        async = true,
        success = () => {},
        error = () => {},
    } = params;

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                success(JSON.parse(xhr.responseText), xhr.status, xhr);
            } else {
                error(xhr, xhr.status, "");
            }
        }
    };

    xhr.open(method, `${BASE_URL}${url}`, async);
    xhr.setRequestHeader("Authorization", `Bearer ${gGetToken()}`);

    if (method.toLowerCase() == "post") {
        xhr.setRequestHeader("content-type", type);
    }

    xhr.send(data);
}

function gAjaxFiles(params) {
    let {
        data,
        url,
        method = "post",
        type = "multipart/form-data",
        async = true,
        success = () => {},
        error = () => {},
    } = params;

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                success(JSON.parse(xhr.responseText));
            }
        } else {
            error(xhr, xhr.status, "");
        }
    };

    xhr.open(method, `${BASE_URL}${url}`, async);
    // xhr.setRequestHeader("content-type", type);
    xhr.setRequestHeader("Authorization", `Bearer ${gGetToken()}`);
    xhr.send(parseData(data));

    //将普通对象转换为formData
    function parseData(data) {
        let form = new FormData();

        for (let i in data) {
            form.append(i, data[i]);
        }

        return form;
    }
}

// 这个函数接受完整的url
function gAjaxImg(params = {}) {
    let {
        url,
        method = "GET",
        async = true,
        success = () => {},
        error = () => {},
    } = params;

    let xhr = new XMLHttpRequest();

    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                success(
                    (window.URL || window.webkitURL).createObjectURL(
                        xhr.response
                    ),
                    xhr.status,
                    xhr
                );
            } else {
                error(xhr, xhr.status, "");
            }
        }
    };

    xhr.open(method, url, async);
    xhr.setRequestHeader("Authorization", `Bearer ${gGetToken()}`);

    xhr.send();
}

// 这个函数接受完整的路径
function setWebImg(img, src) {
    gAjaxImg({
        url: src,
        success: (data) => {
            img.src = data;
            img.onload = function (e) {
                window.URL.revokeObjectURL(img.src); // 当图片加载完成后清除释放
            };
        },
    });
}
