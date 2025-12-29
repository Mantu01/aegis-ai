import { useState, useEffect } from "react";

const Popup = () => {
  const [deviceName, setDeviceName] = useState("");
  const [token, setToken] = useState("");
  const [apiProvider, setApiProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["deviceName", "token", "apiProvider", "apiKey"], (result) => {
      if (typeof result.deviceName === "string") setDeviceName(result.deviceName);
      if (typeof result.token === "string") setToken(result.token);
      if (typeof result.apiProvider === "string") setApiProvider(result.apiProvider);
      if (typeof result.apiKey === "string") setApiKey(result.apiKey);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set(
      { deviceName, token, apiProvider, apiKey },
      () => setSaved(true)
    );
    setTimeout(() => setSaved(false), 2000);
  };

  const providers = [
    { id: "openai", name: "OpenAI" },
    { id: "gemini", name: "Gemini" },
    { id: "deepseek", name: "DeepSeek" },
    { id: "grok", name: "Grok" },
    { id: "claude", name: "Claude" },
    { id: "mistral", name: "Mistral" }
  ];

  return (
    <div className="w-[350px] min-h-[450px] bg-black text-gray-100 p-5">
      <div className="mb-6 pb-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">AI Extension Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure your credentials</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 
                     text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                     transition duration-200"
            placeholder="Enter your device name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 
                     text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                     transition duration-200"
            placeholder="Enter your token"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            AI Provider
          </label>
          <div className="relative">
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 
                       text-white appearance-none
                       focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                       transition duration-200"
            >
              {providers.map((provider) => (
                <option 
                  key={provider.id} 
                  value={provider.id}
                  className="bg-gray-900 py-2"
                >
                  {provider.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 
                     text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                     transition duration-200"
            placeholder={`Enter ${providers.find(p => p.id === apiProvider)?.name} API Key`}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 
                   text-white font-medium rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black
                   transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Save All Settings
        </button>

        {saved && (
          <div className="mt-4 p-3 bg-gray-900 border border-green-800 rounded-lg">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-400">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>v1.0.0</span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${deviceName && token && apiKey ? "bg-green-500" : "bg-red-500"} mr-1`}></div>
            <span>{deviceName && token && apiKey ? "Ready" : "Setup Required"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;