import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';

const ICONS = ['calculator', 'zap', 'flask', 'leaf', 'book', 'globe', 'star'];
const COLORS = ['#1D52D8', '#0EA5E9', '#10B981', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Subjects() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', icon: 'book', color: '#1D52D8' });

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get('/subjects').then(r => r.data)
  });

  const addSubject = useMutation({
    mutationFn: (data) => api.post('/subjects', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      setShowAdd(false);
      setForm({ name: '', icon: 'book', color: '#1D52D8' });
    }
  });

  const deleteSubject = useMutation({
    mutationFn: (id) => api.delete(`/subjects/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['subjects'])
  });

  if (isLoading) return <div className="text-center py-20 text-gray-400">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المواد</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          + إضافة مادة
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">مادة جديدة</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="اسم المادة"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-blue-400"
            />
            <div>
              <p className="text-gray-500 text-sm mb-2 text-right">الأيقونة</p>
              <div className="flex gap-2 flex-wrap justify-end">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setForm({ ...form, icon })}
                    className={`px-3 py-2 rounded-lg border text-sm ${form.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2 text-right">اللون</p>
              <div className="flex gap-2 flex-wrap justify-end">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-full border-2 ${form.color === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">إلغاء</button>
              <button
                onClick={() => addSubject.mutate(form)}
                disabled={!form.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {addSubject.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {subjects?.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="flex justify-between items-start mb-3">
              <button
                onClick={() => { if (confirm('حذف المادة؟')) deleteSubject.mutate(s.id) }}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                حذف
              </button>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="font-bold text-gray-800 text-right">{s.name}</p>
            <p className="text-gray-400 text-sm text-right mt-1">{s._count?.exams} امتحان</p>
          </div>
        ))}
      </div>
    </div>
  );
}