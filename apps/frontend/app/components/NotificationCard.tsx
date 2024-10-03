import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Grid,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { z } from "zod";
import { createNotification } from "../../api/notifications"; // Adjust the import path as needed

interface NotificationCardProps {
  open: boolean;
  handleClose: () => void;
  token: string;
  onSuccess: () => void;
}

const notificationSchema = z.object({
  receivers: z
    .array(z.string().email("Invalid email address"))
    .nonempty("At least one receiver is required"),
  searchQuery: z.string().min(1, "Please enter at least one search query"),
  relevancyScore: z
    .number({
      required_error: "Relevancy score is required",
      invalid_type_error: "Relevancy score must be a number",
    })
    .int("Relevancy score must be an integer")
    .min(1, "Relevancy score must be at least 1")
    .max(5, "Relevancy score cannot be more than 5"),
  frequency: z.enum(["Daily", "Weekly", "Monthly"], {
    errorMap: () => ({ message: "Please select a notification frequency" }),
  }),
  days: z
    .array(z.string())
    .nonempty("Please select at least one day")
    .optional(),
  time: z.string().min(1, "Please select a notification time"),
  timezone: z.string().min(1, "Timezone is required"),
});

export default function NotificationCard({
  open,
  handleClose,
  token,
  onSuccess,
}: NotificationCardProps) {
  const [newNotification, setNewNotification] = useState<{
    receivers: string[];
    searchQuery: string;
    relevancyScore?: number;
    frequency: "Daily" | "Weekly" | "Monthly";
    days?: string[];
    time: string;
    timezone: string;
  }>({
    receivers: [],
    searchQuery: "",
    relevancyScore: undefined,
    frequency: "Daily",
    days: [],
    time: "",
    timezone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    // Prepare data for validation
    const dataToValidate = {
      ...newNotification,
      relevancyScore: Number(newNotification.relevancyScore),
    };

    // Adjust schema conditionally based on frequency
    const schema =
      newNotification.frequency === "Weekly"
        ? notificationSchema
        : notificationSchema.omit({ days: true });

    try {
      // Validate using Zod
      const validatedData = schema.parse(dataToValidate);

      // Remove 'days' from data if frequency is not 'Weekly'
      if (validatedData.frequency !== "Weekly" && "days" in validatedData) {
        delete (validatedData as typeof validatedData & { days?: string[] })
          .days;
      }

      // Clear errors if validation passes
      setErrors({});

      // Set loading state
      setLoading(true);

      // Call the API to create the notification
      await createNotification(token, validatedData);

      // Reset loading state
      setLoading(false);

      // Close the dialog and reset the form
      handleClose();
      setNewNotification({
        receivers: [],
        searchQuery: "",
        relevancyScore: undefined,
        frequency: "Daily",
        days: [],
        time: "",
        timezone: "",
      });
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to form errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // Handle API errors
        setLoading(false);
        setErrors({ apiError: (error as Error).message });
      }
    }
  };

  // Days of the week options
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Timezones (simplified list)
  const timezones = [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    // Add more as needed
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-center text-xl font-semibold">
        Manage Bid Notifications
      </DialogTitle>
      <DialogContent>
        <p className="text-center mb-4 text-gray-500">
          Configure your email notification settings for relevant business bids.
        </p>
        {errors.apiError && (
          <Box color="error.main" mb={2}>
            {errors.apiError}
          </Box>
        )}
        <Box className="p-4">
          <Grid container spacing={3}>
            {/* Frequency */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.frequency}>
                <InputLabel>Notification Frequency</InputLabel>
                <Select
                  value={newNotification.frequency}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      frequency: e.target.value as
                        | "Daily"
                        | "Weekly"
                        | "Monthly",
                      days:
                        e.target.value === "Weekly" ? newNotification.days : [],
                    })
                  }
                  label="Notification Frequency"
                >
                  <MenuItem value="" disabled>
                    Select frequency
                  </MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
                {errors.frequency && (
                  <FormHelperText>{errors.frequency}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notification Time"
                type="time"
                value={newNotification.time}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    time: e.target.value,
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                error={!!errors.time}
                helperText={errors.time}
              />
            </Grid>

            {/* Timezone */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.timezone}>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={newNotification.timezone}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      timezone: e.target.value,
                    })
                  }
                  label="Timezone"
                >
                  <MenuItem value="" disabled>
                    Select timezone
                  </MenuItem>
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
                {errors.timezone && (
                  <FormHelperText>{errors.timezone}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Days (if Weekly) */}
            {newNotification.frequency === "Weekly" && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.days} variant="outlined">
                  <InputLabel>Select Days</InputLabel>
                  <Select
                    multiple
                    value={newNotification.days}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        days: e.target.value as string[],
                      })
                    }
                    input={<OutlinedInput label="Select Days" />}
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    }
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        <Checkbox
                          checked={newNotification.days?.includes(day) ?? false}
                        />
                        <ListItemText primary={day} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.days && (
                    <FormHelperText>{errors.days}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            {/* Search Query */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={
                  newNotification.searchQuery
                    ? newNotification.searchQuery.split(", ")
                    : []
                }
                onChange={(event, newValue) => {
                  setNewNotification({
                    ...newNotification,
                    searchQuery: newValue.join(", "),
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
                    label="Search Query"
                    placeholder="Type and press enter"
                    error={!!errors.searchQuery}
                    helperText={errors.searchQuery || "Enter search terms"}
                  />
                )}
              />
            </Grid>

            {/* Receivers */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newNotification.receivers}
                onChange={(event, newValue) => {
                  setNewNotification({
                    ...newNotification,
                    receivers: newValue as string[],
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
                    label="Email Receivers"
                    placeholder="Type and press enter"
                    error={!!errors.receivers}
                    helperText={errors.receivers || "Enter email addresses"}
                  />
                )}
              />
            </Grid>

            {/* Relevancy Score */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relevancy Score (1-5)"
                type="number"
                value={newNotification.relevancyScore || ""}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    relevancyScore: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                InputProps={{ inputProps: { min: 1, max: 5, step: 1 } }}
                error={!!errors.relevancyScore}
                helperText={errors.relevancyScore}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
