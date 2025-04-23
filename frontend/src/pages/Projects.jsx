import { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  AvatarGroup,
  Avatar,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/slices/projectSlice";

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!projects.length) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" gutterBottom>
          No Projects Yet
        </Typography>
        <Typography color="text.secondary" paragraph>
          Create your first project to get started
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* Handle create project */
          }}
        >
          Create Project
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* Handle create project */
          }}
        >
          Create Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Typography color="text.secondary" noWrap paragraph>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={project.status}
                    color={
                      project.status === "Completed"
                        ? "success"
                        : project.status === "In Progress"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <AvatarGroup max={3}>
                    {project.team.map((member) => (
                      <Avatar
                        key={member._id}
                        src={member.avatar}
                        alt={member.name}
                      />
                    ))}
                  </AvatarGroup>
                  <Typography variant="caption" color="text.secondary">
                    Due {new Date(project.deadline).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
