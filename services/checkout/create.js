import Stripe from 'stripe';
import Joi from 'joi';
import getProduct from 'services/products/get';
import getOfferById from 'services/offers/get';
import airDB from 'services/airtableClient';

const schema = Joi.object({
  id: Joi.required(),
  offerId: Joi.number().greater(0).required(),
  quantity: Joi.number().greater(0).required()
});

export const createCheckout = async (payload) => {
  const orderItem = await schema.validateAsync(payload);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const product = await getProduct(orderItem.id);
  const lineItems = [
    {
      price_data: {
        currency: product.priceCurrency,
        product_data: {
          name: product.name,
          metadata: {
            productId: product.id,
            duration: product.duration
          }
        },
        unit_amount: product.priceCents
      },
      quantity: orderItem.quantity
    }
  ];

  const paymentObjects = {
    payment_method_types: ['card', 'p24'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/offers/${orderItem.offerId}/paymentStatus`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/offers/${orderItem.offerId}/paymentStatus`
  };

  const session = await stripe.checkout.sessions.create(paymentObjects);
  const offer = await getOfferById(orderItem.offerId);

  await airDB('offers').update([
    {
      id: offer.airtableId,
      fields: {
        stripeCheckoutId: session.id,
        stripeCheckoutStatus: session.payment_status,
        highlightDuration: product.duration
      }
    }
  ]);

  return session;
};
