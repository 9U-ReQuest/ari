export interface Pagination<T> {
  data: T;
  cursorInfo: cursor;
}

export interface cursor {
  cursor: string | null;
  pageSize: number;
  hasNext: boolean;
  totalCount: number;
  meta: {
    maxLikeCount: number;
    maxTextScore?: number;
  };
}

export interface Pageable {
  sort: "ASC" | "DESC";
  page: number;
  pageSize: number;
  totalPage: number;
  totalCount: number;
  isLast: boolean;
  isFirst: boolean;
}

export const createCursorInfo = (
  posts: PostInterface[],
  totalCount: number,
  pageSize: number,
): cursor => {
  const hasNext = posts.length >= pageSize;
  const lastPost = posts[posts.length - 1];

  const maxLikeCount = posts.length > 0 ? posts[posts.length - 1].likeCount : 0;

  return {
    cursor: hasNext ? lastPost.id : null,
    pageSize: posts.length,
    hasNext: hasNext,
    totalCount: totalCount,
    meta: {
      maxLikeCount: maxLikeCount,
    },
  };
};

export const createPaginationStages = (
  page: number,
  pageSize: number,
  sort: "ASC" | "DESC",
): PipelineStage[] => {
  const sortStage: PipelineStage = {
    $sort: {
      createdAt: sort === "ASC" ? 1 : -1,
    },
  };

  const skipStage: PipelineStage = {
    $skip: (page - 1) * pageSize,
  };

  const limitStage: PipelineStage = {
    $limit: pageSize,
  };

  return [sortStage, skipStage, limitStage];
};

export const createPageable = (
  paginationStages: PipelineStage[],
  totalCount: number,
): Pageable => {
  const pageSize =
    paginationStages.find((stage) => "$limit" in stage)?.$limit ?? 20;
  const totalPage = Math.ceil(totalCount / pageSize);

  const skipStage = paginationStages.find(
    (stage): stage is { $skip: number } => "$skip" in stage,
  );
  const skipValue = skipStage ? skipStage.$skip : 0;

  const sortStage = paginationStages.find(
    (stage): stage is { $sort: { createdAt: 1 | -1 } } => "$sort" in stage,
  );
  const sortValue = sortStage ? sortStage.$sort.createdAt : -1;

  return {
    sort: sortValue === 1 ? "ASC" : "DESC",
    page: Math.floor(skipValue / pageSize) + 1,
    pageSize: pageSize,
    totalPage: totalPage,
    totalCount: totalCount,
    isLast: Math.floor(skipValue / pageSize) + 1 >= totalPage,
    isFirst: skipValue === 0,
  };
};
