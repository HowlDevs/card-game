import React from 'react';
import { useDrop } from 'react-dnd';
import './Board.css';

function Board({ index, handleDrop, content }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item, monitor) => handleDrop(item, monitor, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const classNames = ['cell'];
  if (isOver) {
    classNames.push('over');
  }
  if (content?.isOriginal) {
    classNames.push('original');
  } else if (content?.isAffected) {
    classNames.push('affected');
  }

  return (
    <div ref={drop} className={classNames.join(' ')}>
      {content && (
        <>
          <img src={content.src} alt={content.name} width="70%" />
          <p>{content.name}</p>
          <p>Temple: {content.temple}</p>
          <p>Rank: {content.rank}</p>
          <p>Jugador: {content.player}</p>
        </>
      )}
    </div>
  );
}

export default Board;
