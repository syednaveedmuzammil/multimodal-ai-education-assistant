import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Save,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import {
  getProfile,
  updateProfile,
} from "@/services/profileService";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";


const INITIAL_FORM = {
  bio: "",
  education_level: "",
  institution: "",
  field_of_study: "",
  learning_goals: "",
  preferred_learning_style: "",
};


export default function Profile() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  /*
   * ==========================================================
   * Load Profile
   * ==========================================================
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);

        const profile = await getProfile();

        setFormData({
          bio: profile.bio ?? "",
          education_level:
            profile.education_level ?? "",
          institution:
            profile.institution ?? "",
          field_of_study:
            profile.field_of_study ?? "",
          learning_goals:
            profile.learning_goals ?? "",
          preferred_learning_style:
            profile.preferred_learning_style ?? "",
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.detail ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authLoading]);


  /*
   * ==========================================================
   * Handle Input
   * ==========================================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /*
   * ==========================================================
   * Save Profile
   * ==========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const updatedProfile =
        await updateProfile({
          bio: formData.bio || null,
          education_level:
            formData.education_level || null,
          institution:
            formData.institution || null,
          field_of_study:
            formData.field_of_study || null,
          learning_goals:
            formData.learning_goals || null,
          preferred_learning_style:
            formData.preferred_learning_style ||
            null,
        });

      setFormData({
        bio: updatedProfile.bio ?? "",
        education_level:
          updatedProfile.education_level ?? "",
        institution:
          updatedProfile.institution ?? "",
        field_of_study:
          updatedProfile.field_of_study ?? "",
        learning_goals:
          updatedProfile.learning_goals ?? "",
        preferred_learning_style:
          updatedProfile.preferred_learning_style ??
          "",
      });

      toast.success(
        "Profile updated successfully."
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };


  /*
   * ==========================================================
   * Loading State
   * ==========================================================
   */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">
          Loading profile...
        </p>
      </div>
    );
  }


  /*
   * ==========================================================
   * Profile Page
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-background text-white px-4 py-8 sm:px-6 lg:px-8">

      <div className="max-w-4xl mx-auto">

        {/* ====================================================
            Header
            ==================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">

              <User
                size={22}
                className="text-primary"
              />

            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold">
                My Profile
              </h1>

              <p className="text-muted text-sm">
                Manage your learning profile and
                personalization preferences.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            Account Information
            ==================================================== */}

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">

              <User
                size={20}
                className="text-primary"
              />

            </div>

            <div>

              <h2 className="font-semibold text-lg">
                Account Information
              </h2>

              <p className="text-sm text-muted">
                Your registered account details.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm text-muted mb-1">
                Name
              </label>

              <div className="px-4 py-3 rounded-lg bg-background border border-border">
                {user?.name || "—"}
              </div>

            </div>


            <div>

              <label className="block text-sm text-muted mb-1">
                Email
              </label>

              <div className="px-4 py-3 rounded-lg bg-background border border-border break-all">
                {user?.email || "—"}
              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            Learning Profile
            ==================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">

                <GraduationCap
                  size={20}
                  className="text-primary"
                />

              </div>

              <div>

                <h2 className="font-semibold text-lg">
                  Learning Profile
                </h2>

                <p className="text-sm text-muted">
                  Tell LearnMate about your academic
                  background and learning preferences.
                </p>

              </div>

            </div>


            <div className="space-y-5">

              {/* ================= Bio ================= */}

              <div>

                <label
                  htmlFor="bio"
                  className="block text-sm font-medium mb-2"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself..."
                  rows={4}
                  maxLength={2000}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    bg-background
                    border
                    border-border
                    text-white
                    placeholder:text-muted
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/40
                    resize-none
                  "
                />

              </div>


              {/* ================= Education ================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>

                  <label
                    htmlFor="education_level"
                    className="block text-sm font-medium mb-2"
                  >
                    Education Level
                  </label>

                  <Input
                    id="education_level"
                    name="education_level"
                    type="text"
                    value={
                      formData.education_level
                    }
                    onChange={handleChange}
                    placeholder="e.g. Undergraduate"
                    maxLength={100}
                  />

                </div>


                <div>

                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium mb-2"
                  >
                    Institution
                  </label>

                  <Input
                    id="institution"
                    name="institution"
                    type="text"
                    value={
                      formData.institution
                    }
                    onChange={handleChange}
                    placeholder="e.g. Your college"
                    maxLength={255}
                  />

                </div>

              </div>


              {/* ================= Field ================= */}

              <div>

                <label
                  htmlFor="field_of_study"
                  className="block text-sm font-medium mb-2"
                >
                  Field of Study
                </label>

                <Input
                  id="field_of_study"
                  name="field_of_study"
                  type="text"
                  value={
                    formData.field_of_study
                  }
                  onChange={handleChange}
                  placeholder="e.g. Computer Science and Engineering"
                  maxLength={150}
                />

              </div>


              {/* ================= Learning Goals ================= */}

              <div>

                <label
                  htmlFor="learning_goals"
                  className="block text-sm font-medium mb-2"
                >
                  Learning Goals
                </label>

                <textarea
                  id="learning_goals"
                  name="learning_goals"
                  value={
                    formData.learning_goals
                  }
                  onChange={handleChange}
                  placeholder="What would you like to achieve with LearnMate?"
                  rows={4}
                  maxLength={5000}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    bg-background
                    border
                    border-border
                    text-white
                    placeholder:text-muted
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/40
                    resize-none
                  "
                />

              </div>


              {/* ================= Learning Style ================= */}

              <div>

                <label
                  htmlFor="preferred_learning_style"
                  className="block text-sm font-medium mb-2"
                >
                  Preferred Learning Style
                </label>

                <Input
                  id="preferred_learning_style"
                  name="preferred_learning_style"
                  type="text"
                  value={
                    formData.preferred_learning_style
                  }
                  onChange={handleChange}
                  placeholder="e.g. Visual and interactive"
                  maxLength={100}
                />

              </div>


              {/* ================= Save ================= */}

              <div className="pt-2 flex justify-end">

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Button>

              </div>

            </div>

          </div>

        </form>


        {/* ====================================================
            Footer Note
            ==================================================== */}

        <div className="mt-6 flex items-start gap-3 text-sm text-muted">

          <BookOpen
            size={18}
            className="shrink-0 mt-0.5"
          />

          <p>
            Your learning profile will later help
            LearnMate personalize study plans,
            quizzes, recommendations, and other
            learning assistance.
          </p>

        </div>

      </div>

    </div>
  );
}