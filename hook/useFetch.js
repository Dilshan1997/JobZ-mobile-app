import { useState, useEffect } from "react";
import  axios from "axios";

// import { RAPID_API_KEY } from '@env';

// const rapidApiKey = RAPID_API_KEY;

const useFetch=(endpoint, query)=>{
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const options = {
      method: 'GET',
      url: `https://jsearch.p.rapidapi.com/${endpoint}`,
      headers: {
        'X-RapidAPI-Key': '69cc20368dmsh8f68a3e8b817f03p119946jsnce2f011c2412',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      params: {...query},

    };
    
const fetchData = async ()=>{
    setIsLoading(true);

    try {
      // console.log(options)
        const response = await axios.request(options);
        console.log("fd",response);
        setData(response.data.data);
        setIsLoading(false);

    } catch (error){
        setError(error);
        console.log("error",error)
        alert('There is an error')

    }finally {
        setIsLoading(false);
    }

}

useEffect(() => {
  fetchData();
}, []);

const refetch = ()=>{
    setIsLoading(true);
    fetchData();
}

return {data, isLoading, error, refetch};
}

export default useFetch;