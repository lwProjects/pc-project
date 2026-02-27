import { createBrowserRouter } from 'react-router-dom';
import I18nPage from '../I18nPage';
import Layout from '../layout';
import Position from '../page/position';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <I18nPage />,
      },
      {
        path: 'position',
        element: <Position />,
      },
    ],
  },
]);

export default router;
