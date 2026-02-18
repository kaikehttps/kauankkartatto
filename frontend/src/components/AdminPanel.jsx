import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { tattooCategories as defaultCategories } from '../data/mock';

const AdminPanel = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [editingSource, setEditingSource] = useState(null); // 'custom' ou 'default'
  const [formData, setFormData] = useState({
    id: '',
    category: 'realismo',
    image: '',
    alt: ''
  });
  const [uploadPreview, setUploadPreview] = useState(null);

  const ADMIN_PASSWORD = 'aai0KAFuz\\£/33ygAU!';

  // Carregar todas as imagens (padrão + customizadas)
  const loadAllImages = () => {
    // Obter imagens customizadas
    const customImages = localStorage.getItem('portfolioImages');
    const customList = customImages ? JSON.parse(customImages) : [];
    
    // Obter imagens padrão que foram editadas/deletadas
    const deletedImages = localStorage.getItem('deletedDefaultImages');
    const deletedList = deletedImages ? JSON.parse(deletedImages) : [];
    
    // Combinar todas as imagens
    const allImgs = [];
    
    // Adicionar imagens padrão (que não foram deletadas)
    Object.keys(defaultCategories).forEach(category => {
      defaultCategories[category].forEach(img => {
        if (!deletedList.includes(img.id)) {
          allImgs.push({ ...img, source: 'default' });
        }
      });
    });
    
    // Adicionar imagens customizadas
    customList.forEach(img => {
      allImgs.push({ ...img, source: 'custom' });
    });
    
    return allImgs;
  };

  // Carregar imagens ao autenticar
  useEffect(() => {
    if (isAuthenticated) {
      setAllImages(loadAllImages());
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setActiveTab('dashboard');
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setUploadPreview(base64);
      setFormData(prev => ({ ...prev, image: base64 }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    
    if (!formData.image || !formData.alt || !formData.category) {
      setError('Preencha todos os campos');
      return;
    }

    if (editingId) {
      // Editar imagem existente
      if (editingSource === 'default') {
        // Para imagens padrão, salvar alterações em localStorage
        const editedDefaults = localStorage.getItem('editedDefaultImages');
        const editedList = editedDefaults ? JSON.parse(editedDefaults) : {};
        
        editedList[editingId] = {
          ...formData,
          id: editingId,
          source: 'default'
        };
        
        localStorage.setItem('editedDefaultImages', JSON.stringify(editedList));
      } else {
        // Para imagens customizadas
        const customImages = localStorage.getItem('portfolioImages');
        const customList = customImages ? JSON.parse(customImages) : [];
        
        const updated = customList.map(img =>
          img.id === editingId ? { ...formData, id: editingId } : img
        );
        localStorage.setItem('portfolioImages', JSON.stringify(updated));
      }
      
      setEditingId(null);
      setEditingSource(null);
    } else {
      // Adicionar nova imagem
      const newImage = {
        id: Date.now().toString(),
        ...formData,
        source: 'custom'
      };
      
      const customImages = localStorage.getItem('portfolioImages');
      const customList = customImages ? JSON.parse(customImages) : [];
      const updated = [...customList, newImage];
      localStorage.setItem('portfolioImages', JSON.stringify(updated));
    }

    // Disparar evento de atualização
    window.dispatchEvent(new Event('portfolioUpdated'));
    
    // Recarregar imagens
    setAllImages(loadAllImages());
    setFormData({ id: '', category: 'realismo', image: '', alt: '' });
    setUploadPreview(null);
    setError('');
  };

  const handleEdit = (image) => {
    setFormData(image);
    setEditingId(image.id);
    setEditingSource(image.source);
    if (image.image && image.image.startsWith('data:')) {
      setUploadPreview(image.image);
    }
    setActiveTab('images');
  };

  const handleDelete = (id, source) => {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      if (source === 'default') {
        // Para imagens padrão, adicionar à lista de deletadas
        const deletedImages = localStorage.getItem('deletedDefaultImages');
        const deletedList = deletedImages ? JSON.parse(deletedImages) : [];
        
        if (!deletedList.includes(id)) {
          deletedList.push(id);
        }
        
        localStorage.setItem('deletedDefaultImages', JSON.stringify(deletedList));
      } else {
        // Para imagens customizadas
        const customImages = localStorage.getItem('portfolioImages');
        const customList = customImages ? JSON.parse(customImages) : [];
        
        const updated = customList.filter(img => img.id !== id);
        localStorage.setItem('portfolioImages', JSON.stringify(updated));
      }
      
      // Disparar evento de atualização
      window.dispatchEvent(new Event('portfolioUpdated'));
      
      // Recarregar imagens
      setAllImages(loadAllImages());
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    setEditingId(null);
    setEditingSource(null);
    setFormData({ id: '', category: 'realismo', image: '', alt: '' });
    setUploadPreview(null);
    setActiveTab('dashboard');
    onClose();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {isAuthenticated ? 'Painel Admin' : 'Acesso Admin'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {!isAuthenticated ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha de Administrador
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm font-medium">{error}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Entrar
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">
                      ✓ Autenticado com sucesso
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-4 py-2 font-medium transition ${
                        activeTab === 'dashboard'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('images')}
                      className={`px-4 py-2 font-medium transition ${
                        activeTab === 'images'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Gerenciar Imagens
                    </button>
                  </div>

                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-gray-800">Informações do Site:</h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <strong>Versão:</strong> 1.0.0
                          </p>
                          <p className="text-gray-600">
                            <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-gray-600">
                            <strong>Ambiente:</strong> {process.env.NODE_ENV}
                          </p>
                          <p className="text-gray-600">
                            <strong>Total de Imagens:</strong> {allImages.length}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">Funcionalidades:</h3>
                        <ul className="text-sm text-blue-900 space-y-1">
                          <li>✓ Adicionar novas imagens ao portfolio</li>
                          <li>✓ Editar imagens (padrão e customizadas)</li>
                          <li>✓ Excluir qualquer imagem</li>
                          <li>✓ Upload de imagens do dispositivo</li>
                          <li>✓ Organizar por categorias (Realismo, Arte Sacra, Blackwork)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === 'images' && (
                    <div className="space-y-4">
                      {/* Formulário de adicionar/editar */}
                      <form onSubmit={handleAddImage} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-gray-800">
                          {editingId ? 'Editar Imagem' : 'Adicionar Nova Imagem'}
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="realismo">Realismo</option>
                            <option value="arteSacra">Arte Sacra</option>
                            <option value="blackwork">Blackwork</option>
                          </select>
                        </div>

                        {/* Upload de arquivo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload de Imagem
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:bg-gray-50 transition cursor-pointer">
                              <Upload size={18} className="text-gray-600" />
                              <span className="text-gray-600">
                                {uploadPreview ? 'Imagem carregada ✓' : 'Clique para selecionar uma imagem'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Preview da imagem */}
                        {uploadPreview && (
                          <div className="border border-gray-200 rounded-lg p-2">
                            <img 
                              src={uploadPreview} 
                              alt="Preview" 
                              className="w-full h-40 object-cover rounded"
                            />
                          </div>
                        )}

                        {/* URL alternativa */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL da Imagem (alternativa)
                          </label>
                          <input
                            type="url"
                            value={!uploadPreview ? formData.image : ''}
                            onChange={(e) =>
                              !uploadPreview && setFormData({ ...formData, image: e.target.value })
                            }
                            placeholder="https://exemplo.com/imagem.jpg"
                            disabled={!!uploadPreview}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição (Alt)
                          </label>
                          <input
                            type="text"
                            value={formData.alt}
                            onChange={(e) =>
                              setFormData({ ...formData, alt: e.target.value })
                            }
                            placeholder="Descrição da tatuagem"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {error && (
                          <div className="text-red-500 text-sm font-medium">{error}</div>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            {editingId ? 'Salvar Alterações' : 'Adicionar Imagem'}
                          </button>
                          {editingId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditingSource(null);
                                setFormData({
                                  id: '',
                                  category: 'realismo',
                                  image: '',
                                  alt: ''
                                });
                                setUploadPreview(null);
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Lista de imagens */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">
                          Todas as Imagens ({allImages.length})
                        </h3>
                        {allImages.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">
                            Nenhuma imagem disponível
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {allImages.map((image) => (
                              <div
                                key={image.id}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image.image}
                                  alt={image.alt}
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="%23999"%3EErro%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                                <div className="p-2 bg-white space-y-2">
                                  <p className="text-xs text-gray-600 truncate">
                                    <span className="font-medium">Cat:</span> {image.category}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {image.source === 'default' ? '📌 Padrão' : '✨ Customizada'}
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEdit(image)}
                                      className="flex-1 bg-yellow-500 text-white py-1 rounded text-xs hover:bg-yellow-600 transition flex items-center justify-center gap-1"
                                    >
                                      <Edit2 size={14} />
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDelete(image.id, image.source)}
                                      className="flex-1 bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600 transition flex items-center justify-center gap-1"
                                    >
                                      <Trash2 size={14} />
                                      Deletar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition mt-6"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
