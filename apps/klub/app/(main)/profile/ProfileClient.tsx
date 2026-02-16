"use client";

import { useState } from "react";
import { Instagram, FileText, MessageSquare, Heart, GraduationCap, Upload, Loader2 } from "lucide-react";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { BadgeShowcase } from "@/components/gamification/BadgeShowcase";
import toast from "react-hot-toast";

const activityLabels: Record<string, string> = {
  POST_CREATED: "Nowy post",
  COMMENT_CREATED: "Komentarz",
  LIKE_RECEIVED: "Otrzymano polubienie",
  LIKE_GIVEN: "Polubienie",
  LESSON_COMPLETED: "Lekcja ukonczona",
  MODULE_COMPLETED: "Modul ukonczony",
  COURSE_COMPLETED: "Kurs ukonczony",
  REEL_SAVED: "Zapisano reelsa",
  DAILY_LOGIN: "Logowanie",
  BADGE_EARNED: "Nowa odznaka",
  CHALLENGE_COMPLETED: "Wyzwanie ukonczone",
  MILESTONE_LIKES: "Kamien milowy",
  ENGAGEMENT_BONUS: "Bonus zaangazowania",
};

interface ProfileClientProps {
  profile: any;
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [uploading, setUploading] = useState(false);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          bio: form.get("bio"),
          instagramHandle: form.get("instagramHandle"),
          avatar,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          window.location.reload();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Moj Profil</h1>

      {/* Level + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <LevelProgress level={profile.level} points={profile.points} />
        </div>
        <StreakCounter streak={profile.streak} longestStreak={profile.longestStreak} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <FileText className="h-5 w-5 text-blue-400 mx-auto" />
          <p className="text-xl font-bold text-white mt-1">{profile.totalPosts}</p>
          <p className="text-xs text-slate-500">Postow</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <MessageSquare className="h-5 w-5 text-green-400 mx-auto" />
          <p className="text-xl font-bold text-white mt-1">{profile.totalComments}</p>
          <p className="text-xs text-slate-500">Komentarzy</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <Heart className="h-5 w-5 text-red-400 mx-auto" />
          <p className="text-xl font-bold text-white mt-1">{profile.totalLikes}</p>
          <p className="text-xs text-slate-500">Polubien</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <GraduationCap className="h-5 w-5 text-purple-400 mx-auto" />
          <p className="text-xl font-bold text-white mt-1">{profile.completedCourses}</p>
          <p className="text-xs text-slate-500">Kursow</p>
        </div>
      </div>

      {/* Badges showcase */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <BadgeShowcase badges={profile.badges} totalBadges={profile.totalBadgesCount} />
      </div>

      {/* Recent activity */}
      {profile.activityLogs.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Ostatnia aktywnosc</h3>
          <div className="space-y-2">
            {profile.activityLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {activityLabels[log.type] || log.type}
                </span>
                <div className="flex items-center gap-3">
                  {log.pointsEarned > 0 && (
                    <span className="text-xs text-orange-400 font-medium">+{log.pointsEarned} pkt</span>
                  )}
                  <span className="text-xs text-slate-600">
                    {new Date(log.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit form */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Edytuj profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-xl text-slate-400">{profile.name?.[0] || profile.username?.[0] || "?"}</span>
                </div>
              )}
              <label className="flex-1">
                <div className="flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-slate-300 hover:border-orange-500 cursor-pointer transition-colors">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Przesyłanie...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Zmień avatar</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG lub GIF. Max 5MB.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              defaultValue={profile.username}
              disabled
              className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Username nie mozna zmienic</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Imie</label>
            <input
              type="text"
              name="name"
              defaultValue={profile.name || ""}
              className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={profile.bio || ""}
              placeholder="Opowiedz cos o sobie..."
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Instagram handle</label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                name="instagramHandle"
                defaultValue={profile.instagramHandle || ""}
                placeholder="twoj_handle"
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {saving ? "Zapisywanie..." : saved ? "Zapisano!" : "Zapisz zmiany"}
          </button>
        </form>
      </div>
    </div>
  );
}
