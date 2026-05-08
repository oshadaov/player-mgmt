import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const ActivityLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/auth/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes("CREATE")) return "text-emerald-400";
    if (action.includes("DELETE")) return "text-red-400";
    if (action.includes("UPDATE")) return "text-sky-400";
    if (action.includes("APPROVE")) return "text-emerald-400";
    if (action.includes("REJECT")) return "text-amber-400";
    return "text-slate-400";
  };

  if (loading) return <div className="text-emerald-400 animate-pulse">Scanning System Logs...</div>;

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-bold">System Activity Logs</h3>
        <button onClick={fetchLogs} className="text-xs text-emerald-400 hover:underline">Refresh</button>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Entity</th>
              <th className="px-6 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                  {new Date(log.performedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-200">{log.performedBy}</span>
                    <span className="text-[10px] text-slate-500">{log.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-300">{log.entityType}</span>
                    <span className="text-[10px] text-slate-500">ID: {log.entityId}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={log.description}>
                  {log.description}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogList;
