"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowRight, CheckCircle2, Users, GraduationCap, Heart } from "lucide-react";

const roles = [
  { value: "family", label: "Family", icon: Heart, desc: "I am a parent or guardian supporting my child's learning." },
  { value: "educator", label: "Educator", icon: GraduationCap, desc: "I am a teacher, tutor, or education professional." },
  { value: "both", label: "Both", icon: Users, desc: "I am both a parent and an educator." },
];

const methodologies = [
  "Homeschool",
  "Hybrid",
  "After-school supplement",
  "Unschooling",
  "Charter / microschool",
  "Co-op / pod",
  "Tutoring-focused",
];

const gradeLevels = [
  "Pre-K",
  "Elementary (K-5)",
  "Middle (6-8)",
  "High school (9-12)",
];

const subjects = [
  "Math",
  "Reading / ELA",
  "Science",
  "History / Social Studies",
  "Art / Music",
  "Coding / Tech",
  "World Languages",
  "Physical Education",
];

const intents = [
  "Community and support",
  "Curriculum and resources",
  "Finding a tutor",
  "Getting my child on track",
  "Supporting other families",
  "Learning about Remix Academics",
  "Exploring Mixtape360",
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState("family");
  const [selectedMethodologies, setSelectedMethodologies] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("You must be signed in to complete onboarding.");
      return;
    }

    const { error } = await supabase.from("seat_profiles").upsert({
      id: user.id,
      display_name: displayName || user.email?.split("@")[0] || "Member",
      role,
      methodology_tags: selectedMethodologies,
      grade_levels: selectedGrades,
      subject_tags: selectedSubjects,
      intent_tags: selectedIntents,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-black tracking-[-0.04em]">
            Welcome to the SEAT Squad
          </h1>
          <p className="mt-2 text-muted-foreground">
            A few quick questions so we can tailor your experience.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-black">What describes you best?</h2>
            <div className="grid gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`group relative flex items-start gap-4 rounded-xl border p-5 text-left transition ${
                      isSelected
                        ? "border-2 border-primary bg-primary/20 shadow-md"
                        : "border border-border bg-card hover:border-primary/60"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-3 top-3">
                        <CheckCircle2 size={20} className="text-primary" />
                      </span>
                    )}
                    <span className={`rounded-lg p-2 ${isSelected ? "bg-primary/30" : "bg-surface-high"}`}>
                      <Icon size={22} className={isSelected ? "text-primary" : "text-foreground/60"} />
                    </span>
                    <div>
                      <p className="font-display text-lg font-black">{r.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px]"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Learning Context */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-black">Your learning context</h2>
              <p className="text-sm text-muted-foreground">Select all that apply to your family.</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold">Methodology</p>
              <div className="flex flex-wrap gap-2">
                {methodologies.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleSelection(m, selectedMethodologies, setSelectedMethodologies)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      selectedMethodologies.includes(m)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/60"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold">Grade Levels</p>
              <div className="flex flex-wrap gap-2">
                {gradeLevels.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleSelection(g, selectedGrades, setSelectedGrades)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      selectedGrades.includes(g)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/60"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold">Subjects of Interest</p>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSelection(s, selectedSubjects, setSelectedSubjects)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      selectedSubjects.includes(s)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm font-bold transition hover:border-primary/60"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex flex-[2] items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px]"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Intent + Display Name */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-black">What brings you here?</h2>
              <p className="text-sm text-muted-foreground">Select all that apply.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {intents.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleSelection(i, selectedIntents, setSelectedIntents)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    selectedIntents.includes(i)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/60"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm font-bold transition hover:border-primary/60"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex flex-[2] items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete <CheckCircle2 size={16} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
