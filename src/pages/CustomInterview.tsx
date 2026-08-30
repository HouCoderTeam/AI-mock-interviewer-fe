import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/Card";
import {
  Upload,
  FileText,
  BriefcaseBusiness,
  Sparkles,
  Play,
  AlertCircle,
  FileUp,
  FileSearch,
} from "lucide-react";

export const CustomInterview: React.FC = () => {
  const { startCustomInterview, isCreating } = useInterview();
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("Backend Developer");
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handleCvUpload = (file?: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError(
        "Vui lòng chọn file PDF cho CV để xem trước trực tiếp trong trình duyệt.",
      );
      setCvFile(null);
      setPdfPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setCvText("");
      return;
    }

    setError("");
    const nextPreviewUrl = URL.createObjectURL(file);

    setPdfPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreviewUrl;
    });
    setCvFile(file);
    setCvText(`Tệp CV đã tải lên: ${file.name}`);
  };

  const handleStart = async () => {
    const hasCv = cvText.trim() || !!cvFile;
    if (!hasCv || !jdText.trim()) {
      setError(
        "Bạn cần tải lên CV PDF và nhập mô tả JD trước khi bắt đầu phỏng vấn.",
      );
      return;
    }
    setError("");
    try {
      await startCustomInterview({
        jobTitle,
        cvText: cvText.trim() || `CV đã tải lên: ${cvFile?.name ?? "CV.pdf"}`,
        jdText,
        questionCount,
      });
      navigate("/interview-room");
    } catch (err: any) {
      setError(
        err?.message || "Không thể tạo buổi phỏng vấn. Vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tạo buổi phỏng vấn theo CV & JD
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tải lên CV và mô tả công việc, sau đó AI sẽ sinh bộ câu hỏi 1-1 và
          tiến hành phỏng vấn như một buổi PV trực tiếp.
        </p>
      </div>

      <Card className="shadow-xs border-slate-200">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Thông tin buổi phỏng vấn
            </h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vị trí ứng tuyển
              </label>
              <div className="relative">
                <BriefcaseBusiness className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="VD: Backend Developer, Java Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Số câu hỏi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[10, 20, 50, 100].map((count) => {
                  const isDisabled = count === 50 || count === 100;
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setQuestionCount(count)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                        isDisabled
                          ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"
                          : isSelected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {count} câu hỏi
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  CV của bạn
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100">
                  <Upload className="w-3.5 h-3.5" />
                  Tải lên PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleCvUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                {pdfPreviewUrl ? (
                  <div className="h-[360px] w-full bg-white">
                    <iframe
                      src={`${pdfPreviewUrl}#toolbar=0&navpanes=0`}
                      title="CV Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <label className="flex h-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleCvUpload(e.target.files?.[0])}
                    />
                    <FileUp className="h-12 w-12 text-slate-400" />
                    <div>
                      <p className="text-base font-semibold">Tải CV PDF lên</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Nhấn vào đây để chọn file PDF
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mô tả công việc (JD)
              </label>

              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={12}
                placeholder="Dán mô tả công việc, yêu cầu, kỹ năng cần có..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-y"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-slate-400" />
            Hệ thống sẽ tạo câu hỏi dựa trên độ khớp CV/JD và mức độ phù hợp với
            vị trí ứng tuyển.
          </div>

          <button
            onClick={handleStart}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isCreating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI đang tạo câu hỏi...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Bắt đầu phỏng vấn
              </>
            )}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};
