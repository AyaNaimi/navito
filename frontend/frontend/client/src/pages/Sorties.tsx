import { useEffect, useState } from "react";
import { Users, Plus, MapPin, Calendar, Clock, Users2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sortie {
  id: string;
  cityId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  level: string;
  organizer: string;
  image: string;
}

export default function Sorties() {
  const [sorties, setSorties] = useState<Sortie[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [userCity, setUserCity] = useState<string>("marrakech");
  const [joinedSorties, setJoinedSorties] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSortie, setNewSortie] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    minParticipants: 2,
    maxParticipants: 10,
    level: "Beginner",
  });

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setSorties(data.sorties))
      .catch((err) => console.error("Failed to load sorties:", err));
  }, []);

  const filteredSorties = sorties.filter((sortie) => {
    if (selectedCity === "all") return true;
    if (selectedCity === "my-city") return sortie.cityId === userCity;
    return sortie.cityId === selectedCity;
  });

  const handleJoinSortie = (sortieId: string) => {
    setJoinedSorties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sortieId)) {
        newSet.delete(sortieId);
      } else {
        newSet.add(sortieId);
      }
      return newSet;
    });
  };

  const handleCreateSortie = () => {
    if (!newSortie.title || !newSortie.date) {
      alert("Please fill in all required fields");
      return;
    }

    const sortie: Sortie = {
      id: `sortie-${Date.now()}`,
      cityId: userCity,
      title: newSortie.title,
      description: newSortie.description,
      date: newSortie.date,
      time: newSortie.time,
      duration: newSortie.duration,
      location: newSortie.location,
      minParticipants: newSortie.minParticipants,
      maxParticipants: newSortie.maxParticipants,
      currentParticipants: 1,
      level: newSortie.level,
      organizer: "You",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    };

    setSorties([sortie, ...sorties]);
    setJoinedSorties((prev) => new Set(prev).add(sortie.id));
    setNewSortie({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      minParticipants: 2,
      maxParticipants: 10,
      level: "Beginner",
    });
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-foreground">Community Sorties</h1>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a New Sortie</DialogTitle>
                  <DialogDescription>
                    Organize a group activity and invite other travelers to join you.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">Title *</label>
                    <Input
                      placeholder="e.g., Sunset in Atlas Mountains"
                      value={newSortie.title}
                      onChange={(e) => setNewSortie({ ...newSortie, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground">Description</label>
                    <Textarea
                      placeholder="What will you do? What should people bring?"
                      value={newSortie.description}
                      onChange={(e) => setNewSortie({ ...newSortie, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground">Date *</label>
                      <Input
                        type="date"
                        value={newSortie.date}
                        onChange={(e) => setNewSortie({ ...newSortie, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">Time</label>
                      <Input
                        type="time"
                        value={newSortie.time}
                        onChange={(e) => setNewSortie({ ...newSortie, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground">Location</label>
                    <Input
                      placeholder="Where will you meet?"
                      value={newSortie.location}
                      onChange={(e) => setNewSortie({ ...newSortie, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground">Duration</label>
                    <Input
                      placeholder="e.g., 4 hours"
                      value={newSortie.duration}
                      onChange={(e) => setNewSortie({ ...newSortie, duration: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground">Min Participants</label>
                      <Input
                        type="number"
                        min="1"
                        value={newSortie.minParticipants}
                        onChange={(e) =>
                          setNewSortie({ ...newSortie, minParticipants: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">Max Participants</label>
                      <Input
                        type="number"
                        min="1"
                        value={newSortie.maxParticipants}
                        onChange={(e) =>
                          setNewSortie({ ...newSortie, maxParticipants: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground">Level</label>
                    <Select value={newSortie.level} onValueChange={(val) => setNewSortie({ ...newSortie, level: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateSortie} className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Sortie
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* City selector */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => setSelectedCity("all")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCity === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-foreground"
              }`}
            >
              All Cities
            </button>
            <button
              onClick={() => setSelectedCity("my-city")}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCity === "my-city"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-foreground"
              }`}
            >
              My City
            </button>
            {["marrakech", "fes", "chefchaouen", "agadir"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-foreground"
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sorties list */}
      <div className="container py-4">
        {filteredSorties.length === 0 ? (
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No sorties found. Create one to get started!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredSorties.map((sortie) => {
              const isJoined = joinedSorties.has(sortie.id);
              const isFull = sortie.currentParticipants >= sortie.maxParticipants;

              return (
                <Card key={sortie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex gap-3">
                    <img
                      src={sortie.image}
                      alt={sortie.title}
                      className="w-24 h-24 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
                      }}
                    />
                    <div className="flex-1 p-3">
                      <h3 className="font-bold text-foreground mb-1">{sortie.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {sortie.description}
                      </p>

                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{sortie.date} at {sortie.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{sortie.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users2 className="w-3 h-3" />
                          <span>
                            {sortie.currentParticipants}/{sortie.maxParticipants} joined
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isJoined ? "default" : "outline"}
                        onClick={() => handleJoinSortie(sortie.id)}
                        disabled={!isJoined && isFull}
                        className={isJoined ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {isJoined ? "✓ Joined" : isFull ? "Full" : "Join"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
