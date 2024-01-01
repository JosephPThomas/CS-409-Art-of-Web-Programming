import React from "react";
import { Card } from "./Card";
import { List } from "./List";
import axios from "axios";
import { useState, useEffect } from "react";

export const Main = () => {
  const [url, setUrl] = useState("http://gateway.marvel.com/v1/public/characters?ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863");
  const [item, setItem] = useState();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [orderval, setOrderVal] = useState("");
  const [view, setView] = useState("gallery");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(url);
      setItem(res.data.data.results);
    };
    fetch();
  }, [url]);

  const searchMarvel = () => {
    if (!search) {
      if (!order){
        setUrl(`https://gateway.marvel.com:443/v1/public/characters?&ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863`);
      }
      else{
        setUrl(`https://gateway.marvel.com:443/v1/public/characters?orderBy=${orderval}${order}&ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863`);

      }
    }
    else{
      if(!order && !orderval){
        setUrl(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${search}&ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863`);
      }
      else{
        setUrl(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${search}&orderBy=${orderval}${order}&ts=1&apikey=6843c29d5f000a3ac96a0da8466488a2&hash=4bb2a2f7830fb9513c10e9a671989863`);
      }
    }
  };

  const handleNavigationClick = (selectedView: string) => { // Specify the type explicitly
    setView(selectedView);
  };

  return (
    <>
      <nav className="navigation">
        <ul>
          <li>
            <a className="link" onClick={() => handleNavigationClick("list")} href="#list">
              List View
            </a>
          </li>
          <li>
            <a className="link" onClick={() => handleNavigationClick("gallery")} href="#gallery">
              Gallery View
            </a>
          </li>
        </ul>
      </nav>
      <div className="header">
        <div className="search-bar">
          <input
            type="search"
            placeholder='Search Here'
            className='search'
            onChange={e => setSearch(e.target.value)}
            onKeyUp={searchMarvel}
          />
          <select id="sortBy" className='tearch' onChange={e => {
            setOrder(e.target.value);
            searchMarvel();
          }}>
            <option value=""></option>
            <option value="name">Name (A-Z)</option>
            <option value="modified">Year (Low to High)</option>
          </select>

          <select id="sortBy" className='tearch' onChange={e => {
            setOrderVal(e.target.value);
            searchMarvel();
          }}>
            <option value=""></option>
            <option value="-">Ascending</option>
            <option value="">Descending</option>
          </select>

        </div>
      </div>
      <div id="gallery" className="maincontent" style={{ display: view === "gallery" ? "block" : "none" }}>
        <div className="content">
          {
            !item ? <p>Not Found</p> : <Card data={item} />
          }
        </div>
      </div>
      <div id="list" className="maincontent" style={{ display: view === "list" ? "block" : "none" }}>
        <div className="row">
          <div className="column">
            <div className="charactername"><p><b>Character Name</b></p><p><b>Recently Updated</b></p></div>
          </div>
        </div>
        <div className="row">
          {
            !item ? <p>Not Found</p> : <List data={item} />
          }
        </div>
      </div>
    </>
  );
}
