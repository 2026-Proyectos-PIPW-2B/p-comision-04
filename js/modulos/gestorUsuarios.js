export { obtenerUsuarios, guardarUsuario, eliminarUsuario };

const CLAVE_USUARIOS = "usuarios";

function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
}

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function eliminarUsuario(nombreUsuario) {
    const usuarios = obtenerUsuarios().filter(u => u.nombreUsuario !== nombreUsuario);
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}
