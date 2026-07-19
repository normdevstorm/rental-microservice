export interface CreateItemResponse {
  // token returned when user upload the first item which add Owner roles to it, thus the need of a new token
  token?: string;
  refreshAccess?: string;
}
