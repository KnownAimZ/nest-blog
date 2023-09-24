import { PaginationQueryDto } from '../dto/pagination-query.dto';

export function formatPaginationQuerry(query: PaginationQueryDto) {
  const { limit, offset, orderBy, orderDirection } = query;
  const shouldApplyOrdering = !!(orderBy && orderDirection);

  return {
    skip: offset ?? 0,
    take: limit ?? null,
    ...(shouldApplyOrdering && { order: { [orderBy]: orderDirection } }),
  };
}
