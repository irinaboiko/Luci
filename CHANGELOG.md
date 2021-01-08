# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.5.1] - 2020-12-10
- The global and header widgets no longer overlap the site when you use them
  (THEME-2021)
- Updated stencil utils to ^6.2.0

## [2.5.0] - 2020-10-16
- Global header region added

## [2.4.2] - 2020-08-26
- Update jQuery and other packages to be up-to-date
- Isolated product images now show full height
- Conditionally load polyfills when necessary

## [2.4.1] - 2020-06-25
- Sanitize product data in account pages

## [2.4.0] - 2020-05-15
- The product below price region has been added to support widgets
- Sanitize user input

## [2.3.1] - 2020-04-24
- Marketing banners show on the homepage again (THEME-1949)

## [2.3.0] - 2020-03-27
- Regions are now available on content pages should you wish to use widgets
  there when they are released
- The product description color is now mapped to the body font color
  (THEME-1936)
- Everything should load on the homepage as expected (THEME-1938)

## [2.2.1] - 2020-03-05
- Update structured data to remove errors and as many warnings as possible

## [2.2.0] - 2020-02-13
- Update theme to use core-js v3

## [2.1.1] - 2020-02-07
- We have a spelling error in the settings, but it's fixed now, our bad

## [2.1.0] - 2019-12-03
- Update JSON-LD to support html in product structured data (THEME-1808)
- Make sure Structured data doesn't break AMP pages
- Don't show gift certificate preview until an amount is entered (THEME-1762)
- File fields now display correctly on the cart page an on returns pages
- Orders can be re-ordered even if one of the items is out of stock (THEME-1519)
- Contact page shows correct success string (THEME-1507)
- Textarea placeholder text now correctly is removed on focus
- Promotional messages now show in all the locations they are supposed to
  (THEME-1508)
- Fortune now has lazyload and uses Srcset so shoppers get the best images
  served to them

## [2.0.0] - 2019-09-05
- Add region support for widgets
- We updated to Webpack 4 to stay modern (THEME-1850)

## [1.19.3] - 2019-08-28
- Update support documentation link

## [1.19.2] - 2019-08-01
- Display of HTML in search results corrected (THEME-1827)
- Update JQuery version to maintain security

## [1.19.1] - 2019-07-04
- Banners are no longer broken after the GAEE update
- Now the image a shopper clicks on to zoom is the one that's shown (THEME-1789)
- Now customers can still log into accounts if the merchants has restricted
  account creation (THEME-1784)

## [1.19.0] - 2019-05-23
- Complete Google Analytics Enhanced Ecommerce integration

## [1.18.2] - 2019-03-07
- Add support for CSRF protection and update Stencil Utils to do so
- Add basic Google Enhanced Eccom Analytics support
- Added the ability to create and to wishlists from the product page (THEME-898)

## [1.18.1] - 2019-02-21
- Fixed broken options from last update (THEME-1734)
- Allow edit options from cart to follow inventory display settings

## [1.18.0] - 2019-02-07
- Added support for vaulted credit cards
- Allow for changing of options in cart (THEME-942)

## [1.17.1] - 2019-01-31
- Show thumbnails for single images

## [1.17.0] - 2019-01-24
- Implemented new pricing structure, sale badges are now controlled by
  sale price and not the existence of a retail price. (THEME-1541)
- Changed "As low as" wording to price ranges for product options. It's more
  descriptive and works regardless of the default.
- Don't show a default price on quick-shop if there isn't one.
- Price label settings

## [1.16.11] - 2018-10-18
- Added support for Smart Paypal buttons

## [1.16.10] - 2018-09-20
- Allow options to show as available even if purchasing is disabled (THEME-1542)

## [1.16.9] - 2018-08-30
- Quick-view wasn't loading for products with images (THEME-1654)

## [1.16.8] - 2018-08-16
- We added image zoom to the main product image, high five! (THEME-1251)

## [1.16.7] - 2018-08-09
- Multiple shipping addresses is now a thing your shoppers can use if you want
  them too
- Added theme option to show product catalog pages in a classic grid
- Added sort to product catalog pages when theme is set to classic (THEME-1377)


## [1.16.6] - 2018-08-02
- We got over zealous fixing a bug and made a new one blocking products from
  being added to the cart from the home or collection pages, it's all fixed now
  (THEME-1644)

