import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

// El quiz (productos, motor y Supabase) se descarga solo al entrar a /quiz:
// la página de inicio carga más rápido.
const Quiz = lazy(() => import('./pages/Quiz'));
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));
const HowWeRecommend = lazy(() => import('./pages/Legal').then((m) => ({ default: m.HowWeRecommend })));

const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center">
    <img src="/logo.png" alt="Banqueando" className="w-20 h-20 object-contain animate-pulse" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Suspense fallback={<Loading />}><Quiz /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<Loading />}><Admin /></Suspense>} />
        <Route path="/privacidad" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
        <Route path="/terminos" element={<Suspense fallback={<Loading />}><Terms /></Suspense>} />
        <Route path="/como-recomendamos" element={<Suspense fallback={<Loading />}><HowWeRecommend /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
