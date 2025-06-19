export interface Review {
  reviewId: number;
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  comment: string;
  recommend?: boolean;
  verified?: boolean;
  helpfulCount?: number;
  userFoundHelpful?: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string; // For display purposes
}

export interface ReviewRequest {
  productId: number;
  rating: number;
  title?: string;
  comment: string;
  recommend?: boolean;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // rating -> count
  };
}

export interface ReviewFilter {
  rating?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  verified?: boolean;
} 