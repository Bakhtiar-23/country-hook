import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then((response) => {
        setCountry({
          found: true,
          data: response.data,
        });
      })
      .catch(() => {
        setCountry({ found: false });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  return { country, loading };
};

const Country = ({ country, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (!country) return null;

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name.common}</h3>
      <div>Capital: {country.data.capital}</div>
      <div>Population: {country.data.population}</div>
      <img
        src={country.data.flags.svg}
        height='100'
        alt={`Flag of ${country.data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const { country, loading } = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>Find</button>
      </form>

      <Country country={country} loading={loading} />
    </div>
  );
};

export default App;
