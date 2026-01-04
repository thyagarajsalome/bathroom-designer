export default function BottomBar() {
  return (
    <div className="h-12 bg-white border-t flex items-center justify-between px-4 text-sm">
      <div className="space-x-6">
        <span>Area: 48 sq ft</span>
        <span>Tiles: 120 pcs</span>
        <span>Cost: ₹18,000</span>
      </div>

      <button className="bg-orange-500 text-white px-4 py-1 rounded">
        Upgrade to Pro
      </button>
    </div>
  );
}
