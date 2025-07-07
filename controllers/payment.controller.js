import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createCheckoutSession = async (req, res) => {
  const { items, orderId } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-fail`,
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export { createCheckoutSession }
