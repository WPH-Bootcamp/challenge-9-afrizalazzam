export type PriceRange = {
  min: number;
  max: number;
};

export type RestaurantListItem = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category?: string | null;
  reviewCount: number;
  menuCount: number;
  priceRange?: PriceRange;
  distance?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RestaurantListResponse = {
  restaurants: RestaurantListItem[];
  pagination: Pagination;
};

export type GetRestaurantsParams = {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
};

export type SearchRestaurantsParams = {
  q: string;
  page?: number;
  limit?: number;
};

export type GetNearbyParams = {
  range?: number;
  limit?: number;
};

export type NearbyResponse = {
  restaurants: RestaurantListItem[];
};

export type GetBestSellerParams = {
  page?: number;
  limit?: number;
};

export type MenuItem = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type Review = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating?: number;
  place: string;
  coordinates?: { lat: number; long: number };
  distance?: number;
  logo: string;
  images: string[];
  category?: string | null;
  totalMenus: number;
  totalReviews: number;
  menus: MenuItem[];
  reviews: Review[];
};

export type GetRestaurantDetailParams = {
  limitMenu?: number;
  limitReview?: number;
};
