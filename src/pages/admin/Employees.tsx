import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User,
  ShieldCheck,
  Edit,
  RefreshCw,
  UserPlus,
  EyeOff,
  UserCheck,
  Search,
  SearchX
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

// --- Interface Definitions ---

interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'SUSPENDED';
  roles: string[];
  phoneNumber?: string;
}

interface NewEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  initialPassword: string;
  role: 'EMPLOYEE' | 'ADMIN';
}

// --- Component Definition ---

const AdminEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [newEmployeeDialogOpen, setNewEmployeeDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  
  // State for forms/modals
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [editedRoles, setEditedRoles] = useState<string[]>([]);
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    initialPassword: '',
    role: 'EMPLOYEE'
  });
  
  const allRoles = ['ADMIN', 'EMPLOYEE'];

  // --- API Functions ---

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Employee[]>('/api/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    // Validation and API call...
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.username || !newEmployee.initialPassword) {
        toast.error("Please fill out all required fields.");
        return;
    }
    try {
      setProcessing(true);
      const response = await apiClient.post<Employee>('/api/admin/employees', newEmployee);
      
      toast.success(`Employee "${response.data.firstName} ${response.data.lastName}" created successfully!`);
      setEmployees(prev => [...prev, response.data]);
      setNewEmployeeDialogOpen(false);
      setNewEmployee({
        firstName: '', lastName: '', email: '', phoneNumber: '', 
        username: '', initialPassword: '', role: 'EMPLOYEE'
      });
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast.error(error.response?.data?.message || 'Failed to create employee.');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleUpdateRoles = async () => {
    // Role update logic...
    if (!selectedEmployee) return;
    
    setProcessing(true);
    const originalRoles = new Set(selectedEmployee.roles);
    const newRoles = new Set(editedRoles);

    const rolesToAdd = editedRoles.filter(role => !originalRoles.has(role));
    const rolesToRemove = selectedEmployee.roles.filter(role => !newRoles.has(role));

    const promises = [
      ...rolesToAdd.map(role => apiClient.post(`/api/admin/employees/${selectedEmployee.username}/roles`, { role })),
      ...rolesToRemove.map(role => apiClient.delete(`/api/admin/employees/${selectedEmployee.username}/roles/${role}`))
    ];

    if (promises.length === 0) {
      toast.info("No role changes were made.");
      setProcessing(false);
      setEditRoleDialogOpen(false);
      return;
    }

    try {
      const results = await Promise.all(promises);
      const lastSuccessfulResponse = results[results.length - 1];
      
      setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, roles: lastSuccessfulResponse.data.roles } : emp));
      toast.success(`Roles for ${selectedEmployee.username} updated successfully.`);
    } catch (error: any) {
      console.error('Error updating roles:', error);
      toast.error(error.response?.data?.message || 'Failed to update one or more roles.');
      await fetchEmployees();
    } finally {
      setProcessing(false);
      setEditRoleDialogOpen(false);
    }
  };

  const handleSuspendAccount = async () => {
    // Suspend logic...
    if (!selectedEmployee) return;
    
    try {
      setProcessing(true);
      const response = await apiClient.post(`/api/admin/manage/users/${selectedEmployee.username}/suspend`, { reason: suspensionReason });
      
      toast.success(response.data.message || `Account for ${selectedEmployee.username} has been suspended.`);
      setEmployees(prev => prev.map(emp => 
        emp.username === selectedEmployee.username ? { ...emp, status: 'SUSPENDED' } : emp
      ));
      setSuspendDialogOpen(false);
      setSuspensionReason('');
    } catch (error: any) {
      console.error('Error suspending account:', error);
      toast.error(error.response?.data?.message || 'Failed to suspend account.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReactivateAccount = async (username: string) => {
    // Reactivate logic...
    try {
        setProcessing(true);
        const response = await apiClient.post(`/api/admin/manage/users/${username}/reactivate`);
        toast.success(response.data.message || `Account for ${username} has been reactivated.`);
        setEmployees(prev => prev.map(emp => 
            emp.username === username ? { ...emp, status: 'ACTIVE' } : emp
        ));
    } catch (error: any) {
        console.error('Error reactivating account:', error);
        toast.error(error.response?.data?.message || 'Failed to reactivate account.');
    } finally {
        setProcessing(false);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Dialog & State Handlers ---

  const openEditRoleDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditedRoles([...employee.roles]);
    setEditRoleDialogOpen(true);
  };

  const openSuspendDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSuspendDialogOpen(true);
  };

  const handleRoleCheckboxChange = (role: string, checked: boolean) => {
    setEditedRoles(prev => 
      checked ? [...prev, role] : prev.filter(r => r !== role)
    );
  };
  
  // --- Filtering Logic ---
  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage internal staff and administrator accounts.</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={fetchEmployees} disabled={loading || processing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${(loading || processing) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={newEmployeeDialogOpen} onOpenChange={setNewEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button><UserPlus className="w-4 h-4 mr-2" />Add Employee</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">{/* Add Employee Form is below */}</DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Employee List */}
        <Card className="shadow-banking">
          <CardHeader>
              <CardTitle>Staff & Admins</CardTitle>
          </CardHeader>
          
          {/* Search Input */}
          <div className="p-4 border-b dark:border-gray-700">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                      placeholder="Search by name, username, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
              </div>
          </div>

          <CardContent className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto animate-spin" /><p>Loading employees...</p>
              </div>
            ) : filteredEmployees.length > 0 ? (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12"><AvatarFallback className="bg-blue-600 text-white">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-semibold">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-gray-500">@{employee.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end gap-y-2">
                        <Badge variant={employee.status === 'ACTIVE' ? 'default' : 'destructive'} className="capitalize">{employee.status.toLowerCase()}</Badge>
                        <div className="flex gap-x-1">{employee.roles.map(role => (<Badge key={role} variant="secondary" className="capitalize">{role.toLowerCase()}</Badge>))}</div>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <Button variant="outline" size="sm" onClick={() => openEditRoleDialog(employee)} disabled={processing}><Edit className="w-4 h-4 mr-2" />Edit Roles</Button>
                        {employee.status === 'ACTIVE' ? (
                          <Button variant="destructive" size="sm" onClick={() => openSuspendDialog(employee)} disabled={processing}><EyeOff className="w-4 h-4 mr-2" />Suspend</Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleReactivateAccount(employee.username)} disabled={processing}><UserCheck className="w-4 h-4 mr-2" />Reactivate</Button>
                        )}
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
                        <p className="text-gray-500">No employees found matching "{searchTerm}".</p>
                    </>
                ) : (
                    <>
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No employees found.</p>
                        <p className="text-sm text-gray-400">Click "Add Employee" to create one.</p>
                    </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- All Dialogs --- */}
        <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Update Employee Roles</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <p>Manage roles for <span className="font-semibold">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</span>.</p>
                    <div className="space-y-3">
                        <Label>Assign Roles</Label>
                        <div className="space-y-2 rounded-md border p-4">
                          {allRoles.map(role => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox id={`role-${role}`} checked={editedRoles.includes(role)} onCheckedChange={(checked) => handleRoleCheckboxChange(role, !!checked)} />
                              <Label htmlFor={`role-${role}`} className="font-normal capitalize">{role.toLowerCase()}</Label>
                            </div>
                          ))}
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateRoles} disabled={processing}>
                            {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}Update Roles
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
         <Dialog open={newEmployeeDialogOpen} onOpenChange={setNewEmployeeDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create New Employee</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="firstName-add">First Name</Label><Input id="firstName-add" value={newEmployee.firstName} onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="lastName-add">Last Name</Label><Input id="lastName-add" value={newEmployee.lastName} onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="email-add">Email</Label><Input id="email-add" type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} /></div>
                  <div className="space-y-2"><Label htmlFor="phoneNumber-add">Phone Number</Label><Input id="phoneNumber-add" value={newEmployee.phoneNumber} onChange={(e) => setNewEmployee({...newEmployee, phoneNumber: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="username-add">Username</Label><Input id="username-add" value={newEmployee.username} onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} /></div>
                    <div className="space-y-2">
                      <Label htmlFor="role-add">Initial Role</Label>
                      <Select onValueChange={(value: 'EMPLOYEE' | 'ADMIN') => setNewEmployee({...newEmployee, role: value})} defaultValue={newEmployee.role}>
                        <SelectTrigger id="role-add"><SelectValue placeholder="Select a role" /></SelectTrigger>
                        <SelectContent><SelectItem value="EMPLOYEE">Employee</SelectItem><SelectItem value="ADMIN">Admin</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="initialPassword-add">Initial Password</Label><Input id="initialPassword-add" type="password" value={newEmployee.initialPassword} onChange={(e) => setNewEmployee({...newEmployee, initialPassword: e.target.value})} /></div>
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setNewEmployeeDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateEmployee} disabled={processing}>{processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}Create Employee</Button>
                  </div>
                </div>
              </DialogContent>
         </Dialog>
         <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Suspend Staff Account</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <p>Are you sure you want to suspend the account for <span className="font-semibold">{selectedEmployee?.username}</span>?</p>
                    <div className="space-y-2"><Label htmlFor="reason">Reason for Suspension</Label><Textarea id="reason" placeholder="e.g., Employee is on temporary leave." value={suspensionReason} onChange={(e) => setSuspensionReason(e.target.value)} /></div>
                     <div className="pt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleSuspendAccount} disabled={processing || !suspensionReason.trim()}>{processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}Suspend Account</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;