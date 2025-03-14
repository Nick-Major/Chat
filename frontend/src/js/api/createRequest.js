const createRequest = async ({ url, method, data }) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

export default createRequest;
