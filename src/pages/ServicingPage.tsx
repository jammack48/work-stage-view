import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Wrench, CalendarClock, AlertTriangle, CheckCircle2, Send, Trash2 } from "lucide-react";
import { format, isPast, addDays, isWithinInterval, addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDemoData } from "@/contexts/DemoDataContext";
import {
  fetchReminders, addReminder, addRemindersBulk, updateReminderStatus, deleteReminder,
  type ServiceReminder, type NewReminder,
} from "@/services/servicingService";
import { dummyTemplates } from "@/data/dummyTemplates";

export default function ServicingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, jobs, addJob } = useDemoData();

  const [reminders, setReminders] = useState<ServiceReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent" | "booked">("all");

  // Dialogs
  const [addOpen, setAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Add form state
  const [formCustomerId, setFormCustomerId] = useState<string>("");
  const [formServiceType, setFormServiceType] = useState("Heat Pump Service");
  const [formInterval, setFormInterval] = useState("6");
  const [formChannel, setFormChannel] = useState<"email" | "sms">("email");

  // Search jobs state
  const [jobKeyword, setJobKeyword] = useState("");
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [searchServiceType, setSearchServiceType] = useState("Heat Pump Service");
  const [searchInterval, setSearchInterval] = useState("6");
  const [searchChannel, setSearchChannel] = useState<"email" | "sms">("email");

  const load = useCallback(async () => {
    try {
      const data = await fetchReminders();
      setReminders(data);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error loading reminders", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  // Stats
  const today = new Date();
  const overdue = reminders.filter((r) => r.status === "pending" && isPast(new Date(r.due_date)));
  const dueSoon = reminders.filter(
    (r) => r.status === "pending" && !isPast(new Date(r.due_date)) &&
      isWithinInterval(new Date(r.due_date), { start: today, end: addDays(today, 14) })
  );
  const totalActive = reminders.filter((r) => r.status !== "booked").length;

  // Filtered list
  const filtered = useMemo(() => {
    let list = reminders;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (filter.trim()) {
      const q = filter.toLowerCase();
      list = list.filter(
        (r) =>
          r.customer_name.toLowerCase().includes(q) ||
          r.service_type.toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reminders, statusFilter, filter]);

  // Service templates
  const serviceTemplates = dummyTemplates.filter((t) => t.category === "services");

  // --- Add reminder ---
  async function handleAdd() {
    const cust = customers.find((c) => String(c.id) === formCustomerId);
    if (!cust) return;
    const dueDate = format(addMonths(today, Number(formInterval)), "yyyy-MM-dd");
    const tpl = serviceTemplates.find((t) => t.channel === formChannel);
    try {
      await addReminder({
        customer_id: cust.id,
        customer_name: cust.name,
        job_id: null,
        service_type: formServiceType,
        interval_months: Number(formInterval),
        due_date: dueDate,
        status: "pending",
        channel: formChannel,
        template_id: tpl?.id ?? null,
        notes: "",
      });
      toast({ title: "Reminder added" });
      setAddOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  // --- Search jobs & bulk create ---
  const matchedJobs = useMemo(() => {
    if (!jobKeyword.trim()) return [];
    const q = jobKeyword.toLowerCase();
    return jobs.filter((j) => j.jobName.toLowerCase().includes(q) || j.client.toLowerCase().includes(q));
  }, [jobs, jobKeyword]);

  function toggleJobSelect(id: string) {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkCreate() {
    const selected = jobs.filter((j) => selectedJobIds.has(j.id));
    if (!selected.length) return;
    const newReminders: NewReminder[] = selected.map((j) => {
      const cust = customers.find((c) => c.name === j.client);
      const dueDate = format(addMonths(today, Number(searchInterval)), "yyyy-MM-dd");
      const tpl = serviceTemplates.find((t) => t.channel === searchChannel);
      return {
        customer_id: cust?.id ?? 0,
        customer_name: j.client,
        job_id: j.id,
        service_type: searchServiceType,
        interval_months: Number(searchInterval),
        due_date: dueDate,
        status: "pending" as const,
        channel: searchChannel,
        template_id: tpl?.id ?? null,
        notes: `From job: ${j.jobName}`,
      };
    });
    try {
      await addRemindersBulk(newReminders);
      toast({ title: `${newReminders.length} reminders created` });
      setSearchOpen(false);
      setSelectedJobIds(new Set());
      setJobKeyword("");
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  // --- Book In ---
  async function handleBookIn(r: ServiceReminder) {
    const jobId = `SVC-${Date.now()}`;
    addJob({ client: r.customer_name, jobName: `Service: ${r.service_type}`, value: 0, stage: "In Progress" as any });
    try {
      await updateReminderStatus(r.id, "booked", jobId);
      toast({ title: "Job created & reminder booked" });
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  // --- Mark sent ---
  async function handleMarkSent(r: ServiceReminder) {
    try {
      await updateReminderStatus(r.id, "sent");
      toast({ title: "Marked as sent" });
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  // --- Delete ---
  async function handleDelete(id: number) {
    try {
      await deleteReminder(id);
      toast({ title: "Reminder deleted" });
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    booked: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <div className="text-2xl font-bold">{overdue.length}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CalendarClock className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold">{dueSoon.length}</div>
            <div className="text-xs text-muted-foreground">Due Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <div className="text-2xl font-bold">{totalActive}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Reminder
        </Button>
        <Button size="sm" variant="outline" onClick={() => setSearchOpen(true)}>
          <Search className="w-4 h-4 mr-1" /> Search Jobs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Search reminders…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No reminders yet. Add one or search jobs to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const isOverdue = r.status === "pending" && isPast(new Date(r.due_date));
            return (
              <Card key={r.id} className={isOverdue ? "border-destructive/50" : ""}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.customer_name}</div>
                    <div className="text-sm text-muted-foreground truncate">{r.service_type}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Due: {format(new Date(r.due_date), "d MMM yyyy")} · {r.channel.toUpperCase()} · Every {r.interval_months}mo
                    </div>
                    {r.notes ? <div className="text-xs text-muted-foreground italic mt-0.5">{r.notes}</div> : null}
                  </div>
                  <Badge className={statusColor[r.status] ?? ""}>{r.status}</Badge>
                  <div className="flex gap-1 shrink-0">
                    {r.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" title="Mark sent" onClick={() => handleMarkSent(r)}>
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Book In" onClick={() => handleBookIn(r)}>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </Button>
                      </>
                    )}
                    {r.status === "sent" && (
                      <Button size="icon" variant="ghost" title="Book In" onClick={() => handleBookIn(r)}>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" title="Delete" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Reminder Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service Reminder</DialogTitle>
            <DialogDescription>Set up a recurring service reminder for a customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer</label>
              <Select value={formCustomerId} onValueChange={setFormCustomerId}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Service Type</label>
              <Input value={formServiceType} onChange={(e) => setFormServiceType(e.target.value)} placeholder="e.g. Heat Pump Service" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Interval</label>
                <Select value={formInterval} onValueChange={setFormInterval}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Channel</label>
                <Select value={formChannel} onValueChange={(v) => setFormChannel(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!formCustomerId || !formServiceType}>Add Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Jobs Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Search Jobs for Servicing</DialogTitle>
            <DialogDescription>Find past jobs by keyword and create service reminders in bulk.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search keyword (e.g. heat pump)…"
              value={jobKeyword}
              onChange={(e) => { setJobKeyword(e.target.value); setSelectedJobIds(new Set()); }}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium">Service Type</label>
                <Input value={searchServiceType} onChange={(e) => setSearchServiceType(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium">Interval</label>
                <Select value={searchInterval} onValueChange={setSearchInterval}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3mo</SelectItem>
                    <SelectItem value="6">6mo</SelectItem>
                    <SelectItem value="12">12mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium">Channel</label>
                <Select value={searchChannel} onValueChange={(v) => setSearchChannel(v as any)}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {matchedJobs.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                {matchedJobs.map((j) => (
                  <label key={j.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-accent cursor-pointer text-sm">
                    <Checkbox
                      checked={selectedJobIds.has(j.id)}
                      onCheckedChange={() => toggleJobSelect(j.id)}
                    />
                    <span className="font-medium truncate">{j.client}</span>
                    <span className="text-muted-foreground truncate flex-1">{j.jobName}</span>
                  </label>
                ))}
              </div>
            )}
            {jobKeyword.trim() && matchedJobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No matching jobs found.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSearchOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkCreate} disabled={selectedJobIds.size === 0}>
              Create {selectedJobIds.size} Reminder{selectedJobIds.size !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
