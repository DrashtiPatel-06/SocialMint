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

export default function BlogPage() {
  // Sample blogs
  const sampleBlogs = [
    {
      id: "b1",
      title: "Getting Started with Algorand",
      author: "cryptoGuru",
      date: "2025-09-10",
      excerpt:
        "Algorand is a fast, secure blockchain — here’s how to begin your journey.",
      likes: 15,
    },
    {
      id: "b2",
      title: "NFTs on Algorand",
      author: "nftartist",
      date: "2025-09-12",
      excerpt:
        "Why Algorand NFTs are different from others and how they scale.",
      likes: 28,
    },
    {
      id: "b3",
      title: "Algorand DeFi Growth",
      author: "defiMaster",
      date: "2025-09-15",
      excerpt:
        "DeFi on Algorand is expanding — let’s explore the biggest projects.",
      likes: 9,
    },
  ];

  const [blogs, setBlogs] = useState(sampleBlogs);
  const [liked, setLiked] = useState({});
  const [showShareFor, setShowShareFor] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 2;

  // handlers
  function toggleLike(blogId) {
    setLiked((prev) => {
      const isLiked = !prev[blogId];
      const updated = { ...prev, [blogId]: isLiked };

      setBlogs((bs) =>
        bs.map((b) =>
          b.id === blogId
            ? { ...b, likes: b.likes + (isLiked ? 1 : -1) }
            : b
        )
      );

      return updated;
    });
  }

  async function copyLink(blog) {
    try {
      await navigator.clipboard.writeText(
        `https://socialmint.app/blog/${blog.id}`
      );
      alert("Link copied!");
    } catch {
      alert("Could not copy link.");
    }
  }

  function shareToWhatsApp(blog) {
    const text = encodeURIComponent(
      `${blog.title} — read on SocialMint: https://socialmint.app/blog/${blog.id}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function shareToChat(blog) {
    alert(`Shared to in-app chat: ${blog.title}`);
  }

  async function tryNativeShare(blog) {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: `https://socialmint.app/blog/${blog.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      alert("Native share not supported.");
    }
  }

  // filtering
  let filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (dateFilter !== "all") {
    filtered = filtered.filter((b) =>
      dateFilter === "today"
        ? new Date(b.date).toDateString() === new Date().toDateString()
        : new Date(b.date) < new Date()
    );
  }

  if (sortBy === "likes") {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "latest") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
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
          placeholder="Search blog..."
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

      {/* Blogs */}
      <div className="space-y-6">
        {paginated.map((blog) => (
          <Card
            key={blog.id}
            className="p-4 rounded-2xl shadow-xl bg-white hover:shadow-2xl transition"
          >
            <CardContent>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-sm text-slate-500 mb-2">
                By {blog.author} — {blog.date}
              </p>
              <p className="mb-3 text-slate-700">{blog.excerpt}</p>

              <div className="flex items-center gap-3">
                <button
                  aria-pressed={!!liked[blog.id]}
                  onClick={() => toggleLike(blog.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
                    liked[blog.id]
                      ? "text-red-600 border-red-200 bg-red-50"
                      : "text-gray-500 border-gray-200 bg-white"
                  }`}
                >
                  ❤️ <span className="text-sm">{blog.likes}</span>
                </button>

                <button
                  onClick={() => setShowShareFor(blog.id)}
                  className="px-3 py-1 rounded-full border text-sm"
                >
                  Share
                </button>
              </div>
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
            <DialogTitle>Share Blog</DialogTitle>
          </DialogHeader>

          {showShareFor && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  shareToChat(blogs.find((b) => b.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                Share to Chat
              </Button>
              <Button
                onClick={() => {
                  shareToWhatsApp(blogs.find((b) => b.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  copyLink(blogs.find((b) => b.id === showShareFor));
                  setShowShareFor(null);
                }}
              >
                Copy Link
              </Button>
              <Button
                onClick={() => {
                  tryNativeShare(blogs.find((b) => b.id === showShareFor));
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
