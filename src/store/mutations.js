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
    set_createTime(state, createTime) {
        state.createTime = createTime;
        localStorage.setItem("createTime",createTime);
    },
    remove_createTime(state) {
        state.createTime = "";
        localStorage.setItem("createTime","");
    },
    set_workPlace(state, workPlace) {
        state.workPlace = workPlace;
        localStorage.setItem("workPlace",workPlace);
    },
    remove_workPlace(state) {
        state.workPlace = "";
        localStorage.setItem("workPlace","");
    }
}