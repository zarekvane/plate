class Order {
    constructor(
        orderId,
        userId,
        name,
        orderDate,
        userIdentity = "0",
        totalPrice = "",
        description = "",
        platePicture = "images/default_avatar.svg",
        userAvatar = "images/default_avatar.svg",
        totalPlates = []
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.name = name;
        this.orderDate = orderDate;
        this.userIdentity = userIdentity;
        this.amount = totalPrice; // 金额
        this.description = description;
        this.platePicture = platePicture; // url
        this.userAvatar = userAvatar; // url
        this.totalPlates = totalPlates;
    }
}

const domTableOrders = document.getElementById("tbl_orders");

var gPlateAvatarControl = new AvatarControl("餐盘图片");
gPlateAvatarControl.disable();
var gUserAvatarControl = new AvatarControl("用户照片");
gUserAvatarControl.disable();

document
    .getElementById("plate_picture_wrapper")
    .appendChild(gPlateAvatarControl.dom);
document
    .getElementById("user_avatar_wrapper")
    .appendChild(gUserAvatarControl.dom);

const domInputOrderId = document.getElementById("input_detail_order_id");
const domInputUserId = document.getElementById("input_detail_user_id");
const domInputName = document.getElementById("input_detail_name");
const domSelectIdentity = document.getElementById("select_detail_identity");
const domInputDescription = document.getElementById("input_detail_description");
const domInputAmount = document.getElementById("input_detail_amount");

var gOrderTable = new Table(document.getElementById("tbl_orders"), [], fFillTr);

var gSearchForm = new SearchForm({
    url: "/admin/order/query/list",

    success: function (data) {
        if (data.code == 200) {
            gOrderTable.clearAll();

            data.data.forEach((e) => {
                gOrderTable.push(
                    new Order(e.order_number, e.user_id, e.name, e.order_date)
                );
            });
        }
    },
    error: function () {},
});

document.getElementById("search_wrapper").appendChild(gSearchForm.dom);

// 根据user对象给tr标签填充
function fFillTr(tr, order) {
    // 订单号
    const domTdOrderId = document.createElement("td");
    domTdOrderId.classList.add("tbl_order_id");
    domTdOrderId.innerHTML = order.orderId;
    tr.appendChild(domTdOrderId);

    // 学号/教职工号
    const domTdUserId = document.createElement("td");
    domTdUserId.classList.add("tbl_user_id");
    domTdUserId.innerHTML = order.userId;
    tr.appendChild(domTdUserId);

    // 姓名
    const domTdName = document.createElement("td");
    domTdName.classList.add("tbl_name");
    domTdName.innerHTML = order.name;
    tr.appendChild(domTdName);

    // 姓名
    const domTdDate = document.createElement("td");
    domTdDate.classList.add("tbl_date");
    domTdDate.innerHTML = order.orderDate;
    tr.appendChild(domTdDate);

    // 操作
    const domTdOperation = document.createElement("td");
    domTdOperation.classList.add("tbl_operation");

    const domBtnDetail = document.createElement("button");
    domBtnDetail.innerHTML = "查看";

    domBtnDetail.onclick = function () {
        // 查看详情按钮点击事件
        gAjax({
            url: `/admin/order/query/detail?order_number=${order.orderId}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    let idx = tr.rowIndex - 1;
                    gOrderTable.dataList[idx].identity = data.data.identity;
                    gOrderTable.dataList[idx].totalPlates =
                        data.data.total_plates;
                    gOrderTable.dataList[idx].amount = data.data.total_price;
                    gOrderTable.dataList[idx].platePicture =
                        data.data.order_img_url;
                    gOrderTable.dataList[idx].userAvatar = data.data.avatar_url;
                    gOrderTable.dataList[idx].description = JSON.stringify(
                        data.data.total_plates
                    );
                    showOrderDeatilDialog(idx);
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取用户详细信息失败");
            },
        });
    };

    domTdOperation.appendChild(domBtnDetail);
    tr.appendChild(domTdOperation);
}

function fillOrderDetailDialog(order) {
    domInputOrderId.value = order.orderId;
    domInputUserId.value = order.userId;
    domInputName.value = order.name;

    for (let i = 0; i < domSelectIdentity.options.length; i++) {
        if (domSelectIdentity.options[i] === order.identity) {
            domSelectIdentity.options[i].selected = i;
            break;
        }
    }

    domInputDescription.value = order.description;
    domInputAmount.value = order.amount;

    gUserAvatarControl.setWebSrc(`${ROOT_URL}${order.userAvatar}`, false);
    gPlateAvatarControl.setWebSrc(`${ROOT_URL}${order.platePicture}`, false);
    // gUserAvatarControl.src = order.userAvatar;
    // gPlateAvatarControl.src = order.platePicture;
}

function showOrderDeatilDialog(idx) {
    fillOrderDetailDialog(gOrderTable.dataList[idx]);
    window.location.href = "#order_detail_dlg";
}

function getOrderList(userId = "", name = "", identity = "") {
    let jsonObj = {};

    if (userId != "") {
        jsonObj.user_id = userId;
    }

    if (name != "") {
        jsonObj.name = name;
    }

    if (identity != "") {
        jsonObj.identity = parseInt(identity);
    }

    gAjax({
        url: "/admin/order/query/list",
        method: "get",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.code == 200) {
                data.data.forEach((e) => {
                    gOrderTable.push(
                        new Order(
                            e.order_number,
                            e.user_id,
                            e.name,
                            e.order_date
                        )
                    );
                });

                gOrderTable.refresh();
            }
        },
    });
}

// (function () {
//     for (let i = 0; i < 200; i++) {
//         let orderId = Math.ceil(Math.random() * 100);
//         let userId = Math.ceil(Math.random() * 100);
//         let date = Date();
//         gOrderTable.dataList.push(new Order(orderId, userId, "小明", date, orderId % 2 ? "学生" : "老师", 0));
//     }

//     gOrderTable.refresh();
// })();

window.onload = function () {
    getOrderList();
};
