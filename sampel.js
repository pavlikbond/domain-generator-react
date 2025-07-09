async function query(data) {
  const response = await fetch("https://ckj2yij79monj3j8.us-east-1.aws.endpoints.huggingface.cloud", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer YOUR_HUGGING_FACE_TOKEN_HERE",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

(business_description = "A coffee shop with organic beans and pasteries"),
  query({
    business_description: business_description,
    inputs: business_description,
  }).then((response) => {
    console.log(JSON.stringify(response));
  });
