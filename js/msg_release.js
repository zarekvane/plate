class Msg {
    constructor(
        date = "",
        title = "",
        body = ""
    ) {
        this.date = date;
        this.title = title;
        this.body = body;
    }
}

const gMsgTable = new Table(document.getElementById("tbl_msgList"), [], fFillTr);
const domInputDate = document.getElementById("input_edit_date");
const domInputTitle = document.getElementById("input_edit_title");
const domInputBody = document.getElementById("input_edit_body");
const domBtnAddMsg = document.getElementById("btn_add_msg");
const domBtnConfirmMsg = document.getElementById("btn_confirm_msg");


let isAdding = true;

/* 获取消息列表 */
function getMsgList() {
    gAjax({
        url: "/admin/news/list",
        method: "get",
        // data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.code == 200) {
                data.data.forEach((e) => {
                    gMsgTable.dataList.push(new Msg(e.date, e.title));
                });
                gMsgTable.refresh();
            }
        },
    });
}


// 根据msg对象给tr标签填充
function fFillTr(tr, msg) {
    // date
    const domTdId = document.createElement("td");
    domTdId.classList.add("tbl_date");
    domTdId.innerHTML = msg.date;
    tr.appendChild(domTdId);

    // title
    const domTdName = document.createElement("td");
    domTdName.classList.add("tbl_title");
    domTdName.innerHTML = msg.title;
    tr.appendChild(domTdName);


    // 操作
    const domTdOperation = document.createElement("td");
    domTdOperation.classList.add("tbl_operation");

    const domBtnEdit = document.createElement("button");
    domBtnEdit.innerHTML = "查看";

    domBtnEdit.onclick = function () {
        gAjax({
            url: `/admin/news/detail?date=${msg.date}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    let idx = tr.rowIndex - 1;
                    gMsgTable.dataList[idx].date = data.data.date;
                    gMsgTable.dataList[idx].title = data.data.title;
                    gMsgTable.dataList[idx].body = data.data.body;
                    showEditMsgDialog(idx);
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取消息详细信息失败");
            },
        });
    };

    const domBtnDelete = document.createElement("button");
    domBtnDelete.innerHTML = "删除";

    domBtnDelete.onclick = function () {
        if (confirm("是否删除?")) {
            gAjax({
                data: JSON.stringify({ date: msg.date }),
                method: "post",
                url: "/admin/news/remove",
                success: (data) => {
                    alert(data.data);
                    if (data.code == 200) {
                        let idx = tr.rowIndex - 1;
                        gMsgTable.deleteRow(idx);
                    }
                },
                error: () => alert("删除请求失败"),
            });
        }
    };

    domTdOperation.appendChild(domBtnEdit);
    domTdOperation.appendChild(domBtnDelete);
    tr.appendChild(domTdOperation);
}


// 显示第idx项用户的对话框
function showEditMsgDialog(idx) {
    domInputDate.setAttribute("disabled", "disabled");
    domInputTitle.setAttribute("disabled", "disabled");
    domInputBody.setAttribute("disabled", "disabled");

    let msg = null;

    if (idx >= 0) {
        msg = gMsgTable.dataList[idx];
        isAdding = false;
        fillEditMsgDialog(msg);
    } else {
        // 添加操作
        domInputDate.removeAttribute("disabled");
        domInputTitle.removeAttribute("disabled");
        domInputBody.removeAttribute("disabled");

        msg = new Msg()
        msg.date = getNowFormatTime()
        fillEditMsgDialog(msg);
        isAdding = true;
    }
    window.location.href = "#msg_detail_dlg";
}


// 根据user的信息填充对话框
function fillEditMsgDialog(msg) {
    domInputDate.value = msg.date;
    domInputTitle.value = msg.title;
    domInputBody.value = msg.body;
}

domBtnAddMsg.onclick = function () {
    showEditMsgDialog(-1);
};

// 发送新增消息请求
domBtnConfirmMsg.onclick = function () {
    if (isAdding) {
        // 如果是添加
        gAjax({
            url: "/admin/news/upload",
            type: "application/json",
            method: "post",
            data: JSON.stringify([
                {
                    title: domInputTitle.value,
                    body: domInputBody.value
                },
            ]),
            success: (data) => {
                alert(data.data);
                window.location.href = "#";
                window.location.reload();
            },
            error: () => alert("添加请求发送失败"),
        });
    } else {
        window.location.href = "#";
        // window.location.reload();
    }
};

window.onload = function () {
    getMsgList();
};
