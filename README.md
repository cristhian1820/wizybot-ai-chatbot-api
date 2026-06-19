# Wizybot AI Chatbot API

Technical assessment built with NestJS, OpenAI Function Calling, product search, and currency conversion tools.

## Features

- OpenAI Chat Completion API integration
- Function Calling support
- Product catalog search from CSV
- Currency conversion using Open Exchange Rates
- Swagger API documentation
- Environment-based configuration

---

## Architecture

```text
Client
  |
  v
POST /chat
  |
  v
ChatbotController
  |
  v
ChatbotService
  |
  v
OpenAiService (Function Calling)
  |
  +--> searchProducts()
  |        |
  |        +--> ProductsService
  |
  +--> convertCurrencies()
           |
           +--> CurrencyService
```
## Project Structure

src/
├── chatbot/
│   ├── controllers/
│   ├── dto/
│   ├── services/
│   └── chatbot.module.ts
│
├── openai/
│   ├── services/
│   └── openai.module.ts
│
├── products/
│   ├── data/
│   │   └── products_list.csv
│   ├── interfaces/
│   ├── services/
│   └── products.module.ts
│
├── currency/
│   ├── services/
│   └── currency.module.ts
│
└── main.ts

## AI Tools

The chatbot uses OpenAI Function Calling to dynamically invoke:

- searchProducts()
- convertCurrencies()

based on the user's natural language request.

## Requirements

- Node.js 20+
- npm 10+
- OpenAI API Key
- Open Exchange Rates App ID

## Installation

Clone repository:

```bash
git clone https://github.com/cristhian1820/wizybot-ai-chatbot-api.git
cd wizybot-ai-chatbot-api
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
OPEN_EXCHANGE_APP_ID=your_open_exchange_rates_app_id
PORT=3000
```

---

## Running the Application

Development:

```bash
npm run start:dev
```

Production Build:

```bash
npm run build
npm run start:prod
```

---

## Swagger Documentation

Once the application is running:

```text
http://localhost:3000/api
```

---

## API Endpoint

### Chat

```http
POST /chat
```

Request:

```json
{
  "message": "I am looking for a phone"
}
```

Response:

```json
{
  "response": "Here are some phones available for purchase..."
}
```

## Example Requests

### Product Search

```json
{
  "message": "I am looking for a phone"
}
```

### Currency Conversion

```json
{
  "message": "How many Canadian Dollars are 350 Euros"
}
```

### Product Price Conversion

```json
{
  "message": "What is the price of the watch in Euros?"
}
```

---

## Technologies

- NestJS
- TypeScript
- OpenAI SDK
- Open Exchange Rates API
- Swagger
- CSV Parser

---

## Author

Cristhian David Patarroyo Cuellar