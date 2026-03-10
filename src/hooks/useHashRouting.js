import { useState, useEffect, useCallback } from "react";
import { steps } from "../constants/steps";

const hashMap = steps.reduce((acc, s, i) => {
  acc[s.hash] = i;
  return acc;
}, {});

function getStepFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hashMap[hash] ?? 0;
}

export default function useHashRouting() {
  const [activeStep, setActiveStep] = useState(getStepFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveStep(getStepFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goToStep = useCallback((stepIndex) => {
    setActiveStep(stepIndex);
    window.location.hash = steps[stepIndex].hash;
  }, []);

  return [activeStep, goToStep];
}
