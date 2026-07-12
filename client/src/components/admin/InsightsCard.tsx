import React from "react";

function InsightsCard({
  name,
  icon,
  money,
  info,
  prefix,
}: {
  name: string;
  icon: React.ReactNode;
  money: number;
  info?: string;
  prefix?: string;
}) {
  return (
    <div className="min-w-[260px] flex-1 p-5 border border-surface-200 rounded-xl flex flex-col gap-2 bg-white motion-safe:transition-all motion-safe:duration-150 hover:border-primary-200 hover:shadow-sm">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-sm font-semibold text-surface-600 uppercase tracking-wide">{name}</h1>
        <span className="text-surface-400">{icon}</span>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold text-surface-900">
          {money.toLocaleString() === "0" ? "N/A" : money.toLocaleString()}
        </span>
        {prefix && (
          <span className="text-sm font-medium text-surface-400 mb-0.5">{prefix}</span>
        )}
      </div>
      {info && <p className="text-xs text-surface-400">{info}</p>}
    </div>
  );
}

export default InsightsCard;
