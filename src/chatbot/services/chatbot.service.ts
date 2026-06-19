import { Injectable } from '@nestjs/common';

import { CurrencyService } from '../../currency/services/currency.service';

@Injectable()
export class ChatbotService {
  constructor(private readonly currencyService: CurrencyService) {}

  async chat(message: string): Promise<string> {
    const convertedAmount = await this.currencyService.convertCurrency(
      350,
      'EUR',
      'CAD',
    );

    return `350 EUR are ${convertedAmount} CAD. User message: ${message}`;
  }
}
