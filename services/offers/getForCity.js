import airDB from 'services/airtableClient';

const getForCity = async (city) => {
  const offers = await airDB('offers')
    .select({
      filterByFormula: `AND(location="${city}", status="active")`
    })
    .firstPage();

  return offers.map((offer) => offer.fields);
};

export default getForCity;
