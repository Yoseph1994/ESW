import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
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
import { sectorApi } from '@/services/api';
import type { Sector } from '@/types';

const schema = z.object({
  economicSector: z.string().min(2, 'Required'),
  macroPd: z.coerce.number().min(0).max(1, 'Must be between 0 and 1'),
});

type FormData = z.infer<typeof schema>;

const MOCK: Sector[] = [
  { id: '1', economicSector: 'Agriculture', macroPd: 0.045, createdAt: '2024-01-10', updatedAt: '2024-06-20' },
  { id: '2', economicSector: 'Manufacturing', macroPd: 0.032, createdAt: '2024-01-15', updatedAt: '2024-05-10' },
  { id: '3', economicSector: 'Trade & Commerce', macroPd: 0.028, createdAt: '2024-02-01', updatedAt: '2024-07-05' },
  { id: '4', economicSector: 'Construction', macroPd: 0.055, createdAt: '2024-02-15', updatedAt: '2024-06-30' },
  { id: '5', economicSector: 'Mining & Quarrying', macroPd: 0.062, createdAt: '2024-03-01', updatedAt: '2024-08-01' },
];

export default function SectorManager() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [items, setItems] = useState<Sector[]>(MOCK);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Sector | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    sectorApi.getAll().then((r) => setItems(r.data)).catch(() => { });
  }, []);

  const openCreate = () => { setEditing(null); reset({ economicSector: '', macroPd: 0 }); setModalOpen(true); };
  const openEdit = (item: Sector) => { setEditing(item); reset({ economicSector: item.economicSector, macroPd: item.macroPd }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    if (editing) {
      try { await sectorApi.update(editing.id, data); } catch { }
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
      toast.success('Sector updated');
    } else {
      try { const r = await sectorApi.create(data); setItems((p) => [...p, r.data]); } catch {
        setItems((p) => [...p, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      }
      toast.success('Sector created');
    }
    setModalOpen(false);
  };

  const handleDelete = async (item: Sector) => {
    try { await sectorApi.delete(item.id); } catch { }
    setItems((p) => p.filter((i) => i.id !== item.id));
    toast.success('Sector deleted');
  };

  const columns: ColumnDef<Sector>[] = [
    { accessorKey: 'economicSector', header: 'Economic Sector', cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.economicSector}</span> },
    { accessorKey: 'macroPd', header: 'Macro PD', cell: ({ row }) => <span className="text-purple-600 font-mono">{row.original.macroPd.toFixed(4)}</span> },
    ...(isAdmin ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)} className="h-8 w-8 text-gray-400 hover:text-purple-600"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)} className="h-8 w-8 text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    } as ColumnDef<Sector>] : []),
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-600" />Sectors</CardTitle>
        {isAdmin && (
          <Button onClick={openCreate} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20">
            <Plus className="h-4 w-4 mr-2" />Create New
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={items} searchPlaceholder="Search sectors..." />
      </CardContent>

      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Edit Sector' : 'Create Sector'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Economic Sector</Label>
            <Input {...register('economicSector')} className="bg-white border-gray-200 text-gray-800" />
            {errors.economicSector && <p className="text-xs text-red-400">{errors.economicSector.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Macro PD</Label>
            <Input type="number" step="0.0001" {...register('macroPd')} className="bg-white border-gray-200 text-gray-800" />
            {errors.macroPd && <p className="text-xs text-red-400">{errors.macroPd.message}</p>}
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
