import airDB from 'services/airtableClient';

const isFavouriteAsync = async (offerToCheck, userAirtableId) => {
  let offer = await airDB('offers').find(offerToCheck.airtableId);
  offer = offer.fields;

  if (offer.favUser !== undefined && offer.favUser.includes(userAirtableId)) {
    return true;
  }

  return false;
};

export default isFavouriteAsync;
