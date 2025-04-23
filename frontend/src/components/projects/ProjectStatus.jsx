import { Chip } from "@mui/material";

const ProjectStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "primary";
      case "not started":
        return "default";
      case "on hold":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={status || "Not Started"}
      color={getStatusColor(status)}
      size="small"
    />
  );
};

export default ProjectStatus;
