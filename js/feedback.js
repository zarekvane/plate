class Feedback {
    constructor(
        feedbackId,
        userId,
        name,
        feedbackTime = "",
        orderId = "",
        orderTime = "",
        plateDetails = [],
        description = "",
        result = "",
        platePicture = "",
        userAvatar = ""
    ) {
        this.feedbackId = feedbackId;
        this.userId = userId;
        this.name = name;

        this.feedbackTime = feedbackTime;
        this.orderId = orderId;
        this.orderTime = orderTime;

        this.plateDetails = plateDetails;
        this.description = description;
        this.result = result;
        this.platePicture = platePicture;
        this.userAvatar = userAvatar;
    }
}

var gReadNum = 0;
var gUnreadNum = 0;

const gFeedbackTable = new Table(
    document.getElementById("tbl_feedbacks"),
    [],
    fFillTr
);

const domFeatureSpanWrapper = document.getElementById("plate_detail_wrapper");

function fFillTr(tr, feedback) {
    let feedbackIdTd = document.createElement("td");
    feedbackIdTd.innerHTML = feedback.feedbackId;
    tr.appendChild(feedbackIdTd);

    let userIdTd = document.createElement("td");
    userIdTd.innerHTML = feedback.userId;
    tr.appendChild(userIdTd);

    let nameTd = document.createElement("td");
    nameTd.innerHTML = feedback.name;
    tr.appendChild(nameTd);

    let feedbackTimeTd = document.createElement("td");
    feedbackTimeTd.innerHTML = feedback.feedbackTime;
    tr.appendChild(feedbackTimeTd);

    let opTd = document.createElement("td");
    let btn = document.createElement("button");
    btn.innerHTML = "进行审核";

    btn.onclick = function () {
        gAjax({
            url: `/admin/feedback/detail?feedback_number=${feedback.feedbackId}`,
            method: "get",
            success: (data) => {
                if (data.code == 200) {
                    let idx = tr.rowIndex - 1;
                    gFeedbackTable.dataList[idx].name = data.data.name;
                    gFeedbackTable.dataList[idx].feedbackTime =
                        data.data.feedback_create_time;
                    gFeedbackTable.dataList[idx].orderId =
                        data.data.order_number;
                    gFeedbackTable.dataList[idx].userId = data.data.user_id;
                    gFeedbackTable.dataList[idx].userAvatar =
                        data.data.avatar_url;
                    gFeedbackTable.dataList[idx].platePicture =
                        data.data.order_img_url;
                    gFeedbackTable.dataList[idx].description =
                        data.data.feedback_description;
                    gFeedbackTable.dataList[idx].result =
                        data.data.feedback_result;
                    gFeedbackTable.dataList[idx].plateDetails = JSON.stringify(
                        data.data.plate_name
                    );

                    fillFeedbackDialog(idx);
                    window.location.href = "#feedback_dlg";
                } else {
                    alert(data.data);
                }
            },
        });
    };
    opTd.appendChild(btn);
    tr.appendChild(opTd);
}

function getFeedbackStatus() {
    gAjax({
        url: "/admin/feedback/status",
        method: "get",
        success: (data) => {
            if (data.code == 200) {
                gReadNum = data.data.processed_feedback;
                gUnreadNum = data.data.not_processed_feedback;
                document.getElementById("span_read_num").innerHTML = gReadNum;
                document.getElementById("span_unread_num").innerHTML =
                    gUnreadNum;
            }
        },
    });
}

document.getElementById("a_read").onclick = function () {};

document.getElementById("a_unread").onclick = function () {};

function getFeedbackList(status) {
    if (status == undefined) {
        status = 0;
    }

    gAjax({
        url: `/admin/feedback/list?status=${status}`,
        method: "get",
        success: (data) => {
            if (data.code == 200) {
                data.data.forEach((e) => {
                    gFeedbackTable.push(
                        new Feedback(
                            e.feedback_number,
                            e.user_id,
                            e.name,
                            e.feedback_create_time
                        )
                    );
                });
            } else {
                alert(data.data);
            }
        },
    });
}

function fillFeedbackDialog(idx) {
    let feedback = gFeedbackTable.dataList[idx];
    document.getElementById("input_feedback_time").value =
        feedback.feedbackTime;
    document.getElementById("input_order_id").value = feedback.orderId;
    document.getElementById("input_order_time").value = feedback.orderTime;
    document.getElementById("input_user_id").value = feedback.userId;
    document.getElementById("input_name").value = feedback.name;
    document.getElementById("input_feedback_description").value =
        feedback.description;
    document.getElementById("input_feedback_result").value =
        feedback.result;
}

window.onload = function () {
    getFeedbackStatus();
    getFeedbackList(0);
};
