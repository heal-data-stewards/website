import { Bookmarks, Download } from "@mui/icons-material"
import { Button } from "@mui/material"

export function Collection() {
  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <Bookmarks fontSize="medium" />
        <h3 className="text-lg font-semibold">Collection</h3>
      </div>
      <hr className="my-4" />
      <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
        Concepts (0)
      </h4>
      <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
        Studies (0)
      </h4>
      <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
        Variables (0)
      </h4>
      <hr className="my-4" />
      <Button variant="contained" fullWidth endIcon={<Download />}>
        Download JSON
      </Button>
    </div>
  )
}
