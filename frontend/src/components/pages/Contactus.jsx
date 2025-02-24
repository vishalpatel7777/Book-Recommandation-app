import React from 'react'
import "../../assets/contact-us-page/contactus.css"

function Contactus() {

    const styles = {
        reset: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        body: {
          fontFamily: "'Caveat', sans-serif",
          backgroundColor: "white",
          color: "black",
          lineHeight: 1.6,
        },
      };

  return (
    <main style={styles.body} className='relative min-h-screen  pt-[121px]'>
    <div className="container">
      <div className="contact-info">
        <div className="border-bottom-1">
          <span className="material-symbols-outlined" id="contact-icon">
            contact_phone
          </span>
          <h2 className="contact-Us">Contact Us</h2>
        </div>
        <div className="info-box-1">
          <h3>
            <span>📍</span> Address
          </h3>
          <p>Bakrol Gate, Acet Boys Hostel, 388120</p>
        </div>
        <div className="info-box-2">
          <h3>
            <span>📧</span> Email
          </h3>
          <p>patelvishal4642@gmail.com</p>

          <h3>
            <span>📱</span> Mobile
          </h3>
          <p>+91 9265001227</p>

          <h3>
            <span>💬</span> Whatsapp
          </h3>
          <p>+91 9265001227</p>
        </div>
      </div>
      <div className="contact-form">
        <div className="border-bottom-2">
          <h2 className="contact-Form">Contact Form</h2>
        </div>
        <form>
          <div className="box">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className="box-input"
              placeholder="Your name"
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="box-input"
              placeholder="Your email"
            />

            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              className="box-input"
              placeholder="Subject"
            />

            <label htmlFor="message">Message:</label>
            <textarea id="message" placeholder="Your message"></textarea>

            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  </main>
  )
}

export default Contactus