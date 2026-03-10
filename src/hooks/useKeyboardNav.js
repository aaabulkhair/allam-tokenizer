import { useEffect } from "react";
import { steps } from "../constants/steps";

export default function useKeyboardNav(activeStep, goToStep) {
  useEffect(() => {
    const handler = (e) => {
      // Don't navigate if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToStep(Math.min(steps.length - 1, activeStep + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToStep(Math.max(0, activeStep - 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeStep, goToStep]);
}
