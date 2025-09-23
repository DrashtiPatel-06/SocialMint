import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export default function ChatPage() {
  const sampleChats = [
    {
      id: "c1",
      username: "algodev",
      profilePic: "https://i.pravatar.cc/40?img=20",
      lastMessage: "Hey, did you check the new NFT drop?",
      messages: [
        { from: "me", text: "Hey! 👋", time: "10:20 AM" },
        { from: "algodev", text: "Did you check the new NFT drop?", time: "10:21 AM" },
      ],
    },
    {
      id: "c2",
      username: "drashti",
      profilePic: "https://i.pravatar.cc/40?img=21",
      lastMessage: "See you in the hackathon!",
      messages: [
        { from: "drashti", text: "See you in the hackathon! 🚀", time: "9:10 AM" },
      ],
    },
  ];

  const [chats, setChats] = useState(sampleChats);
  const [activeChat, setActiveChat] = useState(sampleChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const updatedChat = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        {
          from: "me",
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      lastMessage: newMessage,
    };
    setChats((prev) =>
      prev.map((c) => (c.id === activeChat.id ? updatedChat : c))
    );
    setActiveChat(updatedChat);
    setNewMessage("");
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 font-semibold text-lg border-b">Chats</div>
        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 ${
                activeChat.id === chat.id ? "bg-slate-200" : ""
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <Avatar>
                <AvatarImage src={chat.profilePic} alt={chat.username} />
                <AvatarFallback>{chat.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{chat.username}</div>
                <div className="text-xs text-slate-500 truncate w-40">
                  {chat.lastMessage}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Active Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-white">
          <Avatar>
            <AvatarImage src={activeChat.profilePic} alt={activeChat.username} />
            <AvatarFallback>{activeChat.username[0]}</AvatarFallback>
          </Avatar>
          <Link to={`/profile/${activeChat.username}`} className="font-medium">{activeChat.username}</Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {activeChat.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`px-3 py-2 max-w-xs ${
                  msg.from === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow"
                }`}
              >
                <CardContent className="p-0">
                  <div>{msg.text}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {msg.time}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input (fixed at bottom) */}
        <div className="p-3 border-t flex gap-2 bg-white">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
