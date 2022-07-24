class Plate {
    constructor(plateName, price, picture) {
        this.plateName = plateName;
        this.price = price;
        this.picture = picture;
    }
}

var gPlateTable = new Table(document.getElementById("tbl_plates"), [], fFillTr);
var gNewPriceMap = new Map();

function fFillTr(tr, plate) {
    let plateNameTd = document.createElement("td");
    plateNameTd.innerHTML = plate.plateName;
    tr.appendChild(plateNameTd);

    let platePriceTd = document.createElement("td");
    let priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.min = "0.00";
    priceInput.step = "0.01";
    priceInput.value = plate.price;

    priceInput.onchange = function () {
        gNewPriceMap.set(plate.plateName, plate.price);
    };

    platePriceTd.appendChild(priceInput);

    let priceBtn = document.createElement("button");
    priceBtn.innerHTML = "修改";

    priceBtn.onclick = function () {
        gAjax({
            url: "/admin/plate/change",
            method: "post",
            data: JSON.stringify({
                plate_name: plate.plateName,
                price: plate.price,
                picture: plate.price,
            }),
            success: (data) => {
                if (data.code == 200) {
                    alert(data.data);
                }
            },
        });
    };

    platePriceTd.appendChild(priceBtn);

    tr.appendChild(platePriceTd);

    let picTd = document.createElement("td");
    let img = document.createElement("img");
    setWebImg(img, `${ROOT_URL}${plate.picture}`);

    picTd.appendChild(img);
    tr.appendChild(picTd);
}

function getPlateList() {
    gAjax({
        url: "/admin/plate/list",
        method: "get",
        success: (data) => {
            if (data.code == 200) {
                gPlateTable.clearAll();
                data.data.forEach((e) => {
                    gPlateTable.push(
                        new Plate(e.plate_name, e.price, e.plate_img_url)
                    );
                });
            }
        },
    });
}

window.onload = function () {
    getPlateList();
};
