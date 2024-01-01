import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ListProps {
  data: {
    id: string;
    modified: Date;
    thumbnail: {
      path: string;
      extension: string;
    };
    name: string;
  }[];
}

export const List: React.FC<ListProps> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <>
      {data ? (
        data.map((item) => {
          return (
            <div className="column" key={item.id} onClick={() => navigate(`/${item.id}`)}>
              <img src={`${item.thumbnail.path}.${item.thumbnail.extension}`} alt="" />
              <div className="charactername"><p>{item.name}</p><p>{item.modified.toString()}</p></div>
            </div>
          );
        })
      ) : (
        ''
      )}
    </>
  );
};