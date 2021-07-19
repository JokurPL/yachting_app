import airDB from 'services/airtableClient';

const getFavouriteUserOffers = async (airtableId) => {
  const offers = await airDB('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }]
    })
    .all();

  const mapOffers = offers.map((offer) => offer.fields);

  let favOffers = [];

  mapOffers.forEach((offer) => {
    if (offer.favUser !== undefined && offer.favUser.includes(airtableId)) {
      favOffers.push(offer);
    }
  });

  return favOffers;
};

export const changeFavouriteOffer = async (offerId, userAirtableId) => {
  let offer = await airDB('offers')
    .select({
      filterByFormula: `id=${offerId}`
    })
    .firstPage();

  const offerAirtableId = offer[0].id;

  if (offer[0].fields.favUser !== undefined && offer[0].fields.favUser.includes(userAirtableId)) {
    offer[0].fields.favUser = offer[0].fields.favUser.filter((user) => user !== userAirtableId);

    await airDB('offers').update([
      {
        id: offerAirtableId,
        fields: {
          favUser: offer[0].fields.favUser
        }
      }
    ]);

    return {
      favourite: false
    };
  } else {
    if (offer[0].fields.favUser !== undefined) {
      offer[0].fields.favUser.push(userAirtableId);
    } else {
      offer[0].fields.favUser = [userAirtableId];
    }

    await airDB('offers').update([
      {
        id: offerAirtableId,
        fields: {
          favUser: offer[0].fields.favUser
        }
      }
    ]);

    return {
      favourite: true
    };
  }
};

export default getFavouriteUserOffers;
