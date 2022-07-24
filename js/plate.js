class Plate {
    constructor(plateName, price, picture) {
        this.plateName = plateName;
        this.price = price;
        this.picture = picture;
    }
}

var plateTable = new Table(document.getElementById("tbl_plates"), [], fFillTr);

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
    platePriceTd.appendChild(priceInput);
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
                plateTable.clearAll();
                data.data.forEach((e) => {
                    plateTable.push(
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
