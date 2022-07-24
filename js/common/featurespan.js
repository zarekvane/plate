function createFeatureSpan(content) {
    /**
     * param:
     *     content: str
     */

    let domSpan = document.createElement("span");
    domSpan.classList.add("feature_span");
    domSpan.innerHTML = `<span>${content}</span>`;

    let domButton = document.createElement("button");
    domButton.classList.add("close");
    domButton.innerHTML = "&times;"

    domSpan.appendChild(domButton);

    return domSpan;
}
