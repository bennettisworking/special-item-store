# Bennett's Theme
![tests](https://github.com/bigcommerce/cornerstone/workflows/Theme%20Bundling%20Test/badge.svg?branch=master)

## Overview

### Image Swap on Hover

For the first part of the task, the hover-change image behavior, I added some functionality to theme/product/image-gallery.js.  I added a variable to disable the zoom effect on the product page (because it interfered with the new hover behavior), and I modified the selectNewImage method to accept image objects as well as events (from clicking the thumbs) so that it could be fired manually when the mouse came onto and off of the image.  I also disable the hover effect if any of the other thumbnails (besides the one with the main image) are clicked.  Right now this is hard coded for the first two images but this could easily be modded to always show the next image on hover, etc.

### Add Products/Clear Cart Buttons

I added these buttons in the header template with the condition to only display on the 'Special Items' category page.  I then created a new class in /theme/global/ called add-remove-items.js.  This class provides methods to get the current cart, create a cart if there is none present, add to an existing cart and to delete the cart.  It also includes a method called addOrCreate which calls the get cart method, and depending on whether the cart is present or not either adds items to that existing cart, or creates a cart adding the items in the process.

Both the addOrCreate and deleteCart methods are called from the category.js file, depending upon which header button is clicked.

The add-remove-items.js file will also hide the delete cart button in the header if there are no items in the cart.

Upon either successfull adding or deleting of items, a banner will appear at the top of the screen to indicate what action took place. (I was trying really hard to hit the V3 store API to include item details here but I absolutely could not get it to return data, just a 200 code, I had to let it go for time reasons.) The cart badge will also update (there is probably a hook for that somewhere but I could not find it so I wrote a function to update the badge).

### User Info Banner

I added a little HTML to the navigation.html template that displays a very simple banner on the left of the screen if you are logged in; it includes the user's name, email and phone.
