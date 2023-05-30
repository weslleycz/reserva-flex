import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_PRIVATE_KAY, {
      apiVersion: '2022-11-15',
    });
  }

  async criarLinkDePagamento(
    descricao: string,
    valor: number,
  ): Promise<string> {
    const product = await this.stripe.products.create({
      name: descricao,
      type: 'service',
    });

    const price = await this.stripe.prices.create({
      unit_amount: valor * 100,
      currency: 'brl',
      product: product.id,
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://seusite.com/sucesso',
      cancel_url: 'https://seusite.com/cancelamento',
    });

    return session.url;
  }
}
