# 📚 BookMosaic – Personalized Book Recommendation & Purchase Platform

**BookMosaic** is a user-centric, full-stack web platform that blends genre-based book discovery with secure digital purchases. The name *BookMosaic* reflects the mix of genres, recommendations, and features tailored to every type of reader — casual, academic, or retail.

🌐 **Live Demo:** [https://mybookmosaic.netlify.app](https://mybookmosaic.netlify.app)  
🔧 **Status:** Actively maintained | 🚀 MVP Completed

---

## 🧠 What Makes BookMosaic Special?

> "Even with limitations, it works — and that’s what makes it worth using."

- User-friendly UI for both Admin and Users.
- Modular & expandable architecture.
- Secure test-mode payments via Cashfree.
- Integrated notification and review system.
- Backend logic with rich analytics and CRUD capability.

---

## 🧑‍💼 Admin Side Features

Accessible only to admins with a dedicated admin login and dashboard.

### ✨ Admin Dashboard Includes:

- **Home Page** (Admin Only)
- **Dashboard Stats:**
  - Total Users
  - Active Users (last 24 hours)
  - Total Reviews
  - Book Purchases *(currently under fix)*
- **User Activities:**
  - Last login with date and time
- **Book Analytics:**
  - Top-rated books
  - Most purchased books
  - Recently added books
- **Monthly Analytics:**
  - Monthly revenue chart
  - New user joins per month
  - Top genres read

### ⚙️ Admin Controls

- **Manage Users:**
  - View all users
  - Delete users
- **Manage Books:**
  - View all books
  - Add, Edit, Delete books
- **Admin Settings:**
  - Change admin details
- **Admin Profile Section**
- **Logout Button**

---

## 🧑‍🎓 User Side Features

### 📂 Pages and Components

- **Home Page** *(Different from Admin)*  
  → "Order Now" button redirects to Categories  
- **Categories Page**
  - Genre filter
  - Recommended Books (based on average ratings)
  - Recently Added Books (with “See All” feature)
- **About Page**  
  → Includes **Contact Us** button → sends email directly to Admin  
- **Search Box**  
  → Manual search for books by title
- **Wishlist Page**
  - Add/view favorite books
- **Cart Page**
  - Add/view books to purchase
- **Book Info Page**
  - Add to Wishlist, Cart, or proceed to Buy
- **Payment Flow:**
  - Cashfree (Test Mode)
  - Final Info Page → Payment → Success → Download PDF
- **Notification Page**
  - All book purchase logs
  - Rate and review each book post-purchase

### 👤 User Profile

A nested layout built using `React Outlet` with 3-pane UI.

- **Sections:**
  - Wishlist
  - Terms & Conditions
  - Privacy Policy
  - Blog
  - Best Authors
  - FAQs
- **User Settings:**
  - Change profile details
- **Logout Button**

---

## 🛠️ Tech Stack

| Category      | Technologies (with versions)                          |
|---------------|-------------------------------------------------------|
| Frontend      | React.js (18.3.1), Redux Toolkit (2.6.1), Axios (1.8.3) |
| Styling       | Tailwind CSS (4.0.14), Framer Motion (^12.5.0), Styled-components (6.1.15) |
| Routing       | React Router DOM (7.3.0)                             |
| Backend       | Node.js (v20+), Express.js (4.21.2), Body-parser (1.20.3) |
| Database      | MongoDB (6.14.2), Mongoose (8.12.1)                 |
| Auth          | JWT (9.0.2), Bcrypt (5.1.1) / BcryptJS (3.0.2)     |
| Payment       | Cashfree  |
| Email         | Nodemailer (6.10.0), Google APIs (148.0.0), EmailJS (4.4.1) |
| Visualization | Recharts (2.15.1)                                    |
| Deployment    | Netlify (Frontend), Render (Backend)                 |
| Dev Tools     | Vite (6.0.5), ESLint (9.17.0), Nodemon (3.1.9)     |

---

## 🧪 Testing

- ✅ Manual live testing on deployed URL
- ✅ Postman API tests for all endpoints
- ✅ Lighthouse Performance:
  (optimization pending)

---

## 🚧 Known Limitations

- Profile page performance above 2s
- Mobile responsiveness not yet implemented
- No Jest unit tests (planned for next update)

---


## 🧑‍💻 Author

Made with 💙 by **Vishal patel**

📧 Contact: [patelvishal14642@gmail.com](mailto:patelvishal14642@gmail.com)


---

## 📚 References

- [React.js](https://reactjs.org)
- [Redux](https://redux.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/docs)
- [Cashfree Docs](https://docs.cashfree.com)

---

## 💬 Feedback or Suggestions?

Feel free to open an [Issue](https://github.com/vishalpatel7777/Book-Recommandation-app/issues) or [Contact Me](mailto:patelvishal14642@gmail.com). I'm always open to ideas that make BookMosaic better!

