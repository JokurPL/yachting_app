const isFavouriteSync = (offer, userAirtableId) => {
  if (offer.favUser !== undefined && offer.favUser.includes(userAirtableId)) {
    return true;
  }

  return false;
};

export default isFavouriteSync;
