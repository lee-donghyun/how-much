import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { CSSProperties, FC, useEffect, useState } from "react";
import Portal from "../Portal";

const styles: {
  [name: string]: CSSProperties;
} = {
  backdrop: {
    zIndex: 51,
    pointerEvents: "none",
    position: "fixed",
    inset: 0,
    transition: "all 0.3s ",
  },
  delayed: {
    background: "rgba(0,0,0,0.7)",
    cursor: "pointer",
    pointerEvents: "auto",
  },
  sheet: {
    position: "fixed",
    transition: "all 0.3s ",
    left: 0,
    right: 0,
    background: "white",
    cursor: "default",
  },
};

const BottomSheet: FC<{
  open: boolean;
  onClose: () => any;
  onClosed?: () => any;
  inset?: number;
}> = ({ open, onClose, onClosed, inset = 100, children }) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (open) {
      const body = document.getElementById("root") as HTMLDivElement;
      disableBodyScroll(body);
      return () => {
        enableBodyScroll(body);
      };
    }
  }, [open]);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDelayed(open);
      },
      open ? 10 : 310
    );
    return () => {
      clearTimeout(timer);
    };
  }, [open]);
  useEffect(() => {
    if (!open && !delayed) {
      onClosed?.();
    }
  }, [delayed, open]);

  if (!delayed && !open) {
    return <></>;
  }
  return (
    <Portal>
      <div
        style={{
          ...styles.backdrop,
          ...(delayed && open && styles.delayed),
        }}
        onClick={(e) => {
          e.target === e.currentTarget && onClose();
        }}
      >
        <div
          style={{
            ...styles.sheet,
            bottom: open && delayed ? 0 : `-${inset}vh`,
          }}
        >
          <div
            style={{
              position: "relative",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default BottomSheet;
