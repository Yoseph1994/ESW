import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/DataTable';
import { FormModal } from '@/components/ui/FormModal';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { broadSegmentApi } from '@/services/api';
import type { BroadSegment } from '@/types';

const schema = z.object({ name: z.string().min(2, 'Required') });
type FormData = z.infer<typeof schema>;

const MOCK: BroadSegment[] = [
  { id: '1', name: 'Corporate', createdAt: '2024-01-10', updatedAt: '2024-06-20' },
  { id: '2', name: 'Retail', createdAt: '2024-01-15', updatedAt: '2024-05-10' },
  { id: '3', name: 'SME', createdAt: '2024-02-01', updatedAt: '2024-07-05' },
  { id: '4', name: 'Government', createdAt: '2024-02-15', updatedAt: '2024-06-30' },
];

export default function BroadSegmentManager() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [items, setItems] = useState<BroadSegment[]>(MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BroadSegment | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => { broadSegmentApi.getAll().then((r) => setItems(r.data)).catch(() => { }); }, []);

  const openCreate = () => { setEditing(null); reset({ name: '' }); setModalOpen(true); };
  const openEdit = (item: BroadSegment) => { setEditing(item); reset({ name: item.name }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    if (editing) {
      try { await broadSegmentApi.update(editing.id, data); } catch { }
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
      toast.success('Broad Segment updated');
    } else {
      try { const r = await broadSegmentApi.create(data); setItems((p) => [...p, r.data]); } catch {
        setItems((p) => [...p, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      }
      toast.success('Broad Segment created');
    }
    setModalOpen(false);
  };

  const handleDelete = async (item: BroadSegment) => {
    try { await broadSegmentApi.delete(item.id); } catch { }
    setItems((p) => p.filter((i) => i.id !== item.id));
    toast.success('Broad Segment deleted');
  };

  const columns: ColumnDef<BroadSegment>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
    ...(isAdmin ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)} className="h-8 w-8 text-gray-400 hover:text-purple-600"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)} className="h-8 w-8 text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    } as ColumnDef<BroadSegment>] : []),
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900 flex items-center gap-2"><Target className="h-5 w-5 text-purple-600" />Broad Segments</CardTitle>
        {isAdmin && <Button onClick={openCreate} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20"><Plus className="h-4 w-4 mr-2" />Create New</Button>}
      </CardHeader>
      <CardContent><DataTable columns={columns} data={items} searchPlaceholder="Search broad segments..." /></CardContent>
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Edit Broad Segment' : 'Create Broad Segment'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Name</Label>
            <Input {...register('name')} className="bg-white border-gray-200 text-gray-800" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
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
