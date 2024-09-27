import { Component, Fragment } from "react";

import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import {
  MediaUpload,
  MediaPlaceholder,
  BlockControls,
  URLInput,
  InspectorControls,
  mediaUpload,
  RichText,
  BlockAlignmentToolbar,
} from "@wordpress/block-editor";
import {
  Icon,
  Button,
  ToolbarGroup,
  ToolbarButton,
  ToggleControl,
  FormFileUpload,
  RangeControl,
  PanelBody,
  SelectControl,
} from "@wordpress/components";
import { select } from "@wordpress/data";
import {
  ColorSettings,
  ColorSettingsWithGradient,
  SpacingControl,
} from "../../components/StylingControls";
import { getStyles } from "./get-styles";

const editGallery = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512.001 512.001"
    width="20"
    height="20"
  >
    <path d="M258.544,406.857c-1.861-1.86-4.44-2.93-7.07-2.93c-2.64,0-5.21,1.07-7.069,2.93c-1.87,1.86-2.931,4.44-2.931,7.07 c0,2.64,1.061,5.21,2.931,7.07c1.859,1.87,4.439,2.93,7.069,2.93s5.2-1.06,7.07-2.93c1.86-1.86,2.93-4.44,2.93-7.07 C261.474,411.297,260.405,408.717,258.544,406.857z" />
    <path d="M373.993,19.936H29.999C13.458,19.936,0,33.394,0,49.935v343.994c0,16.542,13.458,30,29.999,30h171.997 c5.522,0,10-4.477,10-10c0-5.523-4.478-10-10-10H29.999c-5.514,0-10-4.486-10-10V49.935c0-5.514,4.486-10,10-10h343.994 c5.514,0,10,4.486,10,10v92.998c0,5.523,4.478,10,10,10s10-4.477,10-10V49.935C403.993,33.394,390.535,19.936,373.993,19.936z" />
    <path d="M145.664,110.934c-17.645,0-31.999,14.355-31.999,31.999c0,17.645,14.355,31.999,31.999,31.999 c17.645,0,31.999-14.355,31.999-31.999C177.664,125.289,163.309,110.934,145.664,110.934z M145.664,154.934 c-6.617,0-12-5.383-12-12c0-6.617,5.383-12,12-12c6.617,0,12,5.384,12,12C157.664,149.551,152.281,154.934,145.664,154.934z" />
    <path d="M511.036,187.967c-1.933-7.212-6.559-13.24-13.024-16.973l-40.613-23.449c-13.351-7.708-30.477-3.116-38.184,10.231 l-63.221,109.502V77.935c0-5.523-4.478-10-10-10H57.999c-5.522,0-10,4.477-10,10v239.996c0,5.523,4.478,10,10,10H291.34 c5.522,0,10-4.477,10-10c0-5.523-4.478-10-10-10H82.142l72.595-72.595l53.928,53.928c3.906,3.905,10.236,3.905,14.143,0 c3.905-3.905,3.905-10.237,0-14.143l-60.999-60.999c-1.876-1.875-4.419-2.929-7.071-2.929c-2.652,0-5.195,1.054-7.071,2.929 l-79.668,79.667V87.935h267.995v142.568l-79.389-79.388c-1.876-1.875-4.419-2.929-7.071-2.929c-2.652,0-5.195,1.054-7.071,2.929 l-52.976,52.976c-3.905,3.905-3.905,10.237,0,14.142c3.906,3.905,10.236,3.905,14.143,0l45.904-45.905l86.388,86.388 c0.023,0.023,0.048,0.042,0.071,0.064v43.138l-42.913,74.329c-0.704,1.219-1.143,2.573-1.287,3.974l-10.401,100.817 c-0.404,3.922,1.533,7.715,4.947,9.687c1.553,0.896,3.278,1.34,4.999,1.34c2.064,0,4.121-0.638,5.863-1.898l82.11-59.417 c1.141-0.826,2.094-1.882,2.798-3.102l126.134-218.469C511.976,202.712,512.969,195.179,511.036,187.967z M303.58,460.864 l6.524-63.242l44.982,25.971L303.58,460.864z M369.789,408.988L315.4,377.587l95.086-164.693l54.389,31.4L369.789,408.988z M490.923,199.178l-16.048,27.797l-54.389-31.4l16.048-27.797c2.193-3.797,7.065-5.103,10.864-2.912l40.613,23.449 c1.84,1.063,3.156,2.777,3.706,4.829C492.267,195.196,491.985,197.339,490.923,199.178z" />
  </svg>
);

