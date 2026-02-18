// Mock data for tattoo studio website

export const studioInfo = {
  name: "Ink Soul Studio",
  phone: "+55 11 98765-4321",
  whatsapp: "5511987654321",
  address: "Rua das Artes, 123 - São Paulo, SP",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0986548289!2d-46.65462368502207!3d-23.56129668467891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201578%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
};

export const artistInfo = {
  name: "Rafael Costa",
  bio: "Tatuador profissional há mais de 10 anos, especializado em realismo, arte sacra e blackwork. Cada tatuagem é uma obra única, criada com dedicação e paixão pela arte corporal. Atendo em estúdio equipado com os mais altos padrões de higiene e segurança.",
  photo: "https://images.unsplash.com/photo-1638458957842-d901372fed55?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHx0YXR0b28lMjBhcnRpc3QlMjB3b3JraW5nfGVufDB8fHx8MTc3MTE3NTE3MXww&ixlib=rb-4.1.0&q=85",
  experience: "10+ anos",
  specialties: ["Realismo", "Arte Sacra", "Blackwork"]
};

export const tattooCategories = {
  realismo: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1640202430303-a71359ade259?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem realista de retrato",
      category: "Realismo"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1607943917700-18ec6ff5a4c2?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem realista em braço",
      category: "Realismo"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1640202430303-a71359ade259?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem realista detalhada",
      category: "Realismo"
    }
  ],
  arteSacra: [
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1729009223925-a805afee0820?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem de arte sacra",
      category: "Arte Sacra"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1729009223925-a805afee0820?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem religiosa",
      category: "Arte Sacra"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1729009223925-a805afee0820?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem sacra detalhada",
      category: "Arte Sacra"
    }
  ],
  blackwork: [
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1561377455-190afb395ed7?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem blackwork geométrica",
      category: "Blackwork"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1561491040-14a86bca9106?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem blackwork em corpo",
      category: "Blackwork"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1557130641-1b14718f096a?crop=entropy&cs=srgb&fm=jpg&q=85",
      alt: "Tatuagem blackwork detalhada",
      category: "Blackwork"
    }
  ]
};
