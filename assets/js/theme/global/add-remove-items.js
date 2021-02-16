const modalBodyClass = 'modal-body';
const modalContentClass = 'modal-content';

export default class AddRemoveItems {

  constructor() {
    this.url = '/api/storefront/carts';
    this.$cartBadge = $('[data-cart-preview] span.countPill');
    this.deleteButton = $('#deleteCart');
    this.init();
  }

  init() {
    console.log('moo');
    let showButton = this.$cartBadge.css('display') == 'none' ? 'none' : 'inline';
    this.deleteButton.css('display', showButton);
  }
  getCart(url) {
    return fetch(url + '?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
        method: "GET",
        credentials: "same-origin"
      })
      .then(response => response.json());
  }

  addCartItem(url, cartId, cartItems) {
    console.log('add item');
    return fetch(url + cartId + '/items', {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cartItems),
      })
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        this.updateCartCounter(data);
        this.addBanner("Your items have been added to the cart!");

      });
  }

  createCart(url, cartItems) {
    console.log('create cart');
    return fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cartItems),
      })
      .then(response => response.json())
      .then(data => {
        this.updateCartCounter(data);
        this.addBanner("Your items have been added to the cart!");
      });
  }

  deleteCart() {
    console.log('delete cart');
    this.getCart(this.url + '?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
      .then(data => {
        return fetch(this.url + "/" + data[0].id, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
          })
          .then(response => {
            this.updateCartCounter({});
            this.addBanner("All items have been deleted from your cart!");
          })
        /*.then(data => {
          console.log(JSON.stringify(data));
          this.updateCartCounter(data);
        });*/
      });
  }

  addBanner(text) {
    $('<div id="addBanner" class="customer-alert">' + text + '</div>').insertBefore($(".header"));
    let to = setTimeout(() => {
      console.log('timeout');
      $('#addBanner').slideUp(500, () => {
        $('#addBanner').remove();
      })
    }, 3000)

  }

  updateCartCounter(data) {
    console.log('meow');
    console.log(data);
    let cartCount = 0;
    for (const property in data.lineItems) {
      console.log(property);
      data.lineItems[property].map(item => {
        cartCount += item.quantity;
      })
    }
    console.log('Total' + cartCount);
    if (cartCount == 0) {
      this.deleteButton.hide();
    } else {
      this.deleteButton.show();
    }
    this.$cartBadge.html(cartCount);
    let disp = cartCount > 0 ? 'inline-block' : 'none';
    this.$cartBadge.css('display', disp);
  }

  addOrCreate(item) {
    let cartCount = 0;
    let itemData = {
      "lineItems": [{
        "quantity": 1,
        "productId": item
      }]
    };
    this.getCart(this.url + '?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
      .then(data => {
        console.log(JSON.stringify(data));
        //console.log(data[0].lineItems);

        if (data.length == 0) {
          console.log('no cart');
          this.createCart('/api/storefront/carts', itemData)
        } else {
          let cartId = (data[0].id);
          this.addCartItem('/api/storefront/carts/', cartId, itemData)
        }
      });
  }
};