## [1.16.5] - 2018-07-26
- Discount banners added to product page (THEME-1185)

## [1.16.4] - [2018-07-12]
- Added support for newsletter summary
- Added fix for iOS empty file upload issue (THEME-1605)
- Correct Schema data to avoid errors on product page (THEME-1280)

## [1.16.3] - [2018-07-05]
- Added "customized_checkout" to features list so the checkout script manager
  works (THEME-1607)

## [1.16.2] - [2018-06-20]
- Added a new setting to allow you to show top selling (popular)
  products (THEME-1341)
- If a product selection contains an error, the customer will no longer
  be redirected to the cart if the item can't be added (THEME-1321)
- Fixed the mobile menu width causing text overflow (THEME-1480))

## [1.16.1] - [2018-06-07]
- Search query now persists on the search page when changing faceted
  search to a price range (THEME-1580)
- Links to open reviews from e-mails will now open the review modal
- Update package.json file to reflect new repo location on github

## [1.16.0] - [2018-05-17]
- Support for AMP product pages added

## [1.15.4] - [2018-04-26]
- Copyright script removed from AMP footer

## [1.15.3] - [2018-04-19]
- Recaptcha v2 on contact page

## [1.15.2] - [2018-04-12]
- Show an error when a user tries to check out with OOS stock product

## [1.15.1] - [2018-04-05]
- Added header and footer scripts to checkout and order confirmation pages

## [1.15.0] - [2018-03-22]
- Added AMP support for category pages

## [1.14.0] - [2018-03-01]
- Added Geotrust seals to theme settings and footer

## [1.13.0] - [2018-02-15]
- Updated to webpack 3

## [1.12.7] - [2018-02-01]
- Hide sold out options across all browsers

## [1.12.6] - [2018-01-26]
- Product checkbox customizations now appear like product option checkboxes
- Countries without states having no longer require state field to be filled
- Added instructions to select dropdowns
- Allow custom field customizations to render html
- Did you know, Fortune actually supports Pixelpop? It totally does, so we've added
  it to the features list :)

## [1.12.5] - [2017-11-10]
- Update to stencil-utils for better product option support

## [1.12.4] - [2017-10-31]
- Full Optimized Checkout support
- A little helper for IE to encourage it to render better
- Ability to use custom formatted gift certificates

## [1.12.3] - [2017-09-28]
- Life can seem random and now the marketing banners really are! Now only one
  marketing banner displayed at a time in random order

## [1.12.2] - [2017-08-03]
- Enhance Masonry ordering to prioritize horiontal ordering
- Update support URLS
- Fix product swatch styling
- Allow product warranty to output HTML

## [1.12.1] - [2017-07-27]
- Updated bc-core
- Updated product review form to recaptcha v2

## [1.12.0] - [2017-06-01]
- Update stencil utils
- Fixing "None" showing on pick lists when it is required (THEME-1279)
- Add event/delivery date picker to product page (THEME-1283)
- Fixes to cart to prevent multiple events firing

## [1.11.2] - [2017-04-28]
- Pre select default item from product pick list
- Add an unscribed template for newsletter unsubscription

## [1.11.1] - [2017-04-06]
- Fixed an issue where product grid overlays weren't showing in IE

## [1.11.0] - [2017-03-23]
- Display dimension units next to dimensions
- Show cart level discounts on the Cart page
- Brand, Category, and Search now allow for additonal facets to be loaded into the page

## [1.10.1] - [2017-03-09]
- Update product ATC button's text if a variant is unavailable
- Add in product level discounts to cart (THEME-1217)
- Add option to hide product dimensions (THEME-1146)
- Remove RTL product ordering
- When cart receives discount, show discounted amount (THEME-1228)
- Add in product dimensions' unit of measurement

## [1.10.0] - [2017-02-02]
- A message now shows if a product doesn't have any facets
- The cart button now gets disabled if the product can't be purchased
- migrated the theme's build system from JSPM/SystemJS to NPM/Webpack

## [1.5.1] - [2016-12-01]
- Added `lang` attribute to <html> tag
- Add Apply Pay icon to footer

