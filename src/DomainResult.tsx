import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface DomainResultProps {
  domain: string;
}

export default function DomainResult({ domain }: DomainResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
      <span className="text-lg font-medium text-slate-800">{domain}</span>
      <button
        onClick={handleCopy}
        className={`btn btn-sm ${
          copied
            ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
            : "bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-700"
        }`}
        title={copied ? "Copied!" : "Copy domain"}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
