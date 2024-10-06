import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Autocomplete,
  CircularProgress,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
} from "@mui/material";

interface EditNotificationModalProps {
  open: boolean;
  notification: any;
  onClose: () => void;
  onSave: (data: any) => void;
  loading: boolean;
  errors: Record<string, string>;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EditNotificationModal = ({
  open,
  notification,
  onClose,
  onSave,
  loading,
  errors,
}: EditNotificationModalProps) => {
  const [currentNotification, setCurrentNotification] = useState(notification);

  const handleSave = () => {
    onSave(currentNotification);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ paddingBottom: "1rem" }}>
        Edit Notification
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>
        <Box component="form" noValidate autoComplete="off">
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={currentNotification.searchQuery || []}
            onChange={(event, newValue) => {
              setCurrentNotification({
                ...currentNotification,
                searchQuery: newValue,
              });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search Queries"
                placeholder="Type and press enter"
                error={!!errors.searchQuery}
                helperText={errors.searchQuery || "Enter search queries"}
              />
            )}
            sx={{ marginBottom: "1rem", marginTop: "1rem" }}
          />

          <TextField
            fullWidth
            label="Relevancy Score (1-5)"
            type="number"
            variant="outlined"
            value={currentNotification.relevancyScore || ""}
            onChange={(e) =>
              setCurrentNotification({
                ...currentNotification,
                relevancyScore: Number(e.target.value),
              })
            }
            InputProps={{ inputProps: { min: 1, max: 5, step: 1 } }}
            error={!!errors.relevancyScore}
            helperText={errors.relevancyScore}
            sx={{ marginBottom: "1rem" }}
          />

          <FormControl
            fullWidth
            error={!!errors.frequency}
            sx={{ marginBottom: "1rem" }}
          >
            <InputLabel>Frequency</InputLabel>
            <Select
              value={currentNotification.frequency}
              onChange={(e) =>
                setCurrentNotification({
                  ...currentNotification,
                  frequency: e.target.value as "Daily" | "Weekly" | "Monthly",
                })
              }
              label="Frequency"
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
            {errors.frequency && (
              <FormHelperText>{errors.frequency}</FormHelperText>
            )}
          </FormControl>

          {currentNotification.frequency === "Weekly" && (
            <Box sx={{ marginBottom: "1rem" }}>
              <FormControl fullWidth error={!!errors.days} variant="outlined">
                <InputLabel>Select Days</InputLabel>
                <Select
                  multiple
                  value={currentNotification.days || []}
                  onChange={(e) =>
                    setCurrentNotification({
                      ...currentNotification,
                      days: e.target.value,
                    })
                  }
                  input={<OutlinedInput label="Select Days" />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      <Checkbox
                        checked={
                          currentNotification.days?.includes(day) ?? false
                        }
                      />
                      <ListItemText primary={day} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.days && <FormHelperText>{errors.days}</FormHelperText>}
              </FormControl>
            </Box>
          )}

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={currentNotification.receivers || []}
            onChange={(event, newValue) =>
              setCurrentNotification({
                ...currentNotification,
                receivers: newValue,
              })
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Email Receivers"
                placeholder="Type and press enter"
                error={!!errors.receivers}
                helperText={errors.receivers || "Enter email addresses"}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            textTransform: "none",
            backgroundColor: "#f5f5f5",
            color: "#333",
            "&:hover": {
              backgroundColor: "#ddd",
            },
            marginRight: "1rem",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            backgroundColor: "#333",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#555",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNotificationModal;
