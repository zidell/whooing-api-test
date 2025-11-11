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
        // 한 니 전 (month - 1)
        const prevMonth = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate(),
        );
        const py = prevMonth.getFullYear();
        const pm = (prevMonth.getMonth() + 1).toString().padStart(2, "0");
        const pd = prevMonth.getDate().toString().padStart(2, "0");
        const start_date = `${py}${pm}${pd}`;

        const res = await fetch(
            `${appHost}/api/pl.json_array?section_id=${currentSectionId}&start_date=${start_date}&end_date=${end_date}`,
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
