import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { UploadCloud, CheckCircle, X, Loader2, Plus, Save, Trash2, Hash } from 'lucide-react';

export default function AdminPanel({ onProductAdded, productToEdit = null, onCancelEdit }) {

  // ── 1. ESTADOS DEL FORMULARIO BÁSICO ──
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    puffs: '',
    nicotine: '5%',
    rechargeable: 'Sí (USB-C)',
    description: '',
    badge: ''
  });

  // ── 2. NUEVO ESTADO: INVENTARIO POR SABOR (JSONB) ──
  const [flavorsList, setFlavorsList] = useState([{ name: '', stock: 0 }]);

  // ── 3. ESTADOS PARA MÚLTIPLES IMÁGENES (Slider / Máximo 3) ──
  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]);           
  
  // ── 4. ESTADOS DE UI Y CARGA ──
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef(null);

  const totalImages = existingImages.length + newImages.length;

  // ── 5. EFECTO PARA LLENAR EL FORMULARIO EN MODO EDICIÓN ──
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name:         productToEdit.name         || '',
        price:        productToEdit.price        || '',
        puffs:        productToEdit.puffs        || '',
        nicotine:     productToEdit.nicotine     || '5%',
        rechargeable: productToEdit.rechargeable || 'Sí (USB-C)',
        description:  productToEdit.description  || '',
        badge:        productToEdit.badge        || ''
      });

      // Lógica segura para cargar la lista dinámica de sabores (JSONB)
      if (productToEdit.flavors && Array.isArray(productToEdit.flavors)) {
        const parsedFlavors = productToEdit.flavors.map(f => 
          typeof f === 'string' ? { name: f, stock: 10 } : f
        );
        setFlavorsList(parsedFlavors.length > 0 ? parsedFlavors : [{ name: '', stock: 0 }]);
      } else {
        setFlavorsList([{ name: '', stock: 0 }]);
      }

      // Cargar imágenes en modo edición
      if (productToEdit.image_url) {
        if (Array.isArray(productToEdit.image_url)) {
          setExistingImages(productToEdit.image_url);
        } else {
          setExistingImages([productToEdit.image_url]);
        }
      } else {
        setExistingImages([]);
      }
      setNewImages([]);
    } else {
      setFormData({ 
        name: '', 
        price: '', 
        puffs: '', 
        nicotine: '5%', 
        rechargeable: 'Sí (USB-C)', 
        description: '', 
        badge: '' 
      });
      setFlavorsList([{ name: '', stock: 0 }]);
      setExistingImages([]);
      setNewImages([]);
    }
  }, [productToEdit]);

  // ── 6. LÓGICA DE GESTIÓN DINÁMICA DE SABORES ──
  const addFlavorRow = () => {
    setFlavorsList([...flavorsList, { name: '', stock: 0 }]);
  };

  const removeFlavorRow = (index) => {
    const newList = flavorsList.filter((_, i) => i !== index);
    setFlavorsList(newList.length > 0 ? newList : [{ name: '', stock: 0 }]);
  };

  const updateFlavorData = (index, field, value) => {
    const newList = [...flavorsList];
    newList[index][field] = field === 'stock' ? parseInt(value, 10) || 0 : value;
    setFlavorsList(newList);
  };

  // ── 7. LÓGICA DE COMPRESIÓN DE IMÁGENES A WEBP ──
  const compressImage = async (file) => {
    const options = { 
      maxSizeMB: 0.8, 
      maxWidthOrHeight: 1200, 
      useWebWorker: true, 
      fileType: 'image/webp' 
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error comprimiendo la imagen:', error);
      return file; 
    }
  };

  // ── 8. LÓGICA PARA PROCESAR MÚLTIPLES ARCHIVOS (MAX 3) ──
  const processFiles = async (filesArray) => {
    if (totalImages + filesArray.length > 3) {
      alert('¡Solo puedes subir un máximo de 3 imágenes por producto para el Slider!');
      return;
    }

    setIsCompressing(true);
    const processed = [];
    
    for (const file of filesArray) {
      if (file.type.startsWith('image/')) {
        const optimizedFile = await compressImage(file);
        processed.push({
          file: optimizedFile,
          preview: URL.createObjectURL(optimizedFile)
        });
      }
    }
    
    setNewImages(prev => [...prev, ...processed]);
    setIsCompressing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ── MODIFICACIÓN: BORRADO FÍSICO DE STORAGE ──
  const removeExistingImage = async (urlToRemove, indexToRemove) => {
    const confirmDelete = window.confirm("¿Deseas eliminar esta imagen permanentemente del servidor para ahorrar espacio?");
    
    if (confirmDelete) {
      try {
        // 1. Extraemos el nombre del archivo de la URL
        const fileName = urlToRemove.split('/').pop();

        // 2. Borramos el archivo físico del bucket 'shop-assets'
        const { error } = await supabase.storage
          .from('shop-assets')
          .remove([fileName]);

        if (error) {
          throw error;
        }

        // 3. Si se borró del servidor, la quitamos del estado visual
        setExistingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
        
        console.log(`Archivo ${fileName} eliminado con éxito del Storage.`);
      } catch (error) {
        console.error("Error al eliminar del Storage:", error);
        alert("No se pudo eliminar el archivo del servidor. Verifica los permisos de Supabase.");
      }
    }
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // ── 9. LÓGICA DE SUBIDA A SUPABASE Y GUARDADO FINAL ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalImages === 0) {
      alert('Por favor, selecciona al menos 1 imagen para el producto. (Máximo 3)');
      return;
    }

    const validFlavors = flavorsList.filter(f => f.name.trim() !== '');
    if (validFlavors.length === 0) {
      alert('Debes añadir al menos un sabor con su respectivo nombre.');
      return;
    }

    setIsUploading(true);
    setSuccessMessage('');

    try {
      let finalImageUrls = [...existingImages];

      for (const item of newImages) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('shop-assets')
          .upload(fileName, item.file, { 
            cacheControl: '3600', 
            upsert: false 
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('shop-assets')
          .getPublicUrl(fileName);
          
        finalImageUrls.push(data.publicUrl);
      }

      const totalStock = validFlavors.reduce((acc, curr) => acc + curr.stock, 0);

      const productDataToSave = {
        name:         formData.name,
        price:        parseInt(formData.price, 10),
        puffs:        parseInt(formData.puffs, 10),
        nicotine:     formData.nicotine,
        rechargeable: formData.rechargeable,
        description:  formData.description,
        badge:        formData.badge || null,
        flavors:      validFlavors, 
        total_stock:  totalStock,   
        image_url:    finalImageUrls
      };

      if (productToEdit) {
        const { error } = await supabase
          .from('products')
          .update(productDataToSave)
          .eq('id', productToEdit.id);
          
        if (error) throw error;
        setSuccessMessage('¡Producto e inventario actualizados correctamente!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productDataToSave]);
          
        if (error) throw error;
        setSuccessMessage('¡Vape publicado en el catálogo con inventario inicial!');
        
        setFormData({ 
          name: '', 
          price: '', 
          puffs: '', 
          nicotine: '5%', 
          rechargeable: 'Sí (USB-C)', 
          description: '', 
          badge: '' 
        });
        setFlavorsList([{ name: '', stock: 0 }]);
        setExistingImages([]);
        setNewImages([]);
      }

      if (onProductAdded) onProductAdded();

      setTimeout(() => {
        setSuccessMessage('');
        if (productToEdit && onCancelEdit) onCancelEdit();
      }, 2000);

    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Hubo un error al guardar el producto. Revisa la consola para más detalles.');
    } finally {
      setIsUploading(false);
    }
  };

  // ── 10. INTERFAZ DE USUARIO DEL ADMIN PANEL ──
  return (
    <div className="bg-[#030308] min-h-screen pt-28 pb-20 px-6 font-sans relative overflow-hidden animate-fade-in">
      
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-phoenix-gold/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-10 border-b border-white/5 pb-6 flex justify-between items-end">
          <div>
            <span className="text-phoenix-gold text-[10px] uppercase tracking-widest font-black">
              Panel de Control
            </span>
            <h1 className="text-4xl md:text-5xl text-white font-serif tracking-tight mt-2">
              {productToEdit ? 'Editar ' : 'Nuevo '}<span className="text-phoenix-gold italic">Producto</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 font-light max-w-lg">
              {productToEdit 
                ? 'Gestiona el inventario por sabor y modifica las imágenes de la galería.'
                : 'Añade un nuevo vape, define su stock por sabores y sube hasta 3 fotos para el slider.'}
            </p>
          </div>
          {productToEdit && (
            <button 
              onClick={onCancelEdit} 
              className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest font-black pb-2 transition-colors border-b border-transparent hover:border-white/40"
            >
              Cancelar Edición
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 animate-fade-in shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <CheckCircle size={20} />
            <span className="text-sm font-bold tracking-wide">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── COLUMNA IZQUIERDA: ZONA DE IMÁGENES (MAX 3) ── */}
          <div className="lg:col-span-1 space-y-4">
            
            <div 
              onClick={() => totalImages < 3 && fileInputRef.current.click()}
              onDragOver={handleDragOver} 
              onDrop={handleDrop}
              className={`relative h-64 rounded-4xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
                isCompressing ? 'border-phoenix-gold bg-phoenix-gold/5 animate-pulse' : 
                totalImages >= 3 ? 'border-white/5 bg-white/2 opacity-50 cursor-not-allowed' : 
                'border-white/10 hover:border-phoenix-gold/40 bg-white/2 hover:bg-white/5 cursor-pointer hover:shadow-[0_0_25px_rgba(212,175,55,0.05)]'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                multiple 
                className="hidden" 
              />
              
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 size={36} className="text-phoenix-gold animate-spin mb-4" />
                  <p className="text-phoenix-gold text-[10px] uppercase font-black tracking-widest">Procesando WebP...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={32} className={totalImages >= 3 ? 'text-white/20 mb-4' : 'text-phoenix-gold mb-4 transition-transform group-hover:-translate-y-1'} />
                  <p className="text-white text-sm font-bold mb-1">Subir fotos ({totalImages}/3)</p>
                  <p className="text-white/40 text-[10px] font-light px-2 mt-2 leading-relaxed">
                    {totalImages >= 3 ? 'Límite máximo de imágenes alcanzado.' : 'Haz clic o arrastra hasta 3 imágenes. Se convertirán y comprimirán a formato WebP.'}
                  </p>
                </div>
              )}
            </div>

            {totalImages > 0 && (
              <div className="grid grid-cols-3 gap-3 animate-fade-in p-4 bg-white/2 rounded-3xl border border-white/5">
                
                {existingImages.map((url, idx) => (
                  <div key={`ext-${idx}`} className="relative aspect-square rounded-2xl border border-white/10 overflow-hidden group bg-[#07070a]">
                    <img src={url} alt={`Existente ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button 
                      type="button" 
                      onClick={() => removeExistingImage(url, idx)} 
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md hover:scale-110 shadow-lg"
                      title="Eliminar imagen del servidor"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white/70 text-[8px] font-black uppercase tracking-widest text-center py-1 border-t border-white/10">
                      Actual
                    </div>
                  </div>
                ))}
                
                {newImages.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-2xl border border-phoenix-gold/50 overflow-hidden group bg-[#07070a] shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <img src={img.preview} alt={`Nueva ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button 
                      type="button" 
                      onClick={() => removeNewImage(idx)} 
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md hover:scale-110 shadow-lg"
                      title="Eliminar imagen nueva"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-phoenix-gold/90 text-black text-[8px] font-black uppercase tracking-widest text-center py-1">
                      Nueva
                    </div>
                  </div>
                ))}

                {[...Array(3 - totalImages)].map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square rounded-2xl border border-white/5 border-dashed bg-white/2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border border-white/10 bg-white/5"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── COLUMNA DERECHA: DATOS DEL VAPE E INVENTARIO ── */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white/2 border border-white/5 rounded-4xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2 space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Nombre del Producto
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Ej: Vaporesso XROS Pro"
                    className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all shadow-inner placeholder:text-white/20" 
                  />
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Precio (COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-phoenix-gold font-bold">$</span>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      value={formData.price} 
                      onChange={e => setFormData({ ...formData, price: e.target.value })} 
                      placeholder="80000"
                      className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 pl-8 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all shadow-inner placeholder:text-white/20" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Cantidad de Puffs
                  </label>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    value={formData.puffs} 
                    onChange={e => setFormData({ ...formData, puffs: e.target.value })} 
                    placeholder="6000"
                    className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all shadow-inner placeholder:text-white/20" 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Nicotina
                  </label>
                  <input 
                    type="text" 
                    value={formData.nicotine} 
                    onChange={e => setFormData({ ...formData, nicotine: e.target.value })} 
                    placeholder="Ej: 5%"
                    className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all shadow-inner placeholder:text-white/20" 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Recargable
                  </label>
                  <div className="relative">
                    <select 
                      value={formData.rechargeable} 
                      onChange={e => setFormData({ ...formData, rechargeable: e.target.value })} 
                      className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all cursor-pointer appearance-none shadow-inner"
                    >
                      <option value="Sí (USB-C)" className="bg-[#07070a]">Sí (USB-C)</option>
                      <option value="Sí (Micro-USB)" className="bg-[#07070a]">Sí (Micro-USB)</option>
                      <option value="No (Desechable)" className="bg-[#07070a]">No (Desechable)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-phoenix-gold transition-colors">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                    Etiqueta Especial <span className="text-white/25 normal-case font-normal ml-2">(opcional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.badge} 
                    onChange={e => setFormData({ ...formData, badge: e.target.value })} 
                    placeholder="Ej: Nuevo, Oferta" 
                    className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all shadow-inner placeholder:text-white/20" 
                  />
                </div>
              </div>
            </div>

            {/* ── PANEL DE INVENTARIO DINÁMICO ── */}
            <div className="bg-white/2 border border-white/5 rounded-4xl p-8 md:p-10 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-phoenix-gold/5 blur-[50px] pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-phoenix-gold/10 rounded-lg">
                    <Hash size={18} className="text-phoenix-gold" />
                  </div>
                  <h3 className="text-white font-serif text-xl tracking-tight">Inventario por Sabor</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addFlavorRow} 
                  className="bg-phoenix-gold/10 text-phoenix-gold border border-phoenix-gold/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-phoenix-gold hover:text-black transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Añadir Sabor
                </button>
              </div>

              <div className="space-y-3">
                {flavorsList.map((flavor, index) => (
                  <div key={index} className="flex gap-4 items-end animate-fade-in bg-[#07070a]/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex-1 space-y-2">
                      <label className="text-white/30 text-[9px] uppercase tracking-widest font-bold ml-1">Sabor</label>
                      <input 
                        type="text" 
                        value={flavor.name} 
                        onChange={(e) => updateFlavorData(index, 'name', e.target.value)} 
                        placeholder="Ej: Mango Ice" 
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-phoenix-gold/50 transition-colors placeholder:text-white/20" 
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <label className="text-white/30 text-[9px] uppercase tracking-widest font-bold ml-1">Stock</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={flavor.stock} 
                        onChange={(e) => updateFlavorData(index, 'stock', e.target.value)} 
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-sm text-center outline-none focus:border-phoenix-gold/50 transition-colors" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFlavorRow(index)} 
                      className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Eliminar Sabor"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-4xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
              <div className="space-y-2 group">
                <label className="text-white/50 text-[10px] font-black uppercase tracking-widest group-focus-within:text-phoenix-gold transition-colors">
                  Descripción del Producto
                </label>
                <textarea 
                  rows="4" 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Describe la experiencia, tecnología y sensaciones de este vaporizador..."
                  className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-phoenix-gold/50 focus:bg-white/5 transition-all resize-none shadow-inner leading-relaxed placeholder:text-white/20"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isUploading || isCompressing}
                className={`w-full mt-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl relative overflow-hidden ${
                  isUploading || isCompressing
                    ? 'bg-phoenix-gold/20 text-phoenix-gold/50 cursor-not-allowed border border-phoenix-gold/20'
                    : 'bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold text-black hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] bg-size-[200%_auto] hover:bg-right'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" /> 
                    Sincronizando con Supabase...
                  </>
                ) : productToEdit ? (
                  <>
                    <Save size={22} /> 
                    Actualizar Producto y Stock
                  </>
                ) : (
                  <>
                    <Plus size={22} strokeWidth={3} /> 
                    Publicar en Catálogo Neón
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

AdminPanel.propTypes = {
  onProductAdded: PropTypes.func,
  productToEdit:  PropTypes.object,
  onCancelEdit:   PropTypes.func
};
