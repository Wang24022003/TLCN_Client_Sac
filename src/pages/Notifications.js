import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  getNotificationsUser,
  makeAllAsReadNotification,
  makeAsReadNotification,
} from "../utils/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState();
  const callMakeAllAsReadNotification = async () => {
    const re = await makeAllAsReadNotification();
    if (re && re.data) {
      fetchNotifications();
    }
  };
  const callMakeAsReadNotification = async (id) => {
    const re = await makeAsReadNotification(id);
    if (re && re.data) {
      fetchNotifications();
    }
  };
  const fetchNotifications = async () => {
    const re = await getNotificationsUser();
    if (re && re.data) {
      setNotifications(re.data);
    }
  };
  // Load dữ liệu cứng vào state khi component được mount
  useEffect(() => {
    fetchNotifications();
    //setNotifications(staticNotifications);
  }, []);
  useEffect(() => {
    setUnreadCount(
      notifications.filter((notification) => !notification.isRead).length
    );

    return () => {};
  }, [notifications]);

  const markAllAsRead = () => {
    callMakeAllAsReadNotification();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      callMakeAsReadNotification(notification._id);
    }

    if (notification.navigate) {
      window.open(notification.navigate, "_blank");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Thông báo</h2>
        <span className="text-red-500">{unreadCount} thông báo chưa đọc</span>
        <button
          onClick={markAllAsRead}
          className="text-blue-500 hover:underline"
        >
          Đánh dấu đã xem tất cả
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200
                            ${
                              notification.isRead
                                ? "bg-white hover:bg-gray-100"
                                : "bg-green-100 hover:bg-white"
                            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <img
              src="https://img.icons8.com/ios/452/bell.png"
              alt="icon"
              className="w-12 h-12 mr-4"
            />
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-gray-800">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <div className="text-xs text-gray-500">
                {format(parseISO(notification.createdAt), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 mb-2">
                {formatDistanceToNow(parseISO(notification.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
