const linkifyHashtags = (text: string) => {
  return text.replace(
    /#(\w+)/g,
    '<a href="/hashtag/$1" class="text-blue-500">#$1</a>'
  );
};

export const WithHashtags = (text: string) => {
  const withBreaks = text.replace(/\n/g, "<br>");
  return linkifyHashtags(withBreaks); // Assuming this returns an HTML string
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  // Convert to desired format
  const formatted = `${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} · ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return formatted;
};
