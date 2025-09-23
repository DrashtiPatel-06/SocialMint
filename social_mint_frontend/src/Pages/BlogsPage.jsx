import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const sampleBlogs = [
    {
      id: "b1",
      username: "web3dev",
      profilePic: "https://i.pravatar.cc/40?img=10",
      title: "Why Algorand is Future of Blockchain",
      category: "Web3",
      likes: 22,
      postedAt: "2025-09-15",
    },
    {
      id: "b2",
      username: "techgirl",
      profilePic: "https://i.pravatar.cc/40?img=12",
      title: "Building Dapps with SocialMint",
      category: "Tech",
      likes: 30,
      postedAt: "2025-09-17",
    },
    {
      id: "b3",
      username: "drashti",
      profilePic: "https://i.pravatar.cc/40?img=14",
      title: "Lifestyle as a Web3 Creator",
      category: "Lifestyle",
      likes: 10,
      postedAt: "2025-09-18",
    },
  ];

  const [blogs, setBlogs] = useState(sampleBlogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [shareBlog, setShareBlog] = useState(null);

  const toggleLike = (blogId) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              likes: blog.likes + (blog.liked ? -1 : 1),
              liked: !blog.liked,
            }
          : blog
      )
    );
  };

  const copyLink = (blog) => {
    navigator.clipboard.writeText(window.location.href + "#" + blog.id);
    alert("Link copied!");
  };

  const shareToWhatsApp = (blog) => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      blog.title + " - " + window.location.href + "#" + blog.id
    )}`;
    window.open(url, "_blank");
  };

  const filteredBlogs = blogs
    .filter(
      (b) =>
        b.username.toLowerCase().includes(search.toLowerCase()) ||
        b.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((b) =>
      categoryFilter === "all" ? true : b.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortOrder === "latest")
        return new Date(b.postedAt) - new Date(a.postedAt);
      if (sortOrder === "oldest")
        return new Date(a.postedAt) - new Date(b.postedAt);
      if (sortOrder === "popular") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Blogs</h1>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Input
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-1/3"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Web3">Web3</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Liked</option>
          </select>
        </div>

        {/* Blogs */}
        <div className="space-y-4">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <CardContent>
                <header className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={blog.profilePic} alt={blog.username} />
                    <AvatarFallback>{blog.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/profile/${blog.username}`} className="font-medium">{blog.username}</Link>
                    <div className="text-xs text-slate-500">
                      {blog.postedAt}
                    </div>
                  </div>
                </header>

                <h2 className="font-semibold text-lg mb-2">{blog.title}</h2>
                <p className="text-xs text-slate-500 mb-3">
                  Category: {blog.category}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    aria-pressed={!!blog.liked}
                    onClick={() => toggleLike(blog.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition ${
                      blog.liked
                        ? "text-red-600 border-red-200 bg-red-50"
                        : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill={blog.liked ? "currentColor" : "none"}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21s-8-7.4-8-11a4 4 0 018-2 4 4 0 018 2c0 3.6-8 11-8 11z"
                      />
                    </svg>
                    <span className="text-sm">{blog.likes}</span>
                  </button>
                  <button
                    onClick={() => setShareBlog(blog)}
                    className="px-3 py-1 rounded-full border text-sm"
                  >
                    Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No blogs found
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <Dialog
        open={!!shareBlog}
        onOpenChange={(open) => {
          if (!open) setShareBlog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>

          {shareBlog && (
            <div className="space-y-4">
              <div className="text-sm">Choose how to share:</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    alert("Shared inside chat!");
                    setShareBlog(null);
                  }}
                >
                  Share to Chat
                </Button>
                <Button
                  onClick={() => {
                    shareToWhatsApp(shareBlog);
                    setShareBlog(null);
                  }}
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => {
                    copyLink(shareBlog);
                    setShareBlog(null);
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: shareBlog.title,
                        url: window.location.href + "#" + shareBlog.id,
                      });
                    } else {
                      alert("Native share not supported");
                    }
                    setShareBlog(null);
                  }}
                >
                  Native Share
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShareBlog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
