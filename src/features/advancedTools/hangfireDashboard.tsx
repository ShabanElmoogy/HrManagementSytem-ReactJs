const HangfireDashboard = () => {
  return (
    <div
      style={{ flex: 1, height: "calc(100vh - 115px)", margin: 0, padding: 0 }}
    >
      <iframe
        id="reportFrame"
        width="100%"
        height="100%"
        src={`${localStorage.getItem("baseApiUrl") || "https://localhost:7037"
          }/hangfire`}
        style={{ border: "none" }}
        title="Hangfire Dashboard"
      />
    </div>
  );
};

export default HangfireDashboard;
