import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";


const Allbooks = () => {
    const [Book, setBook] = useState();
    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get("http://localhost:1000/api/v1/get-all-books");
            setBook(response.data.data);

        };
        fetch();

    }, [])


    return (
        <div className="mt-10 px-4 relative top-[75px] overflow-x-hidden">
            < div className="Cart-border-bottom-1">
                <span className="material-symbols-outlined" id="Cart-icon">
                    family_star
                </span>
                <h2 className="Cart-Us">All Books</h2>

            </div>
            {!Book && <div className="flex  items-center justify-center relative left-0  ">
                <Loader />
            </div>}

            <div className="my-9 relative left-4  grid  grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 ">

                {Book && Book.map((items, i) => <div key={i}> <BookCard data={items} />{" "}</div>)}
            </div>
        </div>


    )
}

export default Allbooks;