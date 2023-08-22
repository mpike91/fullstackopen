import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState(null);

  // Get initial dataset of Countries from API
  const getCountries = async () => {
    const countriesObj = await axios.get(
      `https://studies.cs.helsinki.fi/restcountries/api/all`
    );
    setCountries(countriesObj);
  };

  useEffect(() => getCountries, []);

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
    return <div>No countries match that filter</div>;

  // In this case, only one country is filtered. Render Country.
  return <Country country={filteredCountries[0]} />;
};

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  // Get weather using country's latlng data
  const getWeather = async () => {
    const weatherObj = await axios.get(
      `http://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: process.env.REACT_APP_WEATHER_API_KEY,
          q: `${country.latlng[0]},${country.latlng[1]}`,
        },
      }
    );
    console.log("Weather res is: ", weatherObj);
    setWeather(weatherObj);
  };

  useEffect(() => getWeather, []);

  // Get country data to be displayed
  const name = country.name.common;
  const capital = country?.capital ?? ["N/A"];
  const area = country.area;
  const languages = Object.values(country?.languages);
  const png = country.flags.png;
  const alt = country.flags.alt;

  // Get weather data to be displayed
  // const weatherImg = weather?.data.current.condition.icon;
  // const weatherCondition = weather?.data.current.condition.text;
  // const weatherTemp = weather?.data.current.condition.temp_f;
  // const weatherMph = weather?.data.current.condition.wind_mph;

  console.log(country);
  console.log(weather);
  return (
    <div>
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
      {!weather ? null : (
        <>
          <h2>Weather in {name}</h2>
          <ul>
            <img
              src={weather.data.current.condition.icon}
              width="100"
              alt={weather.data.current.condition.text}
            />
            <li>{weather.data.current.condition.text}</li>
            <li>Temp: {weather.data.current.temp_f} F</li>
            <li>Wind: {weather.data.current.wind_mph} mph</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
