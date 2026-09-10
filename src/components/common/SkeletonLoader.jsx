import React from 'react';

export function CarCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="w-full h-44 bg-zinc-800/60 rounded-xl" />
      <div className="h-4 bg-zinc-800/60 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
        <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
        <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-zinc-800/60">
        <div className="h-5 bg-zinc-800/60 rounded w-1/3" />
        <div className="h-8 bg-zinc-800/60 rounded-xl w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-zinc-800/60">
      <td className="p-4"><div className="h-4 bg-zinc-800/60 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-zinc-800/60 rounded w-32" /></td>
      <td className="p-4"><div className="h-4 bg-slate-800/60 rounded w-20" /></td>
      <td className="p-4"><div className="h-4 bg-zinc-800/60 rounded w-16" /></td>
      <td className="p-4"><div className="h-5 bg-zinc-800/60 rounded-full w-20" /></td>
      <td className="p-4"><div className="h-7 bg-zinc-800/60 rounded-lg w-16" /></td>
    </tr>
  );
}
