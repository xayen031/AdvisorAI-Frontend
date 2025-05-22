// src/pages/Contacts.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Search, Filter as FilterIcon, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CRMHeader from '@/components/crm/CRMHeader';
import ContactDetails from '@/components/crm/ContactDetails';
import { useToast } from '@/hooks/use-toast';
import type { Contact } from '@/types/contact';

const Contacts: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // state
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // delete
  const [delId, setDelId] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // save
  const [saveContact, setSaveContact] = useState<Contact | null>(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // add
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    tags: '',
    address: '', // ✅
    notes: ''    // ✅
  });
  const [newErrors, setNewErrors] = useState<{ name?: string; email?: string }>({});

  // sort
  const [sortField, setSortField] = useState<'name' | 'lastContact'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // filter dialog
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // load from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        toast({ title: 'Error', description: 'Not authenticated', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('last_contact', { ascending: false });

      if (error) {
        toast({ title: 'Load failed', description: error.message, variant: 'destructive' });
      } else if (data) {
        const parsed = data.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          company: row.company,
          status: row.status,
          lastContact: new Date(row.last_contact),
          address: row.address ?? undefined,
          notes: row.notes ?? undefined,
          tags: row.tags,
          personalDetails: row.personal_details ?? undefined,
          compliance: row.compliance ?? undefined,
          financials: row.financials ?? undefined,
          family: row.family ?? undefined,
          riskProfile: row.risk_profile,
          letterOfAuthority: row.letter_of_authority,
        }));
        setContactsList(parsed);
      }
      setLoading(false);
    }

    load();
  }, [toast]);

  // search + filter
  const filtered = useMemo(() => {
    return contactsList.filter(c => {
      const matchText = [c.name, c.email, c.phone]
        .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchText && matchStatus;
    });
  }, [contactsList, searchTerm, filterStatus]);

  // sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const m = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) =>
      sortField === 'name'
        ? m * a.name.localeCompare(b.name)
        : m * (a.lastContact.getTime() - b.lastContact.getTime())
    );
    return arr;
  }, [filtered, sortField, sortDir]);

  const toggleSort = (field: 'name' | 'lastContact') => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // delete handler
  const handleDelete = async () => {
    if (delId == null) return;
    const { error } = await supabase.from('contacts').delete().eq('id', delId);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else {
      setContactsList(cl => cl.filter(c => c.id !== delId));
      toast({ title: 'Deleted', description: 'Contact removed.' });
    }
    setShowDeleteAlert(false);
    setDelId(null);
  };

  // save handler
  const handleSave = async () => {
    if (!saveContact) return;

    const payload = {
      name: saveContact.name,
      email: saveContact.email,
      phone: saveContact.phone,
      company: saveContact.company,
      status: saveContact.status,
      address: saveContact.address ?? '', // ✅ YENİ
      notes: saveContact.notes ?? '',     // ✅ YENİ
      last_contact: saveContact.lastContact,
      tags: saveContact.tags,
      personal_details: saveContact.personalDetails,
      compliance: saveContact.compliance,
      financials: saveContact.financials,
      family: saveContact.family,
      risk_profile: saveContact.riskProfile,
      letter_of_authority: saveContact.letterOfAuthority,
    };

    const { error } = await supabase
      .from('contacts')
      .update(payload)
      .eq('id', saveContact.id);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      setContactsList(cl => cl.map(c => (c.id === saveContact.id ? saveContact : c)));
      toast({ title: 'Saved', description: 'Contact updated.' });
    }

    setShowSaveAlert(false);
    setSaveContact(null);
  };

  // add handler
 const handleAdd = async () => {
    const errs: typeof newErrors = {};
    if (!newForm.name.trim()) errs.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(newForm.email)) errs.email = 'Invalid email';
    if (Object.keys(errs).length) {
      setNewErrors(errs);
      return;
    }
    setNewErrors({});

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      toast({ title: 'Error', description: 'Not authenticated', variant: 'destructive' });
      return;
    }

    const payload = {
      name: newForm.name,
      email: newForm.email,
      phone: newForm.phone,
      company: newForm.company,
      status: newForm.status,
      address: newForm.address, // ✅ YENİ
      notes: newForm.notes,     // ✅ YENİ
      last_contact: new Date(),
      tags: newForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      personal_details: {},
      compliance: {},
      financials: {},
      family: {},
      risk_profile: {
        riskTolerance: 'Medium',
        investmentHorizon: '5-10 years',
        investmentObjectives: ''
      },
      letter_of_authority: {
        status: 'Pending',
        dateIssued: new Date(),
        expiryDate: new Date()
      },
      user_id: userId
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert(payload)
      .select()
      .single();

    if (error) {
      toast({ title: 'Add failed', description: error.message, variant: 'destructive' });
    } else {
      const created: Contact = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
        address: data.address ?? undefined,
        notes: data.notes ?? undefined,
        lastContact: new Date(data.last_contact),
        tags: data.tags,
        personalDetails: data.personal_details,
        compliance: data.compliance,
        financials: data.financials,
        family: data.family,
        riskProfile: data.risk_profile,
        letterOfAuthority: data.letter_of_authority,
      };
      setContactsList(cl => [created, ...cl]);
      toast({ title: 'Added', description: `${created.name} added.` });
      setShowAddDialog(false);
      setNewForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'Active',
        tags: '',
        address: '', // reset
        notes: ''    // reset
      });
    }
};

  // loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Loading contacts…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950">
      <CRMHeader activePage="Contacts" />
      <div className="container mx-auto px-4 py-8">
        {/* Search / Add / Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="default" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Contact
            </Button>
            <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
              <FilterIcon className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-indigo-900/50 border-b">
            <CardTitle>All Contacts ({contactsList.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-indigo-900/30">
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort('name')}
                    >
                      Name {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <span
                        className="cursor-pointer select-none"
                        onClick={() => toggleSort('lastContact')}
                      >
                        Last Contact {sortField === 'lastContact' && (sortDir === 'asc' ? '↑' : '↓')}
                      </span>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map(c => (
                    <React.Fragment key={c.id}>
                      <TableRow
                        className="hover:bg-gray-50 dark:hover:bg-indigo-900/20 cursor-pointer"
                        onClick={() => setExpandedId(id => (id === c.id ? null : c.id))}
                      >
                        <TableCell>
                          <div className="font-medium">{c.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDistanceToNow(c.lastContact, { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <ContactDetails
                            contact={c}
                            isExpanded={expandedId === c.id}
                            onToggle={() => setExpandedId(id => (id === c.id ? null : c.id))}
                            onSave={upd => {
                              setSaveContact(upd);
                              setShowSaveAlert(true);
                            }}
                            onDelete={() => {
                              setDelId(c.id);
                              setShowDeleteAlert(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Save */}
        <AlertDialog open={showSaveAlert} onOpenChange={setShowSaveAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Changes</AlertDialogTitle>
              <AlertDialogDescription>Persist edits?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription>Fill in details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Name</Label>
                <Input value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} />
                {newErrors.name && <p className="text-red-500 text-sm mt-1">{newErrors.name}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newForm.email}
                  onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))}
                />
                {newErrors.email && <p className="text-red-500 text-sm mt-1">{newErrors.email}</p>}
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newForm.phone} onChange={e => setNewForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={newForm.company}
                  onChange={e => setNewForm(f => ({ ...f, company: e.target.value }))}
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newForm.status}
                  onChange={e => setNewForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label>Tags (comma-sep)</Label>
                <Input
                  placeholder="e.g. VIP, Prospect"
                  value={newForm.tags}
                  onChange={e => setNewForm(f => ({ ...f, tags: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filter */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={val => setFilterStatus(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowFilterDialog(false)}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contacts;
