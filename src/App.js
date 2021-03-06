import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select, Card } from "@material-ui/core";
import InfoBox from "./InfoBox";
// import { sortData, prettyPrintStat } from "./util";
import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            flag: country.flag,
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };

    console.log(countryInfo);


    getCountriesData();
  }, []);

  const onChangeCountries = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        setCountryInfo(data);
      });
  };
  console.log(country.flag);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER </h1>
        
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onChangeCountries}
              value={country}
              key={country}
            >
              
              <MenuItem value="worldwide">
              <div className="app__flag">
              <img src alt="Logo" />
              </div>
                Worldwide</MenuItem>
              {countries.map((country) => (
                
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
        <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={(countryInfo.todayCases)}
            total={(countryInfo.cases)}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={(countryInfo.todayRecovered)}
            total={(countryInfo.recovered)}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={(countryInfo.todayDeaths)}
            total={(countryInfo.deaths)}
          />
        </div>
         {/* <Map
        /> */}
      </div>
      <Card className="app__right"></Card>
    </div>
  );
}

export default App;
