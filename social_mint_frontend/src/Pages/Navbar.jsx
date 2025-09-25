import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ImageIcon,
  FileText,
  Calendar,
  MessageCircle,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const location = useLocation();
  const navLinks = [
    { name: "Home", to: "/", icon: <Home className="w-5 h-5" /> },
    { name: "NFTs", to: "/nfts", icon: <ImageIcon className="w-5 h-5" /> },
    { name: "Blogs", to: "/blogs", icon: <FileText className="w-5 h-5" /> },
    { name: "Events", to: "/events", icon: <Calendar className="w-5 h-5" /> },
    {
      name: "Chats",
      to: "/chats",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-2 border-gray-200 shadow-xl rounded-2xl m-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand / Logo */}
          <Link to="/" className="text-2xl font-bold text-black">
            SocialMint
          </Link>

          {/* Nav Links */}
          <div className="flex space-x-8 relative">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`flex items-center space-x-2 text-gray-600 hover:text-gray-400 transition-colors duration-200 relative px-2 py-2`}
                >
                  {link.icon}
                  <span className={`text-sm font-medium`}>{link.name}</span>
                  {/* Animated underline or marker */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-black text-white hover:bg-gray-800 cursor-pointer">
                  <Plus className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-30">
                <DropdownMenuItem asChild>
                  <Link to="/insert-nft"> Insert NFT</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/insert-event">Insert Event</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/insert-blog"> Insert Blog</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/profile" className="flex items-center space-x-2">
              <Avatar className="border-white border-2 size-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
