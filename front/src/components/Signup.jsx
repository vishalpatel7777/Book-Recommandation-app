import React from 'react'
import { useEffect } from 'react';
import "../assets/signup-page/signup.css"

function Signup() {
  useEffect(() => {
    // Prevent scrolling when the Signup page is mounted
    document.body.style.overflow = "hidden";

    // Cleanup: Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className='all'>
    <div className="background-img">
      <img src="../src/assets/signup-page/background.png" alt="background-img" class ="img" />

      <div className="signup-header">
        <img src="../src/assets/signup-page/book-box.png" alt="signup1" className="left" />
        <h1 className="signup">Signup</h1>
        <img src="../src/assets/signup-page/book-box.png" alt="signup2" className="right" />
      </div>

      <div className="signup-box"  >
        <label htmlFor="email" className="email">Email: </label>
        <input type="email" name="email" id="email" className="input-email" placeholder='User07@gmail.com' />
        <label htmlFor="username" className='username'>Username: </label>
        <input type="text" id='username' name='username' className='input-username' placeholder='User07'/>
        <label htmlFor="password" className="password">Password: </label>
        <input type="text" name="password" id="password" className="input-pass" placeholder='User07'  onFocus={(e) => e.target.type = 'text'} 
  onBlur={(e) => e.target.type = 'password'} />
        <label htmlFor="age" className='age'>Age:</label>
        <input type="number" name="age" id="age" className='input-age' placeholder='1' />
        <label htmlFor="genre" className='genre'>Genre:</label>
        <input type="text" name="genre" id="genre" className='input-genre' placeholder='Enter your favorite book genre'/>
        <button type="submit" className="signupbtn">submit</button>
        
      </div>

      <div className="signup-right">
        <img src="../src/assets/signup-page/siiting.png" alt="sitting" className="sitting2" />
        <img src="../src/assets/signup-page/sitting.png" alt="sitting" className="sitting1" />
      </div>
    </div>
  </main>
  )
}

export default Signup