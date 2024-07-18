import { useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

export default function useClientHeight() {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  const { height: bbh } = useResizeObserver({ ref });

  useLayoutEffect(() => {
    // style extracts the declared margin, but it's CSS value so it has "px" suffix
    // rather then being an integer, parseInt casts it
    const style = window.getComputedStyle
      ? getComputedStyle(ref.current, null)
      : ref.current.currentStyle;
    setHeight(bbh + parseInt(style.marginBottom) + parseInt(style.marginTop));
  }, [bbh]);

  return { height, ref };
}
