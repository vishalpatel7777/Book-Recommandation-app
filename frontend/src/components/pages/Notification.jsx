import { useState, useRef, useEffect } from "react";
import "../../assets/notification-page/notification.css";

function Notification() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "You just Purchased Hunting Adeline book!!",
      image: "../src/assets/cover-pages/hunting adeline.jpeg",
      rating: 0,
    },
  ]);

  const notificationWrapperRef = useRef(null);

  const handleRating = (id, ratingValue) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, rating: ratingValue }
          : notification
      )
    );
    console.log(`You rated notification ${id} with ${ratingValue} stars.`);
  };

  const addNewNotification = () => {
    const newNotification = {
      id: Date.now(),
      message: "You just Purchased a New Book!",
      image: "../src/assets/cover-pages/power.png",
      rating: 0,
    };

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);

    setTimeout(() => {
      if (notificationWrapperRef.current) {
        notificationWrapperRef.current.scrollTop =
          notificationWrapperRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen  pt-[121px]">
      <div className="notification-border-bottom-1">
        <span className="material-symbols-outlined" id="notification-icon">
          notifications_active
        </span>
        <h2 className="notification-Us">Notification</h2>
      </div>

      <div id="notification-container" ref={notificationWrapperRef}>
        <div className="notification-wrapper">
          {notifications.map((notification) => (
            <div className="notification-box" key={notification.id}>
              <img
                src={notification.image}
                alt="book"
                className="book-img-notification"
              />
              <h3 className="notification-text">{notification.message}</h3>

              <div className="book-rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={`star ${
                      notification.rating >= value ? "filled" : ""
                    }`}
                    data-value={value}
                    onClick={() => handleRating(notification.id, value)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <button
                className="rating"
                onClick={() => {
                  if (notification.rating > 0) {
                    console.log(
                      `You rated this book ${notification.rating} stars.`
                    );
                  } else {
                    console.log("Please select a rating before confirming.");
                  }
                }}
              >
                Rate the book
              </button>

              <button
                id="add-notification-button"
                className="rating"
                onClick={addNewNotification}
              >
                Add New Notification
              </button>
            </div>
          ))}
        </div>
      </div>
      <img
        src="../src/assets/notification-page/book-bg.png"
        alt="background-book"
        className="background-book"
      />
    </div>
  );
}

export default Notification;
