// Atoms used:
// Image (Book cover)
// Heading (Book title)
// Text (Author)
// Text (Page progress)
// Button (Continue Reading)

import BookThumbnail from "../../atoms/BookThumbnail";
import Text from "../../atoms/Text";

export default function BookInfo() {
  return (
    <div className="flex flex-row">
      <BookThumbnail />
      <div className="flex flex-col">
        <Text>Book.Title</Text>
        <Text>Book.author</Text>
        <div>
          <span>See Saved Words</span>
        </div>
      </div>
    </div>
  );
}
