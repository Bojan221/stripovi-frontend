import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationRounded({
  totalPages,
}: {
  totalPages: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setSearchParams((params) => {
      params.set("page", String(value));
      return params;
    });
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        shape="rounded"
        page={currentPage}
        onChange={handlePageChange}
      />
    </Stack>
  );
}
