import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/DataTable';
import { FormModal } from '@/components/ui/FormModal';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { employeeApi } from '@/services/api';
import type { Employee, UserRole } from '@/types';

const DISTRICTS = [
  'Head Office', 'Addis Ababa District', 'North Addis Ababa District',
  'South Addis Ababa District', 'East Addis Ababa District', 'West Addis Ababa District',
  'Adama District', 'Bahir Dar District', 'Hawassa District', 'Mekelle District',
  'Dire Dawa District', 'Jimma District', 'Gondar District', 'Dessie District',
  'Nekemte District', 'Harar District', 'Gambella District', 'Jijiga District',
  'Semera District', 'Asosa District', 'Arba Minch District', 'Wolaita Sodo District',
  'Debre Markos District', 'Debre Birhan District', 'Shashemene District',
  'Dilla District', 'Hosaena District', 'Woldia District', 'Axum District',
  'Adigrat District',
];

const ROLES: UserRole[] = ['ADMIN', 'CRM MANAGER', 'CRM OFFICER', 'MONITORING OFFICER'];

const phoneRegex = /^(\+?251|0)?9\d{8}$/;

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(phoneRegex, 'Invalid Ethiopian phone number'),
  role: z.enum(['ADMIN', 'CRM MANAGER', 'CRM OFFICER', 'MONITORING OFFICER']),
  district: z.string().min(1, 'District is required'),
  branch: z.string().min(1, 'Branch is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

// Mock data for demo
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', firstName: 'Abebe', lastName: 'Kebede', email: 'abebe@cbe.com.et', phone: '+251911223344', role: 'CRM MANAGER', district: 'Head Office', branch: 'Main Branch', status: 'ACTIVE', createdAt: '2024-01-15', updatedAt: '2024-06-20' },
  { id: '2', firstName: 'Tigist', lastName: 'Hailu', email: 'tigist@cbe.com.et', phone: '+251922334455', role: 'CRM OFFICER', district: 'Addis Ababa District', branch: 'Bole Branch', status: 'ACTIVE', createdAt: '2024-02-10', updatedAt: '2024-05-15' },
  { id: '3', firstName: 'Dawit', lastName: 'Gebre', email: 'dawit@cbe.com.et', phone: '+251933445566', role: 'MONITORING OFFICER', district: 'Bahir Dar District', branch: 'Central Branch', status: 'ACTIVE', createdAt: '2024-03-05', updatedAt: '2024-07-10' },
  { id: '4', firstName: 'Hana', lastName: 'Tesfaye', email: 'hana@cbe.com.et', phone: '+251944556677', role: 'ADMIN', district: 'Hawassa District', branch: 'Lake Side Branch', status: 'INACTIVE', createdAt: '2024-01-20', updatedAt: '2024-04-30' },
  { id: '5', firstName: 'Yonas', lastName: 'Alemu', email: 'yonas@cbe.com.et', phone: '+251955667788', role: 'CRM OFFICER', district: 'Adama District', branch: 'Main Branch', status: 'ACTIVE', createdAt: '2024-04-01', updatedAt: '2024-08-15' },
];

export default function EmployeesContent() {
  const { role: userRole } = useAuth();
  const isAdmin = userRole === 'ADMIN';
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      role: 'CRM OFFICER', district: '', branch: '', status: 'ACTIVE',
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeApi.getAll();
        setEmployees(res.data);
      } catch {
        // Use mock data
      }
    };
    fetchEmployees();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      firstName: '', lastName: '', email: '', phone: '',
      role: 'CRM OFFICER', district: '', branch: '', status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    reset({
      firstName: emp.firstName, lastName: emp.lastName,
      email: emp.email, phone: emp.phone,
      role: emp.role, district: emp.district,
      branch: emp.branch, status: emp.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (editing) {
        try {
          await employeeApi.update(editing.id, data);
        } catch { }
        setEmployees((prev) =>
          prev.map((e) => e.id === editing.id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e)
        );
        toast.success('Employee updated successfully');
      } else {
        try {
          const res = await employeeApi.create(data);
          setEmployees((prev) => [...prev, res.data]);
        } catch {
          const newEmp: Employee = {
            ...data, id: Date.now().toString(),
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          };
          setEmployees((prev) => [...prev, newEmp]);
        }
        toast.success('Employee created successfully');
      }
      setModalOpen(false);
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (emp: Employee) => {
    try {
      await employeeApi.delete(emp.id);
    } catch { }
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
    toast.success('Employee deleted');
  };

  const filteredEmployees = roleFilter === 'all'
    ? employees
    : employees.filter((e) => e.role === roleFilter);

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.original.firstName} {row.original.lastName}
          </p>
          <p className="text-xs text-gray-400">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
          {row.original.role}
        </Badge>
      ),
    },
    { accessorKey: 'district', header: 'District' },
    { accessorKey: 'branch', header: 'Branch' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={`text-xs ${row.original.status === 'ACTIVE'
            ? 'bg-purple-50 text-purple-600 border-purple-200'
            : 'bg-red-50 text-red-600 border-red-200'
            }`}
          variant="outline"
        >
          {row.original.status}
        </Badge>
      ),
    },
    ...(isAdmin
      ? [
        {
          id: 'actions',
          header: 'Actions',
          cell: ({ row }: any) => (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(row.original)}
                className="h-8 w-8 text-gray-400 hover:text-purple-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(row.original)}
                className="h-8 w-8 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
        } as ColumnDef<Employee>,
      ]
      : []),
  ];

  return (
    <div>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-600" />
            Employees
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-800">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800">
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdmin && (
              <Button
                onClick={openCreate}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredEmployees}
            searchPlaceholder="Search employees..."
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? 'Edit Employee' : 'Add New Employee'}
        description={editing ? 'Update employee details' : 'Fill in the details below'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">First Name</Label>
              <Input {...register('firstName')} className="bg-white border-gray-200 text-gray-800" />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Last Name</Label>
              <Input {...register('lastName')} className="bg-white border-gray-200 text-gray-800" />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Email</Label>
            <Input type="email" {...register('email')} className="bg-white border-gray-200 text-gray-800" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Phone</Label>
            <Input {...register('phone')} placeholder="+251911223344" className="bg-white border-gray-200 text-gray-800" />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Role</Label>
              <Select value={watch('role')} onValueChange={(v) => setValue('role', v as UserRole)}>
                <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as 'ACTIVE' | 'INACTIVE')}>
                <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">District</Label>
            <Select value={watch('district')} onValueChange={(v) => setValue('district', v)}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800 max-h-60">
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && <p className="text-xs text-red-500">{errors.district.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Branch</Label>
            <Input {...register('branch')} className="bg-white border-gray-200 text-gray-800" />
            {errors.branch && <p className="text-xs text-red-500">{errors.branch.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="text-gray-500">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white">
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
