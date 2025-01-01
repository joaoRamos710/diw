import React from 'react';
import Image from 'next/image';

interface Tecnologia {
  title: string;
  image: string;
  description: string;
  rating: number;
}

interface CardTecnologiaProps {
  tecnologia: Tecnologia;
}

export default function CardTecnologia({ tecnologia }: CardTecnologiaProps) {
  return (
    <div className="cardTecnologias">
      {/* Imagem da tecnologia */}
      <Image
        src={tecnologia.image}
        alt={tecnologia.title}
        width={200}
        height={200}
        className="card-image"
      />

      /* Título */
      <h2 className="cardTecnologias-title">{tecnologia.title}</h2>

      {/* Descrição */}
      <p className="cardTecnologias-description">{tecnologia.description}</p>

      {/* Avaliação */}
      <div className="cardTecnologias-rating">
        <span className="cardTecnologias-star">⭐</span>
        {tecnologia.rating} / 5
      </div>
    </div>
  );
}
