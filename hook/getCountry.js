import { useState, useEffect } from "react";
import axios from "axios";

const getCountry = (endpoint, { lat, lng, ...otherParams }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    url: `http://api.geonames.org/${endpoint}`,
    headers: {},
    params: {
      lat,
      lng,
      ...otherParams,
    },
  };

  console.log(options.params);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.request(options);
      console.log("fd", response);
      setData(response.data.data);
    } catch (error) {
      setError(error);
      console.log("error", error);
      alert('There is an error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Ensure useEffect re-runs when lat, lng, or otherParams change

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default getCountry;
