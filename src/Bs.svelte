<script>
    import { getFetchHeader } from "./store.js";

    const { appHost } = localStorage;
    export let accounts = {};
    export let currentSectionId = "";

    let results = {};

    const fetchReport = async () => {
        // 오늘 날짜
        const today = new Date();
        const y = today.getFullYear();
        const m = (today.getMonth() + 1).toString().padStart(2, "0");
        const d = today.getDate().toString().padStart(2, "0");
        const end_date = `${y}${m}${d}`;

        const res = await fetch(
            `${appHost}/api/bs.json_array?section_id=${currentSectionId}&end_date=${end_date}`,
            getFetchHeader(),
        ).then((res) => res.json());
        if (res.code !== 200) {
            throw new Error(res.message);
        }
        results = res.results;
    };

    $: {
        if (currentSectionId !== "" && Object.keys(accounts).length > 0) {
            fetchReport();
        }
    }
</script>

<div>
    {JSON.stringify(results)}
</div>

<style lang="scss">
</style>
