import { createPost, getDetailPost, getPosts } from "../../api/post";
import { useMutation, useQuery } from "react-query";

export function useGetPosts(params?: any) {
  const {
    data: posts,
    refetch: refetchPosts,
    status,
    isLoading,
  } = useQuery<any>([`postData`, params], () => getPosts(params), {
    enabled: true,
    retry: false,
  });
  return { posts, refetchPosts, status, isLoading };
}

export function useDetailPost(idPost: string) {
  const {
    data: detailPost,
    refetch: refetchDetailPost,
    isLoading,
    isFetching,
  } = useQuery<any>(["detailPost", idPost], () => getDetailPost(idPost), {
    retry: false,
    enabled: Boolean(idPost),
  });
  return { detailPost, refetchDetailPost, isLoading, isFetching };
}

export function useCreatePost() {
  return useMutation<any>((payload: any) => createPost(payload), {
    onSuccess: () => {},
    onError: () => {},
  });
}
