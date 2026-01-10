export const getComments = (key) => {
  const data = JSON.parse(localStorage.getItem("comments")) || {};
  return data[key] || [];
};

export const addComment = (key, comment) => {
  const data = JSON.parse(localStorage.getItem("comments")) || {};
  data[key] = [...(data[key] || []), comment];
  localStorage.setItem("comments", JSON.stringify(data));
};