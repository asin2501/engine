<template>
    <builder/>
</template>

<script>
    import Builder from './components/Builder';
    import './buttons.scss';

    export default {
        name: 'app',
        components: {Builder}
    }
</script>

<style lang="scss">
    html, body{
        height: 100%;
        margin:0;
    }

</style>
