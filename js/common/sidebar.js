(function () {
    document.getElementById("span_admin_name_sidebar").innerHTML = "吴彦祖";
})();

/**
 * 侧边导航
 */
// 创建元素节点

(function () {
    const navs = [
        ["user.html", "用户信息管理"],
        ["order.html", "消费记录查询"],
        ["plate.html", "餐盘价格修改"],
        ["feedback.html", "申报反馈"],
        ["msg_release.html", "消息发布"],
        ["sales_analysis.html", "销售分析"],
        ["order_comparison.html", "账单对比"],
        ["logout", "退出登录"],
    ];

    const domSidenav = document.getElementById("sidenav");
    let navIdx = window.sessionStorage.getItem("plate_nav_idx");
    navIdx = navIdx == null ? 0 : parseInt(navIdx);

    navs.forEach((e, idx) => {
        let li = document.createElement("li");

        let iconfontSpan = document.createElement("span");
        iconfontSpan.classList.add = "iconfont";
        iconfontSpan.innerHTML = ""; // 这里可添加iconfont
        li.appendChild(iconfontSpan);

        let span = document.createElement("span");
        span.innerHTML = e[1];

        if (e[0] == "logout") {
            span.onclick = function () {
                gAjax({
                    url: "/admin/logout",
                    method: "post",
                    success: (data) => {
                        if (data.code == 200) {
                            window.sessionStorage.removeItem("plate_nav_idx");
                            window.location.href = "login.html";
                        }

                        alert(data.data);
                    },
                });
            };
        } else {
            span.onclick = function () {
                window.sessionStorage.setItem("plate_nav_idx", idx);
                window.location.href = e[0];
            };
        }

        li.appendChild(span);

        if (idx === navIdx) {
            li.classList.add("active");
        }
        domSidenav.appendChild(li);
    });
})();
