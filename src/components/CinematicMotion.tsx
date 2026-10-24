import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { createCinematicMotion } from "@/lib/cinematic-motion";

/** One scoped lifecycle per route, including navigation between fragrance slugs. */
export function CinematicMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useLayoutEffect(() => {
    if (!scope.current) return;
    return createCinematicMotion(scope.current);
  }, [pathname]);

  return <div ref={scope}>{children}</div>;
}
