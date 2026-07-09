export type CreateReviewPayload = {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment?: string;
  menuIds?: number[];
};

export type UpdateReviewPayload = {
  star?: number;
  comment?: string;
};

export type MyReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  transactionId: string;
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
};

export type MyReviewsResponse = {
  reviews: MyReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

