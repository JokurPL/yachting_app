const isFavourite = (offer, userAirtableId) => {
  if (offer.favUser !== undefined && offer.favUser.includes(userAirtableId)) {
    return true;
  }

  return false;
};

export const isFavouriteAsync = async (offer, userAirtableId) => {
  if (offer.favUser !== undefined && offer.favUser.includes(userAirtableId)) {
    return true;
  }

  return false;
};

export default isFavourite;
