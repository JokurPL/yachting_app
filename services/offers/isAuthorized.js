const isAuthorized = (offer, session) => {
  if (!session) return false;
  if (session.user.role === 'admin') return true;
  console.log(offer);
  if (offer.users[0] === session.user.id) return true;

  return false;
};

export default isAuthorized;
