import React, { useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [postOpen, setPostOpen] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      src: "https://picsum.photos/600/400?random=1",
      caption: "First NFT",
      likes: 12,
      liked: false,
    },
    {
      id: 2,
      src: "https://picsum.photos/600/400?random=2",
      caption: "Second NFT",
      likes: 8,
      liked: false,
    },
    {
      id: 3,
      src: "https://picsum.photos/600/400?random=3",
      caption: "Third NFT",
      likes: 20,
      liked: false,
    },
    {
      id: 3,
      src: "https://picsum.photos/600/400?random=3",
      caption: "Third NFT",
      likes: 20,
      liked: false,
    },
    {
      id: 3,
      src: "https://picsum.photos/600/400?random=3",
      caption: "Third NFT",
      likes: 20,
      liked: false,
    },
    {
      id: 3,
      src: "https://picsum.photos/600/400?random=3",
      caption: "Third NFT",
      likes: 20,
      liked: false,
    },
  ]);

  // Toggle like state
  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://i.pravatar.cc/150?u=me" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-muted-foreground">
            Collector | Web3 Enthusiast
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="aspect-square overflow-hidden rounded-lg shadow-sm cursor-pointer"
            onClick={() => setPostOpen(post)}
          >
            <img
              src={post.src}
              alt={post.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* NFT Modal with like, comment, share */}
      <Dialog open={!!postOpen} onOpenChange={() => setPostOpen(null)}>
        <DialogContent className="sm:max-w-2xl">
          {postOpen && (
            <div>
              <img
                src={postOpen.src}
                alt={postOpen.caption}
                className="rounded-lg w-full max-h-[400px] object-cover mb-3"
              />
              <p className="mb-3">{postOpen.caption}</p>

              <div className="flex items-center gap-3 mb-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className={postOpen.liked ? "text-red-500" : "text-slate-600"}
                  onClick={() => toggleLike(postOpen.id)}
                >
                  ❤️ {posts.find((p) => p.id === postOpen.id)?.likes}
                </Button>
                <Button size="sm" variant="ghost">
                  💬 Comment
                </Button>
                <Button size="sm" variant="ghost">
                  🔗 Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Drawer */}
      <Drawer open={isEditing} onOpenChange={setIsEditing}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Input placeholder="Name" defaultValue="John Doe" />
            <Input
              placeholder="Bio"
              defaultValue="Collector | Web3 Enthusiast"
            />
          </div>
          <DrawerFooter>
            <Button onClick={() => setIsEditing(false)}>Save</Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
