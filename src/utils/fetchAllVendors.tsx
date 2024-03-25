import qs from "qs";

// gets the list of all seasons
const fetchAllVendors = async () => {
  const stringifiedQuery = qs.stringify(
    {
      limit: 9999,
    },
    { addQueryPrefix: true },
  );

  const response = await fetch(`/api/vendors${stringifiedQuery}`);
  const vendors = await response.json();

  return vendors;
};

export default fetchAllVendors;
