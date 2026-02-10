// hooks/queries/useLibrary.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "../../services/library.service";

export function useLibraryBooks() {
  return useQuery({
    queryKey: ["library", "books"],
    queryFn: () => libraryService.getBooks(), // ← calls the service
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: { title: string; author: string }) =>
      libraryService.addBook(bookData), // ← calls the service

    onSuccess: () => {
      // Refetch the library after adding
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
    },
  });
}

//TODO Implement useUpdateBook
// export function useUpdateBook() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => libraryService.updateBook(bookData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["library", "books"] });
//     },
//   });
// }
