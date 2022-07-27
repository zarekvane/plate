class SearchForm {
    /*
    <form class="search_form">
        <div>
            <label for="search_id">学号/教职工号:</label>
            <input type="text" name="id" />
        </div>
        <div>
            <label for="search_name">姓名:</label>
            <input type="text" name="name" />
        </div>
        <div>
            <label for="search_identity">身份:</label>
            <select name="identity">
                <option value="">所有</option>
                <option value="0">学生</option>
                <option value="1">老师</option>
            </select>
        </div>
        <button id="btn_search" type="button">搜索</button>
    </this.dom>
    */
    constructor(params) {
        let { url, success, error } = params;
        this.url = url;
        this.success = success;
        this.error = error;
        this.createDom();
    }

    createDom() {
        let _this = this;

        this.dom = document.createElement("form");
        this.dom.action = "#";
        this.dom.classList.add("search_form");

        // <div>
        let divUserId = document.createElement("div");
        let labelUserId = document.createElement("label");
        labelUserId.innerHTML = "学号/教职工号:";
        divUserId.appendChild(labelUserId);

        this.domInputUserId = document.createElement("input");
        this.domInputUserId.type = "text";
        this.domInputUserId.name = "user_id";
        divUserId.appendChild(this.domInputUserId);
        // </div>
        this.dom.appendChild(divUserId);

        // <div>
        let divName = document.createElement("div");

        let labelName = document.createElement("label");
        labelName.innerHTML = "姓名:";
        divName.appendChild(labelName);

        this.domInputName = document.createElement("input");
        this.domInputName.type = "text";
        this.domInputName.name = "name";
        divName.appendChild(this.domInputName);
        // </div>
        this.dom.appendChild(divName);

        // <div>
        let divIdentity = document.createElement("div");

        let labelIdentity = document.createElement("label");
        labelIdentity.innerHTML = "身份:";
        divIdentity.appendChild(labelIdentity);

        this.domSelectIdentity = document.createElement("select");
        this.domSelectIdentity.name = "identity";
        this.domSelectIdentity.innerHTML = `
            <option value="">所有</option>
            <option value="0">学生</option>
            <option value="1">老师</option>
        `.trim();

        divIdentity.appendChild(this.domSelectIdentity);
        // </div>
        this.dom.appendChild(divIdentity);

        this.searchBtn = document.createElement("button");
        this.searchBtn.innerHTML = "搜索";
        this.searchBtn.type = "button";

        this.searchBtn.onclick = function () {
            let userId = _this.domInputUserId.value.trim();
            let name = _this.domInputName.value.trim();
            let identity =
                _this.domSelectIdentity.options[
                    _this.domSelectIdentity.selectedIndex
                ].value;

            let url = _this.url + "?";

            let isFirstParam = true;

            if (userId != "") {
                url += `user_id=${userId}`;
                isFirstParam = false;
            }

            if (name != "") {
                if (isFirstParam) {
                    isFirstParam = false
                } else {
                    url += "&";
                }

                url += `name=${name}`;
            }

            if (identity != "") {
                if (isFirstParam) {
                    isFirstParam = false
                } else {
                    url += "&";
                }

                url += `&identity=${parseInt(identity)}`;
            }

            console.log(url);

            gAjax({
                url: url,
                method: "get",
                success: _this.success,
                error: _this.error,
            });
        };

        this.dom.appendChild(this.searchBtn);
    }
}
