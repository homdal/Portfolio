let elmsArr = [];

const createElm = (
  //create html element
  tagName,
  content,
  Width,
  Height,
  Color,
  BgColor,
  Size,
  BdWidth,
  BdStyle,
  BdColor,
  BdRadius,
  Margin,
  Padding
) => {
  if (tagName) {
    let pageDiv = document.querySelector("#pageDiv");
    let newElm = document.createElement(tagName);
    let Border = BdWidth + "px" + " " + BdStyle + " " + BdColor;
    pageDiv.appendChild(newElm);
    newElm.innerText = content;
    newElm.style.width = Width + "px";
    newElm.style.height = Height + "px";
    newElm.style.color = Color;
    newElm.style.backgroundColor = BgColor;
    newElm.style.fontSize = Size + "px";
    newElm.style.border = Border;
    newElm.style.borderRadius = BdRadius + "px";
    newElm.style.margin = Margin + "px";
    newElm.style.padding = Padding + "px";
    elmsArr.push({
      tagName,
      content,
      Width,
      Height,
      Color,
      BgColor,
      fontSize: Size,
      BorderWidth: BdWidth,
      BorderStyle: BdStyle,
      BorderColor: BdColor,
      BorderRadius: BdRadius,
      Margin,
      Padding,
    });
  }
};

const clearPage = () => {
  //clear all tags
  let pageDiv = document.querySelector("#pageDiv");
  pageDiv.innerHTML = "";
};

const restorePage = () => {
  //restore page from local storage
  elmsArr = [];
  let newElmsArr = [];
  let jsonStr = localStorage.getItem("tags");
  newElmsArr = JSON.parse(jsonStr);
  if (newElmsArr) {
    for (let item of newElmsArr) {
      createElm(
        item.tagName,
        item.content,
        item.Width,
        item.Height,
        item.Color,
        item.BgColor,
        item.fontSize,
        item.BorderWidth,
        item.BorderStyle,
        item.BorderColor,
        item.BorderRadius,
        item.Margin,
        item.Padding
      );
    }
  }
};

window.addEventListener("load", () => {
  document.querySelector("#form1").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  document.querySelector("#submitBtn").addEventListener("click", () => {
    let { value: inputTag } = document.querySelector("#inputTag");
    let { value: inputWidth } = document.querySelector("#inputWidth");
    let { value: inputHeight } = document.querySelector("#inputHeight");
    let { value: inputContent } = document.querySelector("#inputContent");
    let { value: inputColor } = document.querySelector("#inputColor");
    let { value: inputBgColor } = document.querySelector("#inputBgColor");
    let { value: inputSize } = document.querySelector("#inputSize");
    let { value: inputBorderWidth } =
      document.querySelector("#inputBorderWidth");
    let { value: inputBorderStyle } =
      document.querySelector("#inputBorderStyle");
    let { value: inputBorderColor } =
      document.querySelector("#inputBorderColor");
    let { value: inputBorderRadius } =
      document.querySelector("#inputBorderRadius");
    let { value: inputMargin } = document.querySelector("#inputMargin");
    let { value: inputPadding } = document.querySelector("#inputPadding");
    createElm(
      inputTag,
      inputContent,
      inputWidth,
      inputHeight,
      inputColor,
      inputBgColor,
      inputSize,
      inputBorderWidth,
      inputBorderStyle,
      inputBorderColor,
      inputBorderRadius,
      inputMargin,
      inputPadding
    );
  });
  document.querySelector("#saveBtn").addEventListener("click", () => {
    let jsonStr = JSON.stringify(elmsArr);
    localStorage.setItem("tags", jsonStr);
  });
  document.querySelector("#clearBtn").addEventListener("click", () => {
    const check = confirm("Are you sure you want to clear the page?");
    if (check) {
      clearPage();
    }
  });
  document.querySelector("#deleteBtn").addEventListener("click", () => {
    const check = confirm("Are you sure you want to delete your saved data?");
    if (check) {
      clearPage();
      localStorage.clear();
    }
  });
  restorePage();
});
