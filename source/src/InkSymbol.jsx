import React from 'react';

export default function InkSymbol({ kind = 'star' }) {
  return <svg className={`ink-symbol ink-symbol-${kind}`} viewBox="0 0 32 32" aria-hidden="true">
    {kind === 'film' ? <>
      <path d="m5 11 22-5-2-5L3 6Zm0 1h23l-1 17H5Zm3-7 4 4m4-6 4 4m4-6 3 3" />
      <path d="m13 16 7 5-7 4Z" />
    </> : kind === 'arrow' ? <>
      <path d="M3 16c8-3 17 3 26 0M8 10l-6 6 6 5m15-11 7 6-7 6" />
    </> : <path d="m16 2 1 28M3 9l26 14M3 23 26 9M6 4l20 24M6 28 20 4" />}
  </svg>;
}
