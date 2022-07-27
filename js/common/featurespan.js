class FeatureSpanWrapper {
    constructor(dom) {
        this.dom = dom;
        this.spanMap = new Map();
    }

    add(content) {
        if (!this.spanMap.has(content)) {
            let span = this.createFeatureSpan(content);
            this.spanMap.set(content, span);
            this.dom.appendChild(span);
        }
    }

    delete(content) {
        if (this.spanMap.has(content)) {
            this.spanMap.get(content).remove();
            this.spanMap.delete(content);
        }
    }

    getSpanList() {
        return [...this.spanMap.keys()]
    }

    clear() {
        this.dom.innerHTML = "";
        this.spanMap = new Map();
    }

    createFeatureSpan(content) {
        /**
         * param:
         *     content: str
         */

        let domSpan = document.createElement("span");
        domSpan.classList.add("feature_span");
        domSpan.innerHTML = `<span>${content}</span>`;

        let domButton = document.createElement("button");
        domButton.classList.add("span_close");
        domButton.innerHTML = "&times;";

        let _this = this;

        domButton.onclick = function () {
            _this.delete(content);
        };

        domSpan.appendChild(domButton);

        return domSpan;
    }
}
