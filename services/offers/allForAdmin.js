export default async (offset) => {
  let apiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/offers?pageSize=10&sort%5B0%5D%5Bfield%5D=id&sort%5B0%5D%5Bdirection%5D=desc&view=Grid%20view`;
  if (offset) {
    apiUrl += `&offset=${offset}`;
  }

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
    }
  });

  const records = await response.json();

  return records;
};
