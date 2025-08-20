"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import { menuOpenAtom } from "@/store/atoms";
import { authAtom } from "@/store/authAtom";

// MUI
import { TextField, Button, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// shadcn/ui alert (same as your existing style)
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2 } from "lucide-react";

// Utility to decode email from JWT (same approach as your example)
function getEmailFromToken() {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || "";
  } catch {
    return "";
  }
}

export default function SettingsPage() {
  const router = useRouter();

  const [menuOpen] = useAtom(menuOpenAtom);
  const setAuth = useSetAtom(authAtom);

  const email = getEmailFromToken();

  // Alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive">("default");

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Subscription plan
  const [plan, setPlan] = useState<"free" | "pro">("free");

  // Stepper mimic for saving indicators (keeps consistent vibe with your page)
  const [stepIdx, setStepIdx] = useState(0);
  const steps = ["Validating", "Saving", "Done"]; // used during actions

  // Fetch current profile (plan)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/settings/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.plan === "pro" || data?.plan === "free") setPlan(data.plan);
        }
      } catch {
        // non-blocking
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const textFieldSx = {
    "& .MuiInputBase-root": {
      backgroundColor: "var(--tw-colors-neutral-50)",
    },
    "& .MuiInputBase-input": { color: "var(--tw-colors-neutral-800)" },
    "& .MuiFormLabel-root": { color: "var(--tw-colors-neutral-600)" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--tw-colors-neutral-300)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--tw-colors-neutral-400)" },
    ".dark & .MuiInputBase-input": { color: "white" },
  } as const;

  const panelClass = "w-full max-w-4xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 md:p-6 shadow-lg";
  const buttonClass = "px-6 py-2 whitespace-pre-wrap dark:bg-gray-950 dark:text-rose-50 bg-gray-50 text-neutral-700 rounded-[8px] transition duration-300 ease-in-out shadow-lg hover:shadow-pink-500/50 hover:border-pink-400";

  const showMsg = (msg: string, variant: "default" | "destructive" = "default") => {
    setAlertMessage(msg);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMsg("Please fill all password fields.", "destructive");
      return;
    }
    if (newPassword.length < 8) {
      showMsg("New password must be at least 8 characters.", "destructive");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg("New password and confirmation do not match.", "destructive");
      return;
    }

    setSavingPassword(true);
    setStepIdx(0);
    try {
      for (let i = 0; i < steps.length; i++) {
        setStepIdx(i);
        await new Promise((r) => setTimeout(r, 350));
      }

      const res = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showMsg("Password updated successfully.");
    } catch (e: unknown) {
      if (e instanceof Error) {
      showMsg(e.message || "Something went wrong.", "destructive");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleChangePlan() {
    setSavingPlan(true);
    setStepIdx(0);
    try {
      for (let i = 0; i < steps.length; i++) {
        setStepIdx(i);
        await new Promise((r) => setTimeout(r, 300));
      }

      const res = await fetch("/api/settings/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update subscription.");

      showMsg(`Subscription changed to ${plan === "pro" ? "Pro" : "Free"}.`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showMsg(e.message || "Something went wrong.", "destructive");
      }
    } finally {
      setSavingPlan(false);
    }
  }

  return (
    <div className={`flex flex-col items-center p-4 md:mt-12 sm:p-8 w-full min-h-screen bg-[#181a23]${menuOpen ? " hidden" : ""}`}>
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">Settings</h1>
        <p className="text-neutral-300 mt-1">Manage your password and subscription.</p>
      </div>

      {/* Panels */}
      <div className="w-full flex flex-col gap-6 items-center">
        {/* Change Password */}
        <section className={panelClass}>
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Change Password</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Update your account password.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              size="small"
              fullWidth
              sx={textFieldSx}
            />
            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              fullWidth
              sx={textFieldSx}
            />
            <TextField
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
              fullWidth
              sx={textFieldSx}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className={`${buttonClass} flex items-center gap-2`}
            >
              {savingPassword ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Saving
                </>
              ) : (
                <>Update Password <AutoAwesomeIcon fontSize="small" /></>
              )}
            </button>
          </div>
        </section>

        {/* Subscription */}
        <section className={panelClass}>
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Subscription</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Switch between Free and Pro plans.</p>
          {loadingProfile ? (
            <div className="flex items-center gap-2 text-neutral-300"><CircularProgress size={18} /> Loading current plan…</div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <FormControl>
                <FormLabel
                  id="plan-label"
                  sx={{ color: "black", ".dark &": { color: "white" }, "&.Mui-focused": { color: "green" } }}
                  className="dark:text-white"
                >
                  Choose plan
                </FormLabel>
                <RadioGroup
                  row
                  name="subscription-plan"
                  value={plan}
                  onChange={(_, value) => setPlan(value as "free" | "pro")}
                >
                  <FormControlLabel
                    value="free"
                    control={<Radio sx={{ color: "gray", "&.Mui-checked": { color: "green" } }} />}
                    label={<span className="text-black dark:text-white">Free</span>}
                  />
                  <FormControlLabel
                    value="pro"
                    control={<Radio sx={{ color: "gray", "&.Mui-checked": { color: "green" } }} />}
                    label={<span className="text-black dark:text-white">Pro</span>}
                  />
                </RadioGroup>
              </FormControl>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleChangePlan}
                  disabled={savingPlan}
                  className={`${buttonClass} flex items-center gap-2`}
                >
                  {savingPlan ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Updating
                    </>
                  ) : (
                    <>Update Plan <AutoAwesomeIcon fontSize="small" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Action progress indicator (matches your aesthetic) */}
      {(savingPassword || savingPlan) && (
        <div className="w-full mt-6 flex justify-center">
          <div className="space-y-2 w-fit">
            {steps.map((label, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                {((savingPassword || savingPlan) && stepIdx > idx) ? (
                  <Check className="text-green-400" size={18} />
                ) : stepIdx === idx ? (
                  <Loader2 className="animate-spin text-yellow-400" size={18} />
                ) : (
                  <div className="w-4 h-4 border rounded-full border-gray-400" />
                )}
                <span className="text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert */}
      {showAlert && (
        <Alert variant={alertVariant} className="mt-6 max-w-4xl">
          <AlertTitle>{alertVariant === "destructive" ? "Heads up!" : "Success"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Danger zone: sign out */}
      <div className="w-full max-w-4xl mt-8">
        <Divider className="border-neutral-800" />
        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-neutral-100 font-medium">Sign out of this device</h3>
            <p className="text-neutral-400 text-sm">You will need to log in again.</p>
          </div>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setAuth({ token: null, email: "", userName: "" });
              if (typeof window !== "undefined") localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
