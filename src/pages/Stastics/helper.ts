export enum FILTER {
  ALL,
  PLUS = "plus",
  MINUS = "minus",
}

export const filterOptions = [
  { label: "전체", value: FILTER.ALL },
  { label: "수입", value: FILTER.PLUS },
  { label: "지출", value: FILTER.MINUS },
];

export enum SORT {
  VALUE,
  VALUE_DESC,
  UNIX,
  UNIX_DESC,
}

export const sortOptions = [
  { label: "금액 높은 순", value: SORT.VALUE_DESC },
  { label: "금액 낮은 순", value: SORT.VALUE },
  { label: "최신 순", value: SORT.UNIX_DESC },
  { label: "오래된 순", value: SORT.UNIX },
];

export enum BottomSheetState {
  NONE,
  SORT,
}
