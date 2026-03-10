import "./App.css";
import useHashRouting from "./hooks/useHashRouting";
import useKeyboardNav from "./hooks/useKeyboardNav";
import StepNav from "./components/layout/StepNav";
import StepShell from "./components/layout/StepShell";
import ProblemView from "./components/steps/ProblemView";
import TrainTokenizerView from "./components/steps/TrainTokenizerView";
import MergeView from "./components/steps/MergeView";
import EmbeddingView from "./components/steps/EmbeddingView";
import ResultView from "./components/steps/ResultView";

const views = [ProblemView, TrainTokenizerView, MergeView, EmbeddingView, ResultView];

export default function TokenizerExplainer() {
  const [activeStep, goToStep] = useHashRouting();
  useKeyboardNav(activeStep, goToStep);

  const ActiveView = views[activeStep];

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto 32px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "#555",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          ALLaM Paper — Technical Deep Dive
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Tokenizer Expansion for Arabic LLMs
        </h1>
        <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
          How to teach an English-trained model to speak Arabic efficiently
        </p>
      </div>

      <StepNav activeStep={activeStep} goToStep={goToStep} />

      <StepShell activeStep={activeStep} goToStep={goToStep}>
        <ActiveView />
      </StepShell>
    </div>
  );
}
