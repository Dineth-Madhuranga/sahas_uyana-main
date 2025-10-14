import React, { useState, useEffect } from 'react';
import './News.css';
import { FadeInUp, StaggerContainer, StaggerItem, PageTransition, CardHover, ScaleIn } from '../components/ScrollAnimation';
import API_BASE_URL from '../config/api';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        const newsData = await response.json();

        if (response.ok && newsData.newsItems) {
          // Transform data (no need to filter since all news will be published)
          const newsItems = newsData.newsItems
            .map(news => ({
              id: news._id,
              title: news.title,
              description: news.description,
              content: news.content,
              category: news.category,
              date: news.createdAt,
              image: getCategoryImage(news.category),
              imageUrl: news.image && news.image.url ? news.image.url : null
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first

          setNewsItems(newsItems);
        } else {
          console.error('Failed to fetch news:', newsData.message);
          // Fallback to mock data if API fails
          setNewsItems(getMockNews());
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to mock data if API fails
        setNewsItems(getMockNews());
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Helper function to get category-based image
  const getCategoryImage = (category) => {
    const imageMap = {
      'Events': 'cultural-festival',
      'Exhibitions': 'art-exhibition',
      'Awards': 'award',
      'Community': 'community-event',
      'Announcements': 'anniversary',
      'General': 'music-concert'
    };
    return imageMap[category] || 'music-concert';
  };

  // Fallback mock data function
  const getMockNews = () => {
    return [
      {
        id: 1,
        title: "Cultural Festival at Sahas Uyana",
        description: "Experience the vibrant cultural festival with traditional dances, music, and food.",
        image: "cultural-festival",
        date: "2024-01-15",
        category: "Events"
      },
      {
        id: 2,
        title: "New Exhibition: 'Art of Sri Lanka'",
        description: "Explore the rich artistic heritage of Sri Lanka in our new exhibition.",
        image: "art-exhibition",
        date: "2024-01-10",
        category: "Exhibitions"
      },
      {
        id: 3,
        title: "Sahas Uyana Wins 'Best Venue' Award",
        description: "Sahas Uyana has been awarded the 'Best Venue' for its exceptional services and facilities.",
        image: "award",
        date: "2024-01-05",
        category: "Awards"
      }
    ];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setShowNewsModal(true);
  };

  const handleCloseModal = () => {
    setShowNewsModal(false);
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div>
        <div className="news-hero">
          <div className="container">
            <h1 className="news-title">News & Updates</h1>
            <p className="news-subtitle">
              Stay informed about the latest events, exhibitions, and happenings at Sahas Uyana.
            </p>
          </div>
        </div>
        <div className="loading-section section">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading news...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="news">
        {/* Hero Section */}
        <section className="news-hero">
          <div className="container">
            <FadeInUp delay={0.2}>
              <h1 className="news-title">News & Updates</h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="news-subtitle">
                Stay informed about the latest events, exhibitions, and happenings at Sahas Uyana.
              </p>
            </FadeInUp>
          </div>
        </section>

        {/* News Grid */}
        <section className="news-grid section">
          <div className="container">
            {newsItems.length > 0 ? (
              <StaggerContainer>
                <div className="news-items">
                  {newsItems.map((item) => (
                    <StaggerItem key={item.id}>
                      <CardHover>
                        <article className="news-card card">
                          <div className="news-image">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="news-real-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`news-placeholder ${item.image}`}
                              style={{
                                display: item.imageUrl ? 'none' : 'flex'
                              }}
                            >
                              {item.title}
                            </div>
                            <div className="news-category">{item.category}</div>
                          </div>
                          <div className="news-content">
                            <h3 className="news-item-title">{item.title}</h3>
                            <p className="news-item-description">{item.description}</p>
                            <div className="news-meta">
                              <span className="news-date">{formatDate(item.date)}</span>
                              <button
                                className="read-more"
                                onClick={() => handleReadMore(item)}
                              >
                                Read More →
                              </button>
                            </div>
                          </div>
                        </article>
                      </CardHover>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            ) : (
              <FadeInUp>
                <div className="no-news">
                  <h3>No News Available</h3>
                  <p>Check back later for the latest updates and announcements from Sahas Uyana.</p>
                </div>
              </FadeInUp>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter-section section">
          <div className="container">
            <FadeInUp>
              <div className="newsletter-content">
                <h2 className="newsletter-title">Stay Updated</h2>
                <p className="newsletter-description">
                  Subscribe to our newsletter to receive the latest news and updates about events at Sahas Uyana.
                </p>
                <form className="newsletter-form">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="newsletter-input"
                      required
                    />
                    <button type="submit" className="btn btn-primary newsletter-btn">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* News Detail Modal */}
        {showNewsModal && selectedNews && (
          <div className="news-modal-overlay" onClick={handleCloseModal}>
            <ScaleIn>
              <div className="news-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="news-modal-header">
                  <div className="news-modal-category">{selectedNews.category}</div>
                  <button className="news-modal-close" onClick={handleCloseModal}>
                    &times;
                  </button>
                </div>
                <div className="news-modal-body">
                  {selectedNews.imageUrl && (
                    <div className="news-modal-image">
                      <img
                        src={selectedNews.imageUrl}
                        alt={selectedNews.title}
                        className="news-modal-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <h2 className="news-modal-title">{selectedNews.title}</h2>
                  <div className="news-modal-date">{formatDate(selectedNews.date)}</div>
                  <div className="news-modal-description">
                    <p>{selectedNews.description}</p>
                  </div>
                  {selectedNews.content && selectedNews.content !== selectedNews.description && (
                    <div className="news-modal-content-text">
                      <p>{selectedNews.content}</p>
                    </div>
                  )}
                </div>
                <div className="news-modal-footer">
                  <button className="btn btn-primary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </ScaleIn>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default News;
