"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [{ text: "Dashboard", path: "/" }];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        backgroundColor: "#000000",
        height: "100%",
        color: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        NotificationService
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            component="li"
            key={item.text}
            onClick={() => router.push(item.path)}
            disablePadding
          >
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem component="li" onClick={handleLogout} disablePadding>
          <ListItemButton sx={{ color: "#fff" }}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = undefined;

  return (
    <Box sx={{ display: "flex" }}>
      {pathname === "/" && (
        <>
          <AppBar component="nav" sx={{ backgroundColor: "#000" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                NotificationService
              </Typography>
              {isMobile ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: "flex" }}>
                  <Button onClick={handleLogout} sx={{ color: "#fff" }}>
                    Logout
                  </Button>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 240,
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {pathname === "/" && <Toolbar />}
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
