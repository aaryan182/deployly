import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black bg-gradient-to-br from-black via-purple-900/10 to-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-20 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-full w-full bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              transform: `translate(${Math.sin(i) * 10}px, ${
                Math.cos(i) * 10
              }px)`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-8 relative">
        <div className="absolute -inset-1 bg-purple-500/20 blur-lg rounded-lg" />
        <h1 className="relative text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 animate-gradient-x pb-2">
          Welcome to Deployly
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-2 animate-pulse" />
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-black/40 border border-purple-500/20 shadow-2xl shadow-purple-500/10 transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50" />
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Deploy your GitHub Repository
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter the URL of your GitHub repository to deploy it
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="github-url" className="text-purple-300">
                GitHub Repository URL
              </Label>
              <Input
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300"
              />
            </div>
            <Button
              onClick={async () => {
                setUploading(true);
                try {
                  const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
                    repoUrl: repoUrl,
                  });
                  setUploadId(res.data.id);
                  setUploading(false);
                  const interval = setInterval(async () => {
                    const response = await axios.get(
                      `${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`
                    );
                    if (response.data.status === "deployed") {
                      clearInterval(interval);
                      setDeployed(true);
                    }
                  }, 3000);
                } catch (error) {
                  setUploading(false);
                }
              }}
              disabled={uploadId !== "" || uploading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploadId
                ? `Deploying (${uploadId})`
                : uploading
                ? "Uploading..."
                : "Deploy Repository"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {deployed && (
        <Card className="w-full max-w-md mt-8 backdrop-blur-xl bg-black/40 border border-purple-500/20 shadow-2xl shadow-purple-500/10 transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02] animate-fadeIn">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Deployment Successful! 🚀
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your website is now live and ready to view
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deployed-url" className="text-purple-300">
                  Deployed URL
                </Label>
                <Input
                  id="deployed-url"
                  readOnly
                  type="url"
                  value={`http://${uploadId}.dev.aaryanbajaj.com:3001/index.html`}
                  className="bg-black/50 border-purple-500/30 text-purple-100 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300"
                />
              </div>
              <Button className="w-full bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group">
                <a
                  href={`http://${uploadId}.aaryanbajaj.com/index.html`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  Visit Website
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
