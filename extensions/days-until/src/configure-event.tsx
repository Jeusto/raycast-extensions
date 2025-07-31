import { Action, ActionPanel, Form, LocalStorage, showToast, Toast, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";

interface FormValues {
  eventTitle: string;
  eventDateTime: Date;
}

export default function ConfigureEvent() {
  const { pop } = useNavigation();

  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDateTime, setEventDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const loadInitialValues = async () => {
      const storedTitle = await LocalStorage.getItem<string>("eventTitle");
      const storedDate = await LocalStorage.getItem<string>("eventDate");

      const currentYear = new Date().getFullYear();
      const defaultTitle = "Christmas";
      const defaultDate = `25/12/${currentYear} 12:00`;

      // Set the current title (stored or default)
      const currentTitle = storedTitle || defaultTitle;
      setEventTitle(currentTitle);

      // Set the current date (stored or default)
      const currentDateString = storedDate || defaultDate;
      try {
        const parsedDate = parseStoredDate(currentDateString);
        if (parsedDate) {
          setEventDateTime(parsedDate);
        } else {
          // Fallback to default Christmas date
          setEventDateTime(new Date(currentYear, 11, 25, 12, 0, 0));
        }
      } catch (error) {
        console.error("Error parsing current date:", error);
        // Fallback to default Christmas date
        setEventDateTime(new Date(currentYear, 11, 25, 12, 0, 0));
      }
    };

    loadInitialValues();
  }, []);

  function parseStoredDate(dateString: string): Date | null {
    try {
      const dateInput = dateString.trim();
      const hasTime = dateInput.includes(":");

      if (hasTime) {
        // Handle DD/MM/YYYY HH:MM format
        const [datePart, timePart] = dateInput.split(" ");
        if (!datePart || !timePart) return null;

        const dateParts = datePart.split("/");
        if (dateParts.length !== 3) return null;

        const [day, month, year] = dateParts.map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);

        // Validate date components
        if (
          isNaN(day) ||
          isNaN(month) ||
          isNaN(year) ||
          isNaN(hours) ||
          isNaN(minutes) ||
          day < 1 ||
          day > 31 ||
          month < 1 ||
          month > 12 ||
          year < 1900 ||
          hours < 0 ||
          hours > 23 ||
          minutes < 0 ||
          minutes > 59
        ) {
          return null;
        }

        const date = new Date(year, month - 1, day, hours, minutes);

        // Check if the date is valid
        if (
          isNaN(date.getTime()) ||
          date.getDate() !== day ||
          date.getMonth() !== month - 1 ||
          date.getFullYear() !== year
        ) {
          return null;
        }

        return date;
      } else {
        // Handle DD/MM/YYYY format
        const dateParts = dateInput.split("/");
        if (dateParts.length !== 3) return null;

        const [day, month, year] = dateParts.map(Number);

        // Validate date components
        if (
          isNaN(day) ||
          isNaN(month) ||
          isNaN(year) ||
          day < 1 ||
          day > 31 ||
          month < 1 ||
          month > 12 ||
          year < 1900
        ) {
          return null;
        }

        const date = new Date(year, month - 1, day, 12, 0, 0); // Default to noon

        // Check if the date is valid
        if (
          isNaN(date.getTime()) ||
          date.getDate() !== day ||
          date.getMonth() !== month - 1 ||
          date.getFullYear() !== year
        ) {
          return null;
        }

        return date;
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      return null;
    }
  }

  async function handleSubmit(values: FormValues) {
    try {
      // Validate the date
      if (!values.eventDateTime || isNaN(values.eventDateTime.getTime())) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Invalid Date",
          message: "Please select a valid date and time",
        });
        return;
      }

      // Validate title
      if (!values.eventTitle.trim()) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Missing Title",
          message: "Please enter an event title",
        });
        return;
      }

      // Format date as DD/MM/YYYY HH:MM
      const day = values.eventDateTime.getDate().toString().padStart(2, "0");
      const month = (values.eventDateTime.getMonth() + 1).toString().padStart(2, "0");
      const year = values.eventDateTime.getFullYear();
      const hours = values.eventDateTime.getHours().toString().padStart(2, "0");
      const minutes = values.eventDateTime.getMinutes().toString().padStart(2, "0");

      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

      // Store in LocalStorage
      await LocalStorage.setItem("eventTitle", values.eventTitle.trim());
      await LocalStorage.setItem("eventDate", formattedDate);

      await showToast({
        style: Toast.Style.Success,
        title: "Event Configured",
        message: `${values.eventTitle.trim()} set for ${formattedDate}`,
      });

      pop();
    } catch (error) {
      console.error("Submit error:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to save event configuration",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Event" onSubmit={handleSubmit} />
          <Action
            title="Reset to Defaults"
            onAction={async () => {
              await LocalStorage.removeItem("eventTitle");
              await LocalStorage.removeItem("eventDate");
              setEventTitle("Christmas");
              setEventDateTime(new Date(new Date().getFullYear(), 11, 25, 12, 0, 0));
              await showToast({
                style: Toast.Style.Success,
                title: "Reset Complete",
                message: "Event configuration reset to defaults",
              });
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="eventTitle"
        title="Event Title"
        placeholder="e.g., Christmas, Birthday, Vacation"
        value={eventTitle}
        onChange={setEventTitle}
      />

      <Form.DatePicker
        id="eventDateTime"
        title="Event Date & Time"
        value={eventDateTime}
        onChange={(newValue) => {
          if (newValue) {
            setEventDateTime(newValue);
          }
        }}
        type={Form.DatePicker.Type.DateTime}
      />

      <Form.Description text="Configure your custom countdown event with date and time." />
    </Form>
  );
}
