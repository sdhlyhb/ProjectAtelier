import React from 'react';

function Highlighted({ text = '', highlight = '' }) {
  if (highlight.trim().length < 3) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => (regex.test(part) ? (
        <mark key={i}>{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )))}
    </>
  );
};

export default Highlighted;
