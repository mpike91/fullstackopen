import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState(null);

  const getCountries = () => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((res) => {
        setCountries(res);
      })
      .catch((e) => console.log(e));
  };
  useEffect(getCountries, []);

  // If countries is still null, return loading message.
  if (countries === null) return <div>Loading...</div>;

  return (
    <div>
      <span>Find Countries: </span>
      <input
        onChange={(e) => setCountrySearch(e.target.value)}
        value={countrySearch}
      />
      <Countries
        countries={countries}
        countrySearch={countrySearch}
        setCountrySearch={setCountrySearch}
      />
    </div>
  );
}

const Countries = ({ countries, countrySearch, setCountrySearch }) => {
  // If nothing has been searched, return.
  if (countrySearch === "") return;

  // Filter the countries based on the search.
  const filteredCountries = countries.data.filter((c) =>
    c.name.common.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // If more than 10, return message.
  if (filteredCountries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  // If more than 1, return list of countries by name.
  if (filteredCountries.length > 1)
    return filteredCountries.map((c) => (
      <div key={c.name.common}>
        {c.name.common}{" "}
        <button onClick={() => setCountrySearch(c.name.common)}>show</button>
      </div>
    ));
  // If zero, return message.
  if (filteredCountries.length === 0)
    return <div>No countries match that filter.</div>;

  console.log(filteredCountries);
  // In this case, only one country is filtered. Render Country.
  return <Country country={filteredCountries[0]} />;
};

const Country = ({ country }) => {
  // debugger;
  console.log(country);

  // useEffect(
  //   () =>
  //     axios
  //       .get(`http://api.weatherapi.com/v1/current.json`, {
  //         params: {
  //           key: process.env.REACT_APP_WEATHER_API_KEY,
  //           q: `${latlng[0]},${latlng[1]}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         setLatlng(res);
  //       })
  //       .catch((e) => console.log(e)),
  //   []
  // );

  // console.log(weather);

  try {
    const name = country.name.common;
    const capital = country.capital[0];
    const area = country.area;
    const languages = Object.values(country.languages);
    const { png, alt } = country.flags;

    return (
      <>
        <h1>{name}</h1>
        <div>Capital: {capital}</div>
        <div>Area: {area}</div>
        <h2>Languages:</h2>
        <ul>
          {languages.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <img src={png} alt={alt} width="200"></img>
        <h2>Weather in {country.name.common}</h2>
        {/* <ul>
        <img
          src={weather.data.current.condition.icon}
          width="100"
          alt={weather.data.current.condition.text}
        />
        <li>{weather.data.current.condition.text}</li>
        <li>Temp: {weather.data.current.temp_f} F</li>
        <li>Wind: {weather.data.current.wind_mph} mph</li>
      </ul> */}
      </>
    );
  } catch (e) {
    return <div>Something went wrong...</div>;
  }
};

export default App;
