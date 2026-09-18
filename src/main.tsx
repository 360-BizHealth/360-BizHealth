import React, { useState, useEffect, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/index'
import Contact from './pages/contact'
import Login from './pages/login'
import Pricing from './pages/pricing'
import NotFound from './pages/not-found'
import DetailPage from './pages/detail'
import BlogsNews, { BlogArticle } from './pages/blogs-news'
import AboutUs from './pages/about-us'
import './styles.css'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function resolvePage(pathname: string) {
  const isKnownStaticRoute = pathname === '/' || pathname === '/about-us' || pathname === '/about-us/' || pathname === '/contact' || pathname === '/login' || pathname === '/pricing';
  const isBlogRoute = pathname === '/resources/blogs-news' || pathname.startsWith('/resources/blogs-news/');
  const isRemovedServiceRoute = pathname === '/services/ip-branding' || pathname === '/services/ip-branding/';
  const isDynamicDetailRoute = pathname.startsWith('/products/') || pathname.startsWith('/services/') || pathname.startsWith('/about/');

  return isKnownStaticRoute || isBlogRoute || (isDynamicDetailRoute && !isRemovedServiceRoute) ? pathname : '404';
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => resolvePage(window.location.pathname))
  const isFirstRender = React.useRef(true);

  // Restore scroll position SYNCHRONOUSLY before browser paints (prevents Hero flash on refresh)
  useLayoutEffect(() => {
    const savedPos = sessionStorage.getItem('scroll_' + window.location.pathname);
    if (savedPos) {
      const y = parseInt(savedPos, 10);
      if (!isNaN(y) && y > 0) {
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      }
    }

    const handleScroll = () => {
      sessionStorage.setItem('scroll_' + window.location.pathname, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleScroll);
    };
  }, []);

  const handleNavigate = (page: string) => {
    sessionStorage.setItem('scroll_' + page, '0');
    setCurrentPage(resolvePage(page));
    window.history.pushState({}, '', page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolvePage(window.location.pathname);
      setCurrentPage(resolved);
      const savedPos = sessionStorage.getItem('scroll_' + window.location.pathname);
      if (savedPos) {
        window.scrollTo(0, parseInt(savedPos, 10) || 0);
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, [currentPage]);

  const isDynamicRoute = currentPage.startsWith('/products/') || 
                         currentPage.startsWith('/services/') || 
                         currentPage.startsWith('/about/');

  return (
    <>
      {currentPage === '/' && <Index onNavigate={handleNavigate} />}
      {currentPage === '/contact' && <Contact onNavigate={handleNavigate} />}
      {currentPage === '/login' && <Login onNavigate={handleNavigate} />}
      {currentPage === '/pricing' && <Pricing onNavigate={handleNavigate} />}
      {(currentPage === '/about-us' || currentPage === '/about-us/') && <AboutUs onNavigate={handleNavigate} />}
      {currentPage === '/resources/blogs-news' && <BlogsNews onNavigate={handleNavigate} />}
      {currentPage.startsWith('/resources/blogs-news/') && <BlogArticle slug={currentPage.split('/').pop() || ''} onNavigate={handleNavigate} />}
      {isDynamicRoute && currentPage !== '/resources/blogs-news' && !currentPage.startsWith('/resources/blogs-news/') && <DetailPage currentPath={currentPage} onNavigate={handleNavigate} />}
      {currentPage === '404' && <NotFound onNavigate={handleNavigate} />}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
