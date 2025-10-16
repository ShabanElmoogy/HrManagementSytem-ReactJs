const ApiEndpoints = () => {
  return (
    <div
      style={{ flex: 1, height: "calc(100vh - 150px)", margin: 0, padding: 0 }}
    >
      <iframe
        id="reportFrame"
        width="100%"
        height="100%"
        src={`${(import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, '')) || (localStorage.getItem("baseApiUrl") || "https://localhost:7037")
          }/swagger/index.html`}
        style={{ border: "none" }}
        title="Health Check"
      ></iframe>
    </div>
  );
};

export default ApiEndpoints;
