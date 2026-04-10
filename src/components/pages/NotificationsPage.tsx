"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Trophy,
  Target,
  BookOpen,
  Settings,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/db/firebase";
import { UserNotification } from "@/types/user";
import Link from "next/link";
import Loading from "@/app/loading";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserNotification[];
      setNotifications(notifData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        isRead: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unreadNotifications.map((n) =>
          updateDoc(doc(db, "notifications", n.id), {
            isRead: true,
            updatedAt: serverTimestamp(),
          })
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(
        notifications.map((n) => deleteDoc(doc(db, "notifications", n.id)))
      );
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Trophy className="text-amber-500" size={20} />;
      case "achievement":
        return <Trophy className="text-emerald-500" size={20} />;
      case "milestone":
        return <Target className="text-blue-500" size={20} />;
      case "learning":
        return <BookOpen className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-slate-500" size={20} />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                <Bell className="text-amber-500" size={36} /> Notifications
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Stay updated on your learning journey
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  filter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  filter === "unread"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Clear all
              </button>
            )}
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-slate-500 font-medium">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "We'll notify you when something happens on your profile."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-slate-50 transition-colors group ${
                    !notification.isRead ? "bg-amber-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock size={14} />
                          {getTimeAgo(notification.createdAt)}
                        </div>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                          >
                            View <ChevronRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}