// admin\src\components\contentpage\MessagesContent.tsx
'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { FiTrash2, FiAlertCircle, FiSearch, FiMail, FiBriefcase, FiUsers, FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  posted_at: string;
  subscribed_at: string;
  is_read: boolean;
}

interface MessagesContentProps {
  type: 'contacts' | 'hires' | 'subscriptions';
}

export default function MessagesContent({ type }: MessagesContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<boolean | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const endpoints = {
    contacts: '/contacts/',
    hires: '/hires/',
    subscriptions: '/subscribes/'
  };

  const titles = {
    contacts: 'Contact Messages',
    hires: 'Hire Requests',
    subscriptions: 'Subscriptions'
  };

  const icons = {
    contacts: <FiMail className="mr-2" />,
    hires: <FiBriefcase className="mr-2" />,
    subscriptions: <FiUsers className="mr-2" />
  };

  useEffect(() => {
    fetchMessages();
  }, [type]);

  async function fetchMessages() {
    try {
      setLoading(true);
      const response = await api.get(endpoints[type]);
      setMessages(response.data.results ?? []);
      setError(null);
    } catch (err) {
      setError(`Failed to load ${type}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      await api.delete(`${endpoints[type]}${id}/`);
      setMessages(messages.filter(message => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(`Failed to delete ${type.slice(0, -1)}`);
      console.error(err);
    }
  }

  async function handleToggleRead(message: Message) {
    try {
      const updatedMessage = { ...message, is_read: !message.is_read };
      await api.patch(`${endpoints[type]}${message.id}/`, { is_read: updatedMessage.is_read });
      
      setMessages(messages.map(m => 
        m.id === message.id ? updatedMessage : m
      ));
      
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(updatedMessage);
      }
    } catch (err) {
      setError(`Failed to update ${type.slice(0, -1)}`);
      console.error(err);
    }
  }

  function handleViewMessage(message: Message) {
    setSelectedMessage(message);
    
    // If message is unread, mark it as read
    if (!message.is_read) {
      handleToggleRead(message);
    }
  }

  const filteredMessages = Array.isArray(messages)
    ? messages.filter((message) =>
      (searchTerm === "" ||
        message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRead === null || message.is_read === filterRead)
    )
  : [];

  const getValidDate = (...dates: (string | null | undefined)[]) => {
    for (const d of dates) {
      if (d && !isNaN(new Date(d).getTime())) {
        return new Date(d).toLocaleDateString();
      }
    }
    return "—";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading {type}...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <FiAlertCircle size={24} className="mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          {icons[type]}
          {titles[type]}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${type}...`}
            className="pl-10 pr-4 py-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded w-full appearance-none"
            value={filterRead === null ? '' : filterRead ? 'read' : 'unread'}
            onChange={(e) => {
              if (e.target.value === '') setFilterRead(null);
              else if (e.target.value === 'read') setFilterRead(true);
              else setFilterRead(false);
            }}
          >
            <option value="">All Messages</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterRead !== null ? 'No messages match your filters' : `No ${type} found.`}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-blue-50' : message.is_read ? 'bg-white' : 'bg-gray-50'}`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-sm font-medium ${message.is_read ? 'text-gray-900' : 'text-blue-600'}`}>
                        {message.name}
                      </h3>
                      <p className="text-xs text-gray-500">{message.email}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getValidDate(message.created_at, message.posted_at, message.subscribed_at)}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-medium">{selectedMessage.name}</h2>
                  <p className="text-gray-600">{selectedMessage.email}</p>
                  <p className="text-sm text-gray-500">
                    {getValidDate(selectedMessage.created_at, selectedMessage.posted_at, selectedMessage.subscribed_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                    title={selectedMessage.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedMessage.is_read ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className={`p-2 rounded-full hover:bg-gray-100 ${deleteConfirm === selectedMessage.id ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                    title="Delete message"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-4xl mb-4">{icons[type]}</div>
              <p>Select a message to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}