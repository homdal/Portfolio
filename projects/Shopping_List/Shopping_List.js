window.addEventListener("load", () => {
  document.querySelector("#addBtn").addEventListener("click", () => {
    let { value: item } = document.querySelector("#inputItem");
    let { value: quantity } = document.querySelector("#quantity");
    if (!item) {
      document.querySelector("#inputItem").classList.add("empty");
      return;
    }
    if (!quantity) {
      document.querySelector("#quantity").classList.add("empty");
      return;
    }
    if (item && quantity) {
      document.querySelector("#inputItem").classList.remove("empty");
      document.querySelector("#quantity").classList.remove("empty");
      createItem(item, quantity);
    }
  });
  restoreList();
  document.querySelector("#deleteBtn").addEventListener("click", () => {
    const check = confirm("Are you sure you want to delete your list?");
    if (check) {
      clearList();
    }
  });
});
let shoppingList = [];

const createItem = (item, quantity) => {
  let itemInput = document.querySelector("#inputItem");
  itemInput.value = "";
  let list = document.querySelector("#list");
  let newItem = document.createElement("li");
  let infoDiv = document.createElement("div");
  let x = document.createElement("span");
  let itemName = document.createElement("span");
  let itemAmount = document.createElement("span");
  let removeButton = document.createElement("button");
  newItem.classList.add("item");
  itemName.innerText = `${item}`;
  itemAmount.innerText = `${quantity}`;
  x.innerHTML = "x ";
  removeButton.innerText = "X";
  list.appendChild(newItem);
  newItem.appendChild(infoDiv);
  infoDiv.appendChild(itemAmount);
  infoDiv.appendChild(x);
  infoDiv.appendChild(itemName);
  newItem.appendChild(removeButton);
  removeButton.addEventListener("click", (e) => {
    removeItem(e);
  });
  newItem.addEventListener("mouseenter", (e) => {
    e.target.classList.add("active");
  });
  newItem.addEventListener("mouseleave", (e) => {
    e.target.classList.remove("active");
  });
  saveChanges();
};

const removeItem = (e) => {
  e.target.parentElement.remove();
  saveChanges();
};
const saveChanges = () => {
  shoppingList = [];
  let listItems = document.querySelectorAll("li");

  for (let item of listItems) {
    let itemAmount = item.childNodes[0].childNodes[0].innerHTML;
    let itemName = item.childNodes[0].childNodes[2].innerHTML;
    shoppingList = [...shoppingList, { name: itemName, quantity: itemAmount }];
  }
  let jsonStr = JSON.stringify(shoppingList);
  localStorage.setItem("shopitems", jsonStr);
};
const restoreList = () => {
  let list = document.querySelector("#list");
  list.innerHTML = "";
  shoppingList = [];
  let newShoppingList = [];
  let jsonStr = localStorage.getItem("shopitems");
  localStorage;
  newShoppingList = JSON.parse(jsonStr);
  if (newShoppingList) {
    for (let item of newShoppingList) {
      createItem(item.name, item.quantity);
    }
  }
};
const clearList = () => {
  localStorage.removeItem("shopitems");
  let list = document.querySelector("#list");
  list.innerHTML = "";
};
