export default {
    set_username(state, username) {
        state.username = username;
        localStorage.setItem("username",username);
    },
    remove_username(state) {
        state.username = "";
        localStorage.setItem("username",'');
    },
    set_role(state, role) {
        state.role = role;
        localStorage.setItem("role",role);
    },
    remove_role(state) {
        state.role = "";
        localStorage.setItem("role",'');
    },
}