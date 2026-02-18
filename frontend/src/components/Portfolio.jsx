import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { tattooCategories as defaultCategories } from '../data/mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import useScrollOptimization from '../hooks/useScrollOptimization';

const PortfolioCard = memo(({ tattoo, isScrolling }) => (
  <motion.div 
    className="portfolio-card"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: isScrolling ? 0.2 : 0.4 }}
    whileHover={!isScrolling ? { y: -8, transition: { duration: 0.2 } } : {}}
  >
    <img 
      src={tattoo.image} 
      alt={tattoo.alt}
      className="portfolio-image"
      loading="lazy"
      onError={(e) => {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
      }}
    />
    <div className="portfolio-overlay">
      <span className="portfolio-category">{tattoo.category}</span>
    </div>
  </motion.div>
));

PortfolioCard.displayName = 'PortfolioCard';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('realismo');
  const [tattooCategories, setTattooCategories] = useState(defaultCategories);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isScrolling = useScrollOptimization();

  const loadImages = () => {
    // Obter imagens padrão
    const categories = {
      realismo: [...defaultCategories.realismo],
      arteSacra: [...defaultCategories.arteSacra],
      blackwork: [...defaultCategories.blackwork]
    };

    // Aplicar edições às imagens padrão
    const editedDefaults = localStorage.getItem('editedDefaultImages');
    if (editedDefaults) {
      const editedList = JSON.parse(editedDefaults);
      Object.keys(editedList).forEach(imgId => {
        const edited = editedList[imgId];
        Object.keys(categories).forEach(cat => {
          const idx = categories[cat].findIndex(img => img.id === imgId);
          if (idx !== -1) {
            categories[cat][idx] = {
              ...categories[cat][idx],
              image: edited.image,
              alt: edited.alt,
              category: edited.category
            };
          }
        });
      });
    }

    // Remover imagens padrão deletadas
    const deletedImages = localStorage.getItem('deletedDefaultImages');
    if (deletedImages) {
      const deletedList = JSON.parse(deletedImages);
      Object.keys(categories).forEach(cat => {
        categories[cat] = categories[cat].filter(img => !deletedList.includes(img.id));
      });
    }

    // Obter imagens customizadas
    const customImages = localStorage.getItem('portfolioImages');
    const customList = customImages ? JSON.parse(customImages) : [];
    
    // Agrupar imagens customizadas por categoria
    const grouped = {
      realismo: [],
      arteSacra: [],
      blackwork: []
    };
    
    customList.forEach(img => {
      if (grouped[img.category]) {
        grouped[img.category].push(img);
      }
    });
    
    // Mesclar com imagens padrão (customizadas primeiro)
    const merged = {
      realismo: [...grouped.realismo, ...categories.realismo],
      arteSacra: [...grouped.arteSacra, ...categories.arteSacra],
      blackwork: [...grouped.blackwork, ...categories.blackwork]
    };
    
    setTattooCategories(merged);
  };

  // Carregar imagens customizadas do localStorage ao montar
  useEffect(() => {
    loadImages();
  }, []);

  // Listener para quando o admin atualiza as imagens
  useEffect(() => {
    const handleStorageChange = () => {
      loadImages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioUpdated', handleStorageChange);
    };
  }, []);

  return (
    <section id="portfolio" className="portfolio-section" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-heading text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4 }}
        >
          Meus Trabalhos
        </motion.h2>
        
        <Tabs defaultValue="realismo" className="portfolio-tabs" onValueChange={setActiveCategory}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TabsList className="tabs-list-custom">
              <TabsTrigger value="realismo" className="tab-trigger-custom">
                Realismo
              </TabsTrigger>
              <TabsTrigger value="arteSacra" className="tab-trigger-custom">
                Arte Sacra
              </TabsTrigger>
              <TabsTrigger value="blackwork" className="tab-trigger-custom">
                Blackwork
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="realismo">
            <div className="portfolio-grid">
              {tattooCategories.realismo.map((tattoo) => (
                <PortfolioCard key={tattoo.id} tattoo={tattoo} isScrolling={isScrolling} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="arteSacra">
            <div className="portfolio-grid">
              {tattooCategories.arteSacra.map((tattoo) => (
                <PortfolioCard key={tattoo.id} tattoo={tattoo} isScrolling={isScrolling} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blackwork">
            <div className="portfolio-grid">
              {tattooCategories.blackwork.map((tattoo) => (
                <PortfolioCard key={tattoo.id} tattoo={tattoo} isScrolling={isScrolling} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default memo(Portfolio);
