import React from "react";
import RecentlyAddedBooks from "./Recentlyaddedbook"; // <-- Corrected import name
import Filter from "./Filter";
// import Allbooks from "./Allbooks"; // <-- This import was unused
import RecommendedBooks from "./RecommendedBooks";

function Category() {
  return (
    <>
      <div className="relative min-h-screen pt-[121px] overflow-x-hidden">
        <Filter />

        <div className="mb-10"></div>

        <RecommendedBooks />
        <div className="mb-10"></div>
        <RecentlyAddedBooks />

        <div className="mb-10"></div>
      </div>
    </>
  );
}

export default Category;