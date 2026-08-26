import React, { useState, useEffect } from 'react'
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

function resolvePage(pathname: string) {
  const isKnownStaticRoute = pathname === '/' || pathname === '/about-us' || pathname === '/about-us/' || pathname === '/contact' || pathname === '/login' || pathname === '/pricing';
  const isDynamicDetailRoute = pathname.startsWith('/products/') || pathname.startsWith('/services/') || pathname.startsWith('/resources/') || pathname.startsWith('/about/');

  return isKnownStaticRoute || isDynamicDetailRoute ? pathname : '404';
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => resolvePage(window.location.pathname))

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    window.history.pushState({}, '', page)
  }

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolvePage(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const isDynamicRoute = currentPage.startsWith('/products/') || 
                         currentPage.startsWith('/services/') || 
                         currentPage.startsWith('/resources/') || 
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
