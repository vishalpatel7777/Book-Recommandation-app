import React from 'react';
import Recentlyaddedbook from './Recentlyaddedbook';
import Filter from './Filter';
import Allbooks from './Allbooks';

function Category() {
  return (
    < >
      
      <div className="relative min-h-screen  pt-[121px] overflow-x-hidden">
        <Filter />
        <Recentlyaddedbook />

      </div>

    </>
    
  );
}

export default Category;