## [1.5.0] - [2016-11-10]
- Allow merchants to disable AJAX add to cart from the Product page
- Fixed required checkboxes not validating properly
- Addition of Apple Pay icon and formatting options

## [1.4.7] - 2016-10-28
- Fixed logo not always appearing on mobile

## [1.4.6] - 2016-10-04
- Fixed Product utilities not scoping to current section

## [1.4.5] - 2016-09-29
- Disabling Gift Certificates will now hide it from the Cart page
- Link product titles in the cart

## [1.4.4] - 2016-09-15
- Added in pagination to the Brands page
- Corrected thumbnails in the Quick Shop not changing the slide

## [1.4.3] - 2016-09-07
- Rebundle Fortune to correct bundled javascript errors

## [1.4.2] - 2016-09-01
- Add in token to allow reviews to be throttled
- Add in classes to product information for custom styles

## [1.4.1] - 2016-08-11
- Removed duplicate shop name in the blog `<title>`
- Added `rel='nofollow'` attribute to faceted search links

## [1.4.0] - 2016-08-04
- Added support for product videos
- Removed 'Product Actions' from product items on touch interfaces

## [1.3.0] - 2016-07-28
- Add a new option to the product slider so that only one image shows at a time
- Enhanced overall print styles
- Enhanced print styles to the Blog and Product page
- Forced attachment of `jQuery` to the `window` in the event that jQuery is not able to do it itself

## [1.2.9] - 2016-07-21
- Added `rel='nofollow'` attribute to BigCommerce external link

## [1.2.8] - 2016-07-15
- Fixed product variations not updating price

## [1.2.7] - 2016-06-21
- Added copyright information in footer (fixes THEME-1053)
- Fixed contact us form success message not displaying properly and organized the contact form fields better (fixes THEME-1052)

## [1.2.6] - 2016-06-14
- Added blog posts and web pages content to search results page
- Fixed configurable fields producing an out of stock message which prevented add to cart action (fixes THEME-1028)

## [1.2.5] - 2016-05-26
- Added "Call for pricing" message to product page in place of price when selected (fixes THEME-1030)
- Added swatch zoom on hover for desktop, hidden on mobile (fixes THEME-1029)

## [1.2.4] - 2016-05-19
- Enhancement to the Checkout page's heading styling to better match the rest of the theme
- Correction to the Theme Editor's `Hide parent menu items in their children menu` option
- Applying a max height to the product tiles, and to single product images
- Added better responsiveness to the Product Page on mobile and tablet
- Removal of `Primary Color` setting which was not being used
- Current currency now shows if only one currency is enabled store side
- Apply a minimum height to product images on mobile so that the share doesn't overflow

## [1.2.3] - 2016-04-21
- Addition of RSS feed parsing on page templates
- Addition of UPS shipping options

## [1.2.2] - 2016-04-14
- Fix to scroll being prevented after menu initiation or resizing

## [1.2.1] - 2016-04-05
- Correction to incrementing / decrementing quantity options on non-variant products

## [1.2.0] - 2016-03-31
- Fixed the home carousel likely not working at all
- Added a setting in `Home Carousel -> Carousel image cropping`
- Quantity box hides the product quantity box when disabled
- Optional hiding of account creation
- Major header rewrite to extend support
- Case correction for BigCommerce

## [1.1.0] - 2016-03-23
- Added Facebook like button (fixes THEME-932)
- Updates to core files
- Correction to Pinterest button (fixes THEME-944)
- Addition of share buttons to the blog (fixes THEME-945)
- Typo corrections (fixes THEME-941)
- Addition of product stock availability reflecting on product page and quick
  shop (fixes THEME-908)

## [1.0.5] - 2016-03-09
- Show parent menu items as child items so they can be clicked (fixes THEME-869)

## [1.0.4] - 2016-03-02
- Added bulk pricing block to product page (fixes THEME-926)

