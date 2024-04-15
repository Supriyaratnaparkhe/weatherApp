import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("");
  const [filterByTimezone, setFilterByTimezone] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100"
        );
        setCities(response.data.results);
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = cities.filter(
      (city) =>
        city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterByTimezone) {
      filtered = cities.filter(
        (city) => city.timezone.split("/")[0] === filterByTimezone
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "cou_name_en") {
        return a.cou_name_en.localeCompare(b.cou_name_en);
      } else if (sortBy === "timezone") {
        return a.timezone.localeCompare(b.timezone);
      } else {
        return a[sortBy] - b[sortBy];
      }
    });

    setFilteredCities(filtered);
  }, [cities, searchTerm, sortBy, filterByTimezone]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSuggestion(true);
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSelectedSuggestion(false);
  };

  const renderSuggestions = () => {
    if (!searchTerm) return null;

    const suggestions = filteredCities
      .filter((city) =>
        city.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      .map((city) => city.name);

    return (
      <div className="suggestiondiv">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="border border-gray-300 px-4 py-2"
          >
            {suggestion}
          </div>
        ))}
      </div>
    );
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByTimezone(event.target.value);
  };

  return (
    <div className="container flex flex-col justify-center mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Cities Table</h1>

      <div className="flex flex-col justify-center flex-wrap gap-4 mb-4">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search city..."
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {selectedSuggestion ? renderSuggestions() : ""}
        <div className="w-full flex gap-10">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label className="block mb-1">Sort by:</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">None</option>
              <option value="name">City Name</option>
              <option value="cou_name_en">Country Name</option>
              <option value="timezone">Timezone</option>
            </select>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3">
            <label className="block mb-1">Filter by timezone:</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filterByTimezone}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Africa">Africa</option>
              <option value="America">America</option>
              <option value="UTC">UTC</option>
              <option value="US">US</option>
            </select>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">City Name</th>
            <th className="border border-gray-300 px-4 py-2">Country</th>
            <th className="border border-gray-300 px-4 py-2">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city) => (
            <tr key={city.geoname_id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  to={`/weather/${city.name}/${city.cou_name_en}`}
                  className="text-600 hover:underline"
                >
                  {city.name}
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {city.cou_name_en}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {city.timezone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitiesTable;