import SwiperCore, {
  Navigation,
  Thumbs,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Thumbs]);

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { updateDetected: false };
  }
  render() {
    const currentSlides = this.props.slides;

    const customProps = {
      slidesPerView: this.props.slidesPerView,
      spaceBetween: this.props.spaceBetween,
      initialSlide: this.props.initialSlide,
      initialSlide: this.props.initialSlide,
      speed: this.props.speed,
      loop: this.props.wrapAround,
      simulateTouch: this.props.draggable,
      ...(this.props.paginationType !== "none" && {
        pagination: {
          clickable: true,
          type: this.props.paginationType,
        },
      }),
      ...(this.props.autoplay > 0 && {
        autoplay: {
          delay: this.props.autoplay * 1000,
          disableOnInteraction: false,
        },
      }),
      ...(this.props.showThumbnails && {
        thumbs: { swiper: this.props.thumbSwiper },
      }),
      effect: this.props.transition,
    };

    return (
      <Swiper
        navigation={this.props.useNavigation}
        {...customProps}
        onSlideChange={() => {
          if (this.swiper) {
            this.props.setActiveSlide(this.swiper.realIndex);
          }
        }}
        onSwiper={(swiper) => (this.swiper = swiper)}
      >
        {currentSlides.map(
          (slide) => slide && <SwiperSlide>{slide}</SwiperSlide>
        )}
      </Swiper>
    );
  }
}

export class NewImageSlider extends Component {
  constructor(props) {
    super(props);

    this.state = { componentKey: 0, activeSlide: 0, thumbSwiper: null };
  }

