import { Component, type ReactNode } from "react";

interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F4EE] p-6">
          <div
            style={{ background: "white", border: "1px solid rgba(27,43,94,0.1)", borderRadius: "24px", maxWidth: "480px", width: "100%" }}
            className="p-8 text-center shadow-lg"
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h2 style={{ color: "#1B2B5E", fontSize: "20px", fontWeight: "700" }} className="mb-2">
              Algo salió mal
            </h2>
            <p style={{ color: "#8A92B2", fontSize: "14px", lineHeight: "1.6" }} className="mb-6">
              {this.state.message || "Error inesperado. Por favor recarga la página."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white", borderRadius: "12px" }}
              className="px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
