import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LivePage from './pages/LivePage';
import SearchPage from './pages/SearchPage';
import ContentDetailsPage from './pages/ContentDetailsPage';
import MyListPage from './pages/MyListPage';
import PlayerPage from './pages/PlayerPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/watch/:id" element={<PlayerPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/title/:id" element={<ContentDetailsPage />} />
        <Route path="/my-list" element={<MyListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
