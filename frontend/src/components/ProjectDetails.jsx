import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ProjectDetails = ({ project, user, handleRemoveMember }) => {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Team Members
      </Typography>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{project.owner?.name?.[0] || "U"}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={project.owner?.name || "Unknown"}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Project Owner
                </Typography>
                <br />
                {project.owner?.email || "No email provided"}
              </>
            }
          />
        </ListItem>

        {project.members?.map((member) => (
          <ListItem key={member._id}>
            <ListItemAvatar>
              <Avatar>{member.name?.[0] || "U"}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.name} secondary={member.email} />
            {user._id === project.owner?._id && (
              <IconButton
                edge="end"
                aria-label="remove member"
                onClick={() => handleRemoveMember(member._id)}
              >
                <PersonRemoveIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      {user._id === project.owner?._id && (
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={() => setAddMemberDialogOpen(true)}
          sx={{ mt: 2 }}
        >
          Add Team Member
        </Button>
      )}
    </Box>
  );
};

export default ProjectDetails;
