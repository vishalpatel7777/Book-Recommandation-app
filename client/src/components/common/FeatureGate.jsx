import { useFeatureFlagsLive } from "../../hooks/useCmsLive";

export default function FeatureGate({ flag, children, fallback = null }) {
  const flags = useFeatureFlagsLive();
  if (flags === null) return null; // loading
  if (flags[flag] === false) return fallback;
  return children;
}
