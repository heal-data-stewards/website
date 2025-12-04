export function ContentLayout() {
  return (
    <div className="flex-1 border-solid border-[1px] border-t-[3px] border-gray-200 rounded-md rounded-tl-none shadow-md flex min-h-0">
      <div className="min-w-[150px] max-w-[300px] overflow-auto">
        {new Array(100).fill(0).map((_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </div>
      <div>Content Area</div>
    </div>
  )
}
