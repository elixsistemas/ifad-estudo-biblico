import * as React from "react";
import styled from "styled-components";

const Btn = styled.button`
  background: var(--brand);
  color: var(--brand-ink);
  border: 0;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .12s ease, filter .12s ease;
  &:hover { filter: brightness(1.05); transform: translateY(-1px); }
  &.outline { background: transparent; border: 1px solid var(--brand); color: var(--fg); }
`;

export default function PrimaryButton(props){ return <Btn {...props} />; }
