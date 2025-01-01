import React from 'react';
import Image from 'next/image';
import { Produto } from '@/app/models/interfaces';

interface CardProps {
  produto: Produto;
  onAddToCart: (produto: Produto) => void;
}

export default function Card({ produto, onAddToCart }: CardProps) {


  return (
    <div className="cardProduto">
  
      <Image
        src={produto.image}
        alt={produto.title}
        width={200}
        height={200}
        className="card-image"
      />

      
      <h2 className="cardProduto-title">{produto.title}</h2>

    
      <p className="cardProduto-category">{produto.category}</p>
      <p className="cardProduto-description">{produto.description}</p>

    
      <p className="cardProduto-price">€{produto.price?.toFixed(2)}</p>

     
      <div className="cardProduto-rating">
        <span className="cardProduto-star">⭐</span>
        {produto.rating.rate} ({produto.rating.count} avaliações)
      </div>

      <button
        onClick={() => onAddToCart(produto)} 
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 transition-colors"
      >
        Adicionar ao Carrinho
      </button>

    </div>
  );
}

