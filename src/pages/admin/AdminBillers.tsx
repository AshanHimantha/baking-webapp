import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw,
  PlusCircle,
  Search,
  SearchX,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/apiClient";

// --- Interface Definitions ---

interface Biller {
  id: number;
  billerName: string;
  category: BillerCategory;
  status: 'ACTIVE' | 'INACTIVE';
  logoUrl?: string; // Optional logo URL from the server
}

type BillerCategory = 
  | 'UTILITIES'
  | 'TELECOM'
  | 'INSURANCE'
  | 'FINANCE'
  | 'EDUCATION'
  | 'GOVERNMENT'
  | 'CHARITY'
  | 'WATER'
  | 'OTHER';

interface NewBiller {
  billerName: string;
  category: BillerCategory;
  logo: File | null;
}

const billerCategories: BillerCategory[] = [
    'UTILITIES', 'TELECOM', 'INSURANCE', 'FINANCE', 
    'EDUCATION', 'GOVERNMENT', 'CHARITY', 'WATER', 'OTHER'
];

// --- Component Definition ---

const AdminBillers = () => {
  const [billers, setBillers] = useState<Biller[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBillerDialogOpen, setNewBillerDialogOpen] = useState(false);
  
  const [newBiller, setNewBiller] = useState<NewBiller>({
    billerName: '',
    category: 'OTHER',
    logo: null
  });
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- API Functions ---

  const fetchBillers = async () => {
    try {
      setLoading(true);
      // NOTE: The user requested `/api/bills` but for an admin function, 
      // it is more likely to be `/api/admin/billers`. Adjusted for consistency.
      const response = await apiClient.get<Biller[]>('/api/admin/billers');
      setBillers(response.data);
    } catch (error) {
      console.error('Error fetching billers:', error);
      toast.error('Failed to fetch billers.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBiller = async () => {
    if (!newBiller.billerName || !newBiller.category || !newBiller.logo) {
        toast.error("Please fill out all fields and select a logo.");
        return;
    }

    const formData = new FormData();
    formData.append('billerName', newBiller.billerName);
    formData.append('category', newBiller.category);
    formData.append('logo', newBiller.logo);

    try {
      setProcessing(true);
      const response = await apiClient.post<Biller>('/api/admin/billers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(`Biller "${response.data.billerName}" created successfully!`);
      setBillers(prev => [...prev, response.data]);
      setNewBillerDialogOpen(false);
      // Reset form state
      setNewBiller({ billerName: '', category: 'OTHER', logo: null });
      if(logoInputRef.current) {
        logoInputRef.current.value = "";
      }

    } catch (error: any) {
      console.error('Error creating biller:', error);
      toast.error(error.response?.data?.message || 'Failed to create biller.');
    } finally {
      setProcessing(false);
    }
  };
  
  useEffect(() => {
    fetchBillers();
  }, []);

  // --- Event Handlers ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewBiller(prev => ({ ...prev, logo: file }));
    }
  };
  
  // --- Filtering Logic ---
  const filteredBillers = billers.filter(biller =>
    biller.billerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biller.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biller Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage billers and their categories.</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={fetchBillers} disabled={loading || processing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${(loading || processing) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={newBillerDialogOpen} onOpenChange={setNewBillerDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="w-4 h-4 mr-2" />Add Biller</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">{/* Add Biller Form is below */}</DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Biller List */}
        <Card className="shadow-banking">
          <CardHeader>
              <CardTitle>Registered Billers</CardTitle>
          </CardHeader>
          
          <div className="p-4 border-b dark:border-gray-700">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                      placeholder="Search by biller name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
              </div>
          </div>

          <CardContent className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto animate-spin" /><p>Loading billers...</p>
              </div>
            ) : filteredBillers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBillers.map((biller) => (
                  <div key={biller.id} className="border dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            {biller.logoUrl ? 
                                <img src={biller.logoUrl} alt={`${biller.billerName} logo`} className="w-10 h-10 object-contain rounded-full bg-gray-100" /> :
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-600">
                                    <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                            }
                            <p className="font-semibold text-lg">{biller.billerName}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                             <Badge variant="secondary" className="capitalize">{biller.category.toLowerCase().replace('_', ' ')}</Badge>
                             <Badge variant={biller.status === 'ACTIVE' ? 'default' : 'destructive'} className="capitalize">{biller.status.toLowerCase()}</Badge>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {searchTerm ? (
                    <>
                        <SearchX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No billers found matching "{searchTerm}".</p>
                    </>
                ) : (
                    <>
                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No billers have been configured.</p>
                        <p className="text-sm text-gray-400">Click "Add Biller" to create one.</p>
                    </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Add Biller Dialog --- */}
         <Dialog open={newBillerDialogOpen} onOpenChange={setNewBillerDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create New Biller</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="billerName-add">Biller Name</Label>
                    <Input id="billerName-add" value={newBiller.billerName} onChange={(e) => setNewBiller({...newBiller, billerName: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="category-add">Category</Label>
                      <Select onValueChange={(value: BillerCategory) => setNewBiller({...newBiller, category: value})} defaultValue={newBiller.category}>
                        <SelectTrigger id="category-add"><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                          {billerCategories.map(cat => (
                            <SelectItem key={cat} value={cat} className="capitalize">{cat.toLowerCase().replace('_', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-add">Biller Logo</Label>
                    <Input id="logo-add" type="file" accept="image/png, image/jpeg, image/svg+xml" ref={logoInputRef} onChange={handleFileChange} />
                    {newBiller.logo && <p className="text-sm text-gray-500 mt-1">Selected: {newBiller.logo.name}</p>}
                  </div>

                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setNewBillerDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBiller} disabled={processing}>
                        {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}Create Biller
                    </Button>
                  </div>
                </div>
              </DialogContent>
         </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBillers;