# BookMosaic

BookMosaic is a full-stack book management platform that offers a seamless experience for users to browse, purchase, and manage books while providing an admin dashboard for managing books, users, and analytics.

## Features

### User Features
- Browse and search books by title, author, or genre.
- Add books to wishlist and cart.
- View detailed book information and AI-driven recommendations.
- Secure user authentication and role management.

### Admin Features
- Manage books: Add, edit, and delete books (title, author, price, PDF uploads).
- Manage users: View and manage registered users.
- View analytics: Insights into top-rated books, trending books, user activity, and purchases.
- Real-time analytics dashboard with charts and data visualization.

## Tech Stack

### Frontend
- **React.js**: Core UI library.
- **React Router**: Navigation management.
- **Redux**: State management.
- **Tailwind CSS**: Styling framework.
- **Recharts**: Data visualization for analytics.
- **Framer Motion**: UI animations.

### Backend
- **Express.js**: Backend framework.
- **MongoDB**: Database for books, users, and analytics storage.
- **JWT**: Authentication using JSON Web Tokens.
- **Axios**: HTTP client for API calls.

## Prerequisites

- **Node.js**: v16.x or higher
- **MongoDB**: Installed and running
- **Environment Variables**:
  ```plaintext
  REACT_APP_API_URL=http://localhost:1000
  ```

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/BookMosaic.git
   cd BookMosaic
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm start
   ```
   App will be available at `http://localhost:3000`.

4. **Backend Setup**
   Ensure MongoDB is running and start the backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend will run on `http://localhost:1000`.

## Project Structure

```
Bookmosaic/
├── src/
│   ├── components/       # Reusable components (Navbar, BookCard, Fun-components)
│   ├── store/              # Redux store and slices (auth, routes, book, etc.)
│   ├── pages/              # Main page components (Home, Dashboard, Admin, etc.)
│   ├── assets/             # Images and static assets
│   ├── App.jsx             # Main app component
│   ├── index.js            # App entry point
├── backend/
│   ├── models/             # MongoDB models (User, Book, etc.)
│   ├── routes/             # Express.js routes
│   ├── controllers/        # Controllers handling logic
│   ├── middleware/         # Middleware (auth, error handling, etc.)
│   ├── server.js           # Main backend entry point
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation

## API Endpoints

| Endpoint                        | Method | Description |
|--------------------------------|--------|-------------|
| `/api/v1/get-all-books`         | GET    | Fetch all books |
| `/api/v1/add-book`              | POST   | Add a new book |
| `/api/v1/update-book/:id`       | PUT    | Update an existing book |
| `/api/v1/delete-book/:id`       | DELETE | Remove a book |
| `/api/v1/user-information`      | GET    | Fetch user information |
| `/api/v1/book-analytics`        | GET    | Get book analytics |

## Known Limitations

- **Mobile Support**: Currently optimized for desktop.
- **Error Handling**: Could be enhanced.
- **Pagination**: Not implemented for large book lists.
- **Security**: Needs additional token validation for improved security.

## Contributing

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature-branch`)
3. **Make your changes and commit** (`git commit -m "Your changes"`)
4. **Push to the branch** (`git push origin feature-branch`)
5. **Submit a pull request**

For questions, reach out at: [patelvishal14642@gmail.com](mailto:patelvishal14642@gmail.com).

---