## [1.0.3] - 2016-02-25
- Update to bc-core
- Addition of new image sizes
- Addition of invoice.scss
- Improvement to Invoice functionality
- Addition of additional checkout buttons (fixes issue #2)
- Correction to gift certificate language

## [1.0.2] - 2016-02-18
- Correcting image sizes and missing image definitions
- Gift certificate link in footer shows conditionally
- [881] Hiding the wishlist on the product page if disabled through CP
- [889] Adding in a placeholder checkout file to prevent error 500s

## [1.0.1] - 2016-02-02
- Globally set the header background color options
- Correction to product page add to cart success message (Issue 859)
- Button logic switch on home carousel
- Correction to price template update

## [1.0.0] - 2016-01-21
- 1.0.0 Launch
- Adding to cart from the product-item now refreshes the cart
- Contrast adjustment to header nav

## [0.1.7] - 2016-01-21
- Corrections to screen shot paths

## [0.1.6]
- All
    - Correction to 'Always show header bg'. Now shows on pages without carousel
      properly
- Products
    - Typo change for `Add to cart`
    - Typo in remote add to cart correction
    - Increased spacing in modal
    - Centered products in the cart
- Product Review
    - Escape closes review modal
    - Clicking on the modal background closes it
    - Better active color for stars
- Contrast
    - Addition of header background
- Minimal
    - Change of button color to white
- Highlight
    - Better color detection for SOLD OUT button
- Meta
    - Changed price to free
    - Added new artwork
    - Package name change
    - Addition of description to package

## [0.1.5] - 2016-01-20
- Home
    - If new/featured products are enabled, but 0 exist, don't show
    - Switch from padding to margin to allow for border spacing
- Meta
    - Removal of theme documentation pdf
    - Propagation of support URL
- Cart
    - Enhancements to the giftwrapping form
- Global
    - Addition of a generic error page
    - Addition of sort by relavence filter

## [0.1.4] - 2016-01-19
- Minimial
    - Adjustment to the font family for minimal button
    - Minimal: Update to heading font
- Bright
    - Adjustment to carousel colors
    - New setting addition
- Highlight
    - Preset adjustment
- Global
    - Footer won't show border if colors differ
    - Increase spacing between home section titles
    - Update to theme price
    - Update to include theme support documentation
- Product Item
  - Adding a new setting to control the product item title
  - Setting the product-item price to be the same as the brand
  - Tightening up spacing on product item
  - Correcting font size on product item

## [0.1.3] - 2016-01-17
- Overhaul to QuickShop modal
    - Escape now closes modal
    - Clicking outside the modal closes it
    - SelectWrapper activates
- Sidebar
    - Page and blog sidebar now have the same styling
- Product
    - Image switcher has been removed
    - Grids are now RTL
    - Comparision bar edits
- Home carousel edits
    - Minimal's border now maxed to the content width
    - Adjustment of carousel width on desktop
- Body link styles now have an independent variable
- Addition of products per page
- Adjustments to product spacing
- Neutralising alert styles
- Adjustment to product styles
- Left aligning form actions

## [0.1.2] - 2016-01-14
- IE Fixes
    - Correction to checkboxes
    - Fix to slide out menu
- Modified spacing around theme attribution
- Attribution type correction
- Added in variant image preview within lightbox
- Addition of product badges
- Addition of share buttons that match to the CP settings
- Adjustment to quantity input
- Correction to Maintenance and Hibernation Page
- Adjustment to masonry grid
- Have reconfigured product forms
- Modified product release date
- Correction to checkboxes for IE
- Addition of payment icons to the footer
- Correction to checkout url
- Remotely adding a product to the cart now triggers the cart update
- Enhancement to Faceted Search visibility

## [0.1.1]
### Edits
- Continued styling on the Account pages
- Updates to Product Utilities
- Update to Footer styling
- Update to Faceted Search filter view
- Increase in button font size
- Update to header background color visibility
- Updates to the pricing block
- Removal of old JS injection
- Carousel now pauses when window is not in focus, or is out of viewing range
- Product slider  now pauses when window is not in focus, or is out of viewing
  range
- Overhaul to ProductUtils

## [0.1.0]
### Edits
- Overhaul to Auth/Account pages
- Change of FormValidation library
- Package clean up
- Validation to Product Reviews

## [0.0.19]
### Edits
- Global
    - Increased page spacing, and made uniform
    - Correction to horizontal gutter
    - Connected footer navigation
    - Improvements to the compare bar
    - Improvements to navigation
- Product
    - Improved product actions overlay
    - Improved product spacing and alert ordering
- Cart
    - Updated cart total items to be consistent
    - Better visuals on cart-item actions

## [0.0.18]
### Edits
- Updates to Variation settings
- Carousel
    - Increased spacing for dot pagination
    - Uses theme controled colors
- Product
    - Increased spacing between tiles
- Gift Certificate
    - Language fix
    - Certificate design selection fix


## [0.0.17]
### Edits
- Theme Editor integration
- Blog article image fix
- Isotope removal
- Font reworking
- Package rename
- Version Bump

## [0.0.16]
### Edits
- Re-imported bc-account-pages
- Updated usage of history.js
- Added the Product Pick-list partial
- Product Utils update for better functionality
- Cleaned up SCSS variables for consistency
- Added in config.json variable settings
- Added Variations
- Added in simple form validation
 - Reviews
 - Contact form
 - Various Account Pages
- Schema.org integration
  - Product Page
  - Product Reviews
  - Blog Listing
  - Single Blog Posts
- Schema.json Integration
- Git tag v0.0.16

### Fixed
- Faceted Search Category changes now properly restructure the grid.
- Field sets now don't have a border


## [0.0.15]
### Added
- Top / Bottom banners
- Sitemap
- Order complete page
- Git tag v0.0.15

### Fixed
- Header logo/text width

## [0.0.14]
### Added
- Generic Error handler
- Shipping handling in cart
- Coupons addition to cart
- Gift Certificates can be redeemed in cart
- Gift wrapping can be added in the cart
- Purchase Gift Certificates
- Git tag v0.0.14

### Fixed
- Baseline version to latest
- Error handling / captchas in the Leave a Review modal

## [0.0.13]
### Added
- Newsletter sign up
- Git tag v0.0.13

### Fixed
- Brands sorting translation issue
- Account template references
- Review Modal error/success feedback
- Category visibility in faceted search fix

### Removed
- Hidden Brands/Category/Search 'Sort By' option

## [0.0.12]
### Added
- Product review
- Error / Unavailable pages
- Git tag v0.0.12

### Fixed
- A few small Alert related bugs
- Price block strikeout

## [0.0.11]
### Added
- Add to cart in overlay
- Add to wishlist on single product
- Git tag v0.0.11

### Fixed
- Overlay's width

## [0.0.10]
### Added
- Contact Page
- Git tag v0.0.10

## [0.0.9]
### Added
- Quick Shop
- Compare Products Bar
- Compare Products Page
- Git tag v0.0.9

### Fixed
- Quick Shop ATC (#12259269)

## [0.0.8]
### Fixed
- Home / Featured Product detection
- Append store page url to share field (#12177862)
- Reduce cropping of landscape images (#12162779)
- Hitting return/enter should submit form (#12161546)
- Right-arrow goes left (not right) (#12160986)
- Remove nav arrows if 1 slide (#12177725)
- Switch out Carousel to use Flickity (#12147298)
- Carousel no longer jumps on start
- Footer Navigation wonkiness is now corrected
- Git tag v0.0.8
### Removed
- Instagram component hidden until further BC integration

## [0.0.7]
### Added
- Added Sticky Navigation
- Added Mobile Navigation
- Git tag v0.0.7
### Fixed
- Switch all Navigation show/hide to revealer
- Clicking outside of the Slide out navigation closes the slideout (#12161259)
- Scrolling in Slideout (#12177023)
- Removed Carousel aspects when no carousel slides (#12177619)

## [0.0.6]
### Added
- Account Pages (git@bitbucket.org:pixelunion/bc-account-pages.git)
- Reformatted `common/forms/` to be more theme styled
- Reworked some `alert-{$ALERT}.html` to comply with Account Pages
- Added in base Authorization pages
- Git Tag
### Note
- The Account Pages and Authorization pages are likely to receive major changes later in development

## [0.0.5]
### Added
- Image Slideshow in the single product
- No-image fall back on Product
- Quick Cart
- Dot pagination in carousel
- Git tag
### Fixed
- Social Sharing on Product and Blog
- Removed image source on Cart when no image

## [0.0.4]
### Upgrades
- Significant JS upgrades
- Various corrections

## [0.0.3]
### Fixed
- Search Toggle
- Redundant Category / Search / Brand code
### Added
- Category / Brand banner
- Product Pagination

## [0.0.2]
### Fixed
- Corrected many SCSS errors
### Added
- Changelog
- Small version bump
