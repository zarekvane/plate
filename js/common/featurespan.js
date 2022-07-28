class FeatureSpanWrapper {
    constructor(dom) {
        this.dom = dom;
    }

    add(content) {
        let span = this.createFeatureSpan(content);
        this.dom.appendChild(span);
    }

    getSpanList() {
        return Array.from(this.dom.children)
            .map((e) => e.getElementsByTagName("input")[0].value.trim())
            .filter((e) => e != "");
    }

    clear() {
        this.dom.innerHTML = "";
    }

    createFeatureSpan(content) {
        /**
         * param:
         *     content: str
         */

        let domSpan = document.createElement("span");
        domSpan.classList.add("feature_span");

        let contentInput = document.createElement("input");
        contentInput.value = content;
        contentInput.placeholder = "请输入...";
        contentInput.classList.add("span_content")
        domSpan.appendChild(contentInput);

        // domSpan.innerHTML = `<span>${content}</span>`;

        let domButton = document.createElement("button");
        domButton.classList.add("span_close");
        domButton.innerHTML = "&times;";

        domButton.onclick = function () {
            domSpan.remove();
        };

        domSpan.appendChild(domButton);

        return domSpan;
    }
}
