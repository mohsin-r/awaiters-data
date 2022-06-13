<template>
    <div id="sidebar" ref="sidebar" v-show="store.state.title">
        <h1>{{ store.state.title }}</h1>
        <router-link to="/dashboard" id="dashboard"><i class="fas fa-grip"></i> <span> Dashboard </span></router-link>
        <router-link to="/data/new" id="data"><i class="fas fa-circle-plus"></i> <span> Add Data </span></router-link>
        <router-link to="/analysis" id="analysis"><i class="fas fa-chart-simple"></i> <span> Analysis </span></router-link>
        <a href="#" @click="logout" id="logout"><i class="fas fa-arrow-right-from-bracket"></i> <span> Logout </span></a>
        <!-- div id="classInfo">
            <h2>Class Information</h2>
            <p><strong>Day: </strong>{{ classInfo.day }}</p>
            <p><strong>Time: </strong>{{ classInfo.startTime}} to {{ classInfo.endTime }}</p>
            <p>
                <strong>Teacher(s): </strong>
                <span v-for="(teacher, i) in classInfo.teachers" :key="i">
                    {{ teacher }}<span v-if="i != classInfo.teachers.length - 1">, </span>
                </span>
            </p>
        </div -->
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue"
import env from '../apiConfig'
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import header from '../headerConfig'
export default {
    props: {active: String},
    setup(props: any) {
        const host = env.api_host
        const store = useStore()
        const router = useRouter()
        const sidebar: any = ref(null)
        /*
        const classInfo = {
            day: "Tuesday",
            startTime: "7:30pm",
            endTime: "10:30pm",
            teachers: ["Ali Bhayani", "MAK", "Ali Hemraj"]
        }*/
        onMounted(() => {
            if (props.active) {
                sidebar.value.querySelector(`#${props.active}`).className = "active"
            }
        })
        const logout = () => {
            fetch(`${host}/logout`, {
                credentials: "include",
                mode: "cors"
            })
            .then(res => {
                store.commit('setUser', null)
                store.commit('setTitle', null)
                router.push({name: "Login"})
            })
            .catch(error => {
                console.log(error)
            })
        }
        return { sidebar, logout, store }
    }
}
</script>

<style scoped>
    #sidebar {
        height: 100vh;
        width: 250px;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: #231F20;
        overflow-x: hidden;
        padding-top: 40px;
        border-right: 5px solid #AD974F;
        flex-shrink: 0;
        font-weight: 500;
    }

    #sidebar h1 {
        color: white;
        font-size: 2rem;
        margin-left: 0.5rem;
    }

    #sidebar a {
        display: flex;
        align-items: center;
        margin: 0.5rem 0.5rem;
        padding: 0.65rem;
        text-decoration: none;
        font-size: 1.3rem;
        color: white;
        transition: 0.3s;
    }

    #sidebar a:hover {
        color: #AD974F;
    }

    #sidebar a.active {
        color: #AD974F;
        border-left: 4px solid #AD974F;
    }

    #sidebar a svg {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.7rem;
    }

    #classInfo {
        margin-left: 0.5rem;
        color: white;
    }

    #classInfo p {
        padding-left: 0.65rem;
    }

    @media screen and (max-height: 450px) {
        #sidebar {padding-top: 15px;}
        #sidebar a {font-size: 14pt;}
    }

</style>