import React from 'react';
import './Helabojun.css';
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, CardHover, PageTransition } from '../components/ScrollAnimation';

const Helabojun = () => {
  const menuItems = [
    {
      id: 1,
      name: "Kottu Roti",
      description: "A popular street food made with chopped roti, Eggs and vegetables.",
      image: "https://i.postimg.cc/qvGqdbr4/imgi_54_20240522004316-andy-20cooks-20-20kottu-20roti-20recipe.jpg"
    },
    {
      id: 2,
      name: "Hoppers (Appa)",
      description: "Crispy, bowl-shaped pancakes made from fermented rice flour and coconut milk. Served plain or with an egg.",
      image: "https://i.postimg.cc/6pKqgsDM/imgi_9_From-Colombo-to-Your-Kitchen_-Mastering-the-Art-of-Sri-Lankan-Hoppers.jpg"
    },
    {
      id: 3,
      name: "Rice and Curry",
      description: "A staple meal consisting of steamed rice served with a variety of flavorful vegetable curries.",
      image: "https://i.postimg.cc/gk8rgcBw/imgi_23_Sri-Lankan-rice-and-curry-plate-sri-lankan-cuisine-travel-1170x658-1.jpg"
    },
    {
      id: 4,
      name: "Watalappam",
      description: "A rich coconut custard pudding flavored with jaggery, cardamom, and nutmeg. A truly decadent dessert.",
      image: "https://i.postimg.cc/2yBN86Bn/imgi_56_1858687555974_02110302_image153252_full.jpg"
    },
    {
      id: 5,
      name: "String Hoppers",
      description: "Steamed rice flour noodles pressed into noodle-like discs and typically served for breakfast or dinner. Made from a dough of rice flour, salt, and hot water, commonly eaten with various curries and sambals.",
      image: "https://i.postimg.cc/T2yKWJVJ/imgi_31_srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvMTdkM.webp"
    },
    {
      id: 6,
      name: "Vegetable Roti (Elawalu Roti)",
      description: "A Sri Lankan-style stuffed flatbread with curried vegetables. This much-loved Sri Lankan street food is also a special part of Sri Lankan Short Eats (Savory Snacks).",
      image: "https://i.postimg.cc/TPGScN3p/imgi-2-243666969-599025847945602-3657104664899358854-n.jpg"
    },
    {
      id: 7,
      name: "Dhal Wade (Dal Vada)",
      description: "South Indian and Sri Lankan fried fritters made from soaked and ground lentils, such as chana dal, mixed with spices and herbs like curry leaves, green chilies, and ginger. These savory, crispy snacks are a popular street food and appetizer.",
      image: "https://i.postimg.cc/8CP5kRkW/imgi_10_63678932.jpg"
    },
    {
      id: 8,
      name: "Parata (Paratha)",
      description: "A popular unleavened flatbread known for its flaky, layered texture and often made with whole wheat flour and ghee or oil. It can be served plain, folded, or stuffed with various fillings, and is a staple breakfast or meal item.",
      image: "https://i.postimg.cc/8CKC77sY/imgi_191_6afab9d1aecc058f23a6ac4d91d9de7c.jpg"
    },
    {
      id: 9,
      name: "Dosa",
      description: "A thin, savoury crepe in South Indian cuisine made from a fermented batter of ground black gram and rice. Dosas are served hot, often with chutney and sambar.",
      image: "https://i.postimg.cc/CMWzCnJT/imgi_2_Dosa-Recipe-Step-By-Step-Instructions-scaled.jpg.webp"
    },
    {
      id: 10,
      name: "Kiribath",
      description: "A traditional Sri Lankan dish made from rice cooked with coconut milk. It can be considered a form of rice cake or rice pudding and is an essential dish in Sri Lankan cuisine.",
      image: "https://i.postimg.cc/MTH8Nt6P/imgi_2_image_f4667a8e6e-04011605.jpg"
    },
    {
      id: 11,
      name: "Pittu (Puttu)",
      description: "A traditional dish from Sri Lanka and South India, made from steamed cylinders of ground rice layered with grated coconut. This nutritious and flavorful dish is a beloved breakfast staple.",
      image: "https://i.postimg.cc/gJ1kK1Vq/imgi_44_81DB53BA-8334-420E-BA10-195E03288F43-768x1024.jpg"
    },
    {
      id: 12,
      name: "Uduwel (Pani Walalu)",
      description: "A sweetmeat used at celebratory events and special occasions, this sugary delight is made from white lentils, rice flour, treacle or sugar. It's all about the sweetness and the juicy bite that makes Uduwel a famous treat in Sri Lanka.",
      image: "https://i.postimg.cc/W4h9SRPh/imgi-117-Undu-walalu-scaled.jpg"
    }
  ];

  return (
    <PageTransition>
      <div className="helabojun">
        {/* Hero Section */}
        <section className="helabojun-hero">
          <div className="container">
            <div className="hero-content-wrapper">
              <FadeInUp delay={0.2}>
                <h1 className="helabojun-title">Helabojun</h1>
              </FadeInUp>
              <FadeInUp delay={0.4}>
                <p className="helabojun-subtitle">
                  Experience the authentic flavors of Sri Lanka at Helabojun, where traditional recipes meet modern culinary techniques.
                  Our menu features a curated selection of dishes, each prepared with fresh, locally sourced ingredients to deliver
                  an unforgettable dining experience.
                </p>
              </FadeInUp>
              <FadeInUp delay={0.6}>
                <div className="hero-cta">
                  <a href="#menu-section" className="btn btn-primary hero-btn">
                    Explore Our Menu
                  </a>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* Menu Highlights */}
        <section className="menu-section section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Menu Highlights</h2>
            </FadeInUp>
            <StaggerContainer>
              <div className="menu-grid">
                {menuItems.map((item) => (
                  <StaggerItem key={item.id}>
                    <CardHover>
                      <div className="menu-card card">
                        <div className="menu-image">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="menu-item-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className={`menu-placeholder ${item.name.toLowerCase().replace(/\s+/g, '-')}`} style={{ display: 'none' }}>
                            {item.name}
                          </div>
                        </div>
                        <div className="menu-content">
                          <h3 className="menu-item-name">{item.name}</h3>
                          <p className="menu-item-description">{item.description}</p>
                        </div>
                      </div>
                    </CardHover>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Our Ingredients */}
        <section className="ingredients-section section">
          <div className="container">
            <div className="ingredients-content">
              <FadeInLeft>
                <div className="ingredients-text">
                  <h2 className="section-title">Our Ingredients</h2>
                  <p className="ingredients-description">
                    We are committed to using the finest ingredients sourced directly from local farmers and suppliers.
                    Our dishes are prepared with traditional spices and herbs, ensuring an authentic taste of Sri Lanka
                    that is both fresh and vibrant. Every ingredient is carefully selected to maintain the highest quality
                    and nutritional value.
                  </p>
                  <div className="ingredient-features">
                    <div className="feature-item">
                      <div className="feature-icon">🌱</div>
                      <div className="feature-text">
                        <h4>Locally Sourced</h4>
                        <p>Fresh ingredients from local farmers</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🌶️</div>
                      <div className="feature-text">
                        <h4>Traditional Spices</h4>
                        <p>Authentic Sri Lankan spice blends</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🥥</div>
                      <div className="feature-text">
                        <h4>Fresh Coconut</h4>
                        <p>Daily fresh coconut products</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🍚</div>
                      <div className="feature-text">
                        <h4>Premium Rice</h4>
                        <p>High-quality local rice varieties</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInLeft>
              <FadeInRight>
                <div className="ingredients-image">
                  <div className="ingredients-placeholder">
                    <div className="ingredient-items">
                      <div className="ingredient-item">🌶️</div>
                      <div className="ingredient-item">🥥</div>
                      <div className="ingredient-item">🍚</div>
                      <div className="ingredient-item">🌱</div>
                      <div className="ingredient-item">🧄</div>
                      <div className="ingredient-item">🧅</div>
                    </div>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* Visit Us */}
        <section className="visit-section section">
          <div className="container">
            <div className="visit-content">
              <div className="visit-text">
                <h2 className="section-title">Visit Us</h2>
                <p className="visit-description">
                  Helabojun is located within the serene and cultural ambiance of Sahas Uyana.
                  Join us for lunch or dinner and savor the true essence of Sri Lankan cuisine in a beautiful setting.
                  Our restaurant offers both indoor and outdoor seating options, allowing you to enjoy your meal
                  in the most comfortable environment.
                </p>
                <div className="visit-info">
                  <div className="info-item">
                    <div className="info-icon">🕒</div>
                    <div className="info-text">
                      <h4>Opening Hours</h4>
                      <p>Daily: 11:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                      <h4>Location</h4>
                      <p>Sahas Uyana, Kandy, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Benefits */}
        <section className="health-section section">
          <div className="container">
            <h2 className="section-title">Traditional Healthy Foods</h2>
            <p className="section-subtitle">
              Discover the health benefits of traditional Sri Lankan cuisine
            </p>
            <div className="health-grid">
              <div className="health-card card">
                <div className="health-icon">💚</div>
                <h3>Nutritious & Balanced</h3>
                <p>Our traditional dishes are rich in nutrients, fiber, and essential vitamins, providing a balanced diet that supports overall health and well-being.</p>
              </div>
              <div className="health-card card">
                <div className="health-icon">🌿</div>
                <h3>Natural Ingredients</h3>
                <p>We use only natural, unprocessed ingredients without artificial preservatives or additives, ensuring you get the purest flavors and health benefits.</p>
              </div>
              <div className="health-card card">
                <div className="health-icon">🔥</div>
                <h3>Digestive Health</h3>
                <p>Traditional Sri Lankan spices like turmeric, ginger, and cumin are known for their digestive properties and anti-inflammatory benefits.</p>
              </div>
              <div className="health-card card">
                <div className="health-icon">💪</div>
                <h3>Energy & Vitality</h3>
                <p>Our meals provide sustained energy through complex carbohydrates and healthy fats, keeping you energized throughout the day.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Helabojun;