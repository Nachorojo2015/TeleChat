import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageZoom = ({ width, height, url, alt, styles }) => {
  return (
    <Zoom>
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={styles}
      />
    </Zoom>
  )
}

export default ImageZoom