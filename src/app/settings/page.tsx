"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, X } from "lucide-react";

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("Roger");
  const [email, setEmail] = useState("roger@email.com");
  const [activeSection, setActiveSection] = useState("profile");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  const handleSwitchPlan = () => {
    router.push("/settings/plan");
  };

  const handleUnsubscribe = () => {
    alert("You have unsubscribed.");
  };

  const handleCancelAccount = () => {
    alert("Your account has been cancelled.");
  };

  const menuItems = [
    { id: "profile", label: "Profile Settings" },
    { id: "changePassword", label: "Change Password" },
    { id: "plan", label: "Subscription Plan" },
    { id: "billing", label: "Billing" },
    { id: "account", label: "Account" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-white">User Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-white">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 mt-2 text-white rounded hover:brightness-110 transition-colors"
              style={{ backgroundColor: "oklch(59.2% 0.249 0.584)" }}
            >
              Save Changes
            </button>
          </form>
        );
      case "changePassword":
        return (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-white">Existing Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-white">New Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-white">Confirm New Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 mt-2 text-white rounded hover:brightness-110 transition-colors"
              style={{ backgroundColor: "oklch(59.2% 0.249 0.584)" }}
            >
              Save Changes
            </button>
          </form>
        );
      case "plan":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Subscription Plan</h2>
            <button
              onClick={handleSwitchPlan}
              className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Switch Plan
            </button>
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded hover:brightness-95"
            >
              Unsubscribe
            </button>
          </div>
        );
      case "account":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Account Management</h2>
            <button
              onClick={handleCancelAccount}
              className="w-full bg-red-100 dark:bg-red-900 px-4 py-2 rounded text-red-700 dark:text-red-100 hover:brightness-95"
            >
              Cancel Account
            </button>
          </div>
        );
      default:
        return <div className="text-gray-700 dark:text-white">Select an option from the menu</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4 text-gray-700 dark:text-white flex items-center gap-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Settings className="h-5 w-5" />
        )}
        <span>Settings</span>
      </button>

      {/* Left Pane - Menu */}
      <div
        className={cn(
          "w-full md:w-64 bg-white dark:bg-gray-900 shadow-md border-b md:border-r border-gray-300 dark:border-gray-500",
          "md:block", // Always visible on desktop
          isMobileMenuOpen ? "block" : "hidden" // Toggle on mobile
        )}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold mb-6 text-gray-700 dark:text-white">Settings</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false); // Close mobile menu when item selected
                }}
                className={cn(
                  "w-full text-left px-4 py-2 rounded",
                  activeSection === item.id
                    ? "bg-[oklch(59.2%_0.249_0.584)] text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Pane - Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// const SettingsPage: React.FC = () => {
//   const router = useRouter();
//   const [username, setUsername] = useState("Roger");
//   const [email, setEmail] = useState("roger@email.com");
//   const [activeSection, setActiveSection] = useState("profile");
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Settings saved!");
//   };

//   const handleSwitchPlan = () => {
//     router.push("/settings/plan");
//   };

//   const handleUnsubscribe = () => {
//     alert("You have unsubscribed.");
//   };

//   const handleCancelAccount = () => {
//     alert("Your account has been cancelled.");
//   };

//   const menuItems = [
//     { id: "profile", label: "Profile Settings" },
//     { id: "changePassword", label: "Change Password" },
//     { id: "plan", label: "Subscription Plan" },
//     { id: "billing", label: "Billing" },
//     { id: "account", label: "Account" },
//   ];

//   const renderContent = () => {
//     switch (activeSection) {
//       case "profile":
//         return (
//           <form onSubmit={handleSave} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 dark:text-white">User Name</label>
//               <input
//                 type="text"
//                 className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 dark:text-white">Email</label>
//               <input
//                 type="email"
//                 className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-1.5 mt-2 text-white rounded hover:brightness-110 transition-colors"
//               style={{ backgroundColor: "oklch(59.2% 0.249 0.584)" }}
//             >
//               Save Changes
//             </button>
//           </form>
//         );
//       case "changePassword":
//         return (
//           <form onSubmit={handleSave} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 dark:text-white">Existing Password</label>
//               <input
//                 type="text"
//                 className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 dark:text-white">New Password</label>
//               <input
//                 type="email"
//                 className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 dark:text-white">Confirm New Password</label>
//               <input
//                 type="NewPasswordConfirm"
//                 className="w-full mt-1 px-3 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500"
//                 value={newPasswordConfirm}
//                 onChange={(e) => setNewPasswordConfirm(e.target.value)}
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-1.5 mt-2 text-white rounded hover:brightness-110 transition-colors"
//               style={{ backgroundColor: "oklch(59.2% 0.249 0.584)" }}
//             >
//               Save Changes
//             </button>
//           </form>
//         );
//       case "plan":
//         return (
//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Subscription Plan</h2>
//             <button
//               onClick={handleSwitchPlan}
//               className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
//             >
//               Switch Plan
//             </button>
//             <button
//               onClick={handleUnsubscribe}
//               className="w-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded hover:brightness-95"
//             >
//               Unsubscribe
//             </button>
//           </div>
//         );
//       case "account":
//         return (
//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Account Management</h2>
//             <button
//               onClick={handleCancelAccount}
//               className="w-full bg-red-100 dark:bg-red-900 px-4 py-2 rounded text-red-700 dark:text-red-100 hover:brightness-95"
//             >
//               Cancel Account
//             </button>
//           </div>
//         );
//       default:
//         return <div className="text-gray-700 dark:text-white">Select an option from the menu</div>;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
//       {/* Left Pane - Menu */}
//       <div className="w-64 bg-white dark:bg-gray-900 shadow-md p-6 border-r border-gray-300 dark:border-gray-500">
//         <h1 className="text-xl font-bold mb-6 text-gray-700 dark:text-white">Settings</h1>
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveSection(item.id)}
//               className={cn(
//                 "w-full text-left px-4 py-2 rounded",
//                 activeSection === item.id
//                   ? "bg-[oklch(59.2%_0.249_0.584)] text-white"
//                   : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
//               )}
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Right Pane - Content (no card/box) */}
//       <div className="flex-1 p-8">
//         <div className="max-w-2xl">{renderContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
