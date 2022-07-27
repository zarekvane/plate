class Feedback {
    constructor(
        feedbackId,
        userId,
        name,
        feedbackTime = "",
        orderId = "",
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

const gFeedbackTable = new Table(document.getElementById("tbl_feedbacks"), [], fFillTr)
