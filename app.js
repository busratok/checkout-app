const main = document.getElementById("main");
const basketIcon = document.getElementById("cart-shopping");
const badge = document.getElementById("badge");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("close");
const basketItems = document.getElementById("basket-items");
const subTotal = document.getElementById("subtotal");
const tax = document.getElementById("tax");
const shipping = document.getElementById("shipping");
const total = document.getElementById("total");

//* get items from local storage or create a new array
let basket = JSON.parse(localStorage.getItem("basket")) || [];

//? ------------FUNCTIONS-----------

//* if basket is not empty create basket badge
const createBadge = () => {
  if (basket.length) {
    badge.style.display = "initial";
    badge.innerText = basket.reduce((acc, { quantity }) => acc + quantity, 0);
  } else {
    badge.style.display = "none";
  }
};

//* update local storage
const updateLocalStorage = () => {
  localStorage.setItem("basket", JSON.stringify(basket));
};

//* create product and append it to modal container
const createPoduct = (product) => {
  const { id, image, productName, price, quantity } = product;

  const li = document.createElement("li");
  li.setAttribute("id", id);

  const productImage = document.createElement("img");
  productImage.setAttribute("src", image);
  li.append(productImage);

  const details = document.createElement("div");
  details.setAttribute("class", "details");

  const pName = document.createElement("p");
  pName.innerText = productName;
  details.append(pName);

  const pPrice = document.createElement("p");
  pPrice.setAttribute("class", "price");
  pPrice.innerText = price;
  details.append(pPrice);

  const counter = document.createElement("div");
  counter.setAttribute("class", "counter");
  const minus = document.createElement("span");
  minus.setAttribute("class", "minus");
  minus.innerText = "-";
  counter.append(minus);
  const pQuantity = document.createElement("span");
  pQuantity.setAttribute("class", "quantity");
  pQuantity.innerText = quantity;
  counter.append(pQuantity);
  const plus = document.createElement("span");
  plus.setAttribute("class", "plus");
  plus.innerText = "+";
  counter.append(plus);
  details.append(counter);

  const remove = document.createElement("button");
  remove.setAttribute("class", "remove");
  remove.innerText = "Remove";
  details.append(remove);

  const pTotal = document.createElement("p");
  pTotal.innerText = "Product Total: ";
  const pTotalPrice = document.createElement("span");
  pTotalPrice.setAttribute("class", "pTotalPrice");
  pTotalPrice.innerText = `£${Number(price.slice(1)) * quantity}`;
  pTotal.append(pTotalPrice);
  details.append(pTotal);

  li.append(details);

  basketItems.prepend(li);
};

//* remove product from ui, array and localstorage;
const removeProduct = (e) => {
  const idAttr = e.target.closest("li").id;
  e.target.closest("li").remove();
  basket = basket.filter((p) => p.id !== idAttr);
  updateLocalStorage();
  createBadge();
  !basket.length && (modal.style.display = "none");
};

//* calculate tax, shipping and total from given subtotal
const calculateTotal = (subtotal) => {
  tax.innerText = `£${(Number(subTotal.innerText.slice(1)) * 0.18).toFixed(2)}`;
  shipping.innerText = subTotal.innerText.slice(1) != 0 && `£10`;
  total.innerText = `£${
    Number(subTotal.innerText.slice(1)) +
    Number(tax.innerText.slice(1)) +
    Number(shipping.innerText.slice(1))
  } `;
};

//? ---------EVENT LISTENERS AND HANDLERS-----------

//* Invoke createBadge function when padge is loaded
window.addEventListener("load", () => {
  createBadge();
});

// * add product to the array and local storage and update the badge when add button is clicked
main.addEventListener("click", (e) => {
  if (e.target.classList.contains("add")) {
    const addedProduct = {
      id: e.target.closest("div").id,
      image: e.target.closest("div").querySelector("img").getAttribute("src"),
      productName: e.target.closest("div").querySelector("p").innerText,
      price: e.target.closest("div").querySelector("span").innerText,
      quantity: Number(e.target.closest("div").querySelector("select").value),
    };
    if (basket.length == 0) {
      basket.push(addedProduct);
    } else {
      let flag = false;
      basket.map((x) => x.id == addedProduct.id && (flag = true));
      flag &&
        basket.map(
          (x) =>
            x.id == addedProduct.id && (x.quantity += addedProduct.quantity)
        );
      flag || basket.push(addedProduct);
    }
    createBadge();
    updateLocalStorage();
  }
  console.log(basket);
});

//* if array is not empty make modal visible, create and show product and total prices
basketIcon.addEventListener("click", () => {
  if (basket.length) {
    modal.style.display = "block";
    basket.forEach((product) => {
      createPoduct(product);
    });
    subTotal.innerText = `£${basket.reduce(
      (acc, c) => acc + Number(c.price.slice(1)) * c.quantity,
      0
    )}`;
    calculateTotal(subTotal);
  }
});

// *update product details according the button click
modal.addEventListener("click", (e) => {
  const idAttr = e.target.closest("li").getAttribute("id");
  if (e.target.classList.contains("remove")) {
    subTotal.innerText = `£${
      Number(subTotal.innerText.slice(1)) -
      Number(
        e.target.closest("li").querySelector(".pTotalPrice").innerText.slice(1)
      )
    }`;
    calculateTotal(subTotal);
    removeProduct(e);
  } else if (e.target.classList.contains("minus")) {
    if (e.target.closest("li").querySelector(".quantity").innerText == 1) {
      removeProduct(e);
      subTotal.innerText = `£${
        Number(subTotal.innerText.slice(1)) -
        Number(
          e.target.closest("li").querySelector(".price").innerText.slice(1)
        )
      }`;
      calculateTotal(subTotal);
    } else {
      e.target.closest("li").querySelector(".quantity").innerText--;
      basket.forEach((p) => {
        if (p.id == idAttr) {
          p.quantity--;
          e.target.closest("li").querySelector(".pTotalPrice").innerText = `£${
            Number(p.price.slice(1)) * p.quantity
          }`;
        }
      });
      subTotal.innerText = `£${
        Number(subTotal.innerText.slice(1)) -
        Number(
          e.target.closest("li").querySelector(".price").innerText.slice(1)
        )
      }`;
      calculateTotal(subTotal);
      updateLocalStorage();
    }
  } else if (e.target.classList.contains("plus")) {
    e.target.closest("li").querySelector(".quantity").innerText++;
    basket.forEach((p) => {
      if (p.id == idAttr) {
        p.quantity++;
        e.target.closest("li").querySelector(".pTotalPrice").innerText = `£${
          Number(p.price.slice(1)) * p.quantity
        }`;
      }
    });
    subTotal.innerText = `£${
      Number(subTotal.innerText.slice(1)) +
      Number(e.target.closest("li").querySelector(".price").innerText.slice(1))
    }`;
    calculateTotal(subTotal);
    updateLocalStorage();
  }
});

//* make modal unvisible and update its innertext when modalclose is clicked
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  basketItems.innerHTML = "";
});
