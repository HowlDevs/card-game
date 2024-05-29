import React from 'react';
import { useDrag } from 'react-dnd';
import './Card.css';

function Card({ name, imgSrc }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className="card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={imgSrc} alt={name} />
      <p>{name}</p>
    </div>
  );
}

export default Card;
