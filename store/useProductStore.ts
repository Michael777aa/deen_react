import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types';
import { mockProducts } from '@/mocks/productData';

interface ProductState {
  scannedProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  scanProduct: (barcode: string) => void;
  getProductById: (id: string) => Product | undefined;
  clearCurrentProduct: () => void;
  clearHistory: () => void;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  getRecommendedProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      scannedProducts: [],
      currentProduct: null,
      isLoading: false,
      error: null,
      
      scanProduct: async (barcode: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call to your backend
          // For demo purposes, we'll simulate a network request with a timeout
          // and use mock data
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Find product in mock data
          const product = mockProducts.find(p => p.barcode === barcode);
          
          if (product) {
            // Add to scanned products if not already there
            const existingProducts = get().scannedProducts;
            const exists = existingProducts.some(p => p.id === product.id);
            
            if (!exists) {
              set({ 
                scannedProducts: [product, ...existingProducts],
                currentProduct: product,
                isLoading: false
              });
            } else {
              set({ 
                currentProduct: product,
                isLoading: false
              });
            }
          } else {
            // If product not found in our database
            const unknownProduct: Product = {
              id: `unknown-${Date.now()}`,
              barcode: barcode,
              name: "Unknown Product",
              brand: "Unknown Brand",
              halalStatus: "doubtful",
              category: "Unknown",
              scanDate: new Date().toISOString()
            };
            
            set({ 
              scannedProducts: [unknownProduct, ...get().scannedProducts],
              currentProduct: unknownProduct,
              isLoading: false
            });
          }
        } catch (error) {
          set({ 
            error: "Failed to scan product. Please try again.",
            isLoading: false
          });
        }
      },
      
      getProductById: (id: string) => {
        // First check in scanned products
        const { scannedProducts } = get();
        const scannedProduct = scannedProducts.find(product => product.id === id);
        
        // If not found in scanned products, check in mock products
        if (!scannedProduct) {
          return mockProducts.find(product => product.id === id);
        }
        
        return scannedProduct;
      },
      
      clearCurrentProduct: () => {
        set({ currentProduct: null });
      },
      
      clearHistory: () => {
        set({ scannedProducts: [] });
      },
      
      getProductsByCategory: (category: string) => {
        // Filter products by category
        return mockProducts.filter(product => 
          product.category.toLowerCase().includes(category.toLowerCase())
        );
      },
      
      searchProducts: (query: string) => {
        if (!query.trim()) return [];
        
        const searchQuery = query.toLowerCase();
        return mockProducts.filter(product => 
          product.name.toLowerCase().includes(searchQuery) || 
          product.brand.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
        );
      },
      
      getRecommendedProducts: () => {
        // In a real app, this would be based on user preferences, popular items, etc.
        // For demo, we'll just return halal products
        return mockProducts.filter(product => product.halalStatus === 'halal');
      }
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);