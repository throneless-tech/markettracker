import qs from "qs";

// gets the list of all seasons
const fetchAllSeasons = async () => {
  const stringifiedQuery = qs.stringify(
    {
      limit: 9999,
    },
    { addQueryPrefix: true },
  );

  const response = await fetch(`/api/seasons${stringifiedQuery}`);
  const theseSeasons = await response.json();

  return theseSeasons;
};

export default fetchAllSeasons;
