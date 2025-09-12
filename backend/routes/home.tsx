import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your dream job" },
  ];
}

export default function Home() {
  // ✅ Correct way - hooks directly in component
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parshedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      console.log("parshedResumes :", parshedResumes);

      setResumes(parshedResumes || []);

      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Monitor Your Job Application Success</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>
              No Resume Found.Upload Your Resume First,then get your feedback
            </h2>
          ) : (
            <h2>✨ Review Submission & Receive AI-Powered Insights</h2>
          )}

          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/resume-scan-2.gif"
                alt="loader"
                className="w-[200px]"
              />
            </div>
          )}
        </div>
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/Upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
