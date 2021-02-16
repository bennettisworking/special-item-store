import 'easyzoom';

const zoomActive = false;
//use this to make zoomed image visible/hidden

export default class ImageGallery {
  constructor($gallery) {

    this.$mainImage = $gallery.find('[data-image-gallery-main]');
    this.$mainImageNested = $gallery.find('[data-main-image]');
    this.$selectableImages = $gallery.find('[data-image-gallery-item]');
    this.currentImage = {};
  }

  init() {
    this.bindEvents();
    this.setImageZoom();
    const firstImage = this.$selectableImages[0];
    const otherImage = this.$selectableImages[1];
    let imageIndex = -1;
    this.$mainImage.find('a').hover((e) => {
        // get index of current image
        imageIndex = $('li.productView-thumbnail a').index($('a.is-active'));
        // only do the hover swap if the first image is selected
        if (imageIndex < 1) {
          this.selectNewImage(otherImage);
        }
      },
      (e) => {
        if (imageIndex < 1) {
          this.selectNewImage(firstImage);
        }
      })
  }


  setMainImage(imgObj) {
    this.currentImage = { ...imgObj };
    this.setActiveThumb();
    this.swapMainImage();
  }

  setAlternateImage(imgObj) {
    if (!this.savedImage) {
      this.savedImage = {
        mainImageUrl: this.$mainImage.find('img').attr('src'),
        zoomImageUrl: this.$mainImage.attr('data-zoom-image'),
        mainImageSrcset: this.$mainImage.find('img').attr('srcset'),
        $selectedThumb: this.currentImage.$selectedThumb,
      };
    }
    this.setMainImage(imgObj);
  }

  restoreImage() {
    if (this.savedImage) {
      this.setMainImage(this.savedImage);
      delete this.savedImage;
    }
  }

  selectNewImage(o) {
    let $target = {};
    // modified this method to accept either event or image object
    if (o.target) {
      $target = $(o.currentTarget);
      o.preventDefault();
    } else {
      $target = $(o);
    }
    const imgObj = {
      mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
      zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
      mainImageSrcset: $target.attr('data-image-gallery-new-image-srcset'),
      $selectedThumb: $target,
      mainImageAlt: $target.children().first().attr('alt'),
    };
    this.setMainImage(imgObj);
  }

  setActiveThumb() {
    this.$selectableImages.removeClass('is-active');
    if (this.currentImage.$selectedThumb) {
      this.currentImage.$selectedThumb.addClass('is-active');
    }
  }

  swapMainImage() {
    const isBrowserIE = navigator.userAgent.includes('Trident');

    if (this.easyzoom !== undefined) {

      this.easyzoom.data('easyZoom').swap(
        this.currentImage.mainImageUrl,
        this.currentImage.zoomImageUrl,
        this.currentImage.mainImageSrcset,
      );

    }

    this.$mainImage.attr({
      'data-zoom-image': this.currentImage.zoomImageUrl,
    });
    this.$mainImageNested.attr({
      alt: this.currentImage.mainImageAlt,
      title: this.currentImage.mainImageAlt,
    });

    if (isBrowserIE) {
      const fallbackStylesIE = {
        'background-image': `url(${this.currentImage.mainImageUrl})`,
        'background-position': 'center',
        'background-repeat': 'no-repeat',
        'background-origin': 'content-box',
        'background-size': 'contain',
      };

      this.$mainImageNested.css(fallbackStylesIE);
    }
  }

  checkImage() {
    const $imageContainer = $('.productView-image');
    const containerHeight = $imageContainer.height();
    const containerWidth = $imageContainer.width();

    const $image = this.easyzoom.data('easyZoom').$zoom;
    const height = $image.height();
    const width = $image.width();

    // added zoomActive as a condition 
    if (height < containerHeight || width < containerWidth || !zoomActive) {
      this.easyzoom.data('easyZoom').hide();
    }
  }

  setImageZoom() {
    this.easyzoom = this.$mainImage.easyZoom({
      onShow: () => this.checkImage(),
      errorNotice: '',
      loadingNotice: '',
    });
  }

  bindEvents() {
    this.$selectableImages.on('click', this.selectNewImage.bind(this));

  }
}