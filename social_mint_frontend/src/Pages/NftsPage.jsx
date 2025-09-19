import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function NFTPage() {
  // sample NFT posts
  const samplePosts = [
    {
      id: "n1",
      username: "algonet",
      profilePic: "https://i.pravatar.cc/40?img=3",
      image:
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
      caption: "Minted my first Algorand NFT! 🚀",
      likes: 12,
      postedAt: "2025-09-16",
    },
    {
      id: "n2",
      username: "blockqueen",
      profilePic: "https://i.pravatar.cc/40?img=5",
      image:
        "https://images.unsplash.com/photo-1558980664-10e7178bb9d2?q=80&w=1200&auto=format&fit=crop",
      caption: "Rare generative art drop ✨",
      likes: 34,
      postedAt: "2025-09-17",
    },
    {
      id: "n3",
      username: "artlover",
      profilePic: "https://i.pravatar.cc/40?img=8",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      caption: "Ocean vibes collection 🌊",
      likes: 20,
      postedAt: "2025-09-18",
    },
  ];

  const [posts, setPosts] = useState(samplePosts);
  const [liked, setLiked] = useState({});
  const [commentOpen, setCommentOpen] = useState({});
  const [comments, setComments] = useState({});
  const [showShareFor, setShowShareFor] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 2;

  // handlers
  function toggleLike(postId) {
    setLiked((prev) => {
      const isLiked = !prev[postId];
      const updated = { ...prev, [postId]: isLiked };

      setPosts((ps) =>
        ps.map((p) =>
          p.id === postId
            ? { ...p, likes: p.likes + (isLiked ? 1 : -1) }
            : p
        )
      );

      return updated;
    });
  }

  function toggleCommentSection(postId) {
    setCommentOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  function addComment(postId, text) {
    if (!text) return;
    setComments((prev) => {
      const list = prev[postId] ? [...prev[postId]] : [];
      list.push({ id: `${postId}-c-${Date.now()}`, text });
      return { ...prev, [postId]: list };
    });
  }

  async function copyLink(post) {
    try {
      await navigator.clipboard.writeText(
        `https://socialmint.app/nfts/${post.id}`
      );
      alert("Link copied!");
    } catch {
      alert("Could not copy link.");
    }
  }

  function shareToWhatsApp(post) {
    const text = encodeURIComponent(
      `${post.caption} — see on SocialMint: https://socialmint.app/nfts/${post.id}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function shareToChat(post) {
    alert(`Shared to in-app chat: ${post.caption}`);
  }

  async function tryNativeShare(post) {
    const shareData = {
      title: "SocialMint NFT",
      text: post.caption,
      url: `https://socialmint.app/nfts/${post.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      alert("Native share not supported.");
    }
  }

  // filter + sort
  let filtered = posts.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  if (dateFilter !== "all") {
    filtered = filtered.filter((p) =>
      dateFilter === "today"
        ? new Date(p.postedAt).toDateString() === new Date().toDateString()
        : new Date(p.postedAt) < new Date()
    );
  }

  if (sortBy === "likes") {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "latest") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
    );
  }

  // pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function clearFilters() {
    setSearch("");
    setDateFilter("all");
    setSortBy("latest");
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input
          placeholder="Search by user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-40"
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="past">Past</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="latest">Latest</option>
          <option value="likes">Most Liked</option>
        </select>

        <Button
          variant="secondary"
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          Clear Filters
        </Button>
      </div>

      {/* NFT Posts */}
      <div className="space-y-6">
        {paginated.map((post) => (
          <Card
            key={post.id}
            className="p-4 rounded-2xl shadow-xl bg-white hover:shadow-2xl transition"
          >
            <CardContent>
              <header className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={post.profilePic} alt={post.username} />
                  <AvatarFallback>
                    {post.username.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.username}</div>
                  <div className="text-xs text-slate-500">
                    {post.postedAt}
                  </div>
                </div>
              </header>

              <div className="rounded-lg overflow-hidden mb-3">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full max-h-96 object-cover"
                />
              </div>

              <p className="mb-3 text-slate-700">{post.caption}</p>

              <div className="flex items-center gap-3">
                <button
                  aria-pressed={!!liked[post.id]}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                    liked[post.id]
                      ? "text-red-600 border-red-200 bg-red-50"
                      : "text-slate-700 border-slate-200 bg-white"
                  }`}
                >
                  ❤️ <span className="text-sm">{post.likes}</span>
                </button>

                <button
                  onClick={() => toggleCommentSection(post.id)}
                  className="px-3 py-1 rounded-full border text-sm"
                >
                  Comment
                </button>

                <button
                  onClick={() => setShowShareFor(post.id)}
                  className="px-3 py-1 rounded-full border text-sm"
                >
                  Share
                </button>
              </div>

              {commentOpen[post.id] && (
                <div className="mt-4 border-t pt-3 relative">
                  <button
                    onClick={() => toggleCommentSection(post.id)}
                    className="absolute -top-3 right-3 px-2 py-1 text-xs bg-white border rounded-full"
                  >
                    Close
                  </button>
                  <Input
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {(comments[post.id] || []).map((c) => (
                      <div key={c.id} className="bg-slate-50 p-2 rounded">
                        {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Share Dialog */}
      <Dialog
        open={!!showShareFor}
        onOpenChange={(open) => !open && setShowShareFor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share NFT Post</DialogTitle>
          </DialogHeader>

          {showShareFor && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  shareToChat(posts.find((p) => p.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                Share to Chat
              </Button>
              <Button
                onClick={() => {
                  shareToWhatsApp(posts.find((p) => p.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  copyLink(posts.find((p) => p.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                Copy Link
              </Button>
              <Button
                onClick={() => {
                  tryNativeShare(posts.find((p) => p.id === showShareFor));
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
    </div>
  );
}
