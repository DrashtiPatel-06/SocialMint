import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("nft");

  // NFT post modal
  const [postOpen, setPostOpen] = useState(null);
  const [liked, setLiked] = useState({});
  const [commentOpen, setCommentOpen] = useState({});
  const [comments, setComments] = useState({});
  const [showShareFor, setShowShareFor] = useState(null);

  // Blog and Event dummy data
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
  ];

  const sampleEvents = [
    {
      id: "e1",
      username: "algorandTeam",
      profilePic: "https://i.pravatar.cc/40?img=15",
      title: "Algorand Global Meetup",
      description: "Join us for a global Algorand community meetup.",
      date: "2025-09-20T18:00:00",
      likes: 40,
      type: "upcoming",
    },
    {
      id: "e2",
      username: "blockqueen",
      profilePic: "https://i.pravatar.cc/40?img=16",
      title: "Web3 Hackathon",
      description: "48 hours hackathon for Web3 devs.",
      date: "2025-09-10T10:00:00",
      likes: 25,
      type: "past",
    },
  ];

  const [blogs, setBlogs] = useState(sampleBlogs);
  const [events, setEvents] = useState(sampleEvents);
  const [shareBlog, setShareBlog] = useState(null);
  const [shareEvent, setShareEvent] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [eventLiked, setEventLiked] = useState({});

  useEffect(() => {
    // NFT dummy posts
    const fakeUser = {
      username,
      bio: "NFT Collector | Web3 Enthusiast",
      profilePic: "https://i.pravatar.cc/150?u=" + username,
    };
    const fakePosts = [
      { id: 1, src: "https://picsum.photos/400/400?random=11", caption: "Cool NFT", likes: 5 },
      { id: 2, src: "https://picsum.photos/400/400?random=12", caption: "Another NFT", likes: 8 },
    ];
    setUser(fakeUser);
    setPosts(fakePosts);
  }, [username]);

  const toggleLike = (postId) => {
    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (liked[postId] ? -1 : 1) } : p
      )
    );
  };

  const toggleCommentSection = (postId) => {
    setCommentOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          id: Date.now(),
          username: "me",
          profilePic: "https://i.pravatar.cc/150?u=me",
          text,
        },
      ],
    }));
  };

  const shareToChat = (post) => alert("Shared to Chat: " + post.caption || post.title);
  const shareToWhatsApp = (post) =>
    window.open(`https://wa.me/?text=${encodeURIComponent(post.caption || post.title)}`, "_blank");
  const copyLink = (post) => navigator.clipboard.writeText(window.location.href);
  const tryNativeShare = async (post) => {
    if (navigator.share) {
      await navigator.share({ title: post.caption || post.title, url: window.location.href });
    } else {
      alert("Native share not supported");
    }
  };

  const toggleBlogLike = (id) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, liked: !b.liked, likes: b.likes + (b.liked ? -1 : 1) } : b
      )
    );
  };

  const toggleEventLike = (id) => {
    setEventLiked((prev) => {
      const isLiked = !prev[id];
      setEvents((ev) =>
        ev.map((e) =>
          e.id === id ? { ...e, likes: e.likes + (isLiked ? 1 : -1) } : e
        )
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const getCalendarLinks = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const startStr = start.toISOString().replace(/-|:|\.\d+/g, "");
    const endStr = end.toISOString().replace(/-|:|\.\d+/g, "");
    const title = encodeURIComponent(event.title);
    const desc = encodeURIComponent(event.description);
    const location = encodeURIComponent("Online / TBD");

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${desc}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${desc}&startdt=${start.toISOString()}&enddt=${end.toISOString()}`,
      yahoo: `https://calendar.yahoo.com/?v=60&title=${title}&st=${startStr}&et=${endStr}&desc=${desc}&in_loc=${location}`,
      ics: (() => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART:${startStr}
DTEND:${endStr}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        return URL.createObjectURL(blob);
      })(),
    };
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-slate-200 mb-4">
          {["nft", "blogs", "events"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative cursor-pointer pb-2 font-medium text-slate-700 hover:text-slate-900"
            >
              {tab.toUpperCase()}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
              )}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* NFT Tab */}
          {activeTab === "nft" && (
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
          )}

          {/* Blogs Tab */}
          {activeTab === "blogs" && (
            <div className="space-y-4">
              {blogs.map((b) => (
                <Card key={b.id} className="p-4 shadow-md rounded-lg hover:shadow-lg">
                  <CardContent>
                    <header className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={b.profilePic} alt={b.username} />
                        <AvatarFallback>{b.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/profile/${b.username}`} className="font-medium">{b.username}</Link>
                        <div className="text-xs text-slate-500">{b.postedAt}</div>
                      </div>
                    </header>
                    <h2 className="font-semibold text-lg mb-2">{b.title}</h2>
                    <p className="text-xs text-slate-500 mb-3">Category: {b.category}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        aria-pressed={!!b.liked}
                        onClick={() => toggleBlogLike(b.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          b.liked ? "text-red-600 border-red-200 bg-red-50" : "text-slate-700 border-slate-200 bg-white"
                        }`}
                      >
                        ❤️ {b.likes}
                      </button>
                      <button
                        onClick={() => setShareBlog(b)}
                        className="px-3 py-1 rounded-full border text-sm"
                      >
                        Share
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {events.map((e) => (
                <Card key={e.id} className="p-4 shadow-md rounded-lg hover:shadow-lg">
                  <CardContent>
                    <header className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={e.profilePic} alt={e.username} />
                        <AvatarFallback>{e.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/profile/${e.username}`} className="font-medium">{e.username}</Link>
                        <div className="text-xs text-slate-500">{new Date(e.date).toLocaleString()}</div>
                      </div>
                    </header>
                    <h2 className="font-semibold text-lg mb-2">{e.title}</h2>
                    <p className="text-slate-600">{e.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        aria-pressed={!!eventLiked[e.id]}
                        onClick={() => toggleEventLike(e.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          eventLiked[e.id] ? "text-red-600 border-red-200 bg-red-50" : "text-slate-700 border-slate-100 bg-white"
                        }`}
                      >
                        ❤️ {e.likes}
                      </button>
                      <button
                        onClick={() => setShareEvent(e)}
                        className="px-3 py-1 rounded-full border text-sm"
                      >
                        Share
                      </button>
                      <Button size="sm" variant="outline" onClick={() => setCalendarEvent(e)}>📅 Add to Calendar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NFT Post Dialog */}
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
                <button
                  aria-pressed={!!liked[postOpen.id]}
                  onClick={() => toggleLike(postOpen.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    liked[postOpen.id] ? "text-red-600 border-red-200 bg-red-50" : "text-slate-700 border-slate-100 bg-white"
                  }`}
                >
                  ❤️ {posts.find((p) => p.id === postOpen.id)?.likes}
                </button>
                <button onClick={() => toggleCommentSection(postOpen.id)} className="px-3 py-1 rounded-full border text-sm">Comment</button>
                <button onClick={() => setShowShareFor(postOpen)} className="px-3 py-1 rounded-full border text-sm">Share</button>
              </div>
              {commentOpen[postOpen.id] && (
                <div className="mt-4 border-t pt-3 relative">
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
                      <div key={c.id} className="bg-slate-50 p-2 rounded flex items-start gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.profilePic} />
                          <AvatarFallback>{c.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/profile/${c.username}`} className="font-medium text-sm hover:underline">{c.username}</Link>
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
      <Dialog open={!!showShareFor || !!shareBlog || !!shareEvent} onOpenChange={() => { setShowShareFor(null); setShareBlog(null); setShareEvent(null); }}>
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
          {shareEvent && (
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
            <Button variant="secondary" onClick={() => { setShowShareFor(null); setShareBlog(null); setShareEvent(null); }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Modal */}
      <Dialog open={!!calendarEvent} onOpenChange={() => setCalendarEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Calendar</DialogTitle>
          </DialogHeader>
          {calendarEvent && (
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => window.open(getCalendarLinks(calendarEvent).google, "_blank")}>Google Calendar</Button>
              <Button size="sm" onClick={() => window.open(getCalendarLinks(calendarEvent).outlook, "_blank")}>Outlook / Microsoft</Button>
              <Button size="sm" onClick={() => window.open(getCalendarLinks(calendarEvent).yahoo, "_blank")}>Yahoo Calendar</Button>
              <Button size="sm" onClick={() => { const a = document.createElement("a"); a.href = getCalendarLinks(calendarEvent).ics; a.download = `${calendarEvent.title}.ics`; a.click(); URL.revokeObjectURL(a.href); }}>Apple / ICS File</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
