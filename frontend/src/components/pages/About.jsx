import React from "react";
import "../../assets/about/about.css";

const About = () => {
  return (
    <main className="relative min-h-screen  pt-[121px] overflow-hidden">
      <section className="content text-xl">
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
          Odit quia autem consequatur fugiat quas voluptatum doloremque commodi,
          optio, inventore dignissimos officiis obcaecati excepturi est nam
          dolor. Perspiciatis asperiores maiores unde. Eveniet animi distinctio
          vitae inventore enim quaerat deleniti esse accusantium eum
          dignissimosw
        </p>
        <div className="images">
          <img
            src="./src/assets/about/book1.png"
            alt="Books"
            className="top-image"
          />
        </div>
        <a href="/contact-us">
          <button className="button-about">Contact us</button>
        </a>
      </section>

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
