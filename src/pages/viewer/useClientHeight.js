import { useLayoutEffect, useRef, useState } from "react";

export default function useClientHeight() {
  const [height, setHeight] = useState(0);

  const ref = useRef(null);

  useLayoutEffect(() => {
    const height = ref.current.offsetHeight;
    // style extracts the declared margin, but it's CSS value so it has "px" suffix
    // rather then being an integer, parseInt casts it
    const style = window.getComputedStyle
      ? getComputedStyle(ref.current, null)
      : ref.current.currentStyle;
    setHeight(
      height + parseInt(style.marginBottom) + parseInt(style.marginTop),
    );
  }, [ref.current]);

  return { height, ref };
}
