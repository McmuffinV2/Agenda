// src/utils/db.js - Gestión de persistencia local (localStorage)

const KEYS = {
    JOBS: 'sanfercom_jobs',
    USERS: 'sanfercom_users'
};

const DB = {
    // --- Gestión de TRABAJOS (Agenda) ---
    getJobs: function () {
        const jobs = localStorage.getItem(KEYS.JOBS);
        return jobs ? JSON.parse(jobs) : [];
    },

    saveJobs: function (jobs) {
        localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs));
    },

    // --- Gestión de USUARIOS ---
    getUsers: function () {
        const users = localStorage.getItem(KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    saveUsers: function (users) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    },

    // --- Inicialización ---
    init: function (defaultJobs, defaultUsers) {
        // Solo guardamos los default si la "base de datos" está totalmente vacía
        if (this.getJobs().length === 0 && defaultJobs) {
            this.saveJobs(defaultJobs);
        }
        if (this.getUsers().length === 0 && defaultUsers) {
            this.saveUsers(defaultUsers);
        }
    }
};

export default DB;
