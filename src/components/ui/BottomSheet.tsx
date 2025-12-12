import { ReactNode, useEffect, useRef, useState } from 'react';
import { Sheet } from '@silk-hq/components';
import './BottomSheet.css';

export interface BottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  snapPoints?: string[]; // e.g., ['25vh', '50vh', '90vh']
  className?: string;
}

export function BottomSheet({
  isOpen,
  onOpenChange,
  children,
  className = '',
}: BottomSheetProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [restingOutside, setRestingOutside] = useState(false);
  const hasOpenedRef = useRef(false);

  // Programmatically trigger the sheet when isOpen changes
  useEffect(() => {
    if (isOpen && !hasOpenedRef.current && triggerRef.current) {
      hasOpenedRef.current = true;
      triggerRef.current.click();
    } else if (!isOpen) {
      hasOpenedRef.current = false;
    }
  }, [isOpen]);

  return (
    <Sheet.Root license="commercial">
      <Sheet.Trigger ref={triggerRef} style={{ display: 'none' }} />
      <Sheet.Portal>
        <Sheet.View
          className="BottomSheet-view"
          contentPlacement="bottom"
          tracks="bottom"
          swipeOvershoot={false}
          nativeEdgeSwipePrevention={true}
          enteringAnimationSettings={{
            easing: "spring",
            stiffness: 480,
            damping: 45,
            mass: 1.5,
          }}
          onTravelStatusChange={(status) => {
            setRestingOutside(status === "idleOutside");
            if (status === "idleOutside") {
              onOpenChange(false);
            }
          }}
        >
          <Sheet.Backdrop themeColorDimming="auto" />
          <Sheet.Content className={`BottomSheet-content ${className}`}>
            <div className="BottomSheet-handle" />
            <div className="BottomSheet-innerContent">{children}</div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

// Compound component pattern for trigger
BottomSheet.Trigger = Sheet.Trigger;

// Controlled version
export function useBottomSheet() {
  return {
    Root: Sheet.Root,
    Trigger: Sheet.Trigger,
    Portal: Sheet.Portal,
    View: Sheet.View,
    Backdrop: Sheet.Backdrop,
    Content: Sheet.Content,
    BleedingBackground: Sheet.BleedingBackground,
  };
}
