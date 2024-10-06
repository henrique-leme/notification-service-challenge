export const createNotification = async (
  token: string,
  notificationData: any
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create notification");
  }
  return data;
};

export const editNotification = async (
  token: string,
  notificationId: string,
  updateData: any
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${notificationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update notification");
  }
  return data;
};

export const getNotifications = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
};

export const deleteNotification = async (
  token: string,
  notificationId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete notification");
  }
};
