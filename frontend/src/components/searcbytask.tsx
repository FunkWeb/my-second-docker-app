import {gettaskbyid} from "./apicalls.tsx";


interface SearcbytaskProps {
    query: string;
    onsearch?: (results: any[]) => void;
}
const searcbytask = ({ query, onsearch }: SearcbytaskProps) => {

    const handlesearch = async () => {
        try {
            const results = await gettaskbyid(query);
            console.log(`Searching tasks with query: ${query}`);
            if (onsearch) {
                onsearch(results);
            }
        } catch (error) {
            console.error(`Failed to search tasks with query ${query}:`, error);
        }
    };
    return (
        <div>
            <h2>Search Tasks</h2>
            <form onSubmit={handlesearch}>
                <label>
                    Query:
                    <input type="text" defaultValue={query}/>
                </label>
                <br/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
export default searcbytask;