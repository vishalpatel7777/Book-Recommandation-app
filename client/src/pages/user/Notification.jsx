import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // <-- Unused import removed
import CustomAlert from "../../components/common/Alert/CustomAlert"; // <-- Corrected path
import api from "../../services/axios"; // <-- Corrected path

const Notification = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [userId, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/get-notifications/${userId}`);
      setNotifications(res.data);

      // Pre-fetch existing ratings and reviews for these books
      const ratingsData = await Promise.all(
        res.data.map(async (notif) => {
          if (!notif.book) return { bookId: null, rate: undefined }; // Handle missing book ID
          try {
            const ratingRes = await api.get(`/get-rating/${userId}/${notif.book}`);
            return { bookId: notif.book, rate: ratingRes.data?.rate };
          } catch (ratingError) {
             // If rating not found (404), it's fine. Other errors are logged.
            if (ratingError.response?.status !== 404) {
               console.error(`Error fetching rating for book ${notif.book}:`, ratingError);
            }
            return { bookId: notif.book, rate: undefined };
          }
        })
      );
      const ratingsMap = ratingsData.reduce((acc, { bookId, rate }) => {
        if (bookId && rate !== undefined) acc[bookId] = rate;
        return acc;
      }, {});
      setRatings(ratingsMap);

      const reviewsData = await Promise.all(
        res.data.map(async (notif) => {
           if (!notif.book) return { bookId: null, review: undefined }; // Handle missing book ID
           try {
              const reviewRes = await api.get(`/get-review/${userId}/${notif.book}`);
              return { bookId: notif.book, review: reviewRes.data?.review };
           } catch (reviewError) {
              // If review not found (404), it's fine.
              if (reviewError.response?.status !== 404) {
                 console.error(`Error fetching review for book ${notif.book}:`, reviewError);
              }
              return { bookId: notif.book, review: undefined };
           }
        })
      );
      const submittedReviewsMap = reviewsData.reduce((acc, { bookId, review }) => {
        if (bookId && review) acc[bookId] = review;
        return acc;
      }, {});
      setSubmittedReviews(submittedReviewsMap);

    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/delete-notification/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification. Please try again.");
    }
  };

  const handleRating = async (bookId, rating) => {
    if (!bookId) {
      setError("Book ID is missing. Cannot submit rating.");
      return;
    }
    // Prevent re-rating if already rated
    if (ratings[bookId] !== undefined) {
      setAlertMessage("You have already rated this book.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    try {
      await api.post(`/store-rating`, { book: bookId, rate: rating, user: userId });
      setRatings((prev) => ({ ...prev, [bookId]: rating }));
      setAlertMessage("Rating submitted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error submitting rating:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to submit rating. Please try again.");
    }
  };

  const handleReview = async (bookId, notificationId) => {
    const reviewText = (reviews[notificationId] || "").trim();
    if (!reviewText) {
      setError("Review cannot be empty.");
      return;
    }
    if (!bookId) {
      setError("Book ID is missing. Cannot submit review.");
      return;
    }
    // Prevent re-reviewing if already reviewed
    if (submittedReviews[bookId]) {
      setAlertMessage("You have already reviewed this book.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    try {
      await api.post(`/store-review`, {
        userId,
        bookId,
        rating: ratings[bookId] || 0, // Include rating if available
        review: reviewText,
      });
      setReviews((prev) => ({ ...prev, [notificationId]: "" })); // Clear input field
      setSubmittedReviews((prev) => ({ ...prev, [bookId]: reviewText })); // Mark as submitted
      setAlertMessage("Review submitted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to submit review. Please try again.");
    }
  };

  // Keep the interactive renderStars function
  const renderStars = (bookId) => {
    const currentRating = ratings[bookId];
    const stars = [1, 2, 3, 4, 5];
    const alreadyRated = currentRating !== undefined;

    return (
      <div className="flex space-x-1">
        {stars.map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${
              alreadyRated
                ? star <= currentRating ? "text-yellow-400" : "text-gray-300" // Display static rating
                : star <= (reviews[bookId]?.hoverRating || 0) || star <= (ratings[bookId] || 0) // Handle hover/click for input
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => !alreadyRated && handleRating(bookId, star)} // Only allow rating if not already rated
            // Add hover effect if needed, but onClick is primary for interaction here
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-gray-500">Loading notifications...</p></div>;
  }

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📢 Your Notifications</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 w-full max-w-2xl">{error}</p>}
      {notifications.length > 0 ? (
        <div className="w-full max-w-2xl space-y-6">
          {notifications.map((notification) => (
            <div key={notification._id} className="bg-white shadow-lg p-6 rounded-lg border border-gray-200 flex flex-col transition hover:shadow-xl">
              <div className="flex items-start space-x-4">
                {notification.image && (
                  <img
                    src={notification.image}
                    alt={notification.title}
                    className="w-24 h-36 object-cover rounded"
                    onError={(e) => (e.target.src = "/default-book.png")} // Fallback image
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{notification.title}</h2>
                  <p className="text-gray-600">by {notification.author || "Unknown"}</p>
                  <p className="text-gray-600">Price: ₹{notification.price || "N/A"}</p>
                  <p className="text-green-600 mt-1">You purchased this book! 🎉 {notification.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">Rate this book:</p>
                {/* Ensure notification.book exists before rendering stars */}
                {notification.book ? renderStars(notification.book) : <p className="text-sm text-red-500">Cannot rate: Book ID missing</p>}
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">Write a review:</p>
                {/* Ensure notification.book exists */}
                {notification.book && submittedReviews[notification.book] ? (
                  <p className="text-gray-600 italic mt-1 p-2 bg-gray-50 rounded">{submittedReviews[notification.book]}</p>
                ) : notification.book ? ( // Only show review box if book ID exists and not submitted
                  <>
                    <textarea
                      value={reviews[notification._id] || ""}
                      onChange={(e) => setReviews((prev) => ({ ...prev, [notification._id]: e.target.value }))}
                      placeholder="Share your thoughts..."
                      className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <button
                      onClick={() => handleReview(notification.book, notification._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Submit Review
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-red-500">Cannot review: Book ID missing</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-10">No notifications yet.</p>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Notification;