import airDB from 'services/airtableClient';

const getActiveUsersOffers = async (userAirtableId) => {
  const user = await airDB('users').find(userAirtableId);
  const offers = await airDB('offers')
    .select({
      filterByFormula: `users=${user.fields.id}`
    })
    .firstPage();

  return offers.map((offer) => offer.fields);
};

export default getActiveUsersOffers;
