import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function Dashboard() {
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get('/subjects').then(r => r.data)
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/admin/students').then(r => r.data)
  });

  const stats = [
    { label: 'المواد الدراسية', value: subjects?.length || 0, icon: '📚', color: 'bg-blue-50 text-blue-600' },
    { label: 'إجمالي الامتحانات', value: subjects?.reduce((s, x) => s + (x._count?.exams || 0), 0) || 0, icon: '📝', color: 'bg-green-50 text-green-600' },
    { label: 'الطلاب المسجلين', value: students?.length || 0, icon: '👥', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color} mb-4`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">المواد الدراسية</h2>
        <div className="grid grid-cols-4 gap-4">
          {subjects?.map(s => (
            <div key={s.id} className="border border-gray-100 rounded-xl p-4 text-center">
              <p className="font-bold text-gray-800">{s.name}</p>
              <p className="text-gray-500 text-sm mt-1">{s._count?.exams} امتحان</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}