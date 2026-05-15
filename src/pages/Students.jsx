import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';

export default function Students() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/admin/students').then(r => r.data)
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/students/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries(['students'])
  });

  const deleteStudent = useMutation({
    mutationFn: (id) => api.delete(`/admin/students/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['students'])
  });

  const filtered = students?.filter(s =>
    s.name.includes(search) || s.username.includes(search)
  );

  if (isLoading) return <div className="text-center py-20 text-gray-400">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة الطلاب</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-right focus:outline-none focus:border-blue-400"
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">الاسم</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">اسم المستخدم</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">الصلاحية</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">تاريخ التسجيل</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered?.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                <td className="px-6 py-4 text-gray-500">@{s.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    s.role === 'ADMIN' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {s.role === 'ADMIN' ? 'مدير' : 'طالب'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(s.createdAt).toLocaleDateString('ar-IQ')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => changeRole.mutate({ id: s.id, role: s.role === 'ADMIN' ? 'STUDENT' : 'ADMIN' })}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
                    >
                      {s.role === 'ADMIN' ? 'تحويل لطالب' : 'تحويل لمدير'}
                    </button>
                    <button
                      onClick={() => { if (confirm('حذف الحساب؟')) deleteStudent.mutate(s.id) }}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered?.length === 0 && (
          <div className="text-center py-12 text-gray-400">لا يوجد طلاب</div>
        )}
      </div>
    </div>
  );
}