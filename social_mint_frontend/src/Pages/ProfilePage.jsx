import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [postOpen, setPostOpen] = useState(null);
  const [showShareFor, setShowShareFor] = useState(null);

  const [user, setUser] = useState({
    username: "John Doe",
    email: "john@example.com",
    bio: "Collector | Web3 Enthusiast",
    profilePic: "https://i.pravatar.cc/150?u=me",
    walletAddress: "0xABC1234567890DEFabcdef1234567890ABCDEF12",
  });

  const currentUser = {
    username: "drashti",
    profilePic: "https://i.pravatar.cc/40?img=8",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      src: "https://picsum.photos/600/400?random=1",
      caption: "First NFT",
      likes: 12,
    },
    {
      id: 2,
      src: "https://picsum.photos/600/400?random=2",
      caption: "Second NFT",
      likes: 8,
    },
    {
      id: 3,
      src: "https://picsum.photos/600/400?random=3",
      caption: "Third NFT",
      likes: 20,
    },
  ]);

  const [comments, setComments] = useState({});
  const [liked, setLiked] = useState({});
  const [commentOpen, setCommentOpen] = useState({}); // ✅ FIX: added missing state

  // Like handler
  function toggleLike(postId) {
    setLiked((prev) => {
      const isLiked = !prev[postId];
      const updated = { ...prev, [postId]: isLiked };

      setPosts((ps) =>
        ps.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p
        )
      );

      return updated;
    });
  }

  // Toggle comment section
  function toggleCommentSection(postId) {
    setCommentOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  // Comment handler
  function addComment(postId, text) {
    if (!text) return;
    setComments((prev) => {
      const list = prev[postId] ? [...prev[postId]] : [];
      list.push({
        id: `${postId}-c-${Date.now()}`,
        text,
        username: currentUser.username,
        profilePic: currentUser.profilePic,
      });
      return { ...prev, [postId]: list };
    });
  }

  // Share handlers
  async function copyLink(post) {
    try {
      await navigator.clipboard.writeText(
        `https://socialmint.app/posts/${post.id}`
      );
      alert("Link copied!");
    } catch {
      alert("Could not copy link.");
    }
  }

  function shareToWhatsApp(post) {
    const text = encodeURIComponent(
      `${post.caption} — see on SocialMint: https://socialmint.app/posts/${post.id}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function shareToChat(post) {
    alert(`Shared to in-app chat: ${post.caption}`);
  }

  async function tryNativeShare(post) {
    const shareData = {
      title: "SocialMint Post",
      text: post.caption,
      url: `https://socialmint.app/posts/${post.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      alert("Native share not supported.");
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setUser((prev) => ({
      ...prev,
      username: form.get("username"),
      email: form.get("email"),
      bio: form.get("bio"),
      profilePic: form.get("profilePic"),
    }));
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.bio}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
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

      {/* NFT Modal */}
      <Dialog open={!!postOpen} onOpenChange={() => setPostOpen(null)}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          {postOpen && (
            <div>
              <img
                src={postOpen.src}
                alt={postOpen.caption}
                className="rounded-lg w-full max-h-[400px] object-cover mb-3"
              />
              <p className="mb-3">{postOpen.caption}</p>

              <div className="flex items-center gap-3">
                {/* Like */}
                <button
                  aria-pressed={!!liked[postOpen.id]}
                  onClick={() => toggleLike(postOpen.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    liked[postOpen.id]
                      ? "text-red-600 border-red-200 bg-red-50"
                      : "text-slate-700 border-slate-100 bg-white"
                  }`}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill={liked[postOpen.id] ? "currentColor" : "none"}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 21s-8-7.4-8-11a4 4 0 018-2 4 4 0 018 2c0 3.6-8 11-8 11z"
                    />
                  </svg>
                  <span className="text-sm">
                    {posts.find((p) => p.id === postOpen.id)?.likes}
                  </span>
                </button>

                {/* Comment */}
                <button
                  onClick={() => toggleCommentSection(postOpen.id)}
                  className="px-3 py-1 rounded-full border text-sm"
                >
                  Comment
                </button>

                {/* Share */}
                <button
                  onClick={() => setShowShareFor(postOpen)}
                  className="px-3 py-1 rounded-full border text-sm"
                >
                  Share
                </button>
              </div>

              {/* Comment Section */}
              {commentOpen[postOpen.id] && (
                <div className="mt-4 border-t pt-3 relative">
                  <button
                    onClick={() => toggleCommentSection(postOpen.id)}
                    className="absolute -top-3 right-3 px-2 py-1 text-xs bg-white border rounded-full"
                  >
                    ✖
                  </button>
                  <Input
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(postOpen.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                    {(comments[postOpen.id] || []).map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50 p-2 rounded flex items-start gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.profilePic} alt={c.username} />
                          <AvatarFallback>{c.username.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            to={`/profile/${c.username}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {c.username}
                          </Link>
                          <div className="text-sm text-slate-700">{c.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={!!showShareFor}
        onOpenChange={(open) => !open && setShowShareFor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>

          {showShareFor && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  shareToChat(showShareFor);
                  setShowShareFor(null);
                }}
              >
                Share to Chat
              </Button>
              <Button
                onClick={() => {
                  shareToWhatsApp(showShareFor);
                  setShowShareFor(null);
                }}
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  copyLink(showShareFor);
                  setShowShareFor(null);
                }}
              >
                Copy Link
              </Button>
              <Button
                onClick={() => {
                  tryNativeShare(showShareFor);
                  setShowShareFor(null);
                }}
              >
                Native Share
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowShareFor(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Drawer */}
      <Drawer open={isEditing} onOpenChange={setIsEditing}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSave}>
            <div className="p-4 space-y-4">
              <Input name="username" defaultValue={user.username} />
              <Input name="email" defaultValue={user.email} />
              <Textarea name="bio" defaultValue={user.bio} />
              <Input name="profilePic" defaultValue={user.profilePic} />
              <Input
                name="wallet"
                value={user.walletAddress}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <DrawerFooter>
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
