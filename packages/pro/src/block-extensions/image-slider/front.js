Array.prototype.slice
  .call(document.getElementsByClassName("ub_image_slider"))
  .forEach((instance) => {
    if (
      instance.nextElementSibling &&
      instance.nextElementSibling.hasAttribute("data-swiper-data")
    ) {
      const swiperThumbs = new Swiper(
        `#${instance.id}+.ub_image_slider_thumbs`,
        JSON.parse(instance.nextElementSibling.dataset.swiperData)
      );
      const swiper = new Swiper(
        `#${instance.id}`,
        Object.assign(JSON.parse(instance.dataset.swiperData), {
          thumbs: { swiper: swiperThumbs },
        })
      );
    } else {
      const swiper = new Swiper(
        `#${instance.id}`,
        JSON.parse(instance.dataset.swiperData)
      );
    }

    instance
      .getElementsByClassName("swiper-button-next")[0]
      .addEventListener("keydown", (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }
      });

    instance
      .getElementsByClassName("swiper-button-prev")[0]
      .addEventListener("keydown", (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }
      });

    Array.prototype.slice
      .call(instance.getElementsByClassName("swiper-pagination-bullet"))
      .forEach((bullet) => {
        bullet.addEventListener("keydown", (e) => {
          if (e.key === " ") {
            e.preventDefault();
          }
        });
      });
  });

/*Array.prototype.slice
	.call(document.getElementsByClassName('ub_image_slider_thumbs'))
	.forEach(instance => {
		const swiper = new Swiper(
			`#${instance.id}`,
			JSON.parse(instance.dataset.swiperData)
		);
	});*/
