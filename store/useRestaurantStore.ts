import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  distance: string;
  certification: string;
  rating: number;
  imageUrl: string;
  description: string;
  openingHours: string;
  phoneNumber: string;
  website: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
};

type RestaurantState = {
  restaurants: Restaurant[];
  favoriteRestaurants: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [
        {
          id: '1',
          name: 'Istanbul Kebab House',
          cuisine: 'Turkish',
          address: '123 Main St, Seoul, South Korea',
          distance: '1.2km',
          certification: 'Muslim Certified',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Authentic Turkish cuisine with halal meat options. Family-owned restaurant serving kebabs, pide, and traditional Turkish dishes.',
          openingHours: 'Mon-Sun: 11:00 AM - 10:00 PM',
          phoneNumber: '+82-2-123-4567',
          website: 'www.istanbulkebab.com',
          latitude: 37.5665,
          longitude: 126.9780,
          isFavorite: false
        },
        {
          id: '2',
          name: 'Malay Corner',
          cuisine: 'Malaysian',
          address: '456 Oak St, Seoul, South Korea',
          distance: '0.8km',
          certification: 'Muslim Certified',
          rating: 4.2,
          imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Authentic Malaysian cuisine with halal certification. Serving nasi lemak, rendang, and other Malaysian favorites.',
          openingHours: 'Mon-Sat: 11:30 AM - 9:00 PM, Sun: Closed',
          phoneNumber: '+82-2-234-5678',
          website: 'www.malaycorner.com',
          latitude: 37.5725,
          longitude: 126.9760,
          isFavorite: false
        },
        {
          id: '3',
          name: 'Halal Guys Seoul',
          cuisine: 'Middle Eastern',
          address: '789 Pine St, Seoul, South Korea',
          distance: '2.1km',
          certification: 'Halal Certified',
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1606502973842-f64bc2785fe5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Famous New York-based halal food chain now in Seoul. Known for their platters, gyros, and signature white sauce.',
          openingHours: 'Daily: 10:00 AM - 11:00 PM',
          phoneNumber: '+82-2-345-6789',
          website: 'www.thehalalguys.com',
          latitude: 37.5635,
          longitude: 126.9800,
          isFavorite: false
        },
        {
          id: '4',
          name: 'Indonesian Delight',
          cuisine: 'Indonesian',
          address: '101 Elm St, Seoul, South Korea',
          distance: '1.7km',
          certification: 'Self Certified',
          rating: 4.0,
          imageUrl: 'https://images.unsplash.com/photo-1562607635-4608ff48a859?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Family-owned Indonesian restaurant serving authentic dishes like nasi goreng, satay, and rendang.',
          openingHours: 'Tue-Sun: 12:00 PM - 9:30 PM, Mon: Closed',
          phoneNumber: '+82-2-456-7890',
          website: 'www.indonesiandelight.com',
          latitude: 37.5645,
          longitude: 126.9750,
          isFavorite: false
        },
        {
          id: '5',
          name: 'Seoul Kebab',
          cuisine: 'Middle Eastern',
          address: '202 Maple St, Seoul, South Korea',
          distance: '1.5km',
          certification: 'Halal Meat',
          rating: 4.3,
          imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Korean-owned kebab shop using certified halal meat. Popular for their fusion kebabs with Korean flavors.',
          openingHours: 'Daily: 11:00 AM - 10:00 PM',
          phoneNumber: '+82-2-567-8901',
          website: 'www.seoulkebab.com',
          latitude: 37.5695,
          longitude: 126.9820,
          isFavorite: false
        },
        {
          id: '6',
          name: 'Halal Korean BBQ',
          cuisine: 'Korean',
          address: '303 Cedar St, Seoul, South Korea',
          distance: '2.7km',
          certification: 'Self Certified',
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Korean BBQ restaurant using halal-certified meat. Authentic Korean experience with halal options.',
          openingHours: 'Mon-Sun: 5:00 PM - 11:00 PM',
          phoneNumber: '+82-2-678-9012',
          website: 'www.halalkoreanbbq.com',
          latitude: 37.5715,
          longitude: 126.9840,
          isFavorite: false
        },
        {
          id: '7',
          name: 'Veggie Haven',
          cuisine: 'Vegetarian',
          address: '404 Birch St, Seoul, South Korea',
          distance: '0.9km',
          certification: 'Veggie',
          rating: 4.4,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Vegetarian restaurant with many vegan options. Perfect for Muslims looking for meat-free dining.',
          openingHours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
          phoneNumber: '+82-2-789-0123',
          website: 'www.veggiehaven.com',
          latitude: 37.5675,
          longitude: 126.9770,
          isFavorite: false
        },
        {
          id: '8',
          name: 'Seafood Paradise',
          cuisine: 'Seafood',
          address: '505 Walnut St, Seoul, South Korea',
          distance: '3.2km',
          certification: 'Seafood',
          rating: 4.1,
          imageUrl: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          description: 'Seafood restaurant with no pork or alcohol on the menu. Fresh fish and shellfish prepared in various styles.',
          openingHours: 'Tue-Sun: 5:00 PM - 10:00 PM, Mon: Closed',
          phoneNumber: '+82-2-890-1234',
          website: 'www.seafoodparadise.com',
          latitude: 37.5655,
          longitude: 126.9830,
          isFavorite: false
        }
      ],
      favoriteRestaurants: [],
      addFavorite: (id) => set((state) => ({
        favoriteRestaurants: [...state.favoriteRestaurants, id],
        restaurants: state.restaurants.map(restaurant => 
          restaurant.id === id ? { ...restaurant, isFavorite: true } : restaurant
        )
      })),
      removeFavorite: (id) => set((state) => ({
        favoriteRestaurants: state.favoriteRestaurants.filter(restaurantId => restaurantId !== id),
        restaurants: state.restaurants.map(restaurant => 
          restaurant.id === id ? { ...restaurant, isFavorite: false } : restaurant
        )
      })),
      getRestaurantById: (id) => {
        return get().restaurants.find(restaurant => restaurant.id === id);
      }
    }),
    {
      name: 'restaurant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);