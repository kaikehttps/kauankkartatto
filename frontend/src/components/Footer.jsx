import React from 'react';
import { studioInfo } from '../data/mock';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">{studioInfo.name}</h3>
            <p className="footer-description">
              Arte que marca sua história. Tatuagens exclusivas com qualidade e segurança.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contato</h4>
            <div className="footer-links">
              <a href={`tel:${studioInfo.phone}`} className="footer-link">
                <Phone size={18} />
                <span>{studioInfo.phone}</span>
              </a>
              <a href={`https://wa.me/${studioInfo.whatsapp}`} className="footer-link" target="_blank" rel="noopener noreferrer">
                <Phone size={18} />
                <span>WhatsApp</span>
              </a>
              <div className="footer-link">
                <MapPin size={18} />
                <span>{studioInfo.address}</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Redes Sociais</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {studioInfo.name}. Kaike Alves -Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
