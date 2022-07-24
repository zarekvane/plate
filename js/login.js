const domInputUserId = document.getElementById("input_user_id");
const domInputPassword = document.getElementById("input_password");
const domBtnLogin = document.getElementById("btn_login");

domBtnLogin.onclick = function () {
    let userId = domInputUserId.value;
    let password = domInputPassword.value;
    password = SHA256(password);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);

            if (data.code == 200) {
                token = data.data;
                gSetToken(token);
                window.location.href = "user.html";
            } else {
                alert(data.message + ": " + data.data);
            }
        }
    };

    xhr.open("POST", `${BASE_URL}/admin/login`, true);
    xhr.setRequestHeader("content-type", "application/json");

    xhr.send(
        JSON.stringify({
            user_id: userId,
            password: password,
        })
    );
};
