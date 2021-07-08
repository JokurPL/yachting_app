import createUser from 'services/users/create';

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const payload = req.body;
        const user = await createUser(payload);

        res.status(200).json({ status: 'created', user });
      } catch (err) {
        res.status(422).json({ status: 'not_created', err: err.message });
      }
      break;
    }

    default:
      res.status(400);
      break;
  }
};
