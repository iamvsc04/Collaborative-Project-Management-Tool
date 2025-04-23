import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Chip,
  styled,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const CustomCard = ({
  title,
  subtitle,
  progress,
  status,
  dueDate,
  members,
  tags,
  action,
}) => {
  return (
    <StyledCard>
      <CardHeader
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
              }}
            />
          </Box>
        )}

        {tags && tags.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        {members && members.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AvatarGroup max={4}>
              {members.map((member, index) => (
                <Avatar
                  key={index}
                  alt={member.name}
                  src={member.avatar}
                  sx={{ width: 32, height: 32 }}
                />
              ))}
            </AvatarGroup>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        {status && (
          <Chip
            label={status}
            size="small"
            color={
              status === "Completed"
                ? "success"
                : status === "In Progress"
                ? "warning"
                : "error"
            }
            sx={{ borderRadius: 1 }}
          />
        )}
        {dueDate && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "text.secondary" }}
            />
            <Typography variant="caption" color="text.secondary">
              {dueDate}
            </Typography>
          </Box>
        )}
      </CardActions>
    </StyledCard>
  );
};

export default CustomCard;
