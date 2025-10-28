import React from "react";
import "../../assets/styles/pages/about.css"; // Path should be correct relative to src/pages/user/
import { useNavigate } from "react-router-dom";
import AboutBookBG from "../../assets/images/AboutBookBG.png"; // Path should be correct
import AboutBookShelf from "../../assets/images/AboutBookShelf.webp"; // Path should be correct


const About = () => {

  const navigate = useNavigate();
  return (
    <main className="relative p-6 pt-[131px] overflow-hidden">
      <section className="text-xl">
        <p className="mb-6">
          📖 <strong>Welcome to BookMosaic!</strong> 🌟 <br />
          Your AI-powered book discovery platform, where finding your next great read is effortless! 🚀
        </p>
        <p className="mb-4">
          At <strong>BookMosaic</strong>, we believe books have the power to inspire, educate, and transform lives. <br />
          Our advanced AI/ML algorithms recommend books based on your reading habits, interests, and preferences. 📚✨
        </p>
        <p className="mb-4">
          🌍 <strong>Why Choose BookMosaic?</strong> <br />
          ✅ <strong>AI-Driven Recommendations</strong> – Smart suggestions tailored just for you. <br />
          ✅ <strong>Seamless Experience</strong> – User-friendly interface with smooth navigation. <br />
          ✅ <strong>Vast Collection</strong> – Fiction, non-fiction, sci-fi, self-improvement & more! <br />
          ✅ <strong>Wishlist & Secure Downloads</strong> – Save favorites and download e-books safely. <br />
          ✅ <strong>Community & Reviews</strong> – Share insights and explore reader favorites.
        </p>
        <p className="mb-3">
          💡 <strong>Our Vision</strong> <br />
          We aim to build a vibrant reading community where stories bring people together. <br />
          Whether you're a casual reader or a dedicated bookworm, BookMosaic enhances your reading journey with the perfect blend of technology and literature.
        </p>
        <p className="text-center mb-10 font-semibold text-lg">
          📚 <strong>Happy Reading!</strong> 📖💙
        </p>
        <div className="images">
          <img src={AboutBookBG} alt="Books" className="top-image" />
        </div>

          <button className="button-about mb-35 left-160 relative flex"  onClick={() => navigate("/contact-us")}>📩 Contact us</button>

      </section>
      <footer>
        <div className="bookshelf">
          {Array.from({ length: 27 }).map((_, index) => (
            <img key={index} src={AboutBookShelf} alt="Book" className="book-image" />
          ))}
        </div>
      </footer>
    </main>
  );
};

export default About;