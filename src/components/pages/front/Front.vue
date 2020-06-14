<template>
    <div class="container">
        <nav-bar :side-menu-open="true">
            <el-menu-item index="1" :route="'#'" v-scroll-to="'#header'">
                <img src="~/assets/images/logotext.png" height="24">
            </el-menu-item>
            <el-menu-item index="2" :route="'#company'" v-scroll-to="'#company'">Company</el-menu-item>
            <el-menu-item index="3" :route="'#team'" v-scroll-to="'#team'">Team</el-menu-item>
        </nav-bar>

        <page-header></page-header>
        <page-company></page-company>
        <page-team></page-team>
        <page-footer></page-footer>
    </div>
</template>

<script>
    import NavBar from '../../layouts/NavBar.vue'
    import PageHeader from './pages/PageHeader.vue'
    import PageTeam from './pages/PageTeam.vue'
    import PageCompany from './pages/PageCompany.vue'
    import PageFooter from './pages/PageFooter.vue'
    export default {
        components : { NavBar, PageHeader, PageTeam, PageCompany, PageFooter },
    }
</script>
