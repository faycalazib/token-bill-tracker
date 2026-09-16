# LLM Cost Calculator

LLM Cost Calculator is a browser-based tool for estimating, comparing, and tracking the cost of LLM usage. Select a model, enter or import usage data, and see token counts and price estimates before committing to an API provider.

The app runs entirely in the browser. It has no application server, account system, or remote database.

## What You Can Do

- Estimate input and output token costs for an LLM request.
- Compare the same text across the available model catalogue.
- Project monthly usage for a SaaS plan or an entire team.
- Calculate a batch of conversations from pasted data or a CSV/JSON file.
- Build a multi-model pipeline and calculate the cost of every step.
- Use a guided wizard to find models that match a budget, use case, context size, and speed priority.
- Save calculations locally, review them in history, export history as CSV, and view monthly charts.
- Import actual usage data and reconcile it with catalogue estimates.
- Capture price snapshots and review price changes over time.
- Learn how tokenization works with the interactive token guide.
- Switch between classic and Spatial 3D experiences.

## Requirements

- Node.js and npm
- A modern browser with JavaScript enabled

## Run Locally

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The development server reloads the page when source files change.

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the available checks:

```bash
npm run lint
npm run test:ui
```

The Playwright tests expect the application to be available through the configured Vite web server.

## How To Use The App

### 1. Estimate a request

1. Open **Calculator**.
2. Choose a text model.
3. Paste the prompt into **Input**.
4. Paste the expected model response into **Output**.
5. Review input tokens, output tokens, total tokens, and the estimated cost.
6. Use **Compare all models** to see how the same text would be priced elsewhere.
7. Save the calculation if you want it to appear in History and Dashboard.

OpenAI text models use a compatible local tokenizer when it is available. Other models use the app's estimation method, so results should be treated as planning estimates rather than provider invoices.

### 2. Compare models

Open **Comparisons** to browse model pricing, context limits, providers, and comparison charts. Use the tabs to compare input prices, output prices, and model details.

### 3. Calculate a batch

Open **Batch** and choose a model. Then upload or paste one of these formats:

- JSON array: objects with `input` and `output` fields
- CSV or tab-separated data with `input` and `output` columns
- Plain text with one input message per line

Select **Calculate costs** to see per-conversation totals and the total batch cost.

### 4. Model a pipeline

Open **Pipeline**, add one step for each model call, and enter the input and output token count for each step. The page calculates the cost of every step and the complete chain.

### 5. Find a suitable model

Open **Wizard** and answer four questions about budget, use case, context length, and speed. The wizard ranks current text models and displays the highest-scoring recommendations.

### 6. Estimate team or SaaS usage

- **Team** estimates monthly and annual costs from team size, prompts per day, average tokens, working days, and output ratio.
- **Calculator** also includes a SaaS plan simulation for users, prompts, token volume, plan price, and input/output share.

### 7. Track saved usage

- **History** lists saved calculations and can export them as CSV.
- **Dashboard** summarizes the current month's saved calculations, average cost, trends, and model distribution.
- **History** also contains the usage reconciliation tool for comparing imported actual usage with catalogue estimates.

### 8. Track catalogue prices

Open **Prices** to inspect model prices and their provenance. Select **Capture current prices** to store a local snapshot. After at least two snapshots, the page highlights price changes between them.

### 9. Learn about tokens

Open **Tokens** for an interactive explanation of token boundaries, token counts, and the relationship between token volume and API cost.

## Navigation and Preferences

- The app starts in English when no language preference exists.
- Use the language control to switch between English, French, and Arabic.
- Use the theme control to choose Light, Dark, or System.
- Use the **Spatial 3D** switch to enter the alternative interactive experience.
- Press `Ctrl+K` on Windows/Linux or `Cmd+K` on macOS to open the model and page command palette.

Language, theme, saved calculations, price snapshots, and imported usage data are stored in the browser's `localStorage`. Clearing browser storage removes this data from the device.

## Pricing and Data Notes

The catalogue contains model pricing and metadata used for estimates. Prices can change, and the final amount charged by a provider may also include message formatting, cached tokens, tools, batch pricing, request fees, taxes, or other provider-specific rules.

Use the result as a budgeting and comparison aid. Always verify the current pricing and billing rules with the provider before making financial or production decisions.

## Technology

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui and Radix UI primitives
- Recharts for dashboard visualizations
- Three.js for the Spatial 3D experience
- `js-tiktoken` for compatible local tokenization
- Playwright for UI tests

## Project Structure

```text
src/
	components/       Shared UI, navigation, calculator modules, and Spatial 3D components
	contexts/         Language, theme, and experience state
	data/             Model catalogue and translations
	pages/             Calculator and feature pages
	utils/             Token calculations, pricing scenarios, imports, and browser storage
	App.tsx           Application providers and routes
tests/               Playwright UI tests
public/              Static assets
```

## Deployment

`npm run build` produces a static Vite bundle in `dist/`. Deploy that directory to any static hosting service that supports client-side routing. Configure the host to serve `index.html` as the fallback for application routes such as `/comparisons` and `/dashboard`.

## License

No license file is currently included in this repository. Add a license before distributing the project publicly.
