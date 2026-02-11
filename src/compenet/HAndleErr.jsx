export const HandleErr = (err, setErr) => {
  if (err.response && err.response.data) {
    setErr(err.response.data);
  } else {
    setErr({
      errors: {
        general: ["Network error or server unavailable"],
      },
    });
  }
};
