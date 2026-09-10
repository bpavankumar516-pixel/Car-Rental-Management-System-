import React from 'react';

export function CarCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-slate-800 rounded-xl" />
      <div className="h-5 bg-slate-800 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-9 bg-slate-800 rounded-xl w-24" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-800">
      <td className="p-4"><div className="h-4 bg-slate-800 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
      <td className="p-4"><div className="h-4 bg-slate-800 rounded w-20" /></td>
      <td className="p-4"><div className="h-4 bg-slate-800 rounded w-16" /></td>
      <td className="p-4"><div className="h-6 bg-slate-800 rounded-full w-20" /></td>
      <td className="p-4"><div className="h-8 bg-slate-800 rounded-lg w-16" /></td>
    </tr>
  );
}
