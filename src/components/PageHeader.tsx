import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({
  title,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="rounded-lg border px-4 py-2 hover:bg-slate-50"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold">
        {title}
      </h1>
    </div>
  );
}