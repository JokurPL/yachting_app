import airDB from 'services/airtableClient';

const getUsername = async (userAirtableId) => {
  try {
    const user = await airDB('users').find(userAirtableId);

    return user.fields.fullName;
  } catch (err) {
    return null;
  }
};

export default getUsername;
