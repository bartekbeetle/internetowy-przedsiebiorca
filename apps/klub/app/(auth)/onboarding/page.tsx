"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Button } from "@repo/ui";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, title: "Jak się nazywasz?", subtitle: "Przedstaw się społeczności" },
  { id: 2, title: "Twoje zdjęcie", subtitle: "Dodaj avatar (opcjonalnie)" },
  { id: 3, title: "Kilka słów o sobie", subtitle: "Co robisz? Czym się interesujesz?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);

  const canProceed = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return true; // Avatar is optional
    if (step === 3) return true; // Bio is optional
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      toast.error("Wybierz plik graficzny");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksymalny rozmiar to 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setAvatar(url);
      toast.success("Avatar przesłany!");
    } catch {
      toast.error("Błąd przesyłania");
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar, bio }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Błąd zapisu");
      }

      // Update session
      await update({
        onboardingCompleted: true,
        name,
        avatar,
      });

      toast.success("Witaj w społeczności! 🎉");
      router.push("/feed");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-2 w-16 rounded-full transition-colors ${
                s.id <= step ? "bg-orange-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-brand-secondary rounded-xl p-6 border border-slate-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {STEPS[step - 1].title}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {STEPS[step - 1].subtitle}
                </p>
              </div>

              {/* Step Content */}
              {step === 1 && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Twoje imię lub pseudonim"
                    className="w-full h-12 px-4 rounded-lg border border-slate-700 bg-brand-primary text-white text-lg placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <p className="text-slate-500 text-xs mt-2">
                    Minimum 2 znaki. Możesz zmienić później.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col items-center">
                  {avatar ? (
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-700"
                      />
                      <button
                        onClick={() => setAvatar(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 rounded-full bg-slate-700 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-slate-600 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400" />
                          <span className="text-xs text-slate-400 mt-2">Dodaj zdjęcie</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <p className="text-slate-500 text-xs mt-4">
                    JPG, PNG lub GIF. Max 5MB.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Np. Tworzę faceless content na Instagramie. Szukam inspiracji i społeczności..."
                    className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-slate-700 bg-brand-primary text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength={300}
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-slate-500">Opcjonalne</span>
                    <span className="text-slate-500">{bio.length}/300</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Wstecz
            </button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : step === 3 ? (
                "Zakończ"
              ) : (
                <>
                  Dalej
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skip */}
        {step === 2 && (
          <button
            onClick={handleNext}
            className="block w-full text-center text-slate-500 text-sm mt-4 hover:text-slate-300"
          >
            Pomiń na razie
          </button>
        )}
      </div>
    </div>
  );
}
