import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  RefreshCw,
  PlusCircle,
  Edit,
  Percent,
  PiggyBank,
  Wallet,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

// --- Interface Definitions ---

interface InterestRate {
  accountLevel: string;
  accountType: string;
  annualRate: number;
  description: string;
}

const initialRateState: InterestRate = {
  accountType: 'SAVING',
  accountLevel: 'BRONZE',
  annualRate: 0.0,
  description: ''
};

// --- Component Definition ---

const AdminInterestRates = () => {
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRate, setCurrentRate] = useState<InterestRate>(initialRateState);

  // --- API Functions ---

  const fetchInterestRates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<InterestRate[]>('/api/admin/rates');
      // Sort rates for consistent display order
      const sortedRates = response.data.sort((a, b) => {
        if (a.accountType < b.accountType) return -1;
        if (a.accountType > b.accountType) return 1;
        if (a.accountLevel < b.accountLevel) return -1;
        if (a.accountLevel > b.accountLevel) return 1;
        return 0;
      });
      setInterestRates(sortedRates);
    } catch (error) {
      console.error('Error fetching interest rates:', error);
      toast.error('Failed to fetch interest rates.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRate = async () => {
    // Basic validation
    if (!currentRate.annualRate || currentRate.annualRate < 0) {
      toast.error('Please provide a valid, non-negative annual rate.');
      return;
    }
     if (!currentRate.description.trim()) {
      toast.error('The description field cannot be empty.');
      return;
    }
    
    try {
      setProcessing(true);
      // API uses a single POST endpoint for both create and update operations
      await apiClient.post('/api/admin/rates', currentRate);
      
      const action = isEditMode ? 'updated' : 'created';
      toast.success(`Interest rate for ${currentRate.accountLevel} ${currentRate.accountType} has been ${action}.`);
      setDialogOpen(false);
      await fetchInterestRates(); // Refresh the list to show the change
    } catch (error: any) {
      console.error('Error saving interest rate:', error);
      toast.error(error.response?.data?.message || 'Failed to save interest rate.');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchInterestRates();
  }, []);

  // --- Dialog Handlers ---

  const handleOpenNewDialog = () => {
    setIsEditMode(false);
    setCurrentRate(initialRateState);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (rate: InterestRate) => {
    setIsEditMode(true);
    setCurrentRate(rate);
    setDialogOpen(true);
  };
  
  // --- UI Helpers ---

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'GOLD': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'PLATINUM': return 'text-slate-400 border-slate-400/50 bg-slate-400/10';
      case 'SILVER': return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
      case 'BRONZE': return 'text-orange-600 border-orange-600/50 bg-orange-600/10';
      default: return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };
  
  const accountTypes = ['SAVING', 'CURRENT'];
  const accountLevels = ['BRONZE',  'GOLD', 'PLATINUM', 'DIAMOND'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interest Rate Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Set and update annual interest rates for account types.</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={fetchInterestRates} disabled={loading || processing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${(loading || processing) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleOpenNewDialog}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create / Update Rate
            </Button>
          </div>
        </div>

        {/* Interest Rates List */}
        <Card className="shadow-banking">
          <CardHeader>
            <CardTitle>Current Annual Interest Rates</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto animate-spin" />
                <p className="mt-2 text-gray-500">Loading rates...</p>
              </div>
            ) : interestRates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interestRates.map((rate, index) => (
                  <Card key={`${rate.accountType}-${rate.accountLevel}-${index}`} className="flex flex-col justify-between p-4 border hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {rate.accountType === 'SAVING' ? <PiggyBank className="w-5 h-5 text-blue-500" /> : <Wallet className="w-5 h-5 text-green-500" />}
                          <span className="font-semibold text-lg capitalize">{rate.accountType.toLowerCase()}</span>
                        </div>
                        <div className={`px-2 py-1 text-xs font-semibold rounded-full border ${getLevelColor(rate.accountLevel)} capitalize`}>
                          {rate.accountLevel.toLowerCase()}
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-center my-4">
                        {(rate.annualRate * 100).toFixed(2)}%
                        <span className="text-sm font-normal text-gray-500 ml-1">APR</span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">"{rate.description}"</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(rate)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Percent className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No interest rates found.</p>
                <p className="text-sm text-gray-400">Click the button above to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Update Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Interest Rate' : 'Create or Update a Rate'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={currentRate.accountType} 
                    onValueChange={(value) => setCurrentRate({...currentRate, accountType: value})}
                    disabled={isEditMode} // Prevent changing the primary key on edit
                  >
                    <SelectTrigger id="accountType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {accountTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountLevel">Account Level</Label>
                   <Select 
                    value={currentRate.accountLevel} 
                    onValueChange={(value) => setCurrentRate({...currentRate, accountLevel: value})}
                    disabled={isEditMode} // Prevent changing the primary key on edit
                  >
                    <SelectTrigger id="accountLevel"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {accountLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRate">Annual Rate</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="annualRate"
                    min={0}
                    max={100}
                    step={0.01}
                    value={[currentRate.annualRate * 100]}
                    onValueChange={([val]) => {
                      // Clamp to 1 if 100 is selected
                      const decimal = val >= 100 ? 1 : val / 100;
                      setCurrentRate({ ...currentRate, annualRate: decimal });
                    }}
                    className="w-3/4"
                  />
                  <span className="w-16 text-right">{((currentRate.annualRate * 100).toFixed(2))}%</span>
                </div>
                <p className="text-xs text-gray-500">Move the slider. 100% = 1.00 (max)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="e.g., Standard rate for Gold checking accounts"
                  value={currentRate.description}
                  onChange={(e) => setCurrentRate({...currentRate, description: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveRate} disabled={processing}>
                  {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                  Save Rate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInterestRates;