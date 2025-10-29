 import * as React from "react";
 import { css } from "@emotion/react";

 export default function PrimaryButton({ children, ...props }) {
  return (
    <button
      css={css`
        padding:.75rem 1rem; border:none; border-radius:.75rem;
        font-weight:700; background:#f2b705; color:#14120a; cursor:pointer;
        box-shadow:0 6px 18px rgba(0,0,0,.15);
        transition:transform .06s ease, box-shadow .2s ease, filter .2s;
        &:hover{filter:brightness(1.05); box-shadow:0 8px 22px rgba(0,0,0,.22)}
        &:active{transform:translateY(1px)}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
