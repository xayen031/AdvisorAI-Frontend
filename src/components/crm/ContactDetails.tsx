import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2, User, Shield, Wallet, Users, FileText, Clock, AlertCircle, FileWarning, Upload, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabaseClient';

// Reusable sub-types
interface FamilyMember {
  id: number;
  name: string;
  age: number;
  relationship: string;
}

interface PersonalDetails {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  otherDetails?: string;
}

interface Compliance {
  idVerified?: boolean;
  lastReviewDate?: Date;
  documents?: string[];
}

interface Financials {
  income?: string;
  expenditure?: string;
  assets?: string;
  liabilities?: string;
  emergencyFund?: string;
  investments?: string;
  protection?: string;
  retirementSavings?: string;
  estatePlanning?: string;
}

interface FamilyInfo {
  maritalStatus?: string;
  spouse?: { name: string; age: number };
  children?: FamilyMember[];
  parents?: FamilyMember[];
  siblings?: FamilyMember[];
}

interface RiskProfile {
  riskTolerance: string;
  investmentHorizon: string;
  investmentObjectives: string;
  appetiteForRisk?: string;
  investmentFocus?: string;
  investmentStyle?: string;
  esgInterests?: string;
}

interface LetterOfAuthority {
  status: string;
  dateIssued: Date;
  expiryDate: Date;
}

// Main contact shape
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: Date;
  address?: string;
  notes?: string;
  tags: string[];
  personalDetails?: PersonalDetails;
  compliance?: Compliance;
  financials?: Financials;
  family?: FamilyInfo;
  riskProfile: RiskProfile;
  letterOfAuthority: LetterOfAuthority;
}

// Props for your component
interface ContactDetailsProps {
  contact: Contact;
  isExpanded: boolean;
  onToggle: () => void;
  onSave: (updatedContact: Contact) => void;
  onDelete: () => void;
}


