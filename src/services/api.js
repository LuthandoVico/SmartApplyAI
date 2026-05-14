export const analyzeCV = async (data) => {
  const response = await fetch("https://localhost:7088/api/analysis/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
