import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface OpenExchangeRatesResponse {
  rates: Record<string, number>;
}
@Injectable()
export class CurrencyService {
  constructor(private readonly configService: ConfigService) {}

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const appId = this.configService.get<string>('OPEN_EXCHANGE_APP_ID');

    if (!appId) {
      throw new InternalServerErrorException(
        'Open Exchange Rates App ID is not configured',
      );
    }

    const response = await axios.get<OpenExchangeRatesResponse>(
      'https://openexchangerates.org/api/latest.json',
      {
        params: {
          app_id: appId,
        },
      },
    );

    const rates = response.data.rates;

    const fromRate = rates[fromCurrency.toUpperCase()];
    const toRate = rates[toCurrency.toUpperCase()];

    if (!fromRate || !toRate) {
      throw new InternalServerErrorException(
        `Unsupported currency conversion from ${fromCurrency} to ${toCurrency}`,
      );
    }

    const amountInUsd = amount / fromRate;
    const convertedAmount = amountInUsd * toRate;

    return Number(convertedAmount.toFixed(2));
  }
}
