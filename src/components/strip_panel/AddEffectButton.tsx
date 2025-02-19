import React, { FC, RefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { uuid } from "short-uuid";
import { css } from "styled-components";
import { Plus } from "tabler-icons-react";

import { useClickOutside } from "@/components/keyframes_panel/useClickOutside";
import { ScriptEffect } from "@/core/types";
import { EffectPlugin } from "@/interfaces/plugins/CustomEffect";
import { userScriptMap } from "@/rendering/updateScriptEffect";
import {
  Button,
  DropdownMenu,
  iconProps,
  StyledContextMenuButton,
} from "@/riapp-ui/src";

export const AddEffectButton: FC<{
  onAddEffect: (effect: ScriptEffect) => void;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showThis, setShowThis] = React.useState(false);
  const { show, onMouseLeave, setShow } = useClickOutside(ref);

  let pkgs: (EffectPlugin & { assetId: string })[] = [];
  for (const [assetId, ep] of userScriptMap.entries()) {
    if (!ep.pkg) continue;
    pkgs.push({
      ...ep,
      assetId,
    });
  }

  useEffect(() => {
    setShowThis(pkgs.length > 0);
  }, [pkgs.length]);

  const handleClick = (pkg: EffectPlugin & { assetId: string }) => {
    setShow(false);
    props.onAddEffect({
      id: uuid(),
      scriptAssetId: pkg.assetId,
      keyframes: [],
      type: "script",
      ...pkg.defaultEffect,
    } as ScriptEffect);
  };

  if (!showThis) return null;

  return (
    <div
      ref={ref}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Button
        onClick={() => setShow((v) => !v)}
        css={css`
          display: flex !important;
        `}
      >
        <Plus {...iconProps}></Plus>
        <div>add effects</div>
      </Button>
      {show &&
        createPortal(
          <DropdownMenu2 targetRef={ref}>
            {pkgs.map((pkg, i) => {
              return (
                <StyledContextMenuButton
                  onClick={() => handleClick(pkg)}
                  key={i}
                >
                  {pkg.pkg?.name}
                </StyledContextMenuButton>
              );
            })}
          </DropdownMenu2>,
          document.body
        )}
    </div>
  );
};

function DropdownMenu2(props: {
  targetRef: RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const el = props.targetRef.current;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return (
    <DropdownMenu
      style={{ position: "absolute", top: rect.bottom, left: rect.left }}
    >
      {props.children}
    </DropdownMenu>
  );
}
