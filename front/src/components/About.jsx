import React from "react";
// import "./App.css"; // Ensure you include your CSS styles here
import "../assets/about/about.css"

const About = () => {
  return (
    <main>
      {/* Content Section */}
      <section className="content">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aliquam
          eaque, sapiente fuga explicabo porro eligendi, aspernatur voluptate
          alias veniam placeat impedit repellendus in assumenda rerum? Odio
          blanditiis aut minima. At voluptate placeat amet optio voluptas minima
          incidunt fuga dicta inventore sapiente ex natus ullam mollitia aliquid
          molestiae delectus sit illo tempora aut, magni ratione consectetur!
          Eligendi dignissimos totam quia. Laudantium assumenda culpa saepe!
          Saepe perferendis enim expedita, maiores iusto deserunt ducimus
          adipisci distinctio totam rem beatae ratione magni voluptatem sint?
          Rerum id necessitatibus quidem tenetur mollitia officiis eius.
          Laboriosam! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Odit quia autem consequatur fugiat quas voluptatum doloremque
          commodi, optio, inventore dignissimos officiis obcaecati excepturi est
          nam dolor. Perspiciatis asperiores maiores unde. Eveniet animi
          distinctio vitae inventore enim quaerat deleniti esse accusantium eum
          dignissimos assumenda quis eos hic nemo officiis aperiam recusandae
          magni, earum dolorum totam, iste soluta voluptatum, aliquid at?
          Praesentium? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Voluptatum maxime asperiores nesciunt eum, ad vel nihil, obcaecati
          vero perferendis exercitationem quaerat ab odit quasi illum rem
          ducimus nisi optio eaque? Neque eum inventore animi sed id, quo
          expedita ipsa alias sequi ullam ex deleniti, officia est ab distinctio
          unde eligendi consectetur veritatis officiis facilis aspernatur
          doloribus earum? Tempora, voluptatibus alias. Architecto, labore, nam
          corporis assumenda perspiciatis beatae voluptates, sint perferendis
          doloremque at sed officiis saepe laboriosam voluptatem odit autem a.
          Eius vitae cumque a quasi. Sint odit aspernatur eaque ipsum?
        </p>
        <div className="images">
          <img
            src="./src/assets/about/book1.png"
            alt="Books"
            className="top-image"
          />
        </div>
        <a href="contact.html">
          <button>Contact us</button>
        </a>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="bookshelf">
          {Array.from({ length: 27 }).map((_, index) => (
            <img
              key={index}
              src="./src/assets/about/book.webp"
              alt="Book"
              className="book-image"
            />
          ))}
        </div>
      </footer>
    </main>
  );
};

export default About;
