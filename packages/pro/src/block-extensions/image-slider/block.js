import { __ } from "@wordpress/i18n";
import { ToggleControl } from "@wordpress/components";
import SwiperCore, {
  Navigation,
  Thumbs,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "@wordpress/element";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Thumbs]);

export function NewImageSlider(props) {
  const [thumbSwiper, setThumbSwiper] = useState(null);

  const { attributes, setAttributes, BlockEdit } = props;
  const { showThumbnails } = attributes;

  const imageArray = attributes.pics;

  const showThumbnailsToggle = (
    <ToggleControl
      label={__("Show image thumbnails")}
      checked={showThumbnails}
      onChange={() => {
        setAttributes({
          showThumbnails: !showThumbnails,
        });
      }}
    />
  );
  const thumbnails = (
    <Swiper
      slidesPerView={4}
      freeMode={true}
      watchSlidesProgress={true}
      watchSlidesVisibility={true}
      onDestroy={() => setThumbSwiper(null)}
      onSwiper={(e) => setThumbSwiper(e)}
    >
      {imageArray.map((c, i) => (
        <SwiperSlide>
          <img
            key={i}
            src={c.url}
            style={{
              height: `${50}px`,
              width: `auto`,
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  const proProps = {
    showThumbnails,
    showThumbnailsToggle,
    thumbnails,
    thumbSwiper,
  };
  return (
    <>
      <BlockEdit {...props} proProps={proProps} />
    </>
  );
}
