// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Tooltip,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   Dashboard as DashboardIcon,
//   Folder as ProjectIcon,
//   Assignment as TaskIcon,
//   Group as TeamIcon,
//   Person as ProfileIcon,
// } from "@mui/icons-material";

// const drawerWidth = 240;

// const menuItems = [
//   { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
//   { text: "Projects", icon: <ProjectIcon />, path: "/projects" },
//   { text: "Tasks", icon: <TaskIcon />, path: "/tasks" },
//   { text: "Team", icon: <TeamIcon />, path: "/team" },
//   { text: "Profile", icon: <ProfileIcon />, path: "/profile" },
// ];

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//           top: "64px",
//           backgroundColor: "#f8f9fa",
//           borderRight: "1px solid rgba(0, 0, 0, 0.08)",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.03)",
//           overflow: "hidden",
//           transition: "width 0.3s ease",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           p: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{ fontWeight: 600, color: "primary.main" }}
//         >
//           Workspace
//         </Typography>
//       </Box>
//       <Divider sx={{ mx: 2, backgroundColor: "rgba(0, 0, 0, 0.06)" }} />
//       <List sx={{ pt: 1 }}>
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <Tooltip key={item.text} title={item.text} placement="right">
//               <ListItem
//                 button
//                 onClick={() => navigate(item.path)}
//                 selected={isActive}
//                 sx={{
//                   mx: 1,
//                   my: 0.5,
//                   borderRadius: 1.5,
//                   transition: "all 0.2s ease",
//                   "&.Mui-selected": {
//                     backgroundColor: "rgba(25, 118, 210, 0.12)",
//                     "&:hover": {
//                       backgroundColor: "rgba(25, 118, 210, 0.18)",
//                     },
//                   },
//                   "&:hover": {
//                     backgroundColor: "rgba(0, 0, 0, 0.04)",
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 42,
//                     color: isActive ? "primary.main" : "text.secondary",
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={item.text}
//                   primaryTypographyProps={{
//                     fontWeight: isActive ? 600 : 500,
//                     fontSize: "0.93rem",
//                   }}
//                   sx={{
//                     color: isActive ? "primary.main" : "text.primary",
//                   }}
//                 />
//                 {isActive && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       left: 0,
//                       width: 4,
//                       height: "60%",
//                       bgcolor: "primary.main",
//                       borderRadius: "0 4px 4px 0",
//                     }}
//                   />
//                 )}
//               </ListItem>
//             </Tooltip>
//           );
//         })}
//       </List>
//       <Box sx={{ flexGrow: 1 }} />
//       <Divider sx={{ mx: 2, my: 2, backgroundColor: "rgba(0, 0, 0, 0.06)" }} />
//       <Box sx={{ p: 2 }}>
//         <Typography variant="caption" sx={{ color: "text.secondary", px: 1 }}>
//           © 2025 Your Company
//         </Typography>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React from "react";

function Sidebar() {
  return <div></div>;
}

export default Sidebar;
