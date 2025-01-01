import tecnologias from '@/app/data/tecnologias.json';
import CardTecnologia from '@/app/components/TecnologiasCard/Card';

export default function Tecnologias() {
  return (
    <div className="tecnologias-container">
      <h1>Tecnologias Aprendidas</h1>
      <div className="cardsTecnologias-container">
        {tecnologias.map((tecnologia, index) => (
          <CardTecnologia key={index} tecnologia={tecnologia} />
        ))}
      </div>
    </div>
  );
}

