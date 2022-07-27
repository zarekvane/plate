var domBtnUpload = document.getElementById('btn_add_excel')
var domFormUpload = document.getElementById('uploadForm')
var totalNumber = document.getElementById('total_number')
var errorNumber = document.getElementById('error_number')
var compareNumber = document.getElementById('compare_number')

const gExcelTable = new Table(document.getElementById("tbl_excelList"), [], fFillTr);


const domTableOrders = document.getElementById("tbl_orders");

var gPlateAvatarControl = new AvatarControl("餐盘图片");
gPlateAvatarControl.disable();
var gUserAvatarControl = new AvatarControl("用户照片");
gUserAvatarControl.disable();

document
    .getElementById("plate_picture_wrapper")
    .appendChild(gPlateAvatarControl.dom);
document
    .getElementById("user_avatar_wrapper")
    .appendChild(gUserAvatarControl.dom);

const domInputOrderId = document.getElementById("input_detail_order_id");
const domInputUserId = document.getElementById("input_detail_user_id");
const domInputName = document.getElementById("input_detail_name");
const domSelectIdentity = document.getElementById("select_detail_identity");
const domInputDescription = document.getElementById("input_detail_description");
const domInputAmount = document.getElementById("input_detail_amount");

var table_data = {}

class compareData {
    constructor(
        status = 0,
        from_excel = {
            date: "",
            amount: 0,
            user_id: ""
        },
        from_db = {
            date: "",
            amount: 0,
            user_id: ""
        },
    ) {
        this.status = status;
        this.from_excel = from_excel;
        this.from_db = from_db;
    }
}

domFormUpload.onchange = () => {
    let file = domFormUpload[0].files[0]
    let fileObj = { file: file}
    uploadCompare(fileObj).then(res=>{
        table_data = res.compare

        // update chart
        totalNumber.innerHTML = res.excel_sales
        errorNumber.innerHTML = res.except_sales
        compareNumber.innerHTML = res.except_amount
 
        if(res.compare && res.compare instanceof Array){
            res.compare.forEach((e) => {
                excel_chart_data.flag.push(e.from_excel.date)
                excel_chart_data.data_excel.push(e.from_excel.amount)
                excel_chart_data.data_db.push(e.from_db.amount)
            })
        }
        excel_chart.setOption(excel_chart_option);

        // update table
        table_data.forEach((e) => {
            gExcelTable.dataList.push(new compareData(e.status, e.from_excel, e.from_db));
        });
        gExcelTable.refresh();

    })
}


function uploadCompare(file) {
    return new Promise((resolve, reject)=>{
        gAjaxFiles({
            url: `/admin/order/compare/upload`,
            type: "multipart/form-data",
            method: "post",
            data: file,
            contentType:false,
            processData: false,
            success: function (data) {
                if (data.code == 200) {
                    resolve(data.data)
                } else {
                    alert(data.data);
                    reject(data.data)
                }
            },
            error: function () {
                alert("获取数据失败");
            },
        });
    })
}

var excel_chart = echarts.init(document.getElementById('excel_chart'));
var excel_chart_data = { flag: [], data_excel: [], data_db: []}

var excel_chart_option = {
    title: {
        text: '账单对比图',
        textStyle:{
            color:'white',
            fontStyle:'normal',
            fontWeight:'bold',
            fontFamily:'sans-serif',
    　　　　 fontSize:18
        }
    },
    legend: {
        data: ['后台账单', '人工账单']
    },
    tooltip: {},
    xAxis: {
        name: '日期',
        data: excel_chart_data.flag
    },
    yAxis: {
        name:'金额'
    },
    series: [
        {
            name: '后台账单',
            data: excel_chart_data.data_db,
            type: 'line',
        },
        {
            name: '人工账单',
            data: excel_chart_data.data_excel,
            type: 'line',
        }
    ]
};



function fFillTr(tr, data) {
    if(data.status == -1){
        tr.style.color = 'red'
    }else if(data.status != 0){
        tr.style.color = 'blue'

    }
    // date_excel
    const domTdExcelDate = document.createElement("td");
    domTdExcelDate.classList.add("tbl_date_excel");
    domTdExcelDate.innerHTML = data.from_excel.date;
    tr.appendChild(domTdExcelDate);

    // date_amount
    const domTdExcelAmount = document.createElement("td");
    domTdExcelAmount.classList.add("tbl_amount_excel");
    domTdExcelAmount.innerHTML = data.from_excel.amount;
    tr.appendChild(domTdExcelAmount);

    // db_excel
    const domTdDbDate = document.createElement("td");
    domTdDbDate.classList.add("tbl_date_db");
    domTdDbDate.innerHTML = data.from_db.date;
    tr.appendChild(domTdDbDate);

    // db_amount
    const domTdDbAmount = document.createElement("td");
    domTdDbAmount.classList.add("tbl_amount_db");
    domTdDbAmount.innerHTML = data.from_db.amount;
    tr.appendChild(domTdDbAmount);


    // 操作
    const domTdOperation = document.createElement("td");
    domTdOperation.classList.add("tbl_detail");

    const domBtnDetail = document.createElement("button");
    domBtnDetail.innerHTML = "详细";

    domBtnDetail.onclick = function () {
        gAjax({
            url: `/admin/order/compare/query?user_id=${data.from_db.user_id}&date=${data.from_db.date}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    let idx = tr.rowIndex - 1;
                    gExcelTable.dataList[idx].order = data.data;
                    showDetailDialog(idx);
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取详细信息失败");
            },
        });
    };
    domTdOperation.appendChild(domBtnDetail);
    tr.appendChild(domTdOperation);
    
}

function showDetailDialog(idx) {
    fillDetailDialog(gExcelTable.dataList[idx].order);
    window.location.href = "#order_detail_dlg";
}

function fillDetailDialog(order) {
    domInputOrderId.value = order.order_number;
    domInputUserId.value = order.user_id;
    domInputName.value = order.name;

    for (let i = 0; i < domSelectIdentity.options.length; i++) {
        if (domSelectIdentity.options[i] === order.identity) {
            domSelectIdentity.options[i].selected = i;
            break;
        }
    }
    let desVal = ''
    order.total_plates.forEach(e=>{
        desVal += `${e.plate_name}:${e.plate_count};`
    })
    domInputDescription.value = desVal;
    domInputAmount.value = order.total_price;

    gUserAvatarControl.setWebSrc(`${ROOT_URL}${order.avatar_url}`, false);
    gPlateAvatarControl.setWebSrc(`${ROOT_URL}${order.order_img_url}`, false);
    // gUserAvatarControl.src = order.userAvatar;
    // gPlateAvatarControl.src = order.platePicture;
}