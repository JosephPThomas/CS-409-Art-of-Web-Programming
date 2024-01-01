import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { parseISO, format } from 'date-fns';

interface MarvelItem {
  name: string;
  description: string;
  modified: Date;
  thumbnail: {
    path: string;
    extension: string;
  };
}

export const Marvel = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MarvelItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863`
        );
        setItem(response.data.data.results[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {item ? (
        <div className="box-content">
          <button className="carousel-button prev" data-carousel-button="prev">❮</button>
          <div className="right-box">
            <img src={`${item.thumbnail.path}.${item.thumbnail.extension}`} alt="" />
          </div>
          <div className="left-box">
            <h1>{item.name}</h1>
            <h4>{item.description}</h4>
            <h5>
                Recent Date Modified: {format(parseISO(item.modified.toString()), 'MM-dd-yyyy')}
            </h5>
          </div>
          <button className="carousel-button next" data-carousel-button="next">❯</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
