import { AlertCircle, ShieldCheck } from "lucide-react";

const challengeRules = [
  "Accepting the offer reserves the challenge amount from your balance.",
  "The challenge remains active for the selected duration.",
  "Players must follow the match rules before the challenge can continue.",
];

export default function ChallengeRulesPanel() {
  return (
    <section className="mt-7 rounded-[16px] border border-[#ff2ec8]/18 bg-black/35 p-4">
      <h2 className="flex items-center gap-2 text-2xl font-black text-[#e748ff]">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff2ec8] text-white shadow-[0_0_14px_rgba(255,46,200,0.65)]">
          <AlertCircle className="h-5 w-5" />
        </span>
        Rules
      </h2>
      <div className="mt-4 space-y-3">
        {challengeRules.map((rule) => (
          <p
            key={rule}
            className="flex items-start gap-2 text-sm leading-5 text-white/68"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#60ff4d]" />
            <span>{rule}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
