📢 Use this project, [contribute](https://github.com/vtex-apps/quantity-on-cart) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Quantity On Cart

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The **Quantity On Cart app** displays a message informing customers of the quantity of the same product they have added to the cart.

![app-example](https://user-images.githubusercontent.com/67270558/162291375-e469fb78-ef87-4eeb-bd8b-f228a4579a52.gif)

> ⚠️
> 
> The Quantity On Cart app does not work with promotions that split products.

## Configuration 

1. Open the terminal and use the [VTEX IO CLI](https://vtex.io/docs/recipes/development/vtex-io-cli-installment-and-command-reference) to log into the desired VTEX account.
2. Run the following command to install the Quantity On Cart app:
```
vtex install vtexarg.quantity-on-cart
```  
4. Open your store’s Store Theme app directory in your code editor.
5. Open your app's `manifest.json` file and add the Quantity On Cart app under the `peerDependencies` field.

```json
"peerDependencies": {
  "vtexarg.quantity-on-cart": "2.x"
}
```
4. Add the `quantity-on-cart` block to other theme block using a product context since the `quantity-on-cart` block handles product data. For example, the [`product-summary.shelf`](https://developers.vtex.com/vtex-developer-docs/docs/vtex-product-summary-productsummaryshelf#configuration):

```json
  {
  "product-summary.shelf": {
    "children": [
    + "quantity-on-cart"
    ]
  },
...
```
After step 4, no further configuration is needed, and the app is ready to use in your store.

> ℹ️
> 
> The displayed message in the Quantity On Cart app is available in three languages: English, Spanish, and Portuguese, and follows the pattern below, which cannot be changed: `You have x units in your shopping cart.`

---
## Customization

To apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS Handles |
| ----------- | 
| `quantityOnCart` | 

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:
<table>
  <tr>
    <td align="center"><a href="https://github.com/germanBonacchi"><img src="https://avatars.githubusercontent.com/u/55905671?v=4" width="100px;" alt=""/><br /><sub><b>Germán Bonacchi</b></sub></a><br /><a href="https://github.com/vtex-apps/quantity-on-cart/commits?author=germanBonacchi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tomymehdi"><img src="https://avatars.githubusercontent.com/u/774112?v=4" width="100px;" alt=""/><br /><sub><b>Tomás Alfredo Mehdi</b></sub></a><br /><a href="https://github.com/vtex-apps/quantity-on-cart/commits?author=tomymehdi" title="Code">💻</a></td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
