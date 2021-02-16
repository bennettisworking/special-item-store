# Bennett's Theme
![tests](https://github.com/bigcommerce/cornerstone/workflows/Theme%20Bundling%20Test/badge.svg?branch=master)

## Overview

### Image Swap on Hover

For the first part of the task, the hover-change image behavior, I added some functionality to theme/product/image-gallery.js.  I added a variable to disable the zoom effect on the product page (because it interfered with the new hover behavior), and I modified the selectNewImage method to accept image objects as well as events (from clicking the thumbs) so that it could be fired manually when the mouse came onto and off of the image.  I also disable the hover effect if any of the other thumbnails (besides the one with the main image) are clicked.  Right now this is hard coded for the first two images but this could easily be modded to always show the next image on hover, etc.