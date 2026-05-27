import React, { useState, useEffect } from "react"
import {
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaCheck,
  FaCheckDouble,
  FaSearch,
  FaEllipsisH,
  FaVideo,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dynamic chat functionality will be loaded from localStorage

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [isTyping] = useState(false)
  const [messageStatus, setMessageStatus] = useState<Record<number, string>>({})
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [chatList, setChatList] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({})
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  useEffect(() => {
    initializeUser();
    loadChats();
    loadAvailableUsers();
    initializeMockData(); // Add mock data for demo
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth > 768) {
        setShowSidebar(true)
      } else {
        setShowSidebar(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const initializeMockData = () => {
    // Add mock conversations for demo
    const mockChats = [
      {
        id: 'chat_1',
        name: 'Priya Sharma',
        type: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        isVendor: false,
        online: true,
        lastMessage: 'Hi, I need catering for 100 people',
        unread: 2,
        favorite: false,
        event: 'Wedding Planning'
      },
      {
        id: 'chat_2', 
        name: 'Rahul Kumar',
        type: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isVendor: false,
        online: false,
        lastMessage: 'What are your decoration packages?',
        unread: 1,
        favorite: true,
        event: 'Birthday Party'
      },
      {
        id: 'chat_3',
        name: 'Anita Singh', 
        type: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isVendor: false,
        online: true,
        lastMessage: 'Available for wedding on Dec 15?',
        unread: 0,
        favorite: false,
        event: 'Anniversary'
      }
    ];

    const mockMessages = {
      'chat_1': [
        {
          id: 1,
          sender: 'chat_1_user',
          senderName: 'Priya Sharma',
          text: 'Hi, I need catering for 100 people for my wedding',
          time: '2:30 PM',
          date: 'Today',
          status: 'read'
        },
        {
          id: 2,
          sender: 'chat_1_user', 
          senderName: 'Priya Sharma',
          text: 'What packages do you have available?',
          time: '2:32 PM',
          date: 'Today',
          status: 'delivered'
        }
      ],
      'chat_2': [
        {
          id: 3,
          sender: 'chat_2_user',
          senderName: 'Rahul Kumar', 
          text: 'What are your decoration packages for birthday parties?',
          time: '1:15 PM',
          date: 'Today',
          status: 'read'
        }
      ],
      'chat_3': [
        {
          id: 4,
          sender: 'chat_3_user',
          senderName: 'Anita Singh',
          text: 'Are you available for wedding on Dec 15?',
          time: '12:45 PM', 
          date: 'Today',
          status: 'read'
        }
      ]
    };

    setChatList(mockChats);
    setChatMessages(mockMessages);
    setSelectedChat('chat_1');
  };

  const initializeUser = () => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser({
          id: user.id || user.username || 'default',
          name: user.firstName || user.username || 'User',
          email: user.email,
          isVendor: user.isVendor || false,
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        });
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  const loadChats = () => {
    try {
      const userStr = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const userId = user.id || user.username || 'default';
        
        const chats = JSON.parse(localStorage.getItem(`chats_${userId}`) || '[]');
        const messages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '{}');
        
        // Only load from localStorage if data exists, otherwise mock data will be used
        if (chats.length > 0) {
          setChatList(chats);
          setChatMessages(messages);
          setSelectedChat(chats[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadAvailableUsers = () => {
    try {
      // Load all registered users for chat initiation
      const allUsers: any[] = [];
      
      // Get vendors from venue catalog
      const venues = JSON.parse(localStorage.getItem('venue_catalog') || '[]');
      venues.forEach((venue: any) => {
        if (venue.vendorId) {
          allUsers.push({
            id: venue.vendorId,
            name: venue.name + ' Owner',
            type: 'Venue Owner',
            isVendor: true,
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
            contact: venue.contact
          });
        }
      });
      
      // Add mock vendors and customers
      const mockUsers = [
        { id: 'vendor_1', name: 'Elite Catering', type: 'Caterer', isVendor: true, avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=face' },
        { id: 'vendor_2', name: 'Dream Decorators', type: 'Decorator', isVendor: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
        { id: 'vendor_3', name: 'Perfect Photos', type: 'Photographer', isVendor: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
        { id: 'customer_1', name: 'Priya Sharma', type: 'Customer', isVendor: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
        { id: 'customer_2', name: 'Rahul Kumar', type: 'Customer', isVendor: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
      ];
      
      setAvailableUsers([...allUsers, ...mockUsers]);
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const startNewChat = (user: any) => {
    if (!currentUser) return;
    
    const chatId = `${currentUser.id}_${user.id}`;
    const existingChat = chatList.find(chat => chat.id === chatId);
    
    if (existingChat) {
      setSelectedChat(chatId);
      setShowNewChatModal(false);
      return;
    }
    
    const newChat = {
      id: chatId,
      name: user.name,
      type: user.type,
      avatar: user.avatar,
      isVendor: user.isVendor,
      online: Math.random() > 0.5,
      lastMessage: 'Start a conversation',
      unread: 0,
      favorite: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedChats = [...chatList, newChat];
    setChatList(updatedChats);
    
    // Save to localStorage
    localStorage.setItem(`chats_${currentUser.id}`, JSON.stringify(updatedChats));
    
    // Initialize empty messages for this chat
    const updatedMessages = { ...chatMessages, [chatId]: [] };
    setChatMessages(updatedMessages);
    localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(updatedMessages));
    
    setSelectedChat(chatId);
    setShowNewChatModal(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const selectedChatInfo = chatList.find((c) => c.id === selectedChat)

  const filteredChats = chatList.filter((chat) => {
    // Filter based on search term
    if (
      searchTerm &&
      !chat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !chat.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !chat.event.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter based on active tab
    if (activeTab === "favorites" && !chat.favorite) {
      return false
    } else if (activeTab === "unread" && chat.unread === 0) {
      return false
    }

    return true
  })

  const handleSend = () => {
    if (!selectedChat || !currentUser || (!newMessage.trim() && !attachmentPreview)) return;
    
    const messageId = Date.now();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: messageId,
      sender: currentUser.id,
      senderName: currentUser.name,
      text: newMessage,
      time: timeString,
      date: now.toDateString(),
      status: "sent",
      createdAt: now.toISOString(),
      attachment: attachmentPreview ? {
        type: "image",
        url: attachmentPreview,
        name: "image.jpg"
      } : undefined
    };
    
    // Update messages
    const updatedMessages = {
      ...chatMessages,
      [selectedChat]: [...(chatMessages[selectedChat] || []), newMsg]
    };
    setChatMessages(updatedMessages);
    
    // Update chat list with last message
    const updatedChats = chatList.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: newMessage || 'Image', lastMessageTime: timeString }
        : chat
    );
    setChatList(updatedChats);
    
    // Save to localStorage
    localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(updatedMessages));
    localStorage.setItem(`chats_${currentUser.id}`, JSON.stringify(updatedChats));
    
    // Create notification for recipient
    const recipientId = selectedChat.split('_').find(id => id !== currentUser.id);
    if (recipientId) {
      const notification = {
        id: Date.now(),
        type: 'message',
        title: 'New Message',
        message: `${currentUser.name}: ${newMessage || 'Sent an image'}`,
        from: currentUser.id,
        read: false,
        createdAt: now.toISOString()
      };
      
      const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${recipientId}`) || '[]');
      localStorage.setItem(`notifications_${recipientId}`, JSON.stringify([notification, ...existingNotifications]));
    }
    
    setNewMessage("");
    setAttachmentPreview(null);
    
    // Simulate message delivery
    setTimeout(() => {
      setMessageStatus(prev => ({ ...prev, [messageId]: "delivered" }));
    }, 1000);
    
    // Simulate read receipt
    setTimeout(() => {
      setMessageStatus(prev => ({ ...prev, [messageId]: "read" }));
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAttachmentPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setIsEmojiPickerOpen(false)
  }

  const markAsRead = (chatId: string) => {
    if (!currentUser) return;
    
    const updatedChats = chatList.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    );
    setChatList(updatedChats);
    localStorage.setItem(`chats_${currentUser.id}`, JSON.stringify(updatedChats));
  };

  const deleteMessage = (messageIndex: number) => {
    if (!selectedChat || !currentUser) return;
    
    const updatedMessages = { ...chatMessages };
    updatedMessages[selectedChat].splice(messageIndex, 1);
    setChatMessages(updatedMessages);
    localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(updatedMessages));
  };

  const forwardMessage = () => {
    // In a real app, this would open a dialog to select recipients
    alert('Message forwarding feature - select recipients')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full max-w-full mx-0">
      {/* Header with title and background */}
      <div className="relative overflow-hidden bg-brand-gradient rounded-xl p-8 mb-6 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-white/90">Stay connected with vendors and planners for your events</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -ml-20"></div>
      </div>

      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <div className="flex h-[600px]">
          <div className={`w-full md:w-1/3 border-r bg-gray-50 ${showSidebar ? "block" : "hidden md:block"}`}>
            <div className="bg-gradient-to-r from-[#FF5A5F] to-[#673AB7] p-4 text-white">
              <h3 className="font-semibold">Conversations</h3>
              {windowWidth <= 768 && (
                <button className="absolute top-4 right-4 text-white" onClick={toggleSidebar}>
                  ×
                </button>
              )}
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    className="pl-10 pr-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <Button 
                  onClick={() => setShowNewChatModal(true)}
                  className="bg-button-gradient text-white"
                  size="sm"
                >
                  <FaPaperPlane className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="overflow-y-auto h-[400px]">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedChat === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                    onClick={() => {
                      setSelectedChat(chat.id)
                      markAsRead(chat.id)
                      if (windowWidth <= 768) {
                        setShowSidebar(false)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {chat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{chat.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-xs py-0 px-2 bg-[#FF5A5F]/10 text-[#FF5A5F] font-normal"
                          >
                            {chat.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs py-0 px-2 font-normal">
                            {chat.event}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 truncate">{chat.lastMessage}</div>
                      </div>
                      {chat.unread > 0 && (
                        <Badge className="bg-gradient-to-r from-[#FF5A5F] to-[#673AB7] h-6 min-w-[24px] flex items-center justify-center">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
                  <div className="p-4 bg-[#673AB7]/10 rounded-full mb-3">
                    <FaSearch className="text-[#673AB7]" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm">No conversations found</h3>
                  <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${showSidebar && windowWidth <= 768 ? "hidden" : "flex"}`}>
            <div className="border-b p-4 bg-white">
              {windowWidth <= 768 && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
                  ☰
                </Button>
              )}

              {selectedChatInfo && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedChatInfo.avatar || "/placeholder.svg"}
                      alt={selectedChatInfo.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{selectedChatInfo.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${selectedChatInfo.online ? "bg-green-500" : "bg-gray-400"}`}
                        ></span>
                        {selectedChatInfo.online ? "Online" : "Offline"} • {selectedChatInfo.type} •{" "}
                        {selectedChatInfo.event}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <FaPhoneAlt className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <FaVideo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <FaEllipsisH className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedChat && chatMessages[selectedChat]?.map((msg, index, array) => {
                const showDateSeparator = index === 0 || array[index - 1].date !== msg.date
                const msgStatus = messageStatus[msg.id] || msg.status

                return (
                  <div key={msg.id || index} className="mb-4">
                    {showDateSeparator && (
                      <div className="text-center mb-4">
                        <Badge variant="outline" className="bg-white">
                          {msg.date}
                        </Badge>
                      </div>
                    )}

                    <div className={`flex ${msg.sender === currentUser?.id ? "justify-end" : "justify-start"} mb-2 group`}>
                      <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                        {msg.sender !== currentUser?.id && (
                          <img 
                            src={selectedChatInfo?.avatar || '/placeholder.svg'} 
                            alt="Avatar" 
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-lg relative ${
                            msg.sender === currentUser?.id
                              ? "bg-gradient-to-r from-[#FF5A5F] to-[#673AB7] text-white"
                              : "bg-white border shadow-sm"
                          }`}
                          onDoubleClick={() => msg.sender === currentUser?.id && deleteMessage(index)}
                        >
                          {msg.text && <div className="text-sm">{msg.text}</div>}

                          {msg.attachment && (
                            <div className="mt-2">
                              {msg.attachment.type === "image" ? (
                                <img 
                                  src={msg.attachment.url} 
                                  alt="Attachment" 
                                  className="max-w-full h-auto rounded cursor-pointer"
                                  onClick={() => window.open(msg.attachment.url, '_blank')}
                                />
                              ) : (
                                <div className="p-2 bg-white/10 rounded border flex items-center gap-2">
                                  <FaPaperclip className="h-3 w-3" />
                                  <div className="text-xs">
                                    <div className="font-medium">{msg.attachment.name}</div>
                                    <div className="text-xs opacity-75">{msg.attachment.size}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div
                            className={`text-xs mt-1 flex items-center gap-1 ${
                              msg.sender === currentUser?.id ? "text-white/70 justify-end" : "text-gray-500"
                            }`}
                          >
                            {msg.time}
                            {msg.sender === currentUser?.id && (
                              <span>
                                {msgStatus === "read" ? (
                                  <FaCheckDouble className="h-3 w-3 text-[#FFD700]" />
                                ) : msgStatus === "delivered" ? (
                                  <FaCheckDouble className="h-3 w-3" />
                                ) : (
                                  <FaCheck className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                          
                          {/* Message actions */}
                          <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 bg-white shadow-sm"
                              onClick={() => forwardMessage()}
                            >
                              →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t bg-white">
              {/* Attachment preview */}
              {attachmentPreview && (
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img src={attachmentPreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                    <span className="text-sm text-gray-600">Image ready to send</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setAttachmentPreview(null)}
                      className="ml-auto text-red-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Emoji picker */}
              {isEmojiPickerOpen && (
                <div className="p-3 border-b bg-white">
                  <div className="flex flex-wrap gap-2">
                    {['😀', '😂', '😍', '🥰', '😊', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏'].map(emoji => (
                      <Button 
                        key={emoji}
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addEmoji(emoji)}
                        className="text-lg hover:bg-gray-100"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      className="pr-24"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => selectedChat && markAsRead(selectedChat)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      >
                        <FaSmile className="h-4 w-4" />
                      </Button>
                      <label>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <FaPaperclip className="h-4 w-4" />
                        </Button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSend} 
                    className="bg-button-gradient text-white"
                    disabled={!newMessage.trim() && !attachmentPreview}
                  >
                    <FaPaperPlane className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Start New Chat</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNewChatModal(false)}
              >
                <FaTimes className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {availableUsers
                  .filter(user => user.id !== currentUser?.id)
                  .filter(user => currentUser?.isVendor ? !user.isVendor : user.isVendor)
                  .map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => startNewChat(user)}
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.type}</div>
                    </div>
                    <Badge 
                      variant={user.isVendor ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {user.isVendor ? "Vendor" : "Customer"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}