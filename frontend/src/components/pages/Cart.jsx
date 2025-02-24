import { useState, useRef, useEffect } from "react";
import "../../assets/Cart-page/cart.css";

function Cart() {
  const [Carts, setCarts] = useState([
    {
      id: 1,
      message: "You just Added Hunting Adeline book in the cart!!",
      image: "../src/assets/cover-pages/hunting adeline.jpeg",
      price: "$10",
      rating: 0,
    },
  ]);

  const CartWrapperRef = useRef(null);

  const addNewCart = () => {
    const newCart = {
      id: Date.now(),
      message: "You just added New Book in the cart!",
      image: "../src/assets/cover-pages/power.png",
      rating: 0,
    };

    setCarts((prevCarts) => [...prevCarts, newCart]);

    setTimeout(() => {
      if (CartWrapperRef.current) {
        CartWrapperRef.current.scrollTop = CartWrapperRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="relative  pt-[121px] overflow-x-hidden ">
      <div className="Cart-border-bottom-1">
        <span className="material-symbols-outlined" id="Cart-icon">
          shopping_cart
        </span>
        <h2 className="Cart-Us">Your Cart</h2>
      </div>

      <div
        id="Cart-container"
        ref={CartWrapperRef}
        className="overflow-y-hidden"
      >
        <div className="Cart-wrapper">
          {Carts.map((Cart) => (
            <div className="Cart-box" key={Cart.id}>
              <img src={Cart.image} alt="book" className="book-img-Cart" />
              <h3 className="Cart-text">{Cart.message}</h3>

              <button
                className="rating-add"
                onClick={() => {
                  if (Cart.rating > 0) {
                    console.log(`You rated this book ${Cart.rating} stars.`);
                  } else {
                    console.log("Please select a rating before confirming.");
                  }
                }}
              >
                Added to cart
              </button>

              <button
                id="add-Cart-button"
                className="rating-remove"
                onClick={addNewCart}
              >
                Remove from cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <img
        src="../src/assets/Cart-page/cart.png"
        alt="background-book"
        className="background-book-cart overflow-y-hidden"
      />
    </div>
  );
}

export default Cart;
