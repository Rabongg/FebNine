export interface FoodInfoResult {
  data: {
    data: {
      documents: {
        place_name: string;
        address_name: string;
        place_url: string;
      };
      meta: {
        pageable_count: number;
      };
    };
  };
}
