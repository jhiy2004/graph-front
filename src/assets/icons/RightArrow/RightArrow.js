import React from "react";

function RightArrow() {
  return (
    <svg
      width="81"
      height="40"
      viewBox="0 0 81 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        strokeWidth={2}
        x="0.5"
        y="0.5"
        width="44"
        height="39"
        fill="#D9D9D9"
        stroke="black"
      />
      <path
        d="M80.7071 21.7071C81.0976 21.3166 81.0976 20.6834 80.7071 20.2929L74.3431 13.9289C73.9526 13.5384 73.3195 13.5384 72.9289 13.9289C72.5384 14.3195 72.5384 14.9526 72.9289 15.3431L78.5858 21L72.9289 26.6569C72.5384 27.0474 72.5384 27.6805 72.9289 28.0711C73.3195 28.4616 73.9526 28.4616 74.3431 28.0711L80.7071 21.7071ZM25 21V22H80V21V20H25V21Z"
        fill="black"
      />
      <circle cx="22.5" cy="20.5" r="3.5" fill="black" />
    </svg>
  );
}

export default RightArrow;
