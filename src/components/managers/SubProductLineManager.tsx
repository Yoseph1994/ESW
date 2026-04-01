import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, GitBranch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/DataTable';
import { FormModal } from '@/components/ui/FormModal';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { subProductLineApi, productGroupApi } from '@/services/api';
import type { SubProductLine, ProductGroup } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  productGroupId: z.string().min(1, 'Select a product group'),
});
type FormData = z.infer<typeof schema>;

const MOCK_PG: ProductGroup[] = [
  { id: '1', name: 'Short Term Loans', creditProductLineId: '1', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Medium Term Loans', creditProductLineId: '1', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Revolving Credit', creditProductLineId: '2', createdAt: '', updatedAt: '' },
];
const MOCK: SubProductLine[] = [
  { id: '1', name: 'Working Capital Loan', productGroupId: '1', createdAt: '2024-01-10', updatedAt: '2024-06-20' },
  { id: '2', name: 'Trade Finance', productGroupId: '1', createdAt: '2024-01-15', updatedAt: '2024-05-10' },
  { id: '3', name: 'Equipment Financing', productGroupId: '2', createdAt: '2024-02-01', updatedAt: '2024-07-05' },
  { id: '4', name: 'Line of Credit', productGroupId: '3', createdAt: '2024-02-15', updatedAt: '2024-06-30' },
];

export default function SubProductLineManager() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [items, setItems] = useState<SubProductLine[]>(MOCK);
  const [parents, setParents] = useState<ProductGroup[]>(MOCK_PG);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubProductLine | null>(null);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    subProductLineApi.getAll().then((r) => setItems(r.data)).catch(() => {});
    productGroupApi.getAll().then((r) => setParents(r.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); reset({ name: '', productGroupId: '' }); setModalOpen(true); };
  const openEdit = (item: SubProductLine) => { setEditing(item); reset({ name: item.name, productGroupId: item.productGroupId }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    if (editing) {
      try { await subProductLineApi.update(editing.id, data); } catch {}
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
      toast.success('Sub Product Line updated');
    } else {
      try { const r = await subProductLineApi.create(data); setItems((p) => [...p, r.data]); } catch {
        setItems((p) => [...p, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      }
      toast.success('Sub Product Line created');
    }
    setModalOpen(false);
  };

  const handleDelete = async (item: SubProductLine) => {
    try { await subProductLineApi.delete(item.id); } catch {}
    setItems((p) => p.filter((i) => i.id !== item.id));
    toast.success('Sub Product Line deleted');
  };

  const getParentName = (id: string) => parents.find((p) => p.id === id)?.name || id;

  const columns: ColumnDef<SubProductLine>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
    { accessorKey: 'productGroupId', header: 'Product Group', cell: ({ row }) => <span className="text-purple-600">{getParentName(row.original.productGroupId)}</span> },
    ...(isAdmin ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)} className="h-8 w-8 text-gray-400 hover:text-purple-600"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)} className="h-8 w-8 text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    } as ColumnDef<SubProductLine>] : []),
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900 flex items-center gap-2"><GitBranch className="h-5 w-5 text-purple-600" />Sub Product Lines</CardTitle>
        {isAdmin && <Button onClick={openCreate} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20"><Plus className="h-4 w-4 mr-2" />Create New</Button>}
      </CardHeader>
      <CardContent><DataTable columns={columns} data={items} searchPlaceholder="Search sub product lines..." /></CardContent>
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Edit Sub Product Line' : 'Create Sub Product Line'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Name</Label>
            <Input {...register('name')} className="bg-white border-gray-200 text-gray-800" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Product Group</Label>
            <Select value={watch('productGroupId')} onValueChange={(v) => { if (v) setValue('productGroupId', v); }}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-800"><SelectValue placeholder="Select product group" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800">
                {parents.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.productGroupId && <p className="text-xs text-red-400">{errors.productGroupId.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="text-gray-500">Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>
    </Card>
  );
}
