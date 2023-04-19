export interface LINE {
  name: string;
  orders: ORDER[];
}

export interface LOCAL {
  id: number | null;
  sector_name: string;
  sector_locals: LINE[];
}

export interface ORDER {
  order: string;
  count: number;
}
