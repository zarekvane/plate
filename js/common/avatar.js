/** 图片上传控件 */

class AvatarControl {
    constructor(
        slogan = "",
        uploadUrl = "/admin/user/upload/avatar",
        src = "images/default_avatar.svg"
    ) {
        this.slogan = slogan;
        this.src = src;
        this.uploadUrl = uploadUrl;
        this.createDom();
        this.disabled = false;
    }

    createDom() {
        /*
        <div class="avatar_control">
            <div class="avatar_preview">
                <img src="images/default_avatar.svg" id="img_avatar" title="上传头像" />
                <input type="file" id="input_avatar" accept="image/*" />
            </div>
            <label for="input_avatar">上传头像</label>
        </div>
        */
        let _this = this;

        let avatarControl = document.createElement("div");
        avatarControl.classList.add("avatar_control");

        let avatarPreview = document.createElement("div");
        avatarPreview.classList.add("avatar_preview");

        this.img = document.createElement("img");
        this.src = this.img.src = this.src == undefined ? "" : this.src;

        this.img.src = this.src;
        avatarPreview.appendChild(this.img);

        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.accept = "image/*";

        this.fileInput.onchange = function () {
            if (_this.disabled) {
                return;
            }

            const file = this.files[0];
            let reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = function () {
                // 执行上传操作
                gAjaxFiles({
                    url: "/admin/user/upload/avatar",
                    data: {
                        file: file,
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            setWebImg(_this.img, `${ROOT_URL}${data.data}`);
                        } else {
                            alert(data.data);
                        }
                    },
                });
            };

            reader.onerror = function () {
                alert("头像上传出现错误");
            };
        };

        avatarPreview.appendChild(this.fileInput);

        avatarControl.appendChild(avatarPreview);

        let span = document.createElement("span");
        span.innerHTML = this.slogan;

        avatarControl.appendChild(span);

        avatarControl.onclick = function () {
            _this.fileInput.click();
        };

        this.dom = avatarControl;
    }

    setWebSrc(src) {
        let _this = this;
        this.src = src;

        gAjaxImg({
            url: src,
            success: (data) => {
                _this.img.src = window.URL.createObjectURL(data);
            },
            error: () => {
                alert(`图片访问失败: ${_this.src}`);
            },
        });
    }

    disable() {
        this.fileInput.setAttribute("disabled", "disabled");
    }

    enable() {
        this.fileInput.removeAttribute("disabled");
    }
}