  componentDidMount() {
    const {
      attributes: {
        images,
        pics,
        captions,
        showPageDots,
        usePagination,
        paginationType,
        blockID,
      },
      setAttributes,
      clientId,
    } = this.props;

    const { getBlock, getClientIdsWithDescendants } =
      select("core/block-editor") || select("core/editor");

    const { componentKey } = this.state;

    if (images && JSON.parse(images).length !== 0 && pics.length === 0) {
      setAttributes({
        pics: JSON.parse(images),
        images: "[]",
        descriptions: JSON.parse(captions),
        captions: "[]",
      });
    }

    if (blockID === "") {
      setAttributes({ blockID: clientId });
    } else if (!showPageDots && usePagination) {
      setAttributes({ usePagination: false });
    }

    if (paginationType === "") {
      setAttributes({ paginationType: "bullets" });
    }

    if (paginationType !== "" && componentKey === 0) {
      this.setState({ componentKey: componentKey + 1 });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attributes.blockID !== this.props.clientId) {
      this.props.setAttributes({ blockID: this.props.clientId });
    }
  }
  render() {
    const {
      attributes: {
        pics,
        descriptions,
        wrapsAround,
        isDraggable,
        autoplays,
        autoplayDuration,
        sliderHeight,
        showPageDots,
        usePagination,
        paginationType,
        blockID,
        transition,
        slideShadows,
        rotate,
        stretch,
        depth,
        modifier,
        limitRotation,
        shadow,
        shadowOffset,
        shadowScale,
        showThumbnails,
        slidesPerView,
        spaceBetween,
        useNavigation,
        align,
        speed,
      },
      setAttributes,
      isSelected,
    } = this.props;

    const { componentKey, activeSlide, thumbSwiper } = this.state;

    const imageArray = pics;
    const captionArray = descriptions;
    const styles = getStyles(this.props.attributes);
    return [
      <BlockControls>
        <BlockAlignmentToolbar
          value={align}
          controls={["full", "wide"]}
          onChange={(newAlign) => setAttributes({ align: newAlign })}
        />
        {imageArray.length > 0 && (
          <ToolbarGroup>
            <MediaUpload
              value={imageArray.map((img) => img.id)}
              allowedTypes={["image"]}
              multiple
              gallery
              render={({ open }) => (
                <ToolbarButton
                  icon={editGallery}
                  onClick={open}
                  label={__("Edit selection")}
                />
              )}
              onSelect={(newImages) => {
                const newCaptionArray = newImages.map((img) =>
                  captionArray.find((c) => c.id === img.id)
                    ? captionArray.find((c) => c.id === img.id)
                    : {
                        text: img.caption,
                        link: "",
                        id: img.id,
                      }
                );

                setAttributes({
                  pics: newImages,
                  descriptions: newCaptionArray,
                });
              }}
            />
          </ToolbarGroup>
        )}
      </BlockControls>,
      isSelected && imageArray.length > 0 && (
        <Fragment>
          <InspectorControlsStylesTab>
            <PanelBody title={"Slider Settings"} initialOpen={true}>
              <SelectControl
                label={__("Transition")}
                value={transition}
                options={["slide", "fade", "cube", "coverflow", "flip"].map(
                  (o) => ({
                    label: __(o),
                    value: o,
                  })
                )}
                onChange={(transition) => {
                  setAttributes({ transition });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              {["cube", "coverflow", "flip"].includes(transition) && (
                <ToggleControl
                  label={__("Enable slide shadows")}
                  checked={slideShadows}
                  onChange={() => {
                    setAttributes({
                      slideShadows: !slideShadows,
                    });
                    this.setState({
                      componentKey: componentKey + 1,
                    });
                  }}
                />
              )}
              {transition === "coverflow" && (
                <>
                  <RangeControl
                    label={__("Slide rotation")}
                    value={rotate}
                    onChange={(rotate) => {
                      setAttributes({ rotate });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={0}
                    max={180} //change if this proves to be excessive
                  />
                  <RangeControl
                    label={__("Stretch space")}
                    value={stretch}
                    onChange={(stretch) => {
                      setAttributes({ stretch });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={0}
                    max={180} //change if this proves to be excessive
                  />
                  <RangeControl
                    label={__("Depth offset")}
                    value={depth}
                    onChange={(depth) => {
                      setAttributes({ depth });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={0}
                    max={200}
                  />
                  <RangeControl
                    label={__("Effect multiplier")}
                    value={modifier}
                    onChange={(modifier) => {
                      setAttributes({ modifier });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={0}
                    max={3} //change if this proves to be excessive
                    step={0.05}
                  />
                </>
              )}
              {transition === "cube" && (
                <>
                  <ToggleControl
                    label={__("Enable main slider shadow")}
                    checked={shadow}
                    onChange={() => {
                      setAttributes({ shadow: !shadow });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                  />
                  <RangeControl
                    label={__("Shadow offset")}
                    value={shadowOffset}
                    onChange={(shadowOffset) => {
                      setAttributes({ shadowOffset });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={1}
                    max={100}
                  />
                  <RangeControl
                    label={__("Shadow scale")}
                    value={shadowScale}
                    onChange={(shadowScale) => {
                      setAttributes({ shadowScale });
                      this.setState({
                        componentKey: componentKey + 1,
                      });
                    }}
                    min={0}
                    max={2}
                    scale={0.01}
                  />
                </>
              )}
              {transition === "flip" && (
                <ToggleControl
                  label={__("Limit rotation")}
                  checked={limitRotation}
                  onChange={() => {
                    setAttributes({
                      limitRotation: !limitRotation,
                    });
                    this.setState({
                      componentKey: componentKey + 1,
                    });
                  }}
                />
              )}
              {autoplays && (
                <RangeControl
                  label={__("Autoplay duration (seconds)")}
                  value={autoplayDuration}
                  onChange={(value) => {
                    setAttributes({
                      autoplayDuration: value,
                    });
                    this.setState({
                      componentKey: componentKey + 1,
                    });
                  }}
                  min={1}
                  max={10}
                />
              )}
              <RangeControl
                label={__("Height")}
                value={sliderHeight}
                onChange={(newHeight) => {
                  setAttributes({ sliderHeight: newHeight });
                  this.setState({
                    componentKey: componentKey + 1,
                  }); //ensure proper placement of arrows and page dots
                }}
                min={200}
                max={500}
              />
            </PanelBody>
            <PanelBody
              title={__("Dimension Settings", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <SpacingControl
                showByDefault
                attrKey="padding"
                label={__("Padding", "ultimate-blocks-pro")}
              />
              <SpacingControl
                minimumCustomValue={-Infinity}
                showByDefault
                attrKey="margin"
                label={__("Margin", "ultimate-blocks-pro")}
              />
            </PanelBody>
          </InspectorControlsStylesTab>
          <InspectorControls>
            <PanelBody title={__("Slider Settings")} initialOpen={true}>
              <RangeControl
                min={1}
                max={6}
                allowReset
                value={slidesPerView}
                resetFallbackValue={1}
                label={__("Slides Per View", "ultimate-blocks-pro")}
                onChange={(newValue) =>
                  setAttributes({ slidesPerView: newValue })
                }
              />
              <RangeControl
                min={0}
                max={500}
                allowReset
                value={spaceBetween}
                resetFallbackValue={20}
                label={__("Space Between", "ultimate-blocks-pro")}
                onChange={(newValue) =>
                  setAttributes({ spaceBetween: newValue })
                }
              />
              <RangeControl
                min={50}
                max={5000}
                allowReset
                value={speed}
                step={50}
                resetFallbackValue={300}
                label={__("Speed", "ultimate-blocks-pro")}
                onChange={(newValue) => setAttributes({ speed: newValue })}
              />
              <ToggleControl
                label={__("Wrap around")}
                checked={wrapsAround}
                onChange={() => {
                  setAttributes({
                    wrapsAround: !wrapsAround,
                  });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              <ToggleControl
                label={__("Allow dragging")}
                checked={isDraggable}
                onChange={() => {
                  setAttributes({
                    isDraggable: !isDraggable,
                  });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              <ToggleControl
                label={__("Use Navigation Arrows", "ultimate-blocks-pro")}
                checked={useNavigation}
                onChange={() => {
                  setAttributes({
                    useNavigation: !useNavigation,
                  });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              <ToggleControl
                label={__("Use pagination")}
                checked={usePagination}
                onChange={() => {
                  setAttributes({
                    usePagination: !usePagination,
                  });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              {usePagination && (
                <SelectControl
                  label={__("Pagination type")}
                  value={paginationType}
                  options={["bullets", "fraction", "progressbar"].map((o) => ({
                    label: __(o),
                    value: o,
                  }))}
                  onChange={(paginationType) => {
                    setAttributes({ paginationType });
                    this.setState({
                      componentKey: componentKey + 1,
                    });
                  }}
                />
              )}
              <ToggleControl
                label={__("Enable autoplay")}
                checked={autoplays}
                onChange={() => {
                  setAttributes({ autoplays: !autoplays });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
              <ToggleControl
                label={__("Show image thumbnails")}
                checked={showThumbnails}
                onChange={() => {
                  setAttributes({
                    showThumbnails: !showThumbnails,
                  });
                  this.setState({
                    componentKey: componentKey + 1,
                  });
                }}
              />
            </PanelBody>
          </InspectorControls>
          <InspectorControls group="color">
            <ColorSettings
              attrKey="navigationColor"
              label={__("Navigation Color", "ultimate-blocks")}
            />
            <ColorSettings
              attrKey="paginationColor"
              label={__("Inactive Pagination Color", "ultimate-blocks")}
            />
            <ColorSettings
              attrKey="activePaginationColor"
              label={__("Active Pagination Color", "ultimate-blocks")}
            />
            <ColorSettingsWithGradient
              attrBackgroundKey="navigationBackgroundColor"
              attrGradientKey="navigationGradientColor"
              label={__("Navigation Background", "ultimate-blocks")}
            />
          </InspectorControls>
        </Fragment>
      ),

      <div
        id={`ub_image_slider_${blockID}`}
        className={"ub_image_slider"}
        style={{
          minHeight: `${20 + (imageArray.length ? sliderHeight : 200)}px`,
          ...styles,
        }}
      >
        {imageArray.length === 0 ? (
          <MediaPlaceholder
            onSelect={(newImages) =>
              setAttributes({
                pics: newImages,
                descriptions: newImages.map((img) => ({
                  id: img.id,
                  text: img.caption,
                  link: "",
                })),
              })
            }
            labels={{ title: "Image Slider" }}
            allowedTypes={["image"]}
            multiple
          />
        ) : (
          <>
            <Slider
              key={componentKey}
              setActiveSlide={(val) => {
                if (val !== activeSlide)
                  //needed to prevent infinite loop
                  this.setState({ activeSlide: val });
              }}
              initialSlide={activeSlide}
              draggable={isDraggable}
              pageDots={showPageDots}
              useNavigation={useNavigation}
              paginationType={usePagination ? paginationType : "none"}
              autoplay={autoplays ? autoplayDuration : 0}
              transition={transition}
              wrapAround={wrapsAround}
              speed={speed}
              showThumbnails={showThumbnails}
              thumbSwiper={thumbSwiper}
              slidesPerView={slidesPerView}
              spaceBetween={spaceBetween}
              slides={[
                ...imageArray.map((c, i) => (
                  <figure>
                    <img
                      key={i}
                      src={c.url}
                      style={{
                        height: `${sliderHeight}px`,
                      }}
                    />
                  </figure>
                )),
                isSelected && (
                  <div
                    className="ub_image_slider_extra"
                    style={{
                      height: `${sliderHeight + 30}px`,
                    }}
                  >
                    <FormFileUpload
                      multiple
                      isLarge
                      onChange={(event) =>
                        mediaUpload({
                          allowedTypes: ["image"],
                          filesList: event.target.files,
                          onFileChange: (images) =>
                            setAttributes({
                              pics: imageArray.concat(images),
                              descriptions: captionArray.concat(
                                images.map((img) => ({
                                  id: img.id,
                                  text: img.text,
                                  link: "",
                                }))
                              ),
                            }),
                        })
                      }
                      className="ub_image_slider_add_images"
                      accept="image/*"
                      icon="insert"
                    >
                      {__("Upload an image")}
                    </FormFileUpload>
                  </div>
                ),
              ]}
            />
            {activeSlide < captionArray.length && (
              <>
                <RichText
                  tagName="figcaption"
                  allowedFormats={[]}
                  className="ub_image_slider_image_caption"
                  value={descriptions[activeSlide].text}
                  placeholder={__("Caption goes here")}
                  onChange={(text) => {
                    const currentItem = Object.assign(
                      {},
                      descriptions[activeSlide]
                    );

                    setAttributes({
                      descriptions: [
                        ...descriptions.slice(0, activeSlide),
                        Object.assign(currentItem, {
                          text,
                        }),
                        ...descriptions.slice(activeSlide + 1),
                      ],
                    });
                  }}
                />
                <RichText
                  allowedFormats={[]}
                  className="ub_image_slider_image_caption ub_image_slider_image_alt"
                  value={pics[activeSlide].alt}
                  placeholder={__("Image alt text")}
                  onChange={(alt) =>
                    setAttributes({
                      pics: [
                        ...pics.slice(0, activeSlide),
                        Object.assign(pics[activeSlide], { alt }),
                        ...pics.slice(activeSlide + 1),
                      ],
                    })
                  }
                />
              </>
            )}
            {isSelected && activeSlide < captionArray.length && (
              <form
                onSubmit={(event) => event.preventDefault()}
                className={`editor-format-toolbar__link-modal-line ub_image_slider_url_input flex-container`}
              >
                <div className="ub-icon-holder">
                  <Icon icon="admin-links" />
                </div>
                <URLInput
                  autoFocus={false}
                  className="button-url"
                  value={captionArray[activeSlide].link}
                  onChange={(link) => {
                    const currentItem = Object.assign(
                      {},
                      captionArray[activeSlide]
                    );

                    setAttributes({
                      descriptions: [
                        ...descriptions.slice(0, activeSlide),
                        Object.assign(currentItem, {
                          link,
                        }),
                        ...descriptions.slice(activeSlide + 1),
                      ],
                    });
                  }}
                />
                <Button
                  icon={"editor-break"}
                  label={__("Apply")}
                  type={"submit"}
                />
              </form>
            )}
            {showThumbnails && (
              <Swiper
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                watchSlidesVisibility={true}
                onDestroy={() => this.setState({ thumbSwiper: null })}
                onSwiper={(e) => this.setState({ thumbSwiper: e })}
              >
                {imageArray.map((c, i) => (
                  <SwiperSlide>
                    <img
                      key={i}
                      src={c.url}
                      style={{
                        height: `${50}px`,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </>
        )}
      </div>,
    ];
  }
}
