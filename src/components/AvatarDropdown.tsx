"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  Avatar,
  Box,
  Divider,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { authAtom } from "@/store/authAtom";
import { menuOpenAtom } from "@/store/atoms";

export default function AvatarDropdown() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);
  const [, setMenuOpen] = useAtom(menuOpenAtom); // we only need the setter here

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // keep-open-on-hover helpers
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    clearCloseTimer();
    setAnchorEl(event.currentTarget);
  };

  const scheduleClose = () => {
    // small delay so moving the mouse into the menu does not close it
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setAnchorEl(null), 120);
  };

  const handleMouseEnterMenu = () => clearCloseTimer();
  const handleMouseLeaveMenu = () => scheduleClose();

  const initial = auth.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box
      sx={{ position: "relative", display: "inline-flex" }}
      onMouseLeave={scheduleClose}
    >
      <Tooltip title={auth.email || "Account"}>
        <IconButton
          onClick={handleOpen}
          onMouseEnter={(e) => {
            // Hover can also open it for a nice desktop UX
            if (!open) handleOpen(e as unknown as React.MouseEvent<HTMLElement>);
          }}
          size="small"
          sx={{
            borderRadius: 999,
            px: 1.25,
            py: 0.75,
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "action.selected" },
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontWeight: 700,
              bgcolor: "error.light",
              color: "common.white",
            }}
          >
            {initial}
          </Avatar>
          {/* You can add an email next to the avatar if you want */}
        </IconButton>
      </Tooltip>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
        transitionDuration={140}
        PaperProps={{
          elevation: 6,
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 2,
            overflow: "visible",
            border: 1,
            borderColor: "divider",
            "& .MuiMenuItem-root": { fontSize: 14 },
          },
          onMouseEnter: handleMouseEnterMenu,
          onMouseLeave: handleMouseLeaveMenu,
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {auth.email && (
          <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {auth.email}
            </Typography>
          </Box>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setMenuOpen(false);
            router.push("/settings");
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            // Close menu first for a crisp feel
            setAnchorEl(null);
            setMenuOpen(false);

            // Navigate first, then clear auth on next tick to avoid unmount race
            Promise.resolve().then(() => {
              router.push("/login");
              setTimeout(() => {
                setAuth({ token: null, email: "" });
                if (typeof window !== "undefined") {
                  localStorage.removeItem("token");
                }
              }, 0);
            });
          }}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
