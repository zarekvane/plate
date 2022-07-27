class User {
    constructor(
        id = "",
        name = "",
        identity = "学生",
        phone = "",
        nickname = "",
        address = "",
        password = "",
        avatar = ""
    ) {
        this.id = id;
        this.name = name;
        this.identity = identity;
        this.phone = phone;
        this.nickname = nickname;
        this.address = address;
        this.password = password;
        this.avatar = avatar; // url
    }
}

const domBtnAddUser = document.getElementById("btn_add_user");
const domBtnConfirmUser = document.getElementById("btn_confirm_user");

const domAvatarWrapper = document.getElementById("avatar_wrapper");
const domInputAvatar = document.getElementById("input_avatar");
const domInputId = document.getElementById("input_edit_id");
const domInputName = document.getElementById("input_edit_name");
const domSelectIdentity = document.getElementById("select_edit_identity");
const domInputPhone = document.getElementById("input_edit_phone");
const domInputNickname = document.getElementById("input_edit_nickname");
const domInputAddress = document.getElementById("input_edit_address");
const domInputPassword = document.getElementById("input_edit_password");

const gUserTable = new Table(document.getElementById("tbl_users"), [], fFillTr);

// 头像控件
const avatarControl = new AvatarControl("上传头像", "/admin/user/upload/avatar");
domAvatarWrapper.appendChild(avatarControl.dom);

var isAdding = true;

// 根据user对象给tr标签填充
function fFillTr(tr, user) {
    // 学号/教职工号
    const domTdId = document.createElement("td");
    domTdId.classList.add("tbl_id");
    domTdId.innerHTML = user.id;
    tr.appendChild(domTdId);

    // 姓名
    const domTdName = document.createElement("td");
    domTdName.classList.add("tbl_name");
    domTdName.innerHTML = user.name;
    tr.appendChild(domTdName);

    // 身份
    const domTdIdentity = document.createElement("td");
    domTdIdentity.classList.add("tbl_identity");
    domTdIdentity.innerHTML = user.identity;
    tr.appendChild(domTdIdentity);

    // 操作
    const domTdOperation = document.createElement("td");
    domTdOperation.classList.add("tbl_operation");

    const domBtnEdit = document.createElement("button");
    domBtnEdit.innerHTML = "编辑";

    domBtnEdit.onclick = function () {
        gAjax({
            url: `/admin/user/query/detail?user_id=${user.id}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    let idx = tr.rowIndex - 1;
                    gUserTable.dataList[idx].id = data.data.user_id;
                    gUserTable.dataList[idx].phone = data.data.cellphone_number;
                    gUserTable.dataList[idx].address = data.data.address;
                    gUserTable.dataList[idx].sex = data.data.sex;
                    gUserTable.dataList[idx].nickname = data.data.nickname;
                    gUserTable.dataList[idx].avatar = `${ROOT_URL}${data.data.avatar_url}`;
                    showEditUserDialog(idx);
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取用户详细信息失败");
            },
        });
    };

    const domBtnDelete = document.createElement("button");
    domBtnDelete.innerHTML = "删除";

    domBtnDelete.onclick = function () {
        if (confirm("是否删除?")) {
            gAjax({
                data: JSON.stringify({ user_id: user.id }),
                method: "post",
                url: "/admin/user/delete",
                success: (data) => {
                    alert(data.data);

                    if (data.code == 200) {
                        let idx = tr.rowIndex - 1;
                        gUserTable.deleteRow(idx);
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

function getUserList(userId = "", name = "", identity = -1) {
    let jsonObj = {
        user_id: userId,
        name: name,
    };

    if (identity != "") {
        jsonObj.identity = parseInt(identity);
    }

    gAjax({
        url: "/admin/user/query/list",
        method: "get",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.code == 200) {
                data.data.forEach((e) => {
                    gUserTable.dataList.push(new User(e.user_id, e.name, e.identity));
                });

                gUserTable.refresh();
            }
        },
    });
}

// 根据user的信息填充对话框
function fillEditUserDialog(user) {
    domInputId.value = user.id;
    domInputName.value = user.name;

    for (let i = 0; i < domSelectIdentity.options.length; i++) {
        if (domSelectIdentity.options[i] === user.identity) {
            domSelectIdentity.options[i].selected = i;
            break;
        }
    }

    domInputPhone.value = user.phone;
    domInputNickname.value = user.nickname;
    domInputAddress.value = user.address;
    domInputPassword.value = user.password;

    // domInputAvatar
    avatarControl.setWebSrc(user.avatar, false);
    avatarControl.img.src = user.avatar;
}

// 显示第idx项用户的对话框
function showEditUserDialog(idx) {
    avatarControl.img.setAttribute("disabled", "disabled");
    domInputId.setAttribute("disabled", "disabled");
    domInputName.setAttribute("disabled", "disabled");
    domSelectIdentity.setAttribute("disabled", "disabled");
    domInputPhone.setAttribute("disabled", "disabled");
    domInputNickname.setAttribute("disabled", "disabled");
    domInputAddress.setAttribute("disabled", "disabled");
    domInputPassword.setAttribute("disabled", "disabled");

    let user = null;

    if (idx >= 0) {
        // 编辑操作
        avatarControl.disable();
        domInputPassword.removeAttribute("disabled");
        user = gUserTable.dataList[idx];
        isAdding = false;
        fillEditUserDialog(user);
    } else {
        // 添加操作
        avatarControl.enable();
        avatarControl.img.removeAttribute("disabled");
        domInputId.removeAttribute("disabled");
        domInputName.removeAttribute("disabled");
        domSelectIdentity.removeAttribute("disabled");

        if (isAdding == false) {
            // 说明上一次是编辑操作，需要清空对话框
            fillEditUserDialog(new User());
        }

        isAdding = true;
    }

    window.location.href = "#edit_user_dlg";
}

domBtnAddUser.onclick = function () {
    showEditUserDialog(-1);
};

domBtnConfirmUser.onclick = function () {
    if (isAdding) {
        // 如果是添加
        gAjax({
            url: "/admin/user/upload/info",
            type: "application/json",
            method: "post",
            data: JSON.stringify([
                {
                    user_id: domInputId.value,
                    name: domInputName.value,
                    identity: parseInt(domSelectIdentity.options[domSelectIdentity.selectedIndex].value),
                    avatar_url: avatarControl.src,
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
        // 如果是编辑
        gAjax({
            url: "/admin/user/change-password",
            type: "application/json",
            method: "post",
            data: JSON.stringify({
                user_id: domInputId.value,
                password: domInputPassword.value,
            }),
            success: (data) => {
                alert(data.data);
                window.location.href = "#";
                window.location.reload();
            },
            error: () => alert("修改密码请求发送失败"),
        });
    }
};

// 搜索功能
var gSearchForm = new SearchForm({
    url: "/admin/user/query/list",
    success: function (data) {
        if (data.code == 200) {
            gUserTable.clearAll();

            data.data.forEach((e) => {
                gUserTable.push(new User(e.user_id, e.name, e.identity));
            });

            alert("查询成功");
        } else {
            alert(data.data);
        }
    },
    error: function () {
        alert("搜索请求发送失败");
    },
});

document.getElementById("search_wrapper").appendChild(gSearchForm.dom);

window.onload = function () {
    getUserList();
};
