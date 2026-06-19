import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { CurrencyService } from '../../currency/services/currency.service';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
    private readonly currencyService: CurrencyService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'OpenAI API key is not configured',
      );
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  /**
   * Handles OpenAI Function Calling and
   * orchestrates tool execution to generate
   * the final chatbot response.
   */
  async generateResponse(message: string): Promise<string> {
    const firstCompletion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful ecommerce assistant. Use the available tools when the user asks about products or currency conversion. Always answer in English.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'searchProducts',
            description:
              'Searches the product catalog and returns two relevant products based on the user enquiry.',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description:
                    'Search query extracted from the user enquiry, for example phone, watch, gift for dad.',
                },
              },
              required: ['query'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'convertCurrencies',
            description:
              'Converts an amount from one currency to another using latest exchange rates.',
            parameters: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                  description: 'Amount to convert.',
                },
                fromCurrency: {
                  type: 'string',
                  description: 'Source currency code, for example USD or EUR.',
                },
                toCurrency: {
                  type: 'string',
                  description: 'Target currency code, for example EUR or CAD.',
                },
              },
              required: ['amount', 'fromCurrency', 'toCurrency'],
            },
          },
        },
      ],
    });

    const assistantMessage = firstCompletion.choices[0]?.message;

    if (!assistantMessage) {
      throw new InternalServerErrorException(
        'OpenAI returned an empty message',
      );
    }

    const toolCalls = assistantMessage.tool_calls;

    if (!toolCalls || toolCalls.length === 0) {
      return assistantMessage.content ?? 'I could not generate a response.';
    }

    const toolMessages = await Promise.all(
      toolCalls.map(async (toolCall) => {
        if (toolCall.type !== 'function') {
          throw new InternalServerErrorException(
            `Unsupported tool call type: ${toolCall.type}`,
          );
        }

        const toolResult = await this.executeToolCall(
          toolCall.function.name,
          toolCall.function.arguments,
        );

        return {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        };
      }),
    );

    const finalCompletion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful ecommerce assistant. Use the tool results to answer clearly and concisely in English. Do not include image URLs. Do not include raw JSON. If products are available, include only product name, price, currency, and product URL. Use a clean numbered list. If currency conversion is involved, mention that the amount is approximate and based on the latest exchange rates.',
        },
        {
          role: 'user',
          content: message,
        },
        assistantMessage,
        ...toolMessages,
      ],
    });

    return (
      finalCompletion.choices[0]?.message?.content ??
      'I could not generate a final response.'
    );
  }

  /**
   * Executes the tool requested by OpenAI
   * and returns the result back to the model.
   */
  private async executeToolCall(
    functionName: string,
    rawArguments: string,
  ): Promise<unknown> {
    const args = JSON.parse(rawArguments) as Record<string, unknown>;

    if (functionName === 'searchProducts') {
      return this.productsService
        .searchProducts(String(args.query))
        .map((product) => ({
          name: product.displayTitle,
          price: product.price,
          category: product.productType,
        }));
    }

    if (functionName === 'convertCurrencies') {
      return this.currencyService.convertCurrency(
        Number(args.amount),
        String(args.fromCurrency),
        String(args.toCurrency),
      );
    }

    throw new InternalServerErrorException(`Unknown function: ${functionName}`);
  }
}
