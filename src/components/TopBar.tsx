interface Props {
  onExport: () => void;
}

export default function TopBar({ onExport }: Props) {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <h1 className="font-semibold text-lg">Bathroom Designer</h1>

      <button
        onClick={onExport}
        className="bg-black text-white px-4 py-1 rounded"
      >
        Export
      </button>
    </div>
  );
}
