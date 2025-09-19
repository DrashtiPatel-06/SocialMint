import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventPage() {
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
      liked: false,
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
      liked: false,
    },
    {
      id: "e3",
      username: "drashti",
      profilePic: "https://i.pravatar.cc/40?img=17",
      title: "NFT Art Showcase",
      description: "Exclusive showcase of rare NFT art.",
      date: "2025-09-25T14:00:00",
      likes: 15,
      type: "upcoming",
      liked: false,
    },
  ];

  const [events, setEvents] = useState(sampleEvents);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date");
  const [shareEvent, setShareEvent] = useState(null);
  const [calendarEvent, setCalendarEvent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 2;

  // Like toggle
  const toggleLike = (id) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              liked: !e.liked,
              likes: e.liked ? e.likes - 1 : e.likes + 1,
            }
          : e
      )
    );
  };

  // Reset filters
  const clearFilters = () => {
    setFilter("all");
    setSortOrder("date");
    setCurrentPage(1);
  };

  // Filters + sorting
  const filteredEvents = events
    .filter((e) => (filter === "all" ? true : e.type === filter))
    .sort((a, b) => {
      if (sortOrder === "date") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "popular") return b.likes - a.likes;
      return 0;
    });

  const totalPages = Math.ceil(filteredEvents.length / perPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Calendar links
  const getCalendarLinks = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2h
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
        const blob = new Blob([icsContent], {
          type: "text/calendar;charset=utf-8",
        });
        return URL.createObjectURL(blob);
      })(),
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Events</h1>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-sm"
          >
            <option value="date">By Date</option>
            <option value="popular">Most Liked</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={clearFilters}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>

        {/* Events */}
        <div className="space-y-4">
          {paginatedEvents.map((event) => (
            <Card key={event.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <CardContent>
                <header className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={event.profilePic} alt={event.username} />
                    <AvatarFallback>{event.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.username}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(event.date).toLocaleString()}
                    </div>
                  </div>
                </header>

                <h2 className="font-semibold text-lg mb-2">{event.title}</h2>
                <p className="text-slate-600">{event.description}</p>

                <div className="flex items-center gap-3 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={event.liked ? "text-red-500" : "text-slate-600"}
                    onClick={() => toggleLike(event.id)}
                  >
                    ❤️ {event.likes}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShareEvent(event)}
                  >
                    🔗 Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCalendarEvent(event)}
                  >
                    📅 Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No events found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={!!shareEvent} onOpenChange={() => setShareEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3">
            <Button size="sm">📨 Chat</Button>
            <Button size="sm">📱 WhatsApp</Button>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }}
            >
              📋 Copy Link
            </Button>
          </div>
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
              <Button
                size="sm"
                onClick={() =>
                  window.open(getCalendarLinks(calendarEvent).google, "_blank")
                }
              >
                Google Calendar
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  window.open(getCalendarLinks(calendarEvent).outlook, "_blank")
                }
              >
                Outlook / Microsoft
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  window.open(getCalendarLinks(calendarEvent).yahoo, "_blank")
                }
              >
                Yahoo Calendar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const icsUrl = getCalendarLinks(calendarEvent).ics;
                  const a = document.createElement("a");
                  a.href = icsUrl;
                  a.download = `${calendarEvent.title}.ics`;
                  a.click();
                  URL.revokeObjectURL(icsUrl);
                }}
              >
                Apple / ICS File
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
