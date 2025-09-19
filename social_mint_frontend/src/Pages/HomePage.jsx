import React, { useState } from "react";

// Example shadcn imports — adjust paths if your project uses a different structure.
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

export default function SocialMintHomepage() {
  // sample data
  const samplePosts = [
    {
      id: "p1",
      username: "algonet",
      profilePic: "https://i.pravatar.cc/40?img=3",
      image:
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
      caption: "Minted my first Algorand NFT! 🚀",
      likes: 12,
      postedAt: "2025-09-16",
    },
    {
      id: "p2",
      username: "blockqueen",
      profilePic: "https://i.pravatar.cc/40?img=5",
      image:
        "https://images.unsplash.com/photo-1558980664-10e7178bb9d2?q=80&w=1200&auto=format&fit=crop",
      caption: "Drop tomorrow — rare generative art.",
      likes: 34,
      postedAt: "2025-09-17",
    },
  ];

  const sampleBlogs = [
    {
      id: "b1",
      title: "How to Create an Algorand NFT",
      author: "Drashti",
      date: "2025-09-10",
    },
    {
      id: "b2",
      title: "Gasless Transfers on Algorand",
      author: "AlgoInsights",
      date: "2025-09-12",
    },
    {
      id: "b3",
      title: "Designing Collectibles",
      author: "ArtLab",
      date: "2025-09-15",
    },
  ];

  const sampleEvents = [
    {
      id: "e1",
      title: "Algorand Hackathon",
      host: "AlgoFoundation",
      when: "2025-10-01",
      upcoming: true,
    },
    {
      id: "e2",
      title: "Minting Workshop",
      host: "SocialMint",
      when: "2025-09-20",
      upcoming: true,
    },
    {
      id: "e3",
      title: "Post-mortem: NFT Drop",
      host: "BlockStudio",
      when: "2025-09-05",
      upcoming: false,
    },
  ];

  // UI state
  const [posts, setPosts] = useState(samplePosts);
  const [liked, setLiked] = useState({}); // { postId: true }
  const [commentOpen, setCommentOpen] = useState({});
  const [comments, setComments] = useState({});
  const [showShareFor, setShowShareFor] = useState(null);
  const [eventsFilter, setEventsFilter] = useState("all");
  const [blogsFilter, setBlogsFilter] = useState("all");
  const [chatMessages, setChatMessages] = useState([]);

  // handlers
  function toggleLike(postId) {
    setLiked((prev) => {
      const isLiked = !prev[postId]; // toggle state
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
    const url = `https://socialmint.app/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch (e) {
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
    setChatMessages((m) => [
      { id: Date.now(), content: `Shared post ${post.id}: ${post.caption}` },
      ...m,
    ]);
    alert("Shared to app chat (simulated).");
  }

  async function tryNativeShare(post) {
    const shareData = {
      title: "SocialMint",
      text: post.caption,
      url: `https://socialmint.app/posts/${post.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.warn("Native share cancelled or failed", e);
      }
    } else {
      alert("Your device doesn't support native sharing. Try Copy or WhatsApp.");
    }
  }

  // filtered lists
  const filteredEvents = sampleEvents.filter((e) => {
    if (eventsFilter === "all") return true;
    if (eventsFilter === "upcoming") return e.upcoming;
    if (eventsFilter === "recent") return !e.upcoming;
    return true;
  });

  const filteredBlogs = sampleBlogs.filter((b) => {
    if (blogsFilter === "all") return true;
    if (blogsFilter === "latest")
      return new Date(b.date) > new Date("2025-09-11");
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">SocialMint</h1>
          <div className="text-sm text-slate-600">Algorand • Social • NFTs</div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          {/* LEFT: Blogs */}
          <aside className="col-span-3 sticky top-0 h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Recent Blogs</h2>
              <select
                value={blogsFilter}
                onChange={(e) => setBlogsFilter(e.target.value)}
                className="text-sm bg-white border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="latest">Latest</option>
              </select>
            </div>

            <div className="h-[70vh] overflow-y-auto pr-2">
              {filteredBlogs.map((b) => (
                <Card
                  key={b.id}
                  className="mb-4 transform hover:shadow-2xl transition-shadow shadow-md"
                >
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-slate-500">
                          {b.author} • {b.date}
                        </div>
                      </div>
                      <Button size="sm">Read</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="mt-4 text-center">
                <Button variant="ghost">View all blogs</Button>
              </div>
            </div>
          </aside>

          {/* CENTER: Feed */}
          <section className="col-span-6">
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl p-4 shadow-xl transform motion-safe hover:shadow-2xl transition transform-gpu"
                >
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

                  <div className="rounded-xl overflow-hidden mb-3">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full object-cover max-h-96"
                    />
                  </div>

                  <p className="mb-3 text-slate-700">{post.caption}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        aria-pressed={!!liked[post.id]}
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          liked[post.id]
                            ? "text-red-600 border-red-200 bg-red-50"
                            : "text-slate-700 border-slate-100 bg-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill={liked[post.id] ? "currentColor" : "none"}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 21s-8-7.4-8-11a4 4 0 018-2 4 4 0 018 2c0 3.6-8 11-8 11z"
                          />
                        </svg>
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button
                        onClick={() => toggleCommentSection(post.id)}
                        className="px-3 py-1 rounded-full border text-sm border-slate-100"
                      >
                        Comment
                      </button>

                      <button
                        onClick={() => setShowShareFor(post.id)}
                        className="px-3 py-1 rounded-full border text-sm border-slate-100"
                      >
                        Share
                      </button>
                    </div>

                    <div className="text-xs text-slate-400">#{post.id}</div>
                  </div>

                  {/* Comment Drawer */}
                  {commentOpen[post.id] && (
                    <div className="mt-4 border-t pt-3 relative">
                      <button
                        onClick={() => toggleCommentSection(post.id)}
                        className="absolute -top-3 right-3 rounded-full bg-white border px-2 py-1 text-xs"
                      >
                        Close
                      </button>
                      <div className="space-y-2">
                        <div>
                          <Input
                            id={`comment-${post.id}`}
                            placeholder="Write a comment..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addComment(post.id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                          />
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {(comments[post.id] || []).map((c) => (
                            <div
                              key={c.id}
                              className="bg-slate-50 p-2 rounded"
                            >
                              <div className="text-sm">{c.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT: Events */}
          <aside className="col-span-3 sticky top-0 h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Events</h2>
              <select
                value={eventsFilter}
                onChange={(e) => setEventsFilter(e.target.value)}
                className="text-sm bg-white border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="recent">Recent</option>
              </select>
            </div>

            <div className="h-[70vh] overflow-y-auto pr-2 ">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="mb-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-lg"
                >
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-xs text-slate-500">
                    {ev.host} • {ev.when}
                  </div>
                </div>
              ))}

              <div className="mt-4 text-center">
                <Button variant="ghost">View all events</Button>
              </div>
            </div>
          </aside>
        </main>

        {/* Share Dialog */}
        <Dialog
          open={!!showShareFor}
          onOpenChange={(open) => {
            if (!open) setShowShareFor(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Post</DialogTitle>
            </DialogHeader>

            {showShareFor && (
              <div className="space-y-4">
                <div className="text-sm">Choose how to share:</div>
                <div className="flex flex-col sm:flex-row gap-2">
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
                      tryNativeShare(
                        posts.find((p) => p.id === showShareFor)
                      );
                      setShowShareFor(null);
                    }}
                  >
                    Native Share
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowShareFor(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
