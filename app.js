const main = document.getElementById("main");
const basketIcon = document.getElementById("cart-shopping");
const badge = document.getElementById("badge");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("close");

console.log(main);

let basket = JSON.parse(localStorage.getItem("basket")) || [];

const createBadge = () => {
  if (basket.length) {
    badge.style.display = "initial";
    badge.innerText = basket.reduce((acc, { quantity }) => acc + quantity, 0);
  } else {
    badge.style.display = "none";
  }
};

window.addEventListener("load", () => {
  createBadge();
});

basketIcon.addEventListener("click", () => {
  basket.length && (modal.style.display = "block");
  createProduct();
});

modalClose.addEventListener("click", () => (modal.style.display = "none"));

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
    localStorage.setItem("basket", JSON.stringify(basket));
  }
  console.log(basket);
});
