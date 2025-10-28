import React from "react";
import ThankYouImage from "../../assets/images/thank-you.png"; // Path relative to src/pages/user/
import "../../assets/styles/pages/thankyou.css"; // Path relative to src/pages/user/

const Thankyou = () => { // Renamed component
  const handleDownload = () => {
    // In a real app, you'd get the PDF URL (e.g., from useLocation state)
    // const pdfUrl = location.state?.pdfUrl;
    // if (pdfUrl) {
    //   window.location.href = pdfUrl; // Or use a library for download
    // } else {
    //   alert("Download link not found!");
    // }
    alert("Your PDF download will start soon!");
  };

  return (
    <div className="thankyou relative min-h-screen pt-[121px]">
      <img className="thank-you-img"
        src={ThankYouImage}
        alt="thankyou"
        style={{ maxWidth: "100%", height: "auto" }} // Optional inline styling
      />
      <button className="thankyou-btn" onClick={handleDownload} style={buttonStyle}>
        Download your PDF file!!
      </button>
    </div>
  );
};

// Optional: Add custom styles (or move to CSS file)
const buttonStyle = {
  backgroundColor: "#63918b",
  color: "#fff",
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
};

export default Thankyou; // Renamed export