const ContactDetails = ({ contact, isExpanded, onToggle, onSave, onDelete }: ContactDetailsProps) => {
  const [editedContact, setEditedContact] = useState({
    ...contact,
    personalDetails: {
      firstName: contact.name.split(' ')[0] || '',
      lastName: contact.name.split(' ').slice(1).join(' ') || '',
      dateOfBirth: '',
      otherDetails: '',
      ...contact.personalDetails
    },
    compliance: {
      idVerified: false,
      lastReviewDate: '',
      documents: [],
      ...contact.compliance
    },
    financials: {
      income: '',
      expenditure: '',
      assets: '',
      liabilities: '',
      emergencyFund: '',
      investments: '',
      protection: '',
      retirementSavings: '',
      estatePlanning: '',
      ...contact.financials
    },
    family: {
      maritalStatus: '',
      spouse: { name: '', age: 0 },
      children: [],
      parents: [],
      siblings: [],
      ...contact.family
    },
    riskProfile: {
      riskTolerance: 'Medium',
      investmentHorizon: '5-10 years',
      investmentObjectives: '',
      appetiteForRisk: 'Medium',
      investmentFocus: 'Growth',
      investmentStyle: 'Active',
      esgInterests: 'None',
      ...contact.riskProfile
    },
    letterOfAuthority: {
      status: 'Pending',
      dateIssued: '',
      expiryDate: '',
      ...contact.letterOfAuthority
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedContact(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBasicInfoChange = (field: string, value: string) => {
    setEditedContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFamilyMemberChange = (type: 'children' | 'parents' | 'siblings', index: number, field: string, value: string | number) => {
    setEditedContact(prev => {
      const updatedFamily = { ...prev.family };
      updatedFamily[type][index] = {
        ...updatedFamily[type][index],
        [field]: value
      };
      return {
        ...prev,
        family: updatedFamily
      };
    });
  };

  const navigate = useNavigate();

  const addFamilyMember = (type: 'children' | 'parents' | 'siblings') => {
    setEditedContact(prev => {
      const updatedFamily = { ...prev.family };
      const newMember: FamilyMember = {
        id: Date.now(),
        name: '',
        age: 0,
        relationship: type === 'children' ? 'Child' : type === 'parents' ? 'Parent' : 'Sibling'
      };
      updatedFamily[type] = [...(updatedFamily[type] || []), newMember];
      return {
        ...prev,
        family: updatedFamily
      };
    });
  };

  const removeFamilyMember = (type: 'children' | 'parents' | 'siblings', id: number) => {
    setEditedContact(prev => {
      const updatedFamily = { ...prev.family };
      updatedFamily[type] = updatedFamily[type].filter(member => member.id !== id);
      return {
        ...prev,
        family: updatedFamily
      };
    });
  };

  const handleSave = () => {
    // Combine firstName and lastName for the name field
    const updatedContact = {
      ...editedContact,
      name: `${editedContact.personalDetails.firstName} ${editedContact.personalDetails.lastName}`.trim()
    };
    onSave(updatedContact);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleContent className="p-4 space-y-4 bg-gray-50 dark:bg-indigo-900/20 rounded-lg mt-2">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-1">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">Financials</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Family</span>
            </TabsTrigger>
            <TabsTrigger value="softfacts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Soft Facts</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Past</span>
            </TabsTrigger>
            <TabsTrigger value="risk-profiler" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden md:inline">Risk Profiler</span>
            </TabsTrigger>
            <TabsTrigger value="letter-of-authority" className="flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              <span className="hidden md:inline">LOA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={editedContact.personalDetails?.firstName || ''}
                  onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={editedContact.personalDetails?.lastName || ''}
                  onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={editedContact.personalDetails?.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('personalDetails', 'dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={editedContact.phone || ''}
                  onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editedContact.email || ''}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={editedContact.address || ''}
                  onChange={(e) => handleBasicInfoChange('address', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Other Details</Label>
                <Textarea
                  value={editedContact.personalDetails?.otherDetails || ''}
                  onChange={(e) => handleInputChange('personalDetails', 'otherDetails', e.target.value)}
                  placeholder="Enter additional personal details..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID Verification Status</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    checked={editedContact.compliance?.idVerified || false}
                    onChange={(e) => handleInputChange('compliance', 'idVerified', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>{editedContact.compliance?.idVerified ? 'Verified' : 'Not Verified'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Review Date</Label>
                <Input
                  type="date"
                  value={editedContact.compliance?.lastReviewDate || ''}
                  onChange={(e) => handleInputChange('compliance', 'lastReviewDate', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Upload Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag and drop PDF files here, or click to select files
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      multiple
                      id="document-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => document.getElementById('document-upload')?.click()}
                    >
                      Select Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financials" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Income</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.income || ''}
                  onChange={(e) => handleInputChange('financials', 'income', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expenditure</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.expenditure || ''}
                  onChange={(e) => handleInputChange('financials', 'expenditure', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Assets</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.assets || ''}
                  onChange={(e) => handleInputChange('financials', 'assets', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Liabilities</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.liabilities || ''}
                  onChange={(e) => handleInputChange('financials', 'liabilities', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Emergency Fund</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.emergencyFund || ''}
                  onChange={(e) => handleInputChange('financials', 'emergencyFund', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Investments</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.investments || ''}
                  onChange={(e) => handleInputChange('financials', 'investments', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Protection</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.protection || ''}
                  onChange={(e) => handleInputChange('financials', 'protection', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Retirement Savings</Label>
                <Input
                  type="text"
                  value={editedContact.financials?.retirementSavings || ''}
                  onChange={(e) => handleInputChange('financials', 'retirementSavings', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Estate Planning</Label>
                <Textarea
                  value={editedContact.financials?.estatePlanning || ''}
                  onChange={(e) => handleInputChange('financials', 'estatePlanning', e.target.value)}
                  placeholder="Enter estate planning details..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="family" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-3">Spouse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editedContact.family?.spouse?.name || ''}
                      onChange={(e) => handleInputChange('family', 'spouse', {
                        ...editedContact.family?.spouse,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={editedContact.family?.spouse?.age || ''}
                      onChange={(e) => handleInputChange('family', 'spouse', {
                        ...editedContact.family?.spouse,
                        age: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Children</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => addFamilyMember('children')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Child
                  </Button>
                </div>

                {(editedContact.family?.children || []).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No children added yet.</p>
                ) : (
                  (editedContact.family?.children || []).map((child, index) => (
                    <div key={child.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={child.name}
                          onChange={(e) => handleFamilyMemberChange('children', index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Age</Label>
                        <Input
                          type="number"
                          value={child.age}
                          onChange={(e) => handleFamilyMemberChange('children', index, 'age', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          className="h-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFamilyMember('children', child.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Parents</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => addFamilyMember('parents')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Parent
                  </Button>
                </div>

                {(editedContact.family?.parents || []).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No parents added yet.</p>
                ) : (
                  (editedContact.family?.parents || []).map((parent, index) => (
                    <div key={parent.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={parent.name}
                          onChange={(e) => handleFamilyMemberChange('parents', index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Age</Label>
                        <Input
                          type="number"
                          value={parent.age}
                          onChange={(e) => handleFamilyMemberChange('parents', index, 'age', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          className="h-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFamilyMember('parents', parent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Siblings</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => addFamilyMember('siblings')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Sibling
                  </Button>
                </div>

                {(editedContact.family?.siblings || []).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No siblings added yet.</p>
                ) : (
                  (editedContact.family?.siblings || []).map((sibling, index) => (
                    <div key={sibling.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={sibling.name}
                          onChange={(e) => handleFamilyMemberChange('siblings', index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Age</Label>
                        <Input
                          type="number"
                          value={sibling.age}
                          onChange={(e) => handleFamilyMemberChange('siblings', index, 'age', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          className="h-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFamilyMember('siblings', sibling.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="softfacts" className="mt-4">
            <Textarea
              placeholder="Add soft facts about the client..."
              className="min-h-[100px]"
              value={editedContact.notes || ''}
              onChange={(e) => handleBasicInfoChange('notes', e.target.value)}
            />
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            <div className="text-gray-500 dark:text-gray-400 text-center py-4">
              Past interactions will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="risk-profiler" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Appetite for Risk</Label>
                <Select 
                  value={editedContact.riskProfile?.appetiteForRisk}
                  onValueChange={(value) => handleInputChange('riskProfile', 'appetiteForRisk', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk appetite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Investment Focus</Label>
                <Select 
                  value={editedContact.riskProfile?.investmentFocus}
                  onValueChange={(value) => handleInputChange('riskProfile', 'investmentFocus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                    <SelectItem value="Preservation">Capital Preservation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Investment Style</Label>
                <Select 
                  value={editedContact.riskProfile?.investmentStyle}
                  onValueChange={(value) => handleInputChange('riskProfile', 'investmentStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passive">Passive</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>ESG Investing Interests</Label>
                <Select 
                  value={editedContact.riskProfile?.esgInterests}
                  onValueChange={(value) => handleInputChange('riskProfile', 'esgInterests', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ESG interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Governance">Governance</SelectItem>
                    <SelectItem value="All">All ESG Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="letter-of-authority" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={editedContact.letterOfAuthority?.status}
                  onChange={(e) => handleInputChange('letterOfAuthority', 'status', e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Date Issued</Label>
                <Input
                  type="date"
                  value={editedContact.letterOfAuthority?.dateIssued}
                  onChange={(e) => handleInputChange('letterOfAuthority', 'dateIssued', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={editedContact.letterOfAuthority?.expiryDate}
                  onChange={(e) => handleInputChange('letterOfAuthority', 'expiryDate', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
          {/* Left - Create Meeting */}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const sessionId = `contact-${contact.id}-${Date.now()}`

              try {
                const { data: user } = await supabase.auth.getUser()
                const userId = user?.user?.id

                if (!userId) {
                  alert("User not authenticated.")
                  return
                }

                const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/meetings/start?userId=${userId}&clientId=${contact.id}&sessionId=${sessionId}', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: `Meeting with ${contact.name}` })
                })

                if (!res.ok) {
                  const err = await res.json()
                  console.error(err)
                  alert('Failed to create meeting.')
                  return
                }

                // ✅ Navigate to meeting page after success
                navigate('/meeting', {
                  state: {
                    customerName: contact.name,
                    advisorName: 'Advisor',
                    meetingId: sessionId
                  }
                })

              } catch (e) {
                console.error(e)
                alert('Error creating meeting.')
              }
            }}


            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Meeting
          </Button>

          {/* Right - Delete & Save */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>

      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContactDetails;
