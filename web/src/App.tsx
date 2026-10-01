import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EmptyState } from './components/ui';
import { AdminPage } from './pages/AdminPage';
import { CatalogPage } from './pages/CatalogPage';
import { CatalogProductPage } from './pages/CatalogProductPage';
import { ComparePage } from './pages/ComparePage';
import { DealsPage } from './pages/DealsPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { DiscordPage } from './pages/DiscordPage';
import { HomePage } from './pages/HomePage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { ListPage } from './pages/ListPage';
import { CguPage, ConfidentialitePage, MentionsLegalesPage } from './pages/LegalPages';
import { SearchPage } from './pages/SearchPage';
import { SourcesPage } from './pages/SourcesPage';
import { WatchPage } from './pages/WatchPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/recherche', element: <SearchPage /> },
      { path: '/liste', element: <ListPage /> },
      { path: '/configuration', element: <ConfigurationPage /> },
      { path: '/sources', element: <SourcesPage /> },
      { path: '/developpeurs', element: <DevelopersPage /> },
      { path: '/discord', element: <DiscordPage /> },
      { path: '/bons-plans', element: <DealsPage /> },
      { path: '/catalogue', element: <CatalogPage /> },
      { path: '/catalogue/:id', element: <CatalogProductPage /> },
      { path: '/suivis', element: <WatchPage /> },
      { path: '/comparer', element: <ComparePage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '/mentions-legales', element: <MentionsLegalesPage /> },
      { path: '/confidentialite', element: <ConfidentialitePage /> },
      { path: '/cgu', element: <CguPage /> },
      {
        path: '*',
        element: (
          <div className="mx-auto max-w-3xl px-4 py-16">
            <EmptyState title="Page introuvable">Cette page n’existe pas.</EmptyState>
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
