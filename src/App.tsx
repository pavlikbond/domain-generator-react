import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import DomainResult from "./DomainResult";

interface DomainSuggestion {
  domain: string;
}

interface ApiResponse {
  suggestions: DomainSuggestion[];
  status: "success" | "blocked";
  message?: string;
}

function App() {
  const [businessDescription, setBusinessDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [domains, setDomains] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!businessDescription.trim()) {
      setError("Please enter a business description");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");
    setDomains([]);

    try {
      const response = await fetch("https://ckj2yij79monj3j8.us-east-1.aws.endpoints.huggingface.cloud", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          business_description: businessDescription,
          inputs: businessDescription,
        }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("The model is waking up, please wait a little bit and try again");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setResult(JSON.stringify(data, null, 2));

      if (data.status === "success" && data.suggestions) {
        const domainList = data.suggestions.map((suggestion) => suggestion.domain);
        setDomains(domainList);
      } else if (data.status === "blocked") {
        setError(data.message || "Request was blocked");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto mt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-4">Domain Generator</h1>
          <p className="text-xl text-slate-600">Describe your business and get domain suggestions</p>
        </div>

        {/* Main Form Card */}
        <div className="card bg-white shadow-xl border border-slate-200">
          <div className="card-body p-8">
            <div className="space-y-6">
              {/* Input Field */}
              <div className="form-control w-full grid gap-4">
                <label className="label">
                  <span className="label-text text-3xl font-semibold text-slate-700">Business Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 resize-none text-lg w-full border-slate-300 focus:border-slate-600 focus:ring-slate-600 bg-white text-slate-700 placeholder-slate-400"
                  placeholder="Describe your business, products, or services..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Generate Button */}

              <button
                type="button"
                onClick={handleGenerate}
                className="btn w-full text-lg h-14 bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 disabled:text-slate-400 disabled:border-2 disabled:border-slate-400"
                disabled={isLoading || !businessDescription.trim()}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <span> Generate Domains</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-error mt-6 bg-red-50 border border-red-200 text-red-800">
                <AlertCircle className="w-6 h-6" />
                <span className="text-lg">{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="mt-8">
                <div className="grid gap-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}

            {/* Domain Results */}
            {domains.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-semibold text-slate-700">Generated Domains</h3>
                </div>
                <div className="grid gap-2">
                  {domains.map((domain, index) => (
                    <DomainResult key={index} domain={domain} />
                  ))}
                </div>
              </div>
            )}

            {/* Raw Result (for debugging) */}
            {result && domains.length === 0 && !isLoading && !error && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-semibold text-slate-700">Generated Results</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <pre className="text-base text-slate-700 whitespace-pre-wrap overflow-x-auto">{result}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500 text-lg">
          <p>Powered by Hugging Face API</p>
        </div>
      </div>
    </div>
  );
}

export default App;
