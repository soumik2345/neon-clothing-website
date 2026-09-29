"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Reply,
  Check,
} from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export interface ContactMessageType {
  _id: string;
  name: string;
  email: string;
  orderId?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageType | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, search]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: ContactMessageType["status"]
  ) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Update message status error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  const handleSelectMessage = (msg: ContactMessageType) => {
    setSelectedMessage(msg);
    // If it was unread, automatically mark as read
    if (msg.status === "unread") {
      handleUpdateStatus(msg._id, "read");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filterStatus === "all" || m.status === filterStatus;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.orderId && m.orderId.toLowerCase().includes(search.toLowerCase())) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMessages.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredMessages.length);
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Customer Inquiries & Messages" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-neutral-200 rounded-xs shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, order ID, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 text-xs rounded-xs outline-none focus:border-black transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Messages", count: messages.length },
              { id: "unread", label: "Unread", count: unreadCount },
              {
                id: "read",
                label: "Read",
                count: messages.filter((m) => m.status === "read").length,
              },
              {
                id: "replied",
                label: "Replied",
                count: messages.filter((m) => m.status === "replied").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === tab.id
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    filterStatus === tab.id
                      ? "bg-neutral-800 text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Table */}
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xs shadow-2xs overflow-hidden flex flex-col justify-between">
            {loading ? (
              <div className="py-20 text-center text-xs text-neutral-400">
                Loading inquiries...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-20 text-center">
                <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No inquiries found.</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Customer form submissions from the Contact Us page will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 uppercase text-[11px] font-bold text-neutral-600 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Message Snippet</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {paginatedMessages.map((msg) => {
                      const isSelected = selectedMessage?._id === msg._id;
                      const isUnread = msg.status === "unread";
                      return (
                        <tr
                          key={msg._id}
                          onClick={() => handleSelectMessage(msg)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? "bg-neutral-100/90"
                              : isUnread
                              ? "bg-amber-50/40 hover:bg-amber-50/70"
                              : "hover:bg-neutral-50/80"
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              )}
                              <div>
                                <p
                                  className={`text-xs ${
                                    isUnread
                                      ? "font-bold text-black"
                                      : "font-semibold text-neutral-800"
                                  }`}
                                >
                                  {msg.name}
                                </p>
                                <p className="text-[11px] text-neutral-400">{msg.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                            {msg.orderId ? (
                              <span className="font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded-xs">
                                {msg.orderId}
                              </span>
                            ) : (
                              <span className="text-neutral-300">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-1 text-neutral-600 text-xs">
                              {msg.message}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                                msg.status === "unread"
                                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                                  : msg.status === "replied"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-neutral-100 text-neutral-800"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(msg._id);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredMessages.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-neutral-200 bg-neutral-50/50 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <span className="font-bold text-neutral-900">{startIndex + 1}</span>-
                    <span className="font-bold text-neutral-900">{endIndex}</span> of{" "}
                    <span className="font-bold text-neutral-900">{filteredMessages.length}</span>
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-1 bg-white border border-neutral-200 px-2 py-0.5 rounded-xs text-[11px] font-bold outline-none focus:border-black cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={safeCurrentPage === 1}
                      className="p-1 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 5) return true;
                        if (page === 1 || page === totalPages) return true;
                        return Math.abs(page - safeCurrentPage) <= 1;
                      })
                      .map((page, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <React.Fragment key={page}>
                            {prev && page - prev > 1 && (
                              <span className="px-1 text-neutral-400 select-none">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-6 h-6 flex items-center justify-center text-[11px] font-mono font-bold rounded-xs transition cursor-pointer ${
                                safeCurrentPage === page
                                  ? "bg-black text-white"
                                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={safeCurrentPage === totalPages}
                      className="p-1 border border-neutral-200 rounded-xs bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details & Reply Panel */}
          <div className="bg-white border border-neutral-200 rounded-xs shadow-2xs p-5 space-y-5">
            {selectedMessage ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div>
                    <h3 className="text-sm font-black uppercase text-black font-mono">
                      Inquiry Details
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Received {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`uppercase text-[10px] font-bold px-2.5 py-1 rounded-xs ${
                      selectedMessage.status === "unread"
                        ? "bg-amber-100 text-amber-900 border border-amber-200"
                        : selectedMessage.status === "replied"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-900 text-white"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>

                {/* Customer Info Card */}
                <div className="p-3.5 bg-neutral-50 border border-neutral-100 rounded-xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 uppercase">
                      {selectedMessage.name}
                    </span>
                    {selectedMessage.orderId && (
                      <span className="font-mono text-[11px] bg-black text-white px-1.5 py-0.5 rounded-xs">
                        Order #{selectedMessage.orderId}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 font-mono">{selectedMessage.email}</p>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block">
                    Message Content
                  </label>
                  <div className="p-4 bg-white border border-neutral-200 rounded-xs text-xs leading-relaxed text-neutral-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions: Status Dropdown & Email Reply */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                      Update Status
                    </label>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          selectedMessage._id,
                          e.target.value as ContactMessageType["status"]
                        )
                      }
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-bold uppercase tracking-wider rounded-xs outline-none focus:border-black cursor-pointer"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your NEON Support Inquiry${
                      selectedMessage.orderId ? ` [Order #${selectedMessage.orderId}]` : ""
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleUpdateStatus(selectedMessage._id, "replied")}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                </div>
              </>
            ) : (
              <div className="py-24 text-center">
                <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  Select a message from the list to view its complete content and send a reply.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
