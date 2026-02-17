"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      forcePage={page - 1}
      onPageChange={({ selected }) => setPage(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.nav}
      nextClassName={css.nav}
      breakClassName={css.break}
      disabledClassName={css.disabled}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
    />
  );
}
