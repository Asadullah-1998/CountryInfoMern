import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [groupedCountries, setGroupedCountries] = useState({});
  const alphabetRefs = useRef({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const grouped = filteredCountries.reduce((acc, country) => {
      const firstLetter = country.name.common[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(country);
      return acc;
    }, {});
    setGroupedCountries(grouped);
  }, [filteredCountries]);

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, countries]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const scrollToLetter = (letter) => {
    alphabetRefs.current[letter]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="country-list-container">
      <h1>Country List</h1>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="country-list-wrapper">
        <ul className="country-list">
          {Object.entries(groupedCountries).map(([letter, countries]) => (
            <li key={letter} ref={el => alphabetRefs.current[letter] = el}>
              <h2>{letter}</h2>
              <ul>
                {countries.map((country) => (
                  <li key={country.cca3}>
                    <Link to={`/country/${country.name.common}`}>
                      <img
                        src={country.flags.svg}
                        alt={`${country.name.common} flag`}
                        className="country-flag"
                      />
                      <span>{country.name.common}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="alphabet-nav">
          {Object.keys(groupedCountries).map(letter => (
            <button key={letter} onClick={() => scrollToLetter(letter)}>
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CountryList;
