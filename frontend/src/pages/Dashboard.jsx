import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { fetchProjects } from "../store/slices/projectSlice";
import { fetchTasks } from "../store/slices/taskSlice";
import { fetchTeam } from "../store/slices/teamSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { team, loading: teamLoading } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchTeam());
  }, [dispatch]);

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(
      (p) => p.status === "completed"
    ).length;
    const inProgressProjects = projects.filter(
      (p) => p.status === "in-progress"
    ).length;
    const pendingProjects = projects.filter(
      (p) => p.status === "pending"
    ).length;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      pendingProjects,
    };
  };

  const stats = getProjectStats();

  if (projectsLoading || tasksLoading || teamLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Project Statistics */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">{stats.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Projects
              </Typography>
              <Typography variant="h4">{stats.completedProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">{stats.inProgressProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Projects
              </Typography>
              <Typography variant="h4">{stats.pendingProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Projects
            </Typography>
            <List>
              {projects.slice(0, 5).map((project) => (
                <React.Fragment key={project._id}>
                  <ListItem>
                    <ListItemText
                      primary={project.name}
                      secondary={`Status: ${project.status}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <List>
              {tasks.slice(0, 5).map((task) => (
                <React.Fragment key={task._id}>
                  <ListItem>
                    <ListItemText
                      primary={task.title}
                      secondary={`Status: ${task.status}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 