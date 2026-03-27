import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
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
import { subSectorApi, sectorApi } from '@/services/api';
import type { SubSector, Sector } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  sectorId: z.string().min(1, 'Select a sector'),
});
type FormData = z.infer<typeof schema>;

const MOCK_SECTORS: Sector[] = [
  { id: '1', economicSector: 'Agriculture', macroPd: 0.045, createdAt: '', updatedAt: '' },
  { id: '2', economicSector: 'Manufacturing', macroPd: 0.032, createdAt: '', updatedAt: '' },
  { id: '3', economicSector: 'Trade & Commerce', macroPd: 0.028, createdAt: '', updatedAt: '' },
];
const MOCK: SubSector[] = [
  { id: '1', name: 'Crop Production', sectorId: '1', createdAt: '2024-01-10', updatedAt: '2024-06-20' },
  { id: '2', name: 'Livestock', sectorId: '1', createdAt: '2024-01-15', updatedAt: '2024-05-10' },
  { id: '3', name: 'Textile', sectorId: '2', createdAt: '2024-02-01', updatedAt: '2024-07-05' },
  { id: '4', name: 'Food Processing', sectorId: '2', createdAt: '2024-02-15', updatedAt: '2024-06-30' },
  { id: '5', name: 'Wholesale Trade', sectorId: '3', createdAt: '2024-03-01', updatedAt: '2024-08-01' },
];

export default function SubSectorManager() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const [items, setItems] = useState<SubSector[]>(MOCK);
  const [sectors, setSectors] = useState<Sector[]>(MOCK_SECTORS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubSector | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    subSectorApi.getAll().then((r) => setItems(r.data)).catch(() => {});
    sectorApi.getAll().then((r) => setSectors(r.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); reset({ name: '', sectorId: '' }); setModalOpen(true); };
  const openEdit = (item: SubSector) => { setEditing(item); reset({ name: item.name, sectorId: item.sectorId }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    if (editing) {
      try { await subSectorApi.update(editing.id, data); } catch {}
      setItems((p) => p.map((i) => i.id === editing.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
      toast.success('Sub Sector updated');
    } else {
      try { const r = await subSectorApi.create(data); setItems((p) => [...p, r.data]); } catch {
        setItems((p) => [...p, { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      }
      toast.success('Sub Sector created');
    }
    setModalOpen(false);
  };

  const handleDelete = async (item: SubSector) => {
    try { await subSectorApi.delete(item.id); } catch {}
    setItems((p) => p.filter((i) => i.id !== item.id));
    toast.success('Sub Sector deleted');
  };

  const getSectorName = (sectorId: string) => sectors.find((s) => s.id === sectorId)?.economicSector || sectorId;

  const columns: ColumnDef<SubSector>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <span className="font-medium text-white">{row.original.name}</span> },
    { accessorKey: 'sectorId', header: 'Sector', cell: ({ row }) => <span className="text-teal-400">{getSectorName(row.original.sectorId)}</span> },
    ...(isAdmin ? [{
      id: 'actions', header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)} className="h-8 w-8 text-gray-400 hover:text-teal-400"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)} className="h-8 w-8 text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    } as ColumnDef<SubSector>] : []),
  ];

  return (
    <Card className="glass-card border-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2"><Layers className="h-5 w-5 text-teal-400" />Sub Sectors</CardTitle>
        {isAdmin && <Button onClick={openCreate} className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20"><Plus className="h-4 w-4 mr-2" />Create New</Button>}
      </CardHeader>
      <CardContent><DataTable columns={columns} data={items} searchPlaceholder="Search sub sectors..." /></CardContent>
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Edit Sub Sector' : 'Create Sub Sector'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Name</Label>
            <Input {...register('name')} className="bg-white/5 border-white/10 text-white" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Sector</Label>
            <Select value={watch('sectorId')} onValueChange={(v) => setValue('sectorId', v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select sector" /></SelectTrigger>
              <SelectContent className="bg-navy-800 border-white/10 text-white">
                {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.economicSector}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.sectorId && <p className="text-xs text-red-400">{errors.sectorId.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="text-gray-400">Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </FormModal>
    </Card>
  );
}
