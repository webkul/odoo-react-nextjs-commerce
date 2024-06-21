[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/vikastiwariwebkuls-projects/import?s=https%3A%2F%2Fgithub.com%2FVikasTiwari-Webkul%2Fnextjs-commerce-odoo&hasTrialAvailable=1&showOptionalTeamCreation=false&project-name=nextjs-commerce-odoo&framework=nextjs&totalProjects=1&remainingProjects=1)

# Next.js Odoo Commerce

A Next.js 14 and App Router-ready ecommerce template featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS
- Checkout and payments with Odoo
- Automatic light/dark mode based on system settings

Next.js Commerce utilizes the Odoo Frontend API to provide client-safe access to your store's data. The Frontend API has read-only permissions for most models including products, categories, navigation menus, pages, and more. With the cart management, checkout.

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1)

## Project setup

To connect Next.js Commerce to a Odoo store, you will need to set the environment variables [defined in `.env.example`](.env.example). Using [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this is recommended, but a `.env` file is all that is necessary.

> Note: If using an `.env` file, you should not commit this to your repository as it may expose secrets that allow others to access your store.

_To use Vercel Environment Variables:_

1. Install Vercel CLI: `npm i -g vercel`
2. Link a Vercel project: `vercel link` (this creates a `.vercel` directory)
3. Download your environment variables: `vercel env pull`

<details>
  <summary>Expand if you work at Vercel and want to run locally and/or contribute</summary>

1. Run `vc link`.
2. Select the `Vercel Solutions` scope.
3. Connect to the existing `commerce-Odoo` project.
4. Run `vc env pull` to get environment variables.
5. Run `pnpm dev` to ensure everything is working correctly.
</details>

### Connecting to your Odoo store

In order to use the Frontend API, you need to obtain a public required key for your Odoo Store.

<details>
  <summary>Expand to view env variables detailed walkthrough</summary>

1. COMPANY_NAME="Vercel Inc."
2. TWITTER_CREATOR="@vercel"
3. TWITTER_SITE="https://nextjs.org/commerce"
4. SITE_NAME="Odoo Commerce"
5. ODOO_REVALIDATION_SECRET=""
6. ODOO_STOREFRONT_ACCESS_TOKEN='Odoo Access Token'
7. ODOO_STORE_DOMAIN="[your-Odoo-store-subdomain].com"
8. ODOO_API_VERSION='Version'
</details>

### Running locally

> Note: Ensure you are using Node v16 or above before running the install command.

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Production deployment

### Configure on-demand incremental static regeneration (ISR)

Using [on-demand revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#using-on-demand-revalidation) in Next.js is recommended to optimize data fetching and serve requests from cache unless data is changed.

The above product events are triggered when variants are added, updated, and removed, as well as when stock is updated.

> Note: If you add functionality that uses data from other models, you will need to configure the relevant events to listen for in Odoo Store.
