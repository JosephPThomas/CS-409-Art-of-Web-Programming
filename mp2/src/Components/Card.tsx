import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  data: {
    id: string;
    thumbnail: {
      path: string;
      extension: string;
    };
    name: string;
  }[];
}

export const Card: React.FC<CardProps> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <>
      {data ? (
        data.map((item) => {
          return (
            <div className="card" key={item.id} onClick={() => navigate(`/${item.id}`)}>
              <img src={`${item.thumbnail.path}.${item.thumbnail.extension}`} alt="" />
            </div>
          );
        })
      ) : (
        ''
      )}
    </>
  );
};


