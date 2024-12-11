import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';

const Notifications = () => {
    // Dữ liệu thông báo cứng
    const staticNotifications = [
        {
            id: 1,
            title: "Chào mừng bạn đến với hệ thống!",
            message: "Cảm ơn bạn đã đăng ký tài khoản.",
            createdAt: "2024-12-01T10:00:00Z",
            isRead: false,
            navigate: "https://example.com/welcome",
        },
        {
            id: 2,
            title: "Đơn hàng đã được giao",
            message: "Đơn hàng #1234 của bạn đã được giao thành công.",
            createdAt: "2024-12-05T15:30:00Z",
            isRead: false,
            navigate: "https://example.com/orders/1234",
        },
        {
            id: 3,
            title: "Khuyến mãi đặc biệt",
            message: "Nhận ngay ưu đãi 20% cho lần mua sắm tiếp theo.",
            createdAt: "2024-12-10T08:45:00Z",
            isRead: true,
            navigate: "https://example.com/promotions",
        },
    ];

    const [notifications, setNotifications] = useState([]);

    // Load dữ liệu cứng vào state khi component được mount
    useEffect(() => {
        setNotifications(staticNotifications);
    }, []);

    const markAllAsRead = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({
                ...notification,
                isRead: true,
            }))
        );
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            setNotifications((prevNotifications) =>
                prevNotifications.map((n) =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                )
            );
        }

        if (notification.navigate) {
            window.open(notification.navigate, '_blank');
        }
    };

    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    return (
        <div className="bg-white p-6 rounded-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Thông báo</h2>
                <span className="text-red-500">{unreadCount} thông báo chưa đọc</span>
                <button onClick={markAllAsRead} className="text-blue-500 hover:underline">
                    Đánh dấu đã xem tất cả
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200
                            ${
                                notification.isRead
                                    ? 'bg-white hover:bg-gray-100'
                                    : 'bg-green-100 hover:bg-white'
                            }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <img
                            src="https://img.icons8.com/ios/452/bell.png"
                            alt="icon"
                            className="w-12 h-12 mr-4"
                        />
                        <div className="flex-grow">
                            <h4 className="text-lg font-semibold text-gray-800">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <div className="text-xs text-gray-500">
                                {format(parseISO(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-xs text-gray-500 mb-2">
                                {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
