import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9999";
      const res = await fetch(`${BASE_URL}/api/notifications/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // Sort newest first
        const sorted = data.sort((a, b) => b.id - a.id);
        setNotifications(sorted);
        setUnreadCount(sorted.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user?.id]);

  const markAsRead = async (id) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9999";
      const res = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT"
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(c => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    // Mark all currently unread notifications as read
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markAsRead(n.id)));
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9999";
    const wsUrl = BASE_URL.replace(/^http/, 'ws') + '/ws';
    
    let ws;
    let reconnectTimeout;
    
    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected. Sending STOMP CONNECT frame...");
        // Send STOMP CONNECT frame
        ws.send("CONNECT\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\u0000");
      };

      ws.onmessage = (event) => {
        const msg = event.data;
        
        // Check if it's a CONNECTED frame
        if (msg.startsWith("CONNECTED")) {
          console.log("STOMP Session established. Subscribing to notifications...");
          // Subscribe to notifications topic
          ws.send(`SUBSCRIBE\nid:sub-notif\ndestination:/topic/notifications/${user.id}\n\n\u0000`);
        } 
        // Check if it's a MESSAGE frame
        else if (msg.startsWith("MESSAGE")) {
          // Parse STOMP frame body
          const bodyIndex = msg.indexOf("\n\n");
          if (bodyIndex !== -1) {
            let body = msg.substring(bodyIndex + 2);
            // Remove trailing null character if present
            if (body.endsWith("\u0000")) {
              body = body.substring(0, body.length - 1);
            }
            try {
              const notification = JSON.parse(body.trim());
              setNotifications(prev => [notification, ...prev]);
              setUnreadCount(c => c + 1);
              
              // Play a subtle notification sound if browser permits
              try {
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                audio.volume = 0.4;
                audio.play();
              } catch (soundErr) {
                // Ignore audio play block policy
              }
            } catch (err) {
              console.error("Failed to parse websocket message body:", err);
            }
          }
        }
      };

      ws.onclose = (e) => {
        console.log("WebSocket connection closed. Retrying in 5s...", e.reason);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [user?.id, fetchNotifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, refresh: fetchNotifications };
}
