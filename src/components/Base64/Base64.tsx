// components/BrandDescription.tsx
'use client';

import React from 'react';

interface BrandDescriptionProps {
  description: string;
}

const BrandDescription: React.FC<BrandDescriptionProps> = ({ description }) => {
  const isBase64Image = description && description.startsWith('data:image');
  const isHTML = description && (description.includes('<') || description.includes('>'));

  if (isBase64Image) {
    return (
      <img
        src={description}
        alt="Brand description"
        style={{ width: '100px', height: 'auto' }}
      />
    );
  }

  return (
    <div>
      {isHTML ? (
        <div dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <p>{description}</p>
      )}
    </div>
  );
};

export default BrandDescription;
