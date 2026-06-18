import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { join } from 'path';

import { Product } from '../interfaces/product.interface';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  private products: Product[] = [];

  async onModuleInit(): Promise<void> {
    await this.loadProducts();
  }

  searchProducts(query: string): Product[] {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery
      .split(' ')
      .filter((word) => word.length > 2)
      .filter((word) => !this.isStopWord(word));
    const expandedQueryWords = this.expandQueryWords(queryWords);

    return this.products
      .map((product) => ({
        product,
        score: this.calculateScore(product, expandedQueryWords),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.product);
  }

  private async loadProducts(): Promise<void> {
    const filePath = join(
      process.cwd(),
      'src',
      'products',
      'data',
      'products_list.csv',
    );

    this.products = await new Promise<Product[]>((resolve, reject) => {
      const results: Product[] = [];

      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: Product) => {
          results.push(data);
        })
        .on('end', () => {
          this.logger.log(`Loaded ${results.length} products from CSV`);
          resolve(results);
        })
        .on('error', reject);
    });
  }

  private calculateScore(product: Product, queryWords: string[]): number {
    const searchableText = this.normalizeText(
      `${product.displayTitle} ${product.embeddingText} ${product.productType}`,
    );

    return queryWords.reduce((score, word) => {
      if (searchableText.includes(word)) {
        return score + 1;
      }

      return score;
    }, 0);
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the',
      'and',
      'for',
      'with',
      'from',
      'this',
      'that',
      'you',
      'your',
      'are',
      'was',
      'were',
      'looking',
      'look',
      'want',
      'need',
      'like',
    ]);

    return stopWords.has(word);
  }

  private expandQueryWords(queryWords: string[]): string[] {
    const synonyms: Record<string, string[]> = {
      present: [
        'gift',
        'technology',
        'watch',
        'headphones',
        'speaker',
        'camera',
      ],
      gift: [
        'present',
        'technology',
        'watch',
        'headphones',
        'speaker',
        'camera',
      ],
      dad: ['man', 'technology', 'watch', 'headphones', 'speaker', 'camera'],
      father: ['man', 'technology', 'watch', 'headphones', 'speaker', 'camera'],
      phone: ['iphone', 'smartphone', 'technology', 'cellulares'],
      watch: ['apple', 'gps', 'technology', 'reloj'],
    };

    const expandedWords = new Set(queryWords);

    queryWords.forEach((word) => {
      synonyms[word]?.forEach((synonym) => expandedWords.add(synonym));
    });

    return Array.from(expandedWords);
  }
}
