import { Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    barcode: "8801062628247",
    name: "Shin Ramyun Noodle Soup",
    brand: "Nongshim",
    imageUrl:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "halal",
    certification: "Korea Muslim Federation (KMF)",
    certificationNumber: "KMF-2021-0123",
    certificationExpiry: "2023-12-31",
    category: "Instant Food",
    ingredients:
      "Wheat Flour, Palm Oil, Potato Starch, Salt, Sugar, Vegetable Protein, Chili Powder, Garlic, Onion, Mushroom Extract, Yeast Extract, Spices",
    nutritionalInfo: {
      Calories: "500 kcal",
      Protein: "10g",
      Carbohydrates: "75g",
      Fat: "18g",
      Sodium: "1,790mg",
    },
    manufacturer: "Nongshim Co., Ltd.",
    countryOfOrigin: "South Korea",
    manufacturerContact: "customer@nongshim.com",
    scanDate: "2023-06-15T09:30:00Z",
  },
  {
    id: "2",
    barcode: "8801111908818",
    name: "Bibigo Mandu (Dumplings)",
    brand: "CJ CheilJedang",
    imageUrl:
      "https://images.unsplash.com/photo-1625938145744-e380515399b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "halal",
    certification: "Korea Halal Authority (KHA)",
    certificationNumber: "KHA-2022-0456",
    certificationExpiry: "2024-05-30",
    category: "Frozen Food",
    ingredients:
      "Wheat Flour, Cabbage, Onion, Tofu, Vegetable Oil, Salt, Garlic, Ginger, Soy Sauce, Sesame Oil, Yeast Extract, Spices",
    nutritionalInfo: {
      Calories: "250 kcal",
      Protein: "8g",
      Carbohydrates: "35g",
      Fat: "9g",
      Sodium: "580mg",
    },
    manufacturer: "CJ CheilJedang Corp.",
    countryOfOrigin: "South Korea",
    manufacturerContact: "info@cj.net",
    scanDate: "2023-06-18T14:45:00Z",
  },
  {
    id: "3",
    barcode: "8801043036412",
    name: "Choco Pie",
    brand: "Orion",
    imageUrl:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "doubtful",
    certification: "Under Review",
    category: "Confectionery",
    ingredients:
      "Wheat Flour, Sugar, Vegetable Oil, Cocoa Powder, Corn Syrup, Baking Powder, Salt, Artificial Flavors",
    nutritionalInfo: {
      Calories: "150 kcal",
      Protein: "2g",
      Carbohydrates: "25g",
      Fat: "5g",
      Sodium: "120mg",
    },
    manufacturer: "Orion Corporation",
    countryOfOrigin: "South Korea",
    scanDate: "2023-06-20T11:15:00Z",
  },
  {
    id: "4",
    barcode: "8801123456789",
    name: "Soju",
    brand: "Jinro",
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "haram",
    category: "Alcoholic Beverage",
    ingredients: "Water, Alcohol, Sugar, Flavoring",
    manufacturer: "HiteJinro Co., Ltd.",
    countryOfOrigin: "South Korea",
    scanDate: "2023-06-22T18:30:00Z",
  },
  {
    id: "5",
    barcode: "8801075110012",
    name: "Honey Butter Chip",
    brand: "Haitai",
    imageUrl:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "halal",
    certification: "Korea Halal Authority (KHA)",
    certificationNumber: "KHA-2021-0789",
    certificationExpiry: "2023-10-15",
    category: "Snacks",
    ingredients:
      "Potato, Vegetable Oil, Sugar, Honey Powder, Salt, Butter Flavor (Natural), Yeast Extract",
    nutritionalInfo: {
      Calories: "180 kcal",
      Protein: "2g",
      Carbohydrates: "22g",
      Fat: "9g",
      Sodium: "210mg",
    },
    manufacturer: "Haitai Confectionery & Foods Co., Ltd.",
    countryOfOrigin: "South Korea",
    scanDate: "2023-06-25T10:00:00Z",
  },
  {
    id: "6",
    barcode: "8801111222333",
    name: "Banana Milk",
    brand: "Binggrae",
    imageUrl:
      "https://images.unsplash.com/photo-1628565376886-ab9817c8cbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "halal",
    certification: "Korea Muslim Federation (KMF)",
    certificationNumber: "KMF-2022-0321",
    certificationExpiry: "2024-03-20",
    category: "Dairy & Beverages",
    ingredients: "Milk, Sugar, Banana Flavor, Stabilizer, Vitamin D",
    nutritionalInfo: {
      Calories: "120 kcal",
      Protein: "3g",
      Carbohydrates: "20g",
      Fat: "2.5g",
      Calcium: "120mg",
    },
    manufacturer: "Binggrae Co., Ltd.",
    countryOfOrigin: "South Korea",
    scanDate: "2023-06-28T15:20:00Z",
  },
  {
    id: "7",
    barcode: "8801234567890",
    name: "Kimchi",
    brand: "Jongga",
    imageUrl:
      "https://images.unsplash.com/photo-1583224964978-2e827ef39d08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "doubtful",
    category: "Fermented Food",
    ingredients:
      "Cabbage, Radish, Red Pepper Powder, Garlic, Ginger, Salt, Fish Sauce, Salted Shrimp",
    nutritionalInfo: {
      Calories: "30 kcal",
      Protein: "2g",
      Carbohydrates: "5g",
      Fat: "0.5g",
      Sodium: "670mg",
    },
    manufacturer: "Daesang Corporation",
    countryOfOrigin: "South Korea",
    scanDate: "2023-07-01T09:45:00Z",
  },
  {
    id: "8",
    barcode: "8801444555666",
    name: "Samyang Hot Chicken Flavor Ramen",
    brand: "Samyang",
    imageUrl:
      "https://images.unsplash.com/photo-1627661055476-e795bd005732?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    halalStatus: "halal",
    certification: "Korea Halal Authority (KHA)",
    certificationNumber: "KHA-2021-0567",
    certificationExpiry: "2023-11-30",
    category: "Instant Food",
    ingredients:
      "Wheat Flour, Palm Oil, Starch, Salt, Sugar, Chili Powder, Garlic, Onion, Spices, Vegetable Extract",
    nutritionalInfo: {
      Calories: "530 kcal",
      Protein: "11g",
      Carbohydrates: "72g",
      Fat: "20g",
      Sodium: "1,920mg",
    },
    manufacturer: "Samyang Foods Co., Ltd.",
    countryOfOrigin: "South Korea",
    scanDate: "2023-07-05T12:30:00Z",
  },
];

export const mockResults = [
  {
    status: "halal",
    product: {
      id: "p" + Date.now(),
      name: "Organic Green Tea",
      brand: "Nature's Best",
      imageUrl:
        "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      halalStatus: "halal",
    },
  },
  {
    status: "haram",
    product: {
      id: "p" + Date.now(),
      name: "Chocolate Cookies",
      brand: "Sweet Delights",
      imageUrl:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      halalStatus: "haram",
    },
  },
  {
    status: "doubtful",
    product: {
      id: "p" + Date.now(),
      name: "Fruit Juice",
      brand: "Fresh Squeeze",
      imageUrl:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      halalStatus: "doubtful",
    },
  },
];
