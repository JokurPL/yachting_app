import createOffer from 'services/offers/createOffer';
import getRecentOffers from 'services/offers/getRecent';

import { getSession } from 'next-auth/client';

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const offers = await getRecentOffers(4);
      res.status(200).json(offers);

      break;
    }

    case 'POST': {
      try {
        const session = await getSession({ req });

        if (!session) {
          return res.status(401).json({ error: 'not_authorized' });
        }

        const payload = req.body;
        const userId = session.user.id;
        console.log(session);
        const offer = await createOffer(payload, userId);
        console.log(session);
        res.status(200).json({ status: 'created', offer });
      } catch (err) {
        res.status(422).json({ status: 'not_created', err });
      }

      break;
    }

    default:
      res.status(400);
      break;
  }
};
