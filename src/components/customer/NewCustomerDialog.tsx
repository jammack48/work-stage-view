import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoData } from "@/contexts/DemoDataContext";
import { toast } from "@/hooks/use-toast";
import type { DemoCustomer } from "@/types/demoData";

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCustomerDialog({ open, onOpenChange }: NewCustomerDialogProps) {
  const navigate = useNavigate();
  const { addCustomer, customers } = useDemoData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCustomer: Omit<DemoCustomer, "id"> = {
      name: name.trim(),
      phone: phone.trim() || "—",
      email: email.trim() || "—",
      address: address.trim() || "—",
      jobs: 0,
      status: "leads",
      totalSpend: 0,
      notes: [],
      contacts: [{ name: name.trim(), role: "Primary", phone: phone.trim(), email: email.trim() }],
      jobHistory: [],
    };

    const newId = await addCustomer(newCustomer);
    toast({ title: "Customer added", description: `${name.trim()} has been created.` });
    setName(""); setPhone(""); setEmail(""); setAddress("");
    onOpenChange(false);
    if (newId !== undefined) {
      navigate(`/customer/${newId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
          <DialogDescription>Add a new customer to your directory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="nc-name">Name *</Label>
            <Input id="nc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" required />
          </div>
          <div>
            <Label htmlFor="nc-phone">Phone</Label>
            <Input id="nc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04xx xxx xxx" />
          </div>
          <div>
            <Label htmlFor="nc-email">Email</Label>
            <Input id="nc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div>
            <Label htmlFor="nc-address">Address</Label>
            <Input id="nc-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim()}>Add Customer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
