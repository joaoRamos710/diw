export interface ProdutosResponse {
    produtos: Produto[]
}
export interface Produto {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export interface PostResponse {
    message: string;
    address?: string;
    reference?: string;
    totalCost?: number;
    error?: string;
    
  }
  
