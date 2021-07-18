import airDB from 'services/airtableClient';

const countView = async (id) => {
  let offer = await airDB('offers')
    .select({
      filterByFormula: `id=${id}`
    })
    .firstPage();

  if (!offer) return null;

  const currentViews = offer[0].fields.views ?? 0;

  offer = await airDB('offers').update([
    {
      id: offer[0].id,
      fields: {
        views: currentViews + 1
      }
    }
  ]);

  return offer[0].fields.views;
};

export default countView;
