import { get } from "lodash";
import { isEmpty } from "lodash";
import Inspector from "./inspector";
import { __ } from "@wordpress/i18n";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useEffect, render, unmountComponentAtNode } from "@wordpress/element";

function NewAdvancedVideo(props) {
  const {
    attributes: {
      channelId,
      channelDetails,
      showChannelDetails,
      videoSource,
      videoEmbedCode,
    },
    setAttributes,
    BlockEdit,
  } = props;
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
    ).then((response) =>
      response
        .json()
        .then((data) =>
          setAttributes({ channelDetails: get(data, "items.0", {}) })
        )
        .catch((error) => console.error(error))
    );
  }, [channelId]);

  const channelThumbnail = channelDetails?.snippet?.thumbnails?.default?.url;
  const channelTitle = channelDetails?.snippet?.title;

  useEffect(() => {
    const mainDocument =
      document?.querySelector(".edit-site-visual-editor__editor-canvas")
        ?.contentDocument ?? document;

    const youtubeContainer = mainDocument.querySelector(
      `#block-${props.clientId} .ub-advanced-video-container`
    );
    const channelDetailsContainer = document.createElement("div");
    channelDetailsContainer.classList.add("ub-advanced-video-channel-details");
    if (
      showChannelDetails &&
      !isEmpty(videoEmbedCode) &&
      videoSource === "youtube"
    ) {
      render(
        <>
          <div className="ub-advanced-video-channel-content-wrapper">
            <div className="ub-advanced-video-thumbnail-wrapper">
              <img
                src={channelThumbnail}
                className="ub-advanced-video-thumbnail"
              />
            </div>
            <div className="ub-advanced-video-title-wrapper">
              <p className="ub-advanced-video-title">{channelTitle}</p>
            </div>
          </div>
          <div className="ub-advanced-video-channel-subscribe">
            <button className="ub-advanced-video-channel-subscribe-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox={`0, 0, ${faYoutube.icon[0]},  ${faYoutube.icon[1]}`}
              >
                <path fill="currentColor" d={faYoutube.icon[4]} />
              </svg>
              <span>{__("Subscribe", "ultimate-blocks-pro")}</span>
            </button>
          </div>
        </>,
        channelDetailsContainer
      );
    }
    youtubeContainer?.appendChild(channelDetailsContainer);
    // Clean up the component when it's unmounted
    return () => {
      if (channelDetailsContainer) {
        unmountComponentAtNode(channelDetailsContainer);
        channelDetailsContainer.remove();
      }
    };
  }, [showChannelDetails, videoEmbedCode, videoSource]);

  return (
    <>
      <BlockEdit {...props} />
      <Inspector {...props} />
    </>
  );
}
export default NewAdvancedVideo;
