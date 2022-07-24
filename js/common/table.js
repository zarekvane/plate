/**
 * 下标从0开始
 */

class Table {
    constructor(dom, dataList = [], fFillTr = (tr, data) => {}) {
        /**
         * param:
         *   dom: 文档对象
         *   headers: 表头
         *   data: 数据列表
         *   fFillTr: 根据data，对某个tr进行填充
         */

        this.dom = dom;
        this.dataList = dataList;
        this.fFillTr = fFillTr;

        this.tbody = dom.createTBody();
    }

    push(data) {
        // 追加元素
        this.dataList.push(data);
        let tr = document.createElement("tr");
        this.fFillTr(tr, data);
        this.tbody.appendChild(tr);
    }

    insertRow(pos, data) {
        this.dataList.splice(pos, 0, data);
        let tr = this.tbody.insertRow(pos + 1);
        this.fFillTr(tr, data);
    }

    deleteRow(pos) {
        this.dataList.splice(pos, 1);
        this.tbody.deleteRow(pos + 1);
    }

    clearAll() {
        this.tbody.innerHTML = "";
        this.dataList = [];
    }

    refresh() {
        this.tbody.innerHTML = "";
        this.dataList.forEach((data) => {
            let tr = document.createElement("tr");
            this.fFillTr(tr, data);
            this.tbody.appendChild(tr);
        });
    }
}

document.querySelectorAll(".tbl_wrapper").forEach((value) => {
    value.addEventListener("scroll", function () {
        this.querySelector(
            "thead"
        ).style.transform = `translateY(${this.scrollTop}px)`;
    });
});
