import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProveedorAutenticacion } from "./context/ContextoAutenticacion";
import { ProveedorFavoritos } from "./context/ContextoFavoritos";
import { RutaProtegida } from "./components/RutaProtegida";
import { RutaProtegidaAdmin } from "./components/RutaProtegidaAdmin";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Auth
import { PaginaLogin } from "./pages/Login";
import { PaginaRegistro } from "./pages/Registro";

// Public pages
import { HomePage } from "./pages/Inicio";
import { Catalogo } from "./pages/catalogo";
import { DetallePropiedad } from "./pages/DetallePropiedad";

// Dashboard pages
import { DashboardOverviewPage } from "./pages/dashboard";
import { MisPropiedades } from "./pages/MisPropiedades";
import { CrearPropiedad } from "./pages/CrearPropiedad";
import { ListaChats } from "./pages/ListaChats";
import { ConversacionChat } from "./pages/ConversacionChat";
import { EditarPropiedad } from "./pages/EditarPropiedad";

// Admin pages
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminPropertiesPage } from "./pages/admin/AdminPropertiesPage";

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <ProveedorAutenticacion>
        <ProveedorFavoritos>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/propiedad/:id" element={<DetallePropiedad />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />

          {/* Protegidas */}
          <Route element={<RutaProtegida />}>
            <Route path="/panel" element={<DashboardOverviewPage />} />
            <Route path="/panel/propiedades" element={<MisPropiedades />} />
            <Route path="/panel/propiedades/crear" element={<CrearPropiedad />} />
            <Route path="/panel/propiedades/editar/:id" element={<EditarPropiedad />} />
            <Route path="/panel/chat" element={<ListaChats />} />
            <Route path="/panel/chat/:id" element={<ConversacionChat />} />
          </Route>

          {/* Admin (solo rol admin) */}
          <Route element={<RutaProtegidaAdmin />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/properties" element={<AdminPropertiesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ProveedorFavoritos>
      </ProveedorAutenticacion>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
