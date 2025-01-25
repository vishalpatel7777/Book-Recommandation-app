import React from 'react'

function Home() {
  return (
<main>
  {/* Hero Section */}
  <div className="relative px-12 h-[calc(100vh-130px)] flex justify-between items-center">
    <div className="max-w-[60%]">
      <h1 className="text-[76px] font-medium leading-[1.2] mb-10 mr-2">
        Shop Your
        <br />
        Dream Book.
      </h1>
      <p className="text-[24px] font-light italic text-gray-600 mb-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        <br />
        eiusmod tempor incididunt ut labore et dolore.
      </p>
      <a
        href="#"
        className="text-[20px] font-medium bg-[#d46a6a] text-black py-2 px-6 rounded-full hover:bg-[#b95353] transition mt-24 inline-block"
      >
        Order Now
      </a>
    </div>
    <div className="absolute bottom-0 right-0">
      <img
        src="../src/assets/home-page/book.png"
        alt="Bookshelf"
        className="max-w-[500px] h-auto"
      />
    </div>
  </div>
</main>

  )
}

export default Home