import Category from '../components/books/list/Category';
import Allbooks from '../components/books/list/AllBooks';
import ViewBookDetails from '../components/books/details/ViewBookDetails';

const bookRoutes = [
  {
    path: '/category',
    element: <Category />,
  },
  {
    path: '/allbooks',
    element: <Allbooks />,
  },
  {
    path: '/view-book-details/:id',
    element: <ViewBookDetails />,
  },
];

export default bookRoutes;