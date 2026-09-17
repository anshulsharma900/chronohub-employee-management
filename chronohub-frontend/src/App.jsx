import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-x-hidden">
      <div className="flex-1 overflow-x-hidden">